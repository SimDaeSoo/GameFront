import BaseObject from "../baseObject";
import { loadAniTexture } from "../loader";
//{ src: "ksh001_idle", length: 4, offset: { x: -18, y: -4 }, animationSpeed: 0.1, loop: true}
interface IAnimationOptions {
    src: string;
    length: number;
    offset: { x: number, y: number };
    animationSpeed: number;
    loop: boolean;
}

interface IAnimation {
    sprite: PIXI.AnimatedSprite;
    options: IAnimationOptions
}

export default class BaseCharacter extends BaseObject {
    public animations: { [name: string]: IAnimation } = {};
    public animationName: string;
    private options: any;

    constructor(options: any) {
        super(options);
        this.options = options;
    }
    public _update(dt: number): void {
        this._updateProperties();
        this.interpolationPosition(dt);
        this.updateVibration(dt);
        this.update(dt);
    }

    public update(dt: number): void {
    }

    // 음.. 이게 맞나싶어
    private _updateProperties() {
        if (this.options.land && Math.abs(this.options.vector.y) >= 0.1) {
            this.options.land = false;
        }
        if (this.options.vector.x < 0 && this.flip.x) {
            this.flip = { x: false, y: this.flip.y };
        } else if (this.options.vector.x > 0 && !this.flip.x) {
            this.flip = { x: true, y: this.flip.y };
        }
    }

    public addAnimation(name: string, options: IAnimationOptions): void {
        this.animations[name] = {
            sprite: new PIXI.AnimatedSprite(loadAniTexture(options.src, options.length)),
            options: options
        };
    }

    public setAnimation(name: string): void {
        this.animationName = name;
    }

    public get animation(): IAnimation {
        return this.animations[this.animationName];
    }
}