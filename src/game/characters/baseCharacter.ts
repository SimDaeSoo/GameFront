import BaseObject from "../baseObject";
import { loadAniTexture } from "../../utils/utils";
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
    public animations: {[name: string]: IAnimation} = {};
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
/*
state: {
    currentState: "",
    startDt: 0,
    endDt: 0,
    loop: true,
    nextState: ""
}

state Map이 있어야 할듯하다. -> 그래프 느낌으로
    State에 따라서 Animation이 변경된다.
    State는 Mutation될 수 있다.
    State는 완료 시점이 있으며, Loop할 수 있다.
    어떤 Key가 눌려있는지를 알아야 State를 조절할 수 있을듯 하다.

    idle -> idle (Loop & all key up)
    idle -> walk (current keydown) vector 변형
    idle -> jump (current keydown) vector 변형
    idle -> attack (current keydown)
    idle -> crouch (current keydown)

    walk -> idle (all key up & land) vector 변형
    walk -> walk (Loop & keydown)
    walk -> jump (!land) vector 변형
    walk -> attack (current keydown) vector 변형
    walk -> crouch (current keydown) vector 변형

    jump -> idle (land)
    jump -> walk (land & keydown) vector 변형
    jump -> jump (Loop & !land) keydown시 vector 변형

    attack -> idle (done state & land) 
    attack -> jump (done state & !land) vector 변형
    attack -> attack (done state & keydown)
    attack -> walk (done state & keydown) vector 변형

    crouch -> idle (all key up)
    crouch -> walk (keydown) vector 변형
    crouch -> jump (keydown) vector 변형
    crouch -> crouch (Loop)

    stateMap: {
        idle: {
            idle: [
                {
                    events: ["keyUp", "all"],
                    script: []
                }
            ],
            walk: [
                {
                    events: ["keyDown", "left"],
                    script: ["setVector", "x", -0.2]
                }
            ]
        }
    }
*/