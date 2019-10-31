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
    public size: { width: number, height: number };

    constructor(options: IuiOptions) {
        super();

        if (options.size) this.size = options.size;
    }

    public update(): void {
    }
}