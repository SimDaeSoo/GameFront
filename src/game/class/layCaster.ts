import CollisionEngine from './collisionEngine';

export default class LayCaster {
    private position: any;
    private triangles: any = {};
    private objs: any;
    private LAY_DENSITY: number = 1;
    public dirties: Array<any> = [];

    public update() {
    }

    public setPosition(position: any): void {
        this.position = position;
    }

    public setObjects(objs: Array<any>): void {
        this.objs = objs;
    }

    public initLay(): void {
        const lay: any = {
            position: this.position,
            size: { x: 0.1, y: 0.1 },
            vector: {
                x: 0,
                y: 0
            }
        };

        for (let i=0; i<=180; i += this.LAY_DENSITY) {
            lay.vector.x = Math.cos(i * Math.PI / 180);
            lay.vector.y = Math.sin(i * Math.PI / 180);
            const hitObjects: Array<any> = CollisionEngine.getHitObjects(lay, this.objs, Number.MAX_SAFE_INTEGER);

            if (hitObjects.length > 0) {
                this.triangles[i.toString()] = {
                    x: this.position.x + (lay.vector.x * (hitObjects[0].time + 1)),
                    y: this.position.y + (lay.vector.y * (hitObjects[0].time + 1))
                };
                this.dirty(i.toString());
            }
        }

        console.log(this.triangles);
    }

    // 타일 박살났을 때 호출해서 Lay 다시 계산한다.
    public refreshLay(deletedObject: any): void {
        const reCalculateds: Array<any> = [];

        // 변경 된 lay 찾는다.
        for (let i=0; i<=180; i += this.LAY_DENSITY) {
            const lay: any = this.triangles[i.toString()];
            const x: any = { min: deletedObject.position.x, max: deletedObject.position.x + deletedObject.size.x };
            const y: any = { min: deletedObject.position.y, max: deletedObject.position.y + deletedObject.size.y };

            if (lay.x <= x.max && lay.x >= x.min && lay.y <= y.max && lay.y >= y.min) {
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
        reCalculateds.forEach((lay): void => {
            reCalculedLay.vector.x = Math.cos(lay * Math.PI / 180);
            reCalculedLay.vector.y = Math.sin(lay * Math.PI / 180);
            const hitObjects: Array<any> = CollisionEngine.getHitObjects(reCalculedLay, this.objs, Number.MAX_SAFE_INTEGER);

            if (hitObjects.length > 0) {
                this.triangles[lay.toString()] = {
                    x: this.position.x + (reCalculedLay.vector.x * (hitObjects[0].time + 1)),
                    y: this.position.y + (reCalculedLay.vector.y * (hitObjects[0].time + 1))
                };
                this.dirty(lay.toString());
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