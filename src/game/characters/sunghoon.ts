import BaseCharacter from "./baseCharacter";

export default class SungHoon extends BaseCharacter {

    constructor(options: any) {
        super(options);

        this.sprite = PIXI.Sprite.from(`src/assets/hitBox.png`);
        this.sprite.position.x -= 18;
        this.sprite.position.y -= 4;
        this.container.addChild(this.sprite);

        this.makeNameTag();
    }

    public update(dt: number): void {
    }
}