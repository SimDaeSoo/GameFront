import { warn, system } from "../utils/utils";

export default class Updater {
    private time: number = 0;
    public ups: number = 0;
    private updateCount: number = 0;
    private updaterID: any;
    private GAME_UPDATE_MILLISEC: number = 10;
    private AVERAGE_LOOPING: number = 3;
    public forceDisConnect: any;

    public onUpdate(callback: Function): void {
        let lastTime: number = Date.now();
        this.updaterID = setInterval(async () => {
            const dt: number = Date.now() - lastTime;

            this.performanceCheck(dt);
            await callback(dt);

            lastTime += dt;
        }, this.GAME_UPDATE_MILLISEC);
    }

    private performanceCheck(dt: number): void {
        this.time += dt;
        this.updateCount ++;

        // 125번 Update가 Maximum 성능이 20% 이상 다운되었을 경우 Warning Log띄우기.
        if (this.time >= 1000 * this.AVERAGE_LOOPING) {
            const ups: number = this.ups = Number((this.updateCount / this.AVERAGE_LOOPING).toFixed(2));
            if (this.updateCount < 1000 / this.GAME_UPDATE_MILLISEC * this.AVERAGE_LOOPING * 0.8) {
                // warn({ text: `update: ${ups.toFixed(2)} ups (${(ups / (1000 / this.GAME_UPDATE_MILLISEC) * 100).toFixed(2)}%)`});
                if (this.updateCount < 1000 / this.GAME_UPDATE_MILLISEC * this.AVERAGE_LOOPING * 0.2) { 
                    this.forceDisConnect?this.forceDisConnect():null;
                }
            } else {
                // system({ text: `update: ${ups.toFixed(2)} ups (${(ups / (1000 / this.GAME_UPDATE_MILLISEC) * 100).toFixed(2)}%)`});
            }

            this.time = this.updateCount = 0;
        }
    }

    public stop(): void {
        clearInterval(this.updaterID);
    }
}