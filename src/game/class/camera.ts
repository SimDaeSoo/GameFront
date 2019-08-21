export default class Camera {
    private screenWidth: number;
    private screenHeight: number;
    public targetZoom: number = 1;
    private currentZoom: number = 1;
    private position: any = { x: 0, y: 0 };
    private obj: any = undefined;
    private stage: any = undefined;


    constructor(width: number, height: number) {
        this.screenWidth = width;
        this.screenHeight = height;
    }

    update(): void {
        const COEIFFICIENT = 0.05;
        this.followZoom(COEIFFICIENT);
        this.followObj(COEIFFICIENT);
        this.updateStage();
    }

    setStage(stage: any) {
        this.stage = stage;
    }

    updateStage(): void {
        if (this.stage === undefined) return;

        this.stage.position.x = this.position.x;
        this.stage.position.y = this.position.y;
        this.stage.scale.x = this.currentZoom;
        this.stage.scale.y = this.currentZoom;
    }

    setObject(obj: any): void {
        this.obj = obj;
    }

    followObj(coeifficient: number): void {
        if (this.obj === undefined) return;

        this.position.x += ((-this.obj.position.x * this.currentZoom + this.screenWidth / 2) - this.position.x) * coeifficient;
        this.position.y += ((-this.obj.position.y * this.currentZoom + this.screenHeight / 2) - this.position.y) * coeifficient;
    }

    setZoom(value): void {
        this.targetZoom = value;
    }

    followZoom(coeifficient: number): void {
        const zoom: number = this.currentZoom + (this.targetZoom - this.currentZoom) * coeifficient;
        const centerPos: any = {
            x: (this.position.x - this.screenWidth / 2) / this.currentZoom,
            y: (this.position.y - this.screenHeight / 2) / this.currentZoom
        };

        this.currentZoom = zoom;
        this.position.x = (centerPos.x * this.currentZoom) + this.screenWidth / 2;
        this.position.y = (centerPos.y * this.currentZoom) + this.screenHeight / 2;
    }
}