export default class CollisionEngine {
    public static applyTilePhysics(objA: any, collisionResult: any): any {
        const dt: number = collisionResult.time;
        const objB: any = collisionResult.object;
        
        // xAxis
        if (collisionResult.direction.left || collisionResult.direction.right) {
            const vectorA = objA.vector.x + objB.weight * (objB.vector.x - objA.vector.x) / (objA.weight + objB.weight) * 2;
            objA.position.x += objA.vector.x * dt + (collisionResult.direction.left?0.15:-0.15);
            objA.vector.x = CollisionEngine.translateTinyValue(vectorA)*0;
        }

        // yAxis
        if (collisionResult.direction.up || collisionResult.direction.down) {
            const vectorA = objA.vector.y + objB.weight * (objB.vector.y - objA.vector.y) / (objA.weight + objB.weight) * 2;
            objA.position.y += objA.vector.y * dt + (collisionResult.direction.up?0.15:-0.15);
            objA.vector.y = CollisionEngine.translateTinyValue(vectorA)*0;
            objA.land = collisionResult.direction.down;
        }

        return {
            objA: objA,
            objB: objB
        };
    }

    public static applyPhysics(objA: any, collisionResult: any): any {
        const dt: number = collisionResult.time;
        const objB: any = collisionResult.object;
        
        // xAxis
        if (collisionResult.direction.left || collisionResult.direction.right) {
            const vectorA = objA.vector.x + objB.weight * (objB.vector.x - objA.vector.x) / (objA.weight + objB.weight) * 2;
            const vectorB = objB.vector.x + objA.weight * (objA.vector.x - objB.vector.x) / (objA.weight + objB.weight) * 2;
            objA.position.x += objA.vector.x * dt;
            objB.position.x += objB.vector.x * dt;
            objA.vector.x = CollisionEngine.translateTinyValue(vectorA);
            objB.vector.x = CollisionEngine.translateTinyValue(vectorB);
        }

        // yAxis
        if (collisionResult.direction.up || collisionResult.direction.down) {
            const vectorA = objA.vector.y + objB.weight * (objB.vector.y - objA.vector.y) / (objA.weight + objB.weight) * 2;
            const vectorB = objB.vector.y + objA.weight * (objA.vector.y - objB.vector.y) / (objA.weight + objB.weight) * 2;
            objA.position.y += objA.vector.y * dt;
            objB.position.y += objB.vector.y * dt;
            objA.vector.y = CollisionEngine.translateTinyValue(vectorA);
            objB.vector.y = CollisionEngine.translateTinyValue(vectorB);
        }

        return {
            objA: objA,
            objB: objB
        };
    }

    public static getHitTileGroup(objA: any, objects: Array<any>, dt: number): Array<any> {
        let result: Array<any> = [];
        let time: number = Infinity;
        const tickInterpolation: number = 24;

        objects.forEach((objB: any) => {
            const hitTestResult: any = CollisionEngine.hitTest(objA, objB);
            hitTestResult.direction.left = hitTestResult.direction.left && (objB.endXAxis === objB.id);
            hitTestResult.direction.right = hitTestResult.direction.right && (objB.startXAxis === objB.id);
            hitTestResult.direction.up = hitTestResult.direction.up && (objB.endYAxis === objB.id);
            hitTestResult.direction.down = hitTestResult.direction.down && (objB.startYAxis === objB.id);

            if (hitTestResult.direction.left || hitTestResult.direction.right || hitTestResult.direction.up || hitTestResult.direction.down) {
                if (hitTestResult.time <= dt && hitTestResult.time >= -tickInterpolation && time > hitTestResult.time) {
                    result = [hitTestResult];
                    time = hitTestResult.time;
                } else if (hitTestResult.time <= dt && hitTestResult.time >= -tickInterpolation && time === hitTestResult.time) {
                    result.push(hitTestResult);
                    time = hitTestResult.time;
                }
            }
        });

        return result;
    }

    public static getHitObjects(objA: any, objects: Array<any>, dt: number): Array<any> {
        let result: Array<any> = [];
        let time: number = Infinity;
        const tickInterpolation: number = 24;

        objects.forEach((objB: any) => {
            const hitTestResult: any = CollisionEngine.hitTest(objA, objB);

            if (hitTestResult.time <= dt && hitTestResult.time >= -tickInterpolation && time > hitTestResult.time) {
                result = [hitTestResult];
                time = hitTestResult.time;
            } else if (hitTestResult.time <= dt && hitTestResult.time >= -tickInterpolation && time === hitTestResult.time) {
                result.push(hitTestResult);
                time = hitTestResult.time;
            }
        });

        return result;
    }

    public static hitTest(objA: any, objB: any): any {
        const xAxis: any = CollisionEngine.xAxisHitTest(objA, objB);
        const yAxis: any = CollisionEngine.yAxisHitTest(objA, objB);
        const result: any = { direction: { left: false, right: false, up: false, down: false }, time: Infinity, object: null };

        // Collision
        if (xAxis.min < yAxis.max && xAxis.max > yAxis.min) {
            result.time = xAxis.min<yAxis.min?yAxis.min:xAxis.min;
            result.direction.left = (xAxis.min === result.time) && (objB.vector.x-objA.vector.x > 0);
            result.direction.right = (xAxis.min === result.time) && (objB.vector.x-objA.vector.x < 0);
            result.direction.up = (yAxis.min === result.time) && (objB.vector.y-objA.vector.y > 0);
            result.direction.down = (yAxis.min === result.time) && (objB.vector.y-objA.vector.y < 0);
            result.object = objB;
        }

        return result;
    }

    public static yAxisHitTest(objA: any, objB: any): { min: number, max: number } {
        const vector: number = objB.vector.y - objA.vector.y;
        let timestamp: any = { min: Infinity, max: -Infinity };

        if (vector === 0) {
            if (objA.position.y + objA.size.y >= objB.position.y && objA.position.y <= objB.position.y + objB.size.y) {
                timestamp = { min: -Infinity, max: Infinity };
            }
        } else if (vector > 0) {
            timestamp.max = ((objA.position.y + objA.size.y) - objB.position.y) / vector;
            timestamp.min = (objA.position.y - (objB.position.y + objB.size.y)) / vector;
        } else if (vector < 0) {
            timestamp.max = (objA.position.y - (objB.position.y + objB.size.y)) / vector;
            timestamp.min = ((objA.position.y + objA.size.y) - objB.position.y) / vector;
        }
        return timestamp;
    }

    public static xAxisHitTest(objA: any, objB: any): { min: number, max: number } {
        const vector: number = objB.vector.x - objA.vector.x;
        let timestamp: any = { min: Infinity, max: -Infinity };

        if (vector === 0) {
            if (objA.position.x + objA.size.x >= objB.position.x && objA.position.x <= objB.position.x + objB.size.x) {
                timestamp = { min: -Infinity, max: Infinity };
            }
        } else if (vector > 0) {
            timestamp.max = ((objA.position.x + objA.size.x) - objB.position.x) / vector;
            timestamp.min = (objA.position.x - (objB.position.x + objB.size.x)) / vector;
        } else if (vector < 0) {
            timestamp.max = (objA.position.x - (objB.position.x + objB.size.x)) / vector;
            timestamp.min = ((objA.position.x + objA.size.x) - objB.position.x) / vector;
        }

        return timestamp;
    }

    public static translateTinyValue(value: number): number {
        return Math.abs(value)<=0.00000000001?0:value;
    }
}