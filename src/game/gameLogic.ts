import GameData from "./gameData";
import { isNested, max, isBounded } from "../utils/utils";

export default class GameLogic {
    public gameData: GameData;

    /* ----------------------- Logic ----------------------- */

    public async update(dt: number): Promise<void> {
        this.hitTestAll(dt);
        this.applyVector(dt);
        this.applyForceVector(dt);
    }

    private hitTestAll(dt: number): void {
        this.characterHitTest(dt);
        this.objectHitTest(dt);
    }

    private hitTest(a: any, b: any, dt: number): any {
        const yAxisHitTime: { min: number, max: number } = this.yAxisHitTest(a, b, dt);
        const xAxisHitTime: { min: number, max: number } = this.xAxisHitTest(a, b, dt);
        const base: { min: number, max: number } = { min: 0, max: 1 };

        const result: any = {
            isHit: false,
            time: 0,
            hitArea: {
                left: false,
                right: false,
                up: false,
                down: false
            }
        };

        if (isBounded(base, xAxisHitTime) && isBounded(base, yAxisHitTime) && isNested(xAxisHitTime, yAxisHitTime)) {
            result.isHit = true;
            result.time = max(xAxisHitTime.min, yAxisHitTime.min);

            if (result.time === xAxisHitTime.min) {
                if (a.position.x > b.position.x) {
                    result.hitArea.left = true;
                } else if (a.position.x < b.position.x) {
                    result.hitArea.right = true;
                }
            }
            if (result.time === yAxisHitTime.min) {
                if (a.position.y > b.position.y) {
                    result.hitArea.up = true;
                } else if (a.position.y < b.position.y) {
                    result.hitArea.down = true;
                }
            }
            
            result.time *= dt;
        }

        return result;
    }

    private yAxisHitTest(a: any, b: any, dt: number): { min: number, max: number } {
        const v: number = (a.vector.y * dt) - (b.vector.y * dt);
        const result: { min: number, max: number } = { min: 2, max: -1 };

        if (v === 0 && (a.position.y + a.size.y) - b.position.y > 0 && (b.position.y + b.size.y) - a.position.y > 0) {
            result.min = 0;
            result.max = 1;
        } else if (v > 0) {
            result.max = (a.position.y - (b.position.y + b.size.y)) / -v;
            result.min = ((a.position.y + a.size.y) - b.position.y) / -v;
        } else if (v < 0) {
            result.max = (b.position.y - (a.position.y + a.size.y)) / v;
            result.min = ((b.position.y - b.size.y) - a.position.y) / v;
        }

        result.min = result.min<0?0:result.min;
        result.max = result.max>1?1:result.max;
        
        return result;
    }

    private xAxisHitTest(a: any, b: any, dt: number): { min: number, max: number } {
        const v: number = (a.vector.x * dt) - (b.vector.x * dt);
        const result: { min: number, max: number } = { min: 2, max: -1 };

        if (v === 0 && (a.position.x + a.size.x) - b.position.x > 0 && (b.position.x + b.size.x) - a.position.x > 0) {
            result.min = 0;
            result.max = 1;
        } else if (v > 0) {
            result.min = (b.position.x - (a.position.x + a.size.x)) / v;
            result.max = ((b.position.x + b.size.x) - a.position.x) / v;
        } else if (v < 0) {
            result.min = (a.position.x - (b.position.x + b.size.x)) / -v;
            result.max = ((a.position.x + a.size.x) - b.position.x) / -v;
        }

        result.min = result.min<0?0:result.min;
        result.max = result.max>1?1:result.max;

        return result;
    }
    
    private characterHitTest(dt: number): void {
        for (let id in this.gameData.data['characters']) {
            const character: any = this.gameData.data['characters'][id];
            
            this.characterTileHitTest(character, dt);
            this.characterObjectHitTest(character, dt);
        }
    }

    private getTiles(character: any): Array<any> {
        const result: Array<any> = [];

        const pos = { x: Math.round(character.position.x / 16) - 1, y: Math.round(character.position.y / 16) - 1 };
        const size = { x: Math.round(character.size.x / 16 + 0.5) + 2, y: Math.round(character.size.y / 16 + 0.5) + 2 };

        for (let i = pos.x; i < pos.x + size.x; i++) {
            for (let j = pos.y; j < pos.y + size.y; j++) {
                if (this.gameData.data['tiles'][i + j * this.gameData.worldProperties.width]) {
                    result.push(this.gameData.data['tiles'][i + j * this.gameData.worldProperties.width]);
                }
            }
        }

        return result;
    }

    private characterTileHitTest(character: any, dt: number): void {
        // 캐릭터의 Vector 계산해서 Tile과 HitTest한다. -> 캐릭터의 위치값을 이용해서 Vector거리의 타일을 조금 구해오면 빠르게 연산 가능할 것이다.
        const tiles: Array<any> = this.getTiles(character);
        
        tiles.forEach((tile: any): void => {
            const result: any = this.hitTest(character, tile, dt);

            if (result.isHit) {
                const command = {
                    script: 'setVector',
                    data: {
                        id: character.id,
                        objectType: 'characters',
                        position: character.position,
                        vector: character.vector
                    }
                };

                if (result.hitArea.left && character.vector.x <= 0) {
                    command.data.position.x = character.position.x + character.vector.x * result.time - character.vector.x * (dt + 4);
                } else if (result.hitArea.right && character.vector.x >= 0) {
                    command.data.position.x = character.position.x + character.vector.x * result.time - character.vector.x * (dt + 4);
                } else if (result.hitArea.up && character.vector.y <= 0) {
                    command.data.position.y = character.position.y + character.vector.y * result.time + 0.03 * dt;
                    command.data.vector.y = 0.001;
                } else if (result.hitArea.down && character.vector.y >= 0) {
                    command.data.position.y = character.position.y + character.vector.y * result.time - 0.03 * dt;
                    command.data.vector.y = -0.001;
                }
                
                this.setVector(command.data, 0);
            }
        });
    }

    private characterObjectHitTest(character: any, dt: number): void {
        // 이게 좀 복잡한데.. 캐릭터의 Vector와, Object의 Vector 둘 다 신경써야한다.. 어떻게 처리할까..?
    }

    private objectHitTest(dt: number): void {
        for (let id in this.gameData['objects']) {
            const object: any = this.gameData['objects'][id];

            this.objectTileHitTest(object, dt);
        }
    }

    private objectTileHitTest(object: any, dt: number): void {
        // 총알과 타일의 hitTest
    }

    private applyForceVector(dt: number): void {
        for (let type in this.gameData.data) {
            for (let id in this.gameData.data[type]) {
                if (this.gameData.data[type][id].forceVector.x !== 0 || this.gameData.data[type][id].forceVector.y !== 0) {
                    this.gameData.data[type][id].vector.x += dt * this.gameData.data[type][id].forceVector.x;
                    this.gameData.data[type][id].vector.y += dt * this.gameData.data[type][id].forceVector.y;
                    this.gameData.dirty(id, type);
                }
            }
        }
    }

    private applyVector(dt: number): void {
        for (let type in this.gameData.data) {
            for (let id in this.gameData.data[type]) {
                if (this.gameData.data[type][id].vector.x !== 0 || this.gameData.data[type][id].vector.y !== 0) {
                    this.gameData.data[type][id].position.x += dt * this.gameData.data[type][id].vector.x;
                    this.gameData.data[type][id].position.y += dt * this.gameData.data[type][id].vector.y;
                    this.gameData.dirty(id, type);
                }
            }
        }
    }

    public setWorldProperties(worldProperties: any): void {
        this.gameData.worldProperties = worldProperties;
    }

    /* ----------------------- Command ----------------------- */

    public addCharacter(data: any, dt: number): void {
        data.position.x += dt * data.vector.x;
        data.position.y += dt * data.vector.y;
        data.position.x += dt * dt * data.forceVector.x / 2;
        data.position.y += dt * dt * data.forceVector.y / 2;
        data.vector.x += dt * data.forceVector.x;
        data.vector.y += dt * data.forceVector.y;
        this.gameData.insertData(data.id, data);
    }

    public deleteCharacter(data: any, dt: number): void {
        this.gameData.deleteData(data.id, data.objectType);
    }

    public setVector(data: any, dt: number): void {
        data.position.x += dt * data.vector.x;
        data.position.y += dt * data.vector.y;
        this.gameData.data[data.objectType][data.id].position = data.position;
        this.gameData.data[data.objectType][data.id].vector = data.vector;
        this.gameData.dirty(data.id, data.objectType);
    }

    // setVector, addCharacter랑 통합해서 setState로 만들 수 있을 것 같다..
    public setForceVector(data: any, dt: number): void {
        data.position.x += dt * dt * data.forceVector.x / 2;
        data.position.y += dt * dt * data.forceVector.y / 2;
        data.vector.x += dt * data.forceVector.x;
        data.vector.y += dt * data.forceVector.y;
        this.gameData.data[data.objectType][data.id].position = data.position;
        this.gameData.data[data.objectType][data.id].vector = data.vector;
        this.gameData.data[data.objectType][data.id].forceVector = data.forceVector;
        this.gameData.dirty(data.id, data.objectType);
    }

    public runCommand(command: any, date: number): void {
        if (typeof((this as any)[command.script]) === 'function') {
            const dt: number = Date.now() - date;
            (this as any)[command.script](command.data, dt);
        }
    }
}