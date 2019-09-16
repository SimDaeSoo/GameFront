export default class Keyboard {
    public keyData: any = {};
    public onKeyDown: any;
    public onKeyUp: any;

    constructor() {
        window.addEventListener("keydown", (e: KeyboardEvent): void => {
            if (!this.keyData[e.keyCode]) {
                this.keyData[e.keyCode] = {
                    isDown: false,
                    isUp: true
                };
            }

            if (this.keyData[e.keyCode].isUp) {
                this.onKeyDown ? this.onKeyDown(e.keyCode) : null;
                this.keyData[e.keyCode].isDown = true;
                this.keyData[e.keyCode].isUp = false;
            }
        });

        window.addEventListener("keyup", (e: KeyboardEvent): void => {
            if (!this.keyData[e.keyCode]) {
                this.keyData[e.keyCode] = {
                    isDown: false,
                    isUp: false
                };
            }

            this.onKeyDown ? this.onKeyUp(e.keyCode) : null;
            this.keyData[e.keyCode].isDown = false;
            this.keyData[e.keyCode].isUp = true;
        });
    }
}