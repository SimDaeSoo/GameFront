import { TILE_SIZE } from "../define";

export default class Camera {
    private renderer: any;
    private screenWidth: number;
    private screenHeight: number;
    private targetVibration: number = 0;
    private currentVibration: number = 0;
    public targetZoom: number = 1;
    public currentZoom: number = 1;
    public position: any = { x: 0, y: 0 };
    private size: any = { width: 0, height: 0 };
    private obj: any = undefined;
    private stage: any = undefined;


    constructor(width: number, height: number) {
        this.screenWidth = width;
        this.screenHeight = height;
    }

    public update(dt: number): void {
        const FOLLOW_COEIFFICIENT = 1.004 ** dt - 1;
        const ZOOM_COEIFFICIENT = 1.003 ** dt - 1;
        this.clearVibration();
        this.updateFollowObj(FOLLOW_COEIFFICIENT);
        this.updateFollowZoom(ZOOM_COEIFFICIENT);
        this.applyVibration();
        this.updateStage();
    }

    public setSize(size: any): void {
        this.size = size;
    }

    public setRenderer(renderer: any): void {
        this.renderer = renderer;
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
        if (this.size.width !== 0 && value < this.screenWidth / (this.size.width) * 1.01) {
            this.targetZoom = this.screenWidth / (this.size.width) * 1.01;
        } else if (this.size.width !== 0) {
            this.targetZoom = value;
        }
    }

    private clearVibration(): void {

    }

    private applyVibration(): void {
        
    }

    private updateStage(): void {
        if (this.stage === undefined) return;
        const data: any = this.renderer.gameData;
        this.stage.scale.x = this.currentZoom;
        this.stage.scale.y = this.currentZoom;

        if (this.position.x >= -1 * this.currentZoom) {
            this.position.x = 0;
        } else if (data && data.worldProperties.width > 0 && this.position.x <= -(data.worldProperties.width * TILE_SIZE.WIDTH * this.currentZoom - this.screenWidth) + 1 * this.currentZoom) {
            this.position.x = -(data.worldProperties.width * TILE_SIZE.WIDTH * this.currentZoom - this.screenWidth);
        }

        if (data && data.worldProperties.height > 0 && this.position.y <= -((data.worldProperties.height) * TILE_SIZE.HEIGHT * this.currentZoom - this.screenHeight) + 1 * this.currentZoom) {
            this.position.y = -((data.worldProperties.height) * TILE_SIZE.HEIGHT * this.currentZoom - this.screenHeight);
        }
        
        this.stage.position.x = Math.round(this.position.x);
        this.stage.position.y = Math.round(this.position.y);
    }

    private updateFollowObj(coeifficient: number): void {
        if (this.obj === undefined) return;

        const targetPosition: any = {
            x: ((-this.obj.position.x - this.obj.size.x / 2) * this.currentZoom + this.screenWidth / 2),
            y: ((-this.obj.position.y - this.obj.size.y / 2 + 100) * this.currentZoom + this.screenHeight / 2)
        };

        this.position.x += (targetPosition.x - this.position.x) * coeifficient;
        this.position.y += (targetPosition.y - this.position.y) * coeifficient;
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