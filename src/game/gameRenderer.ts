import GameData from "./gameData";
import { system } from "../utils/utils";
import { EventEmitter } from "events";
import Camera from "./class/camera";

export default class GameRenderer extends EventEmitter{
    private app: PIXI.Application;
    public camera: Camera;
    public gameData: GameData;
    private time: number = 0;
    private renderCount: number = 0;
    private AVERAGE_LOOPING: number = 30;
    private objectDict: any = { tiles: {}, characters: {}, objects: {}};

    constructor() {
        super();
        const SCREEN_WIDTH: number = 1050;
        const SCREEN_HEIGHT: number = 600;

        this.app = new PIXI.Application({
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
            backgroundColor: 0x71B3FF,
            autoStart: false
        });
        this.camera = new Camera(SCREEN_WIDTH, SCREEN_HEIGHT);
        this.camera.setStage(this.app.stage);
        this.camera.setZoom(1);
    }

    public async update(dt: number): Promise<void> {
        await this.objectGenerate();
        await this.objectDelete();
        await this.objectUpdate();
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
                const newTile = PIXI.Sprite.from(fileName);
                newTile.x = this.gameData.data[type][id].position.x;
                newTile.y = this.gameData.data[type][id].position.y;
                newTile.scale.x = this.gameData.data[type][id].scale.x;
                newTile.scale.y = this.gameData.data[type][id].scale.y;
                newTile.interactive = true;
                newTile.on('click', (): void => {
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
                    // const command = {
                    //     script: 'deleteCharacter',
                    //     data: {
                    //         id: id,
                    //         objectType: type
                    //     }
                    // };
                    // this.emit('broadcast', command)
                })
                this.app.stage.addChild(newTile);
                
                this.objectDict[type][id] = newTile;
                this.gameData.doneGenerate(id, type);
            });
        }
    }

    public get view(): any {
        return this.app.view;
    }

    public clearRenderer(): void {
        for (var i = this.app.stage.children.length - 1; i >= 0; i--) {
            this.app.stage.removeChild(this.app.stage.children[i]);
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