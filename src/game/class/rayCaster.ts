import CollisionEngine from './collisionEngine';

export default class RayCaster {
    public dirties: Array<any> = [];
    private objs: any;
    private lighting: any;
    private position: any;
    private triangles: any = {};
    public rayContainer: PIXI.Container;
    private rayPolygon: any;
    private LAY_DENSITY: number = 0.08;
    
    constructor() {
        this.rayContainer = new PIXI.Container();
    }

    public update() {
        if (this.dirties.length > 0) {
            this.dirties.forEach((dirty) => {
                this.clean(dirty);
            });

            this.makeLay();
        }
    }

    public setPosition(position: any): void {
        this.position = position;
    }

    public setObjects(objs: any): void {
        this.objs = [];
        for (let key in objs) {
            this.objs.push(objs[key]);
        }
    }

    public setLightingLayer(lighting: any): void {
        this.lighting = lighting;
    }

    public makeLay(): void {
        if (this.rayPolygon) {
            this.rayContainer.removeChild(this.rayPolygon);
        }

        const points: Array<any> = [new PIXI.Point(this.position.x, this.position.y)];
        for (let key in this.triangles) {
            points.push(new PIXI.Point(this.triangles[key].x, this.triangles[key].y));
        }

        this.rayPolygon = new PIXI.Graphics();
        this.rayPolygon.parentLayer = this.lighting;
        this.rayPolygon.beginFill(0xFFFFFF, 0.2);
        this.rayPolygon.drawPolygon(points);
        this.rayPolygon.endFill();
        this.rayContainer.addChild(this.rayPolygon);
    }

    public initLay(): void {
        const ray: any = {
            position: this.position,
            size: { x: 0.1, y: 0.1 },
            vector: {
                x: 0,
                y: 0
            }
        };

        for (let i=0; i<=180; i += this.LAY_DENSITY) {
            ray.vector.x = Math.cos(i * Math.PI / 180);
            ray.vector.y = Math.sin(i * Math.PI / 180);
            const hitObjects: Array<any> = CollisionEngine.getHitObjects(ray, this.objs, Number.MAX_SAFE_INTEGER);

            if (hitObjects.length > 0) {
                this.triangles[i.toString()] = {
                    x: this.position.x + (ray.vector.x * (hitObjects[0].time + 5)),
                    y: this.position.y + (ray.vector.y * (hitObjects[0].time + 5))
                };
                this.dirty(i.toString());
            }
        }
    }

    // 타일 박살났을 때 호출해서 Lay 다시 계산한다.
    public refreshLay(deletedObject: any): void {
        const reCalculateds: Array<any> = [];

        // 변경 된 ray 찾는다.
        for (let i=0; i<=180; i += this.LAY_DENSITY) {
            const ray: any = this.triangles[i.toString()];
            const x: any = { min: deletedObject.position.x, max: deletedObject.position.x + deletedObject.size.x };
            const y: any = { min: deletedObject.position.y, max: deletedObject.position.y + deletedObject.size.y };

            if (ray.x <= x.max && ray.x >= x.min && ray.y <= y.max && ray.y >= y.min) {
                reCalculateds.push(i);
            }
        }

        const reCalculedLay: any = {
            position: this.position,
            size: { x: 0.1, y: 0.1 },
            vector: {
                x: 0,
                y: 0
            }
        };

        // Lay 재 계산.
        reCalculateds.forEach((ray): void => {
            reCalculedLay.vector.x = Math.cos(ray * Math.PI / 180);
            reCalculedLay.vector.y = Math.sin(ray * Math.PI / 180);
            const hitObjects: Array<any> = CollisionEngine.getHitObjects(reCalculedLay, this.objs, Number.MAX_SAFE_INTEGER);

            if (hitObjects.length > 0) {
                this.triangles[ray.toString()] = {
                    x: this.position.x + (reCalculedLay.vector.x * (hitObjects[0].time + 1)),
                    y: this.position.y + (reCalculedLay.vector.y * (hitObjects[0].time + 1))
                };
                this.dirty(ray.toString());
            }
        });
    }

    private clean(key: string): void {
        const index: number = this.dirties.indexOf(key);

        if (index >= 0) {
            this.dirties.splice(index, 1);
        }
    }

    private dirty(key: string): void {
        if (this.dirties.indexOf(key) < 0) {
            this.dirties.push(key);
        }
    }
}