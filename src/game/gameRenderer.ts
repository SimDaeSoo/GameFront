import GameData from "./gameData";
import { system } from "../utils/utils";
import { EventEmitter } from "events";
import Camera from "./class/camera";
import Display from 'pixi-layers';
import { TILE_SIZE } from "./define";
import RayCaster from './class/rayCaster';
import Background from "./class/background";
import Tile from "./class/tile";
import ObjectFactory from "./class/objectFactory";

export default class GameRenderer extends EventEmitter {
    // Application
    private app: PIXI.Application;
    private SCREEN_WIDTH: number = 1050;
    private SCREEN_HEIGHT: number = 600;

    public camera: Camera;
    public stage: PIXI.Container;
    public map: PIXI.Container;
    public background: PIXI.Container;

    // Lighting
    private display: any = Display;
    private lighting: PIXI.display.Layer;
    private lightbulb: PIXI.Graphics;
    private rayCaster: RayCaster;
    
    // GameData
    public owner: string;
    public gameData: GameData;
    private objectDict: any = { tiles: {}, characters: {}, objects: {}};

    // Rendering Performance
    private time: number = 0;
    private renderCount: number = 0;
    private AVERAGE_LOOPING: number = 30;

    constructor() {
        super();

        this.app = new PIXI.Application({
            width: this.SCREEN_WIDTH,
            height: this.SCREEN_HEIGHT,
            backgroundColor: 0x7296D5,
            autoStart: false,
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
        this.lighting.on('display', (element) => { element.blendMode = PIXI.BLEND_MODES.LIGHTEN; });
        this.lighting.useRenderTexture = true;
        this.lighting.clearColor = [0.12, 0.12, 0.12, 1];
        this.app.stage.addChild(this.lighting);

        const lightingSprite: PIXI.Sprite = new PIXI.Sprite(this.lighting.getRenderTexture());
        lightingSprite.blendMode = PIXI.BLEND_MODES.MULTIPLY;
        this.app.stage.addChild(lightingSprite);

        this.lightbulb = new PIXI.Graphics();
        this.lightbulb.parentLayer = this.lighting;
        this.lightbulb.beginFill(0xFFFFFF, 1);
        this.lightbulb.drawRect(0, 0, this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
        this.lightbulb.endFill();
        this.app.stage.addChild(this.lightbulb);

        this.rayCaster = new RayCaster();
        this.rayCaster.setLightingLayer(this.lighting);
        // ----------------------------- Lightings
    }

    public init(): void {
        const worldSize: any = {
            width: this.gameData.worldProperties.width * TILE_SIZE.WIDTH,
            height: (this.gameData.worldProperties.height + 17) * TILE_SIZE.HEIGHT
        };

        for (var i = this.stage.children.length - 1; i >= 0; i--) {
            this.stage.removeChild(this.stage.children[i]);
        };

        this.background = new PIXI.Container();
        this.background.addChild(new Background(worldSize));
        this.stage.addChild(this.background);

        this.map = new PIXI.Container();
        this.stage.addChild(this.map);

        this.objectGenerate();
        this.camera.setSize(worldSize);
        this.rayCaster.setObjects(this.gameData.data.tiles);
        this.rayCaster.setPosition({ x: worldSize.width / 2, y: -600 });
        this.rayCaster.setSize(worldSize);
        this.rayCaster.initRay();
        this.stage.addChild(this.rayCaster.rayContainer);
    }

    public start() {
        window.requestAnimationFrame((now: number): void => {
            this.render(now, 0);
        });
    }
    
    public async render(t_1: number, t_2: number): Promise<void> {
        const dt: number = t_1 - t_2;
        this.checkRenderingPerformance(dt);
        await this.app.render();
        window.requestAnimationFrame((now: number): void => {
            this.render(now, t_1);
        });
    }

    public async update(dt: number): Promise<void> {
        await this.objectGenerate();
        await this.objectDelete();
        await this.objectUpdate(dt);
        await this.setLighting();
        await this.camera.update(dt);
        this.rayCaster.update(dt);
    }

    private async objectUpdate(dt: number): Promise<void> {
        const boundary: any = {
            min: ((-this.camera.position.x + this.SCREEN_WIDTH / 2) / this.camera.currentZoom) - this.SCREEN_WIDTH,
            max: ((-this.camera.position.x + this.SCREEN_WIDTH / 2) / this.camera.currentZoom) + this.SCREEN_WIDTH
        }

        for (let type in this.gameData.dirties) {
            this.gameData.dirties[type].forEach((id: string) => {
                const obj = this.objectDict[type][id];
                const data = this.gameData.data[type][id];

                if (obj && data && (Math.round(obj.x) !== Math.round(data.position.x) || Math.round(obj.y) !== Math.round(data.position.y))) {
                    obj.targetPosition.x = Math.round(data.position.x);
                    obj.targetPosition.y = Math.round(data.position.y);
                    this.gameData.clean(id, type);
                }
            });
        }
        for (let type in this.objectDict) {
            for (let id in this.objectDict[type]) {
                const centerX: number = this.objectDict[type][id].position.x + this.objectDict[type][id].size.x / 2;
                this.objectDict[type][id].visible = centerX < boundary.max && centerX > boundary.min;
                this.objectDict[type][id]._update(dt);
            }
        }
    }

    private async objectDelete(): Promise<void> {
        for (let type in this.gameData.beDeletes) {
            this.gameData.beDeletes[type].forEach((id: string): void => {
                if (this.objectDict[type][id]) {
                    this.objectDict[type][id].delete();
                    delete this.objectDict[type][id];
                }
                this.gameData.doneDelete(id, type);

                if (type === 'tiles') {
                    this.changeTile(id);
                }
            });
        }
    }

    private async objectGenerate(): Promise<void> {
        let count: number = 0;
        for (let type in this.gameData.beGenerates) {
            this.gameData.beGenerates[type].every((id: string): any => {
                if (this.objectDict[type][id]) return true;

                const object = ObjectFactory.create(this.gameData.data[type][id]);

                if (type === 'tiles') {
                    this.map.addChild(object);
                } else {
                    this.stage.addChild(object);
                }

                this.objectDict[type][id] = object;
                this.gameData.doneGenerate(id, type);

                if (id === this.owner) {
                    this.camera.setObject(this.gameData.data[type][id]);
                }

                if (count++ > 150) {
                    return false;
                }
            });
        }
    }

    private async setLighting(): Promise<void> {
        if (this.gameData.worldProperties.height === 0) return;
        let depth = this.camera.position.y + (this.gameData.worldProperties.height * TILE_SIZE.HEIGHT * this.camera.currentZoom) - this.SCREEN_HEIGHT;
        depth /= (this.gameData.worldProperties.height - 17) * TILE_SIZE.HEIGHT;
        depth = (depth * 1.5)<0?0:(depth * 1.5);

        if (this.camera.currentZoom < 0.9) {
            depth = depth < 0.15?0.15:depth;
        }
        
        this.lightbulb.alpha = depth>=1?1:depth;
    }

    public get view(): any {
        return this.app.view;
    }
    
    private checkRenderingPerformance(dt: number): void {
        this.time += dt;
        this.renderCount++;

        if (this.time > 1000 * this.AVERAGE_LOOPING) {
            system({ text: `render: ${(this.renderCount / this.AVERAGE_LOOPING).toFixed(2)}fps (${(this.renderCount / this.AVERAGE_LOOPING/60*100).toFixed(2)}%)` });
            this.time = 0;
            this.renderCount = 0;
        }
    }

    private changeTile(id: string): void {
        const width: number = this.gameData.worldProperties.width;
        const tiles: any = {}

        tiles[(Number(id) - width).toString()] = this.objectDict['tiles'][(Number(id) - width).toString()];
        tiles[(Number(id) + width).toString()] = this.objectDict['tiles'][(Number(id) + width).toString()];
        tiles[(Number(id) - 1).toString()] = this.objectDict['tiles'][(Number(id) - 1).toString()];
        tiles[(Number(id) + 1).toString()] = this.objectDict['tiles'][(Number(id) + 1).toString()];

        for (let key in tiles) {
            if (tiles[key] !== undefined) {
                tiles[key].changeTile(this.gameData.data['tiles'], key, width);
            }
        }
    }
}