import GameLogic from "./gameLogic";
import { warn, system } from "../utils/utils";

export default class Updater {
    private gameLogic: GameLogic;
    private avgUpdate: number = 0;
    private updateCount: number = 0;
    private GAME_UPDATE_MILLISEC: number = 8;
    private AVERAGE_LOOPING: number = 30;
    private updaterID: any;

    public update(dt: number): void {
        this.performanceCheck(dt);
        this.gameLogic.update(dt);
    }

    public updateLoop(): void {
        let lastTime: number = Date.now();
        this.updaterID = setInterval(async () => {
            const currentTime: number = Date.now();
            await this.update(currentTime - lastTime);
            lastTime = currentTime;
        }, this.GAME_UPDATE_MILLISEC);
    }

    private performanceCheck(dt: number): void {
        this.avgUpdate += dt;
        this.updateCount ++;

        // 125번 Update가 Maximum 성능이 20% 이상 다운되었을 경우 Warning Log띄우기.
        if (this.avgUpdate >= 1000 * this.AVERAGE_LOOPING) {
            const ups: number = this.updateCount / this.AVERAGE_LOOPING;
            if (this.updateCount < 125 * this.AVERAGE_LOOPING * 0.8) {
                warn({ text: `${this.gameLogic.roomName} ${ups.toFixed(2)} UPS (${(ups / (1000 / this.GAME_UPDATE_MILLISEC) * 100).toFixed(2)}%)`});
            } else {
                system({ text: `${this.gameLogic.roomName} ${ups.toFixed(2)} UPS (${(ups / (1000 / this.GAME_UPDATE_MILLISEC) * 100).toFixed(2)}%)`});
            }

            this.avgUpdate = this.updateCount = 0;
        }
    }
    
    public setGameLogic(gameLogic: GameLogic): void {
        this.gameLogic = gameLogic;
    }

    public stop(): void {
        clearInterval(this.updaterID);
    }
}