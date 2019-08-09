import { warn, system } from "../utils/utils";

export default class Updater {
    private time: number = 0;
    private updateCount: number = 0;
    private updaterID: any;
    private GAME_UPDATE_MILLISEC: number = 8;
    private AVERAGE_LOOPING: number = 30;

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
            const ups: number = this.updateCount / this.AVERAGE_LOOPING;
            if (this.updateCount < 1000 / this.GAME_UPDATE_MILLISEC * this.AVERAGE_LOOPING * 0.8) {
                warn({ text: `${ups.toFixed(2)} UPS (${(ups / (1000 / this.GAME_UPDATE_MILLISEC) * 100).toFixed(2)}%)`});
            } else {
                system({ text: `${ups.toFixed(2)} UPS (${(ups / (1000 / this.GAME_UPDATE_MILLISEC) * 100).toFixed(2)}%)`});
            }

            this.time = this.updateCount = 0;
        }
    }

    public stop(): void {
        clearInterval(this.updaterID);
    }
}