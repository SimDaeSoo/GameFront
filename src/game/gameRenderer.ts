import GameData from "./gameData";

export default class GameRenderer {
    private app: PIXI.Application;
    public data: GameData;

    constructor(pixi: any) {
        this.app = new pixi.Application({ width: 800, height: 400, autoStart: false });
    }

    public async update(dt: number): Promise<void> {
        if (this.data.beGenerates.length > 0) {
            this.data.beGenerates.forEach((id: string) => {
                this.data.doneGenerate(id);
            });
        }
        if (this.data.dirties.length > 0) {
            this.data.dirties.forEach((id: string) => {
                this.data.clean(id);
            });
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
        this.app.render();
        window.requestAnimationFrame((now: number) => {
            this.render(now, t_1);
        });
    }
}