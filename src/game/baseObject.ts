export default class BaseObject extends PIXI.Container {
    public container: PIXI.Container = new PIXI.Container();
    public uiContainer: PIXI.Container = new PIXI.Container();
    public sprite: PIXI.Sprite;

    private nextVibrationTime: number = 0;
    private vibrationTimer: number = 0;
    private strength: number = 0;
    private duration: number = 0;
    private vibrateFlag: boolean = true;
    private size: any = { x: 0, y: 0 };

    constructor(options: any) {
        super();
        this.interactive = true;
        this.setPosition(options.position);
        this.setScale(options.scale);
        this.setSize(options.size);
        this.addChild(this.container);
        this.addChild(this.uiContainer);

        this.on('click', (): void => {
            this.vibration(300, 3);
        });
    }

    public update(dt: number): void {}
    public _update(dt: number): void {
        this.updateVibration(dt);
        this.update(dt);
    }

    public updateVibration(dt: number): void {
        if (!this.strength) return;
        const PERIOD: number = 10; // ms
        
        this.vibrationTimer += dt;
        if (this.duration < this.vibrationTimer) {
            this.duration = this.strength = this.container.position.x = this.container.position.y = 0;
        } else if (this.nextVibrationTime < this.vibrationTimer && this.vibrateFlag) {
            this.container.position.x += this.strength * (1 - Math.round(Math.random()) * 2);
            this.container.position.y += this.strength * (1 - Math.round(Math.random()) * 2);
            this.nextVibrationTime += PERIOD;
            this.vibrateFlag = !this.vibrateFlag;
            this.strength *= 0.9;
        } else if (this.nextVibrationTime < this.vibrationTimer && !this.vibrateFlag) {
            this.container.position.x = this.container.position.y = 0;
            this.nextVibrationTime += PERIOD;
            this.vibrateFlag = !this.vibrateFlag;
        }
    }

    public vibration(duration: number, strength: number): void {
        this.duration = duration;
        this.strength = strength;
        this.vibrationTimer = 0;
        this.nextVibrationTime = 0;
    }

    public setPosition(position: any): void {
        if (!position) return;
        this.position.x = position.x;
        this.position.y = position.y;
    }

    public setSize(size: any): void {
        if (!size) return;
        this.size.x = size.x;
        this.size.y = size.y;
    }

    public setScale(scale: any): void {
        if (!scale) return;
        this.scale.x = scale.x;
        this.scale.y = scale.y;
    }
    
    public delete(): void {
        this.parent.removeChild(this);
        this.destroy();
    }
}