import BaseCharacter from "./baseCharacter";

export default class SungHoon extends BaseCharacter {
    public sprite: PIXI.AnimatedSprite;

    constructor(options: any) {
        super(options);

        this.addAnimation("idle", { src: "ksh001_idle", length: 4, offset: { x: -18, y: -4 }, animationSpeed: 0.1, loop: true });
        this.addAnimation("walk", { src: "ksh001_walk", length: 4, offset: { x: -18, y: -4 }, animationSpeed: 0.1, loop: true });
        this.addAnimation("jump", { src: "ksh001_jump", length: 1, offset: { x: -18, y: -4 }, animationSpeed: 0.1, loop: true });

        this.makeNameTag(`SOCKET ID:${options.id}`);
    }

    public update(dt: number): void {
        this.changeAnimation();
    }

    private changeAnimation(): void {
        if (this.state && this.animationName !== this.state.currentState) {
            this.setAnimation(this.state.currentState);

            if (!this.sprite) {
                this.sprite = new PIXI.AnimatedSprite(this.animation.sprite.textures);
                this.container.addChild(this.sprite);
            }

            this.sprite.textures = this.animation.sprite.textures;
            this.sprite.position.x = this.animation.options.offset.x;
            this.sprite.position.y = this.animation.options.offset.y;
            this.sprite.animationSpeed = this.animation.options.animationSpeed;
            this.sprite.loop = this.animation.options.loop;
            this.sprite.gotoAndPlay(0);
        }
    }
}