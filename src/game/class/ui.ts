interface IuiOptions {
    size?: {
        width: number,
        height: number
    },
    fpsChecker?: boolean,
    upsChecker?: boolean,
    pingInterpolationChecker?: boolean
}

export default class UI extends PIXI.Container {
    public size: { width: number, height: number};
    public systemContainer: PIXI.Container;
    public fpsText: PIXI.Text;
    public upsText: PIXI.Text;
    public pingText: PIXI.Text;
    public systemData: { fps: number, ups: number, ping: number };

    constructor(options: IuiOptions) {
        super();
        this.systemContainer = new PIXI.Container();
        this.systemContainer.position.x += 2;
        this.addChild(this.systemContainer);

        const box = new PIXI.Sprite(PIXI.Texture.WHITE);
        box.tint = 0xffffff;
        box.alpha = 0.15;
        box.position.y += 2;
        box.width = 85;
        box.height = 49;
        this.systemContainer.addChild(box);

        if (options.size) this.size = options.size;
        if (options.fpsChecker) this.makeFPS();
        if (options.upsChecker) this.makeUPS();
        if (options.pingInterpolationChecker) this.makePing();
    }

    public update(): void {
        if (this.systemData) {
            this.updateFPS();
            this.updateUPS();
            this.updatePing();

            // this.fpsText.style = { fontSize: 10, fill: 'green' };
        }
    }

    public updateFPS(): void {
        if (this.fpsText && this.fpsText.text !== `FPS ${this.systemData.fps}`) {
            let color: string = 'red';
            if (this.systemData.fps >= 54) { // 90%
                color = 'green';
            } else if (this.systemData.fps >= 42) { // 70%
                color = 'orange';
            }
            this.fpsText.style = { fontSize: 15, fill: color };
            this.fpsText.text = `FPS ${this.systemData.fps}`;
        }
    }

    public updateUPS(): void {
        if (this.upsText && this.upsText.text !== `UPS ${this.systemData.ups}`) {
            let color: string = 'red';
            if (this.systemData.ups >= 90) { // 90%
                color = 'green';
            } else if (this.systemData.ups >= 70) { // 70%
                color = 'orange';
            }
            this.upsText.style = { fontSize: 15, fill: color };
            this.upsText.text = `UPS ${this.systemData.ups}`;
        }
    }

    public updatePing(): void {
        if (this.pingText && this.pingText.text !== `Ping ${this.systemData.ping}`) {
            let color: string = 'red';
            if (this.systemData.ping <= 20) {
                color = 'green';
            } else if (this.systemData.ping <= 80) {
                color = 'orange';
            }
            this.pingText.style = { fontSize: 15, fill: color };
            this.pingText.text = `Ping ${this.systemData.ping}`;
        }
    }

    public makeFPS(): void {
        if (!this.fpsText) {
            this.fpsText = new PIXI.Text('FPS 0', { fontSize: 15, fill: 'green' });
            this.fpsText.position.x += 2;
            this.fpsText.position.y += 2;
            this.systemContainer.addChild(this.fpsText);
        }
    }

    public makeUPS(): void {
        if (!this.upsText) {
            this.upsText = new PIXI.Text('UPS 0', { fontSize: 15, fill: 'green' });
            this.upsText.position.x += 2;
            this.upsText.position.y += 17;
            this.systemContainer.addChild(this.upsText);
        }
    }

    public makePing(): void {
        if (!this.pingText) {
            this.pingText = new PIXI.Text('Ping 0', { fontSize: 15, fill: 'green' });
            this.pingText.position.x += 2;
            this.pingText.position.y += 32;
            this.systemContainer.addChild(this.pingText);
        }
    }
}