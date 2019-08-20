import GameData from "./gameData";
import { system } from "../utils/utils";

export default class GameRenderer {
    private app: PIXI.Application;
    public gameData: GameData;
    private time: number = 0;
    private renderCount: number = 0;
    private AVERAGE_LOOPING: number = 30;
    private objectDict: any = { tiles: {}, characters: {}, objects: {}};

    constructor() {
        this.app = new PIXI.Application({ width: 1050, height: 600, autoStart: false });
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
                const data = this.gameData.data[type][id].position;

                if (obj && data && (Math.round(obj.x) !== Math.round(data.x) || Math.round(obj.y) !== Math.round(data.y))) {
                    obj.x = data.x;
                    obj.y = data.y;
                    this.gameData.clean(id, type);
                }
            });
        }
    }

    private async objectDelete(): Promise<void> {
        for (let type in this.gameData.beDeletes) {
            this.gameData.beDeletes[type].forEach((id: string) => {
                this.app.stage.removeChild(this.objectDict[type][id]);
                delete this.objectDict[type][id];
                this.gameData.doneDelete(id, type);
            });
        }
    }

    private async objectGenerate(): Promise<void> {
        for (let type in this.gameData.beGenerates) {
            this.gameData.beGenerates[type].forEach((id: string) => {
                // 임시 Tile Map TODO: 제거.
                const newTile = PIXI.Sprite.from('src/assets/tile.png');
                newTile.x = this.gameData.data[type][id].position.x;
                newTile.y = this.gameData.data[type][id].position.y;
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
        window.requestAnimationFrame((now: number) => {
            this.render(now, 0);
        });
    }
    
    public render(t_1: number, t_2: number): void {
        const dt: number = t_1 - t_2;
        this.checkRenderingPerformance(dt);
        this.app.render();
        window.requestAnimationFrame((now: number) => {
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