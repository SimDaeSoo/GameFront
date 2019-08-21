import GameData from "./gameData";
import { system } from "../utils/utils";
import { EventEmitter } from "events";
import Camera from "./class/camera";
import Display from 'pixi-layers';
import { TILE_SIZE } from "./define";

export default class GameRenderer extends EventEmitter{
    private app: PIXI.Application;

    private display: any = Display;
    private lighting: PIXI.display.Layer;
    private lightbulb: PIXI.Graphics;
    public container: any;
    public camera: Camera;
    public gameData: GameData;
    private time: number = 0;
    private renderCount: number = 0;
    private AVERAGE_LOOPING: number = 30;
    private objectDict: any = { tiles: {}, characters: {}, objects: {}};
    private SCREEN_WIDTH: number = 1050;
    private SCREEN_HEIGHT: number = 600;

    constructor() {
        super();

        this.app = new PIXI.Application({
            width: this.SCREEN_WIDTH,
            height: this.SCREEN_HEIGHT,
            backgroundColor: 0x71B3FF,
            autoStart: false,
        });
        this.app.stage = new PIXI.display.Stage();
        this.container = new PIXI.Container();
        this.app.stage.addChild(this.container);

        this.camera = new Camera(this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
        this.camera.setStage(this.container);
        this.camera.setZoom(1);

        // ----------------------------- Lightings
        this.lighting = new PIXI.display.Layer();
        this.lighting.on('display', (element) => { element.blendMode = PIXI.BLEND_MODES.ADD; });
        this.lighting.useRenderTexture = true;
        this.lighting.clearColor = [0.03, 0.03, 0.03, 1];
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
        // ----------------------------- Lightings
    }

    public async update(dt: number): Promise<void> {
        await this.objectGenerate();
        await this.objectDelete();
        await this.objectUpdate();
        await this.setLighting();
    }

    private async setLighting(): Promise<void> {
        if (this.gameData.worldProperties.height === 0) return;
        const depth = ((this.camera.position.y - this.SCREEN_HEIGHT / 2) / this.camera.currentZoom + this.SCREEN_HEIGHT / 2) / ((this.gameData.worldProperties.height) * -TILE_SIZE.HEIGHT); 
        this.lightbulb.alpha = 1 - (depth * 1.5);
    }

    private async objectUpdate(): Promise<void> {
        for (let type in this.gameData.dirties) {
            this.gameData.dirties[type].forEach((id: string) => {
                const obj = this.objectDict[type][id];
                const data = this.gameData.data[type][id];

                if (obj && data && (Math.round(obj.x) !== Math.round(data.position.x) || Math.round(obj.y) !== Math.round(data.position.y))) {
                    obj.x = Math.round(data.position.x);
                    obj.y = Math.round(data.position.y);
                    this.gameData.clean(id, type);
                }
            });
        }
    }

    private async objectDelete(): Promise<void> {
        for (let type in this.gameData.beDeletes) {
            this.gameData.beDeletes[type].forEach((id: string): void => {
                this.app.stage.removeChild(this.objectDict[type][id]);
                delete this.objectDict[type][id];
                this.gameData.doneDelete(id, type);
            });
        }
    }

    private async objectGenerate(): Promise<void> {
        for (let type in this.gameData.beGenerates) {
            this.gameData.beGenerates[type].forEach((id: string): void => {
                // 임시 Tile Map TODO: 제거.
                let fileName = '';
                if (this.gameData.data[type][id].tileNumber !== undefined) {
                    fileName = `Terrain Tileset${this.gameData.data[type][id].tileNumber}.png`;
                } else {
                    fileName = 'src/assets/hitBox.png';
                }
                const container: PIXI.Container = new PIXI.Container();
                container.x = this.gameData.data[type][id].position.x;
                container.y = this.gameData.data[type][id].position.y;
                container.interactive = true;

                const newTile = PIXI.Sprite.from(fileName);
                newTile.scale.x = this.gameData.data[type][id].scale.x;
                newTile.scale.y = this.gameData.data[type][id].scale.y;
                container.addChild(newTile);

                this.container.addChild(container);
                this.objectDict[type][id] = container;
                this.gameData.doneGenerate(id, type);

                // 임시 Test Event ------------------------------------------------------------
                container.on('click', (): void => {
                    this.camera.setObject(this.gameData.data[type][id]);
                    if (this.camera.targetZoom < 0.5) {
                        this.camera.setZoom(0.5);
                    } else if(this.camera.targetZoom < 1) {
                        this.camera.setZoom(1);
                    } else if(this.camera.targetZoom < 2) {
                        this.camera.setZoom(2);
                    } else {
                        this.camera.setZoom(0.2);
                    }
                });
            });
        }
    }

    public get view(): any {
        return this.app.view;
    }

    public clearRenderer(): void {
        for (var i = this.app.stage.children.length - 1; i >= 0; i--) {
            this.container.removeChild(this.app.stage.children[i]);
        };
    }

    public start() {
        window.requestAnimationFrame((now: number): void => {
            this.render(now, 0);
        });
    }
    
    public render(t_1: number, t_2: number): void {
        const dt: number = t_1 - t_2;
        this.checkRenderingPerformance(dt);
        this.camera.update();
        this.app.render();
        window.requestAnimationFrame((now: number): void => {
            this.render(now, t_1);
        });
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
}