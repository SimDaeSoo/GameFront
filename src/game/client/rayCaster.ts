import CollisionEngine from "../union/collisionEngine";
import { TILE_SIZE, Size } from "../union/define";

export default class RayCaster {
    public dirties: Array<any> = [];
    private realObjs: any;
    private lighting: any;
    private position: any;
    private size: Size;
    private triangles: any = {};
    public rayContainer: PIXI.Container;
    private period: number = 0;
    private rayPolygon: any;
    private RAY_DENSITY: number = 0.15;

    constructor() {
        this.rayContainer = new PIXI.Container();
    }

    public update(dt: number) {
        if (this.period > 500) {
            this.changeDetect();
            this.makeRay();
            this.period = 0;
        } else {
            this.period += dt;
        }
    }

    public setPosition(position: any): void {
        this.position = position;
    }

    public setSize(size: Size): void {
        this.size = size;
    }

    public setObjects(objs: any): void {
        this.realObjs = objs;
    }

    public get objs(): Array<any> {
        const objs: Array<any> = [];
        for (let key in this.realObjs) {
            objs.push(this.realObjs[key]);
        }
        return objs;
    }

    public setLightingLayer(lighting: any): void {
        this.lighting = lighting;
    }

    public initializeRay(): void {
        const ray: any = {
            position: this.position,
            size: { width: 0.1, height: 0.1 },
            vector: { x: 0, y: 0 }
        };

        for (let i = 0; i <= 180; i += this.RAY_DENSITY) {
            ray.vector.x = Math.cos(i * Math.PI / 180);
            ray.vector.y = Math.sin(i * Math.PI / 180);
            const hitObjects: Array<any> = CollisionEngine.getHitObjects(ray, this.objs, Number.MAX_SAFE_INTEGER);

            if (hitObjects.length > 0) {
                this.triangles[i.toFixed(2)] = {
                    x: this.position.x + (ray.vector.x * (hitObjects[0].time + 5)),
                    y: this.position.y + (ray.vector.y * (hitObjects[0].time + 5)),
                    name: Math.round(hitObjects[0].object.position.x / TILE_SIZE.WIDTH) % this.size.width + Math.round(hitObjects[0].object.position.y / TILE_SIZE.HEIGHT * this.size.width / TILE_SIZE.WIDTH)
                };
            }
        }

        this.makeBoundary();
    }

    public makeRay(): void {
        if (this.rayPolygon) {
            this.rayContainer.removeChild(this.rayPolygon);
            this.rayPolygon.destroy(true);
        }

        const points: Array<any> = this.getPolygonPath();

        this.rayPolygon = new PIXI.Graphics();
        this.rayPolygon.parentLayer = this.lighting;
        this.rayPolygon.beginFill(0xF0F0E0, 1);
        this.rayPolygon.drawPolygon(points);
        this.rayPolygon.endFill();
        this.rayContainer.addChild(this.rayPolygon);
    }

    private getPolygonPath(): Array<any> {
        const points: Array<any> = [];
        let min: number = Number.MAX_VALUE;
        let max: number = Number.MIN_VALUE;

        for (let key in this.triangles) {
            if (min > Number(key)) min = Number(key);
            if (max < Number(key)) max = Number(key);

            points.push(new PIXI.Point(this.triangles[key].x, this.triangles[key].y));
        }

        const boundaryAngle: any = {
            min: { x: this.size.width / 2 + (this.position.y - this.size.height) / Math.tan((min - this.RAY_DENSITY) * Math.PI / 180), y: this.size.height },
            max: { x: this.size.width / 2 + (this.position.y - this.size.height) / Math.tan((max + this.RAY_DENSITY) * Math.PI / 180), y: this.size.height }
        };

        const startPoint: Array<any> = [
            new PIXI.Point(boundaryAngle.min.x, boundaryAngle.min.y),
            new PIXI.Point(0, 0),
            new PIXI.Point(0, this.position.y),
            new PIXI.Point(this.size.width, this.position.y),
            new PIXI.Point(boundaryAngle.max.x, boundaryAngle.max.y)
        ];

        return startPoint.concat(points);
    }

    private makeBoundary(): void {
        this.realObjs["boundary"] = {
            class: "dirt",
            objectType: "tiles",
            tileNumber: 0,
            weight: 10000000000000000000,
            scale: { x: 0, y: 0 },
            position: { x: -Number.MAX_VALUE / 2, y: this.size.height },
            size: { width: Number.MAX_VALUE, height: 1 },
            vector: { x: 0, y: 0 },
            forceVector: { x: 0, y: 0 },
            flip: { x: false, y: false },
            rotation: 0,
            rotationVector: 0
        };
    }

    private changeDetect(): void {
        for (let key in this.triangles) {
            if (this.realObjs[this.triangles[key].name] === undefined) {
                this.resolution(key);
            }
        }
    }

    private resolution(key: any): void {
        const ray: any = {
            position: this.position,
            size: { width: 0.1, height: 0.1 },
            vector: { x: 0, y: 0 }
        };
        ray.vector.x = Math.cos(Number(key) * Math.PI / 180);
        ray.vector.y = Math.sin(Number(key) * Math.PI / 180);
        const hitObjects: Array<any> = CollisionEngine.getHitObjects(ray, this.objs, Number.MAX_SAFE_INTEGER);

        if (hitObjects.length > 0) {
            this.triangles[key] = {
                x: this.position.x + (ray.vector.x * (hitObjects[0].time + 5)),
                y: this.position.y + (ray.vector.y * (hitObjects[0].time + 5)),
                name: Math.round(hitObjects[0].object.position.x / TILE_SIZE.WIDTH) % this.size.width + Math.round(hitObjects[0].object.position.y / TILE_SIZE.HEIGHT * this.size.width / TILE_SIZE.WIDTH)
            };

            if (hitObjects[0].object.size.width >= TILE_SIZE.WIDTH * this.size.width / 2) {
                this.triangles[key].name = "boundary"
            }
        } else {
            delete this.triangles[key];
        }
    }
}