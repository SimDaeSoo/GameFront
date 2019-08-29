import BaseObject from "../baseObject";

export default class SungHoon extends BaseObject {
    constructor(options: any) {
        super(options);

        this.sprite = PIXI.Sprite.from(`src/assets/hitBox.png`);
        this.sprite.position.x -= 14;
        this.container.addChild(this.sprite);

        this.makeNameTag();
    }

    public update(dt: number): void {
    }

    private makeNameTag(): void {
    const message3 = new PIXI.Text("Lv.1 권성훈",
        { fontSize: 10, fill: 'white' }
    );
    message3.anchor.x = 0.5;
    message3.anchor.y = 0.5;
    message3.position.x += this.size.x / 2;
    message3.position.y = -message3.height;

    const box = new PIXI.Sprite(PIXI.Texture.WHITE);
    box.tint = 0;
    box.alpha = 0.3;
    box.anchor.x = 0.5;
    box.anchor.y = 0.5;
    box.width = message3.width + 4;
    box.height = message3.height - 1;
    box.position.x += this.size.x / 2;
    box.position.y = -message3.height - 1;

    this.uiContainer.addChild(box);
    this.uiContainer.addChild(message3);
    }
}