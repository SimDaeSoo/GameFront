import BaseCharacter from "./baseCharacter";
import { loadAniTexture } from "../../utils/utils";

export default class SungHoon extends BaseCharacter {
    public sprite: PIXI.AnimatedSprite;

    constructor(options: any) {
        super(options);

        // Sprite Load
        this.sprite = new PIXI.AnimatedSprite(loadAniTexture('ksh001_idle', 4));
        
        // Offset
        this.sprite.position.x -= 18;
        this.sprite.position.y -= 4;

        // Setting Animation
        this.sprite.animationSpeed = 0.1;
        this.sprite.loop = true;
        this.sprite.play();

        this.container.addChild(this.sprite);
        this.makeNameTag();
    }

    public update(dt: number): void {
    }
}