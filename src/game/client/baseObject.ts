import { State } from "../union/state";
import { Size, Flip, Point, Scale } from "../union/define";

export default class BaseObject extends PIXI.Container {
    public container: PIXI.Container = new PIXI.Container();
    public uiContainer: PIXI.Container = new PIXI.Container();
    public outerContainer: PIXI.Container = new PIXI.Container();

    private nextVibrationTime: number = 0;
    private vibrationTimer: number = 0;
    private strength: number = 0;
    private duration: number = 0;
    private vibrateFlag: boolean = true;
    public size: Size = { width: 0, height: 0 };
    public _flip: Flip = { x: false, y: false };
    public targetPosition: Point = { x: 0, y: 0 };
    public currentPosition: Point = { x: 0, y: 0 };
    public INTERPOLATION: number = 1.02;
    public state: State;

    constructor(options: any) {
        super();
        this.interactive = true;
        this.setPosition(options.position);
        this.setScale(options.scale);
        this.setSize(options.size);
        this.outerContainer.addChild(this.container);
        this.addChild(this.outerContainer);
        this.addChild(this.uiContainer);
        this.initialize(options);

        this.on("click", (): void => {
            this.vibration(300, 3);
        });
    }

    private initialize(options: any): void {
        this.targetPosition.x = this.currentPosition.x = options.position.x;
        this.targetPosition.y = this.currentPosition.y = options.position.y;

        if (options.showCollisionBox) {
            const collisionBox: PIXI.Graphics = new PIXI.Graphics();
            collisionBox.lineStyle(1, 0xff0000);
            collisionBox.moveTo(0, 0);
            collisionBox.lineTo(this.size.width, 0);
            collisionBox.lineTo(this.size.width, this.size.height);
            collisionBox.lineTo(0, this.size.height);
            collisionBox.lineTo(0, 0);
            collisionBox.endFill();
            collisionBox.alpha = 0.5;
            this.addChild(collisionBox);
        }
    }

    public update(dt: number): void { }
    public _update(dt: number): void {
        this.interpolationPosition(dt);
        this.updateVibration(dt);
        this.update(dt);
    }

    public interpolationPosition(dt: number): void {
        const strength: number = ((this.INTERPOLATION ** dt) - 1) >= 1 ? 1 : ((this.INTERPOLATION ** dt) - 1);
        this.currentPosition.x += (this.targetPosition.x - this.currentPosition.x) * strength;
        this.currentPosition.y += (this.targetPosition.y - this.currentPosition.y) * strength;

        this.x = Math.round(this.currentPosition.x);
        this.y = Math.round(this.currentPosition.y);
    }

    public updateVibration(dt: number): void {
        if (this.strength === 0) return;
        const PERIOD: number = 10; // ms

        this.vibrationTimer += dt;
        if (this.duration < this.vibrationTimer) {
            this.outerContainer.position.x = this.flip.x ? this.size.width : 0;
            this.outerContainer.position.y = this.flip.y ? this.size.height : 0;
            this.duration = this.strength = 0;
        } else if (this.nextVibrationTime < this.vibrationTimer && this.vibrateFlag) {
            this.outerContainer.position.x += this.strength * (1 - Math.round(Math.random()) * 2);
            this.outerContainer.position.y += this.strength * (1 - Math.round(Math.random()) * 2);
            this.nextVibrationTime += PERIOD;
            this.vibrateFlag = !this.vibrateFlag;
            this.strength *= 0.9;
        } else if (this.nextVibrationTime < this.vibrationTimer && !this.vibrateFlag) {
            this.outerContainer.position.x = this.flip.x ? this.size.width : 0;
            this.outerContainer.position.y = this.flip.y ? this.size.height : 0;
            this.nextVibrationTime += PERIOD;
            this.vibrateFlag = !this.vibrateFlag;
        }
    }

    public get flip(): Flip {
        return this._flip;
    }

    public set flip(flip: Flip) {
        this._flip.x = flip.x;
        this._flip.y = flip.y;
        this.outerContainer.position.x = this.flip.x ? this.size.width : 0;
        this.outerContainer.position.y = this.flip.y ? this.size.height : 0;
        this.outerContainer.scale.x = this.flip.x ? -1 : 1;
        this.outerContainer.scale.y = this.flip.y ? -1 : 1;
    }

    public vibration(duration: number, strength: number): void {
        this.duration = duration;
        this.strength = strength;
        this.vibrationTimer = 0;
        this.nextVibrationTime = 0;
    }

    public setState(state: State): void {
        this.state = state;
    }

    public setPosition(position: Point): void {
        if (!position) return;
        this.position.x = position.x;
        this.position.y = position.y;
    }

    public setSize(size: Size): void {
        if (!size) return;
        this.size.width = size.width;
        this.size.height = size.height;
    }

    public setScale(scale: Scale): void {
        if (!scale) scale = { x: 1, y: 1 };
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

    public makeNameTag(name: string): void {
        const nameTag: PIXI.Text = new PIXI.Text(name,
            { fontSize: 10, fill: "white" }
        );
        nameTag.anchor.x = 0.5;
        nameTag.anchor.y = 0.5;
        nameTag.position.x += this.size.width / 2;
        nameTag.position.y = -nameTag.height;

        const box: PIXI.Sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
        box.tint = 0;
        box.alpha = 0.3;
        box.anchor.x = 0.5;
        box.anchor.y = 0.5;
        box.width = nameTag.width + 4;
        box.height = nameTag.height - 1;
        box.position.x += this.size.width / 2;
        box.position.y = -nameTag.height - 1;

        this.uiContainer.addChild(box);
        this.uiContainer.addChild(nameTag);
    }
}