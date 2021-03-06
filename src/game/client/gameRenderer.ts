import GameData from "../union/gameData";
import { system } from "../union/utils";
import Camera from "./camera";
import Display from "pixi-layers";
import { TILE_SIZE, Dictionary, Size, Boundary } from "../union/define";
import RayCaster from "./rayCaster";
import Background from "./background";
import ObjectFactory from "./objectFactory";
import UI from "./ui";
import BaseObject from "./baseObject";

export default class GameRenderer {
    // Application
    private app: PIXI.Application;
    private SCREEN_WIDTH: number = window.innerWidth;
    private SCREEN_HEIGHT: number = window.innerHeight;

    public camera: Camera;
    public ui: UI;
    public stage: PIXI.Container;
    public groundLayer: PIXI.Container;
    public characterLayer: PIXI.Container;
    public background: PIXI.Container;

    // Lighting
    private display: any = Display;
    private lighting: PIXI.display.Layer;
    private lightbulb: PIXI.Graphics;
    private rayCaster: RayCaster;
    private lastTime: number;

    // GameData
    public owner: string;
    public gameData: GameData;
    private objectDict: Dictionary<Dictionary<any>> = { tiles: {}, characters: {}, objects: {} };

    constructor(element: HTMLElement) {
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        PIXI.settings.ROUND_PIXELS = true;

        this.app = new PIXI.Application({
            width: this.SCREEN_WIDTH,
            height: this.SCREEN_HEIGHT,
            backgroundColor: 0x7296D5,
            autoStart: false,
            antialias: false,
            sharedLoader: true,
            powerPreference: 'high-performance',
            resizeTo: element
        });
        this.app.stage = new PIXI.display.Stage();
        this.stage = new PIXI.Container();
        this.app.stage.addChild(this.stage);

        this.camera = new Camera(this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
        this.camera.setStage(this.stage);
        this.camera.setZoom(1);
        this.camera.setRenderer(this);
        // ----------------------------- Lightings
        this.lighting = new PIXI.display.Layer();
        this.lighting.on("display", (element) => { element.blendMode = PIXI.BLEND_MODES.LIGHTEN; });
        this.lighting.useRenderTexture = true;
        this.lighting.clearColor = [1, 1, 1, 1];
        this.app.stage.addChild(this.lighting);

        const lightingSprite: PIXI.Sprite = new PIXI.Sprite(this.lighting.getRenderTexture());
        lightingSprite.blendMode = PIXI.BLEND_MODES.MULTIPLY;
        this.app.stage.addChild(lightingSprite);

        this.lightbulb = new PIXI.Graphics();
        this.lightbulb.parentLayer = this.lighting;
        this.lightbulb.beginFill(0xFFFFFF, 0);
        this.lightbulb.drawRect(0, 0, this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
        this.lightbulb.endFill();
        this.app.stage.addChild(this.lightbulb);

        this.rayCaster = new RayCaster();
        this.rayCaster.setLightingLayer(this.lighting);
        // ----------------------------- Lightings

        this.ui = new UI({ size: { width: this.SCREEN_WIDTH, height: this.SCREEN_HEIGHT } });
        this.app.stage.addChild(this.ui);
    }

    public initialize(): void {
        const worldSize: Size = {
            width: this.gameData.worldProperties.width * TILE_SIZE.WIDTH,
            height: (this.gameData.worldProperties.height + 17) * TILE_SIZE.HEIGHT
        };

        for (var i = this.stage.children.length - 1; i >= 0; i--) {
            this.stage.removeChild(this.stage.children[i]);
        };

        this.background = new PIXI.Container();
        this.background.addChild(new Background(worldSize));
        this.stage.addChild(this.background);

        this.groundLayer = new PIXI.Container();
        this.stage.addChild(this.groundLayer);

        this.characterLayer = new PIXI.Container();
        this.stage.addChild(this.characterLayer);

        this.objectGenerate();
        this.camera.setSize(worldSize);
        this.rayCaster.setObjects(this.gameData.data.tiles);
        this.rayCaster.setPosition({ x: worldSize.width / 2, y: -1400 });
        this.rayCaster.setSize(worldSize);
        this.rayCaster.initializeRay();
        this.stage.addChild(this.rayCaster.rayContainer);
    }

    public start() {
        window.requestAnimationFrame((): void => {
            this.render();
        });
    }

    public render(): void {
        this.app.render();
        window.requestAnimationFrame((): void => {
            this.render();
        });
    }

    public update(dt: number): void {
        this.objectGenerate();
        this.objectDelete();
        this.objectUpdate(dt);
        this.setLighting();
        this.ui.update();
        this.camera.update(dt);
        this.rayCaster.update(dt);
    }

    private objectUpdate(dt: number): void {
        const boundary: Boundary<number> = {
            min: ((-this.camera.position.x + this.SCREEN_WIDTH / 2) / this.camera.currentZoom) - this.SCREEN_WIDTH,
            max: ((-this.camera.position.x + this.SCREEN_WIDTH / 2) / this.camera.currentZoom) + this.SCREEN_WIDTH
        }

        for (let type in this.gameData.dirties) {
            this.gameData.dirties[type].forEach((id: string) => {
                const obj: any = this.objectDict[type][id];
                const data: any = this.gameData.data[type][id];

                if (obj && data && (Math.round(obj.x) !== Math.round(data.position.x) || Math.round(obj.y) !== Math.round(data.position.y))) {
                    obj.targetPosition.x = Math.round(data.position.x);
                    obj.targetPosition.y = Math.round(data.position.y);
                    this.gameData.clean(id, type);
                }
            });
        }
        for (let type in this.objectDict) {
            for (let id in this.objectDict[type]) {
                const centerX: number = this.objectDict[type][id].position.x + this.objectDict[type][id].size.width / 2;
                this.objectDict[type][id].visible = centerX < boundary.max && centerX > boundary.min;
                this.objectDict[type][id]._update(dt);
            }
        }
    }

    private objectDelete(): void {
        for (let type in this.gameData.beDeletes) {
            this.gameData.beDeletes[type].forEach((id: string): void => {
                if (this.objectDict[type][id]) {
                    this.objectDict[type][id].delete();
                    delete this.objectDict[type][id];
                }
                this.gameData.doneDelete(id, type);

                if (type === "tiles") {
                    this.changeTile(id);
                }
            });
        }
    }

    private objectGenerate(): void {
        for (let type in this.gameData.beGenerates) {
            this.gameData.beGenerates[type].every((id: string): boolean => {
                if (this.objectDict[type][id]) return true;

                const object: BaseObject = ObjectFactory.create(this.gameData.data[type][id]);
                this.objectDict[type][id] = object;
                this.gameData.doneGenerate(id, type);

                // State가 있을경우 설정. Test
                if (this.gameData.data[type][id].state) {
                    object.setState(this.gameData.data[type][id].state);
                }
                // 코드 나중에 변경하자. 자신의 Parent로 삼을 Layer를 가지는 것으로..
                if (type === "tiles") {
                    this.groundLayer.addChild(object);
                } else {
                    this.characterLayer.addChild(object);
                }
                if (id === this.owner) {
                    this.camera.setObject(this.gameData.data[type][id]);
                }
            });
        }
    }

    private setLighting(): void {
        const currentTime: number = (this.gameData.clock.currentTimePeriod + 1) / 2;
        if (this.lastTime && Math.abs(this.lastTime - currentTime) <= 0.01) return;
        this.lighting.clearColor = [currentTime + 0.05, currentTime + 0.05, currentTime + 0.05, 1];
        this.rayCaster.rayContainer.alpha = currentTime + 0.1;
        this.lastTime = currentTime;
    }

    public resize(): void {
        this.SCREEN_WIDTH = window.innerWidth;
        this.SCREEN_HEIGHT = window.innerHeight;

        if (this.lightbulb) {
            this.lightbulb.parent.removeChild(this.lightbulb);
        }
        this.lightbulb = new PIXI.Graphics();
        this.lightbulb.parentLayer = this.lighting;
        this.lightbulb.beginFill(0xFFFFFF, 0);
        this.lightbulb.drawRect(0, 0, this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
        this.lightbulb.endFill();
        this.app.stage.addChild(this.lightbulb);

        this.camera.resize(this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
    }

    public get view(): HTMLCanvasElement {
        return this.app.view;
    }

    private changeTile(id: string): void {
        const width: number = this.gameData.worldProperties.width;
        const tiles: Dictionary<any> = {}

        tiles[(Number(id) - width).toString()] = this.objectDict["tiles"][(Number(id) - width).toString()];
        tiles[(Number(id) + width).toString()] = this.objectDict["tiles"][(Number(id) + width).toString()];
        tiles[(Number(id) - 1).toString()] = this.objectDict["tiles"][(Number(id) - 1).toString()];
        tiles[(Number(id) + 1).toString()] = this.objectDict["tiles"][(Number(id) + 1).toString()];

        for (let key in tiles) {
            if (tiles[key] !== undefined) {
                tiles[key].changeTile(this.gameData.data["tiles"], key, width);
            }
        }
    }

    private get SCREEN_RATIO(): number {
        let screenRatio: number = window.innerHeight / window.innerWidth;
        if (screenRatio < 9 / 16) screenRatio = 9 / 16;
        if (screenRatio > 3 / 4) screenRatio = 3 / 4;
        return screenRatio;
    }
}