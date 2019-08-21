export default class Camera {
    private screenWidth: number;
    private screenHeight: number;
    private targetVibration: number = 0;
    private currentVibration: number = 0;
    public targetZoom: number = 1;
    public currentZoom: number = 1;
    public position: any = { x: 0, y: 0 };
    private obj: any = undefined;
    private stage: any = undefined;


    constructor(width: number, height: number) {
        this.screenWidth = width;
        this.screenHeight = height;
    }

    public update(): void {
        const COEIFFICIENT = 0.05;
        this.clearVibration();
        this.updateFollowZoom(COEIFFICIENT);
        this.updateFollowObj(COEIFFICIENT);
        this.applyVibration();
        this.updateStage();
    }

    public setVibration(strength: number): void {
        
    }

    public setStage(stage: any): void {
        this.stage = stage;
    }

    public setObject(obj: any): void {
        this.obj = obj;
    }

    public setZoom(value): void {
        this.targetZoom = value;
    }

    private clearVibration(): void {

    }

    private applyVibration(): void {
        
    }

    private updateStage(): void {
        if (this.stage === undefined) return;

        this.stage.scale.x = this.currentZoom;
        this.stage.scale.y = this.currentZoom;
        this.stage.position.x = Math.round(this.position.x);
        this.stage.position.y = Math.round(this.position.y);
    }

    private updateFollowObj(coeifficient: number): void {
        if (this.obj === undefined) return;

        this.position.x += ((-this.obj.position.x * this.currentZoom + this.screenWidth / 2) - this.position.x) * coeifficient;
        this.position.y += ((-this.obj.position.y * this.currentZoom + this.screenHeight / 2) - this.position.y) * coeifficient;

        // if (this.position.x > 0) {
        //     this.position.x = 0;
        // }
    }

    private updateFollowZoom(coeifficient: number): void {
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