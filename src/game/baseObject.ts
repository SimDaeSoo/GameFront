export default class BaseObject extends PIXI.Container {
    public container: PIXI.Container = new PIXI.Container();
    public uiContainer: PIXI.Container = new PIXI.Container();
    public outerContainer: PIXI.Container = new PIXI.Container();
    public sprite: PIXI.Sprite;

    private nextVibrationTime: number = 0;
    private vibrationTimer: number = 0;
    private strength: number = 0;
    private duration: number = 0;
    private vibrateFlag: boolean = true;
    public size: any = { x: 0, y: 0 };
    public targetPosition: any = { x: 0, y: 0 };
    public currentPosition: any = { x: 0, y: 0 };
    public INTERPOLATION: any = 1.02;

    constructor(options: any) {
        super();
        this.interactive = true;
        this.setPosition(options.position);
        this.setScale(options.scale);
        this.setSize(options.size);
        this.outerContainer.addChild(this.container);
        this.addChild(this.outerContainer);
        this.addChild(this.uiContainer);
        this.init(options);

        this.on('click', (): void => {
            this.vibration(300, 3);
        });
    }
    
    private init(options: any): void {
        this.targetPosition.x = this.currentPosition.x = options.position.x;
        this.targetPosition.y = this.currentPosition.y = options.position.y;

        options.showCollisionBox = true;
        if (options.showCollisionBox) {
            const collisionBox: PIXI.Graphics = new PIXI.Graphics();
            collisionBox.lineStyle(1, 0xff0000);
            collisionBox.moveTo(0, 0);
            collisionBox.lineTo(this.size.x, 0);
            collisionBox.lineTo(this.size.x, this.size.y);
            collisionBox.lineTo(0, this.size.y);
            collisionBox.lineTo(0, 0);
            collisionBox.endFill();
            collisionBox.alpha = 0.5;
            this.addChild(collisionBox);
        }
    }

    public update(dt: number): void {}
    public _update(dt: number): void {
        this.interpolationPosition(dt);
        this.updateVibration(dt);
        this.update(dt);
    }

    private interpolationPosition(dt: number): void {
        const strength: number = ((this.INTERPOLATION ** dt) - 1)>=1? 1: ((this.INTERPOLATION ** dt) - 1);
        this.currentPosition.x += (this.targetPosition.x - this.currentPosition.x) * strength;
        this.currentPosition.y += (this.targetPosition.y - this.currentPosition.y) * strength;

        this.x = Math.round(this.currentPosition.x);
        this.y = Math.round(this.currentPosition.y);
    }

    public updateVibration(dt: number): void {
        if (!this.strength) return;
        const PERIOD: number = 10; // ms
        
        this.vibrationTimer += dt;
        if (this.duration < this.vibrationTimer) {
            this.duration = this.strength = this.outerContainer.position.x = this.outerContainer.position.y = 0;
        } else if (this.nextVibrationTime < this.vibrationTimer && this.vibrateFlag) {
            this.outerContainer.position.x += this.strength * (1 - Math.round(Math.random()) * 2);
            this.outerContainer.position.y += this.strength * (1 - Math.round(Math.random()) * 2);
            this.nextVibrationTime += PERIOD;
            this.vibrateFlag = !this.vibrateFlag;
            this.strength *= 0.9;
        } else if (this.nextVibrationTime < this.vibrationTimer && !this.vibrateFlag) {
            this.outerContainer.position.x = this.outerContainer.position.y = 0;
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
        if (!scale) scale = { x:1, y:1 };
        this.container.scale.x = scale.x;
        this.container.scale.y = scale.y;
    }

    public get scale(): any {
        return this.container.scale;
    }
    
    public delete(): void {
        this.parent.removeChild(this);
        this.destroy();
    }
}