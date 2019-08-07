import GameLogic from "./gameLogic";
import { IScript } from "./scriptParser";

export default class GameRenderer {
    private app: PIXI.Application;

    constructor(pixi: any) {
        this.app = new pixi.Application({ width: 800, height: 400, autoStart: false });
    }
    
    public addCharacter(token: string, position: {x:number,y:number}): void {
    }

    public deleteCharacter(token: string, position: {x:number,y:number}): void {
    }

    public runscript(data: {parsedScript: IScript, result: any}) {
        console.log('runrun');
    }

    public get view() {
        return this.app.view;
    }

    public start() {
        window.requestAnimationFrame((now: number) => {
            this.render(now, 0);
        });
    }
    
    public render(t_1: number, t_2: number) {
        const dt: number = t_1 - t_2;
        console.log(`render ${dt.toFixed(2)}ms`);
        this.app.render();
        window.requestAnimationFrame((now: number) => {
            this.render(now, t_1);
        });
    }
}