import BaseObject from "../baseObject";

export default class SungHoon extends BaseObject {
    constructor(options: any) {
        super(options);

        this.sprite = PIXI.Sprite.from(`src/assets/hitBox.png`);
        this.container.addChild(this.sprite);
    }

    public update(dt: number): void {
    }
}