import GameData from "./gameData";
import { system } from "../utils/utils";
import { EventEmitter } from "events";
import Camera from "./class/camera";
import Display from 'pixi-layers';
import { TILE_SIZE } from "./define";
import RayCaster from './class/rayCaster';

export default class GameRenderer extends EventEmitter {
    // Application
    private app: PIXI.Application;
    private SCREEN_WIDTH: number = 1050;
    private SCREEN_HEIGHT: number = 600;
    public camera: Camera;
    public mainContainer: any;
    public mapContainer: any;

    // Lighting
    private display: any = Display;
    private lighting: PIXI.display.Layer;
    private lightbulb: PIXI.Graphics;
    private rayCaster: RayCaster;
    
    // GameData
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
            backgroundColor: 0x71B3FF,
            autoStart: false,
        });
        this.app.stage = new PIXI.display.Stage();
        this.mainContainer = new PIXI.Container();
        this.app.stage.addChild(this.mainContainer);

        this.camera = new Camera(this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
        this.camera.setStage(this.mainContainer);
        this.camera.setZoom(1);
        this.camera.setRenderer(this);

        // ----------------------------- Lightings
        this.lighting = new PIXI.display.Layer();
        this.lighting.on('display', (element) => { element.blendMode = PIXI.BLEND_MODES.ADD; });
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

    public async update(dt: number): Promise<void> {
        await this.objectGenerate();
        await this.objectDelete();
        await this.objectUpdate();
        await this.setLighting();
        this.rayCaster.update();
    }

    public initWorld(): void {
        const worldSize: any = {
            width: this.gameData.worldProperties.width * TILE_SIZE.WIDTH,
            height: (this.gameData.worldProperties.height + 17) * TILE_SIZE.HEIGHT
        };

        this.objectGenerate();
        this.camera.setSize(worldSize);
        this.rayCaster.setObjects(this.gameData.data.tiles);
        this.rayCaster.setPosition({ x: worldSize.width / 2, y: -600 });
        this.rayCaster.setSize(worldSize);
        this.rayCaster.initRay();
        this.mainContainer.addChild(this.rayCaster.rayContainer);
    }

    private async setLighting(): Promise<void> {
        if (this.gameData.worldProperties.height === 0) return;
        let depth = this.camera.position.y + (this.gameData.worldProperties.height * TILE_SIZE.HEIGHT * this.camera.currentZoom) - this.SCREEN_HEIGHT;
        depth /= (this.gameData.worldProperties.height - 17) * TILE_SIZE.HEIGHT;
        depth = (depth * 2.5)<0?0:(depth * 2.5);
        if (this.camera.currentZoom < 0.9) {
            depth = depth < 0.4?0.4:depth;
        }
        this.lightbulb.alpha = depth>=0.87?0.87:depth;
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
            if (this.gameData.beDeletes[type].length > 0 && type === 'tils') this.mapContainer.cacheAsBitMap = false;
            this.gameData.beDeletes[type].forEach((id: string): void => {
                this.objectDict[type][id].parent.removeChild(this.objectDict[type][id]);
                delete this.objectDict[type][id];
                this.gameData.doneDelete(id, type);
            });
            if (!this.mapContainer.cacheAsBitMap) this.mapContainer.cacheAsBitMap = true;
        }
    }

    private async objectGenerate(): Promise<void> {
        let count: number = 0;
        for (let type in this.gameData.beGenerates) {
            if (this.gameData.beGenerates[type].length > 0 && type === 'tils') this.mapContainer.cacheAsBitMap = false;

            this.gameData.beGenerates[type].every((id: string): any => {
                count++;
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

                if (type === 'tiles') {
                    this.mapContainer.addChild(container);
                } else {
                    this.mainContainer.addChild(container);
                }
                this.objectDict[type][id] = container;
                this.gameData.doneGenerate(id, type);

                // 임시 Test Event ------------------------------------------------------------
                container.on('click', (): void => {
                    this.camera.setObject(this.gameData.data[type][id]);
                    if(this.camera.targetZoom < 1) {
                        this.camera.setZoom(1);
                    } else {
                        this.camera.setZoom(0.2);
                    }
                    const command = {
                        script: 'deleteCharacter',
                        data: {
                            id: id,
                            objectType: type
                        }
                    };
                    this.emit('broadcast', command)
                });

                if (count > 150) {
                    return false;
                }
            });
            
            if (!this.mapContainer.cacheAsBitMap) this.mapContainer.cacheAsBitMap = true;
        }
    }

    public get view(): any {
        return this.app.view;
    }

    public clearRenderer(): void {
        for (var i = this.mainContainer.children.length - 1; i >= 0; i--) {
            this.mainContainer.removeChild(this.mainContainer.children[i]);
        };

        this.mapContainer = new PIXI.Container();
        this.mainContainer.addChild(this.mapContainer);
    }

    public start() {
        window.requestAnimationFrame((now: number): void => {
            this.render(now, 0);
        });
    }
    
    public async render(t_1: number, t_2: number): Promise<void> {
        const dt: number = t_1 - t_2;
        this.checkRenderingPerformance(dt);
        await this.camera.update();
        await this.app.render();
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