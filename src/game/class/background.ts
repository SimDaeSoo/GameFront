export default class Background extends PIXI.Container {
    constructor(worldSize: any) {
        super();

        let backgroundSize: any = {
            width: 0,
            height: 0
        };

        while (backgroundSize.width < worldSize.width) {
            let background: PIXI.Sprite;
            background = PIXI.Sprite.from("src/assets/background.png");
            background.position.x = backgroundSize.width;
            this.addChild(background);

            backgroundSize.width += background.width;
        }

        let shadow = new PIXI.Graphics();
        shadow.beginFill(0x0C1122, 1);
        shadow.drawPolygon([new PIXI.Point(0, 580), new PIXI.Point(0, 1080), new PIXI.Point(backgroundSize.width, 1080), new PIXI.Point(backgroundSize.width, 580)]);
        shadow.endFill();
        this.addChild(shadow);
        this.position.y = -60;
    }
}