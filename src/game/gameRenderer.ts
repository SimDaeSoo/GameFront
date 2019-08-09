import GameData from "./gameData";
import { system } from "../utils/utils";

export default class GameRenderer {
    private pixi: any;
    private app: PIXI.Application;
    public gameData: GameData;
    private time: number = 0;
    private renderCount: number = 0;
    private AVERAGE_LOOPING: number = 30;
    private objectDict: any = { tiles: {}, characters: {}, objects: {}};

    constructor(pixi: any) {
        this.pixi = pixi;
        this.app = new pixi.Application({ width: 1400, height: 800, autoStart: false });
    }

    public async update(dt: number): Promise<void> {
        await this.objectGenerate();
        await this.objectUpdate();
    }

    private async objectUpdate(): Promise<void> {
        for (let type in this.gameData.dirties) {
            if (this.gameData.dirties[type].length > 0) {
                this.gameData.dirties[type].forEach((id: string) => {
                    if (this.objectDict[type][id]) {
                        this.objectDict[type][id].x = this.gameData.data[type][id].position.x;
                        this.objectDict[type][id].y = this.gameData.data[type][id].position.y;
                        this.gameData.clean(id, type);
                    }
                });
            }
        }
    }

    private async objectGenerate(): Promise<void> {
        for (let type in this.gameData.beGenerates) {
            if (this.gameData.beGenerates[type].length > 0) {
                this.gameData.beGenerates[type].forEach((id: string) => {
                    // 임시 Tile Map TODO: 제거.
                    const newTile = this.pixi.Sprite.from('../assets/tile.png');
                    newTile.x = this.gameData.data[type][id].position.x;
                    newTile.y = this.gameData.data[type][id].position.y;
                    this.app.stage.addChild(newTile);
                    
                    this.objectDict[type][id] = newTile;
                    this.gameData.doneGenerate(id, type);
                });
            }
        }
    }

    public get view(): any {
        return this.app.view;
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