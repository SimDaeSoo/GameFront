import GameData from "./gameData";
import CollisionEngine from './class/collisionEngine';
import { TILE_SIZE } from "./define";
import { EventEmitter } from "events";
import { changeTileNumber } from "../utils/utils";
import { State } from './class/state';

export default class GameLogic extends EventEmitter {
    public gameData: GameData;
    public stateMap: {[type: string]: {[id: string]: State}} = { tiles: {}, objects: {}, characters: {}};
    public lastUpdate: number = Date.now();

    /* ----------------------- Logic ----------------------- */

    public async update(dt: number): Promise<void> {
        this.lastUpdate = Date.now();
        this.collision(dt);
        this.applyVector(dt);
        this.applyForceVector(dt);
        this.interpolationCharacterPosition(dt);
        this.changeState();
    }

    public changeState(): void {
        for (let type in this.stateMap) {
            for (let id in this.stateMap[type]) {
                const object: any = this.gameData.data[type][id];

                if (object !== undefined) {
                    this.gameData.data[type][id].currentState = this.stateMap[type][id].mutation(object);
                }
            }
        }
    }

    private collision(dt: number): void {
        this.characterCollision(dt);
    }
    
    private characterCollision(dt: number): void {
        for (let id in this.gameData.data['characters']) {
            const character: any = this.gameData.data['characters'][id];
            
            this.characterTileCollision(character, dt);
        }
    }

    private characterTileCollision(character: any, dt: number): boolean {
        const tiles: Array<any> = this.getTiles(character);
        const result: Array<any> = CollisionEngine.getHitObjects(character, tiles, dt);

        if (result.length > 0) {
            result.forEach((collisionData) => {
                CollisionEngine.applyTilePhysics(character, collisionData);
            });
            return true;
        } else {
            character.forceVector.y = character.forceVector.y === 0?0.0002:character.forceVector.y;
            return false;
        }
    }

    private getTiles(character: any): Array<any> {
        const result: Array<any> = [];

        const pos = { x: Math.round(character.position.x / TILE_SIZE.WIDTH) - 2, y: Math.round(character.position.y / TILE_SIZE.HEIGHT) - 2 };
        const size = { x: Math.round(character.size.x / TILE_SIZE.WIDTH + 0.5) + 4, y: Math.round(character.size.y / TILE_SIZE.HEIGHT + 0.5) + 4 };

        for (let i = pos.x; i < pos.x + size.x; i++) {
            for (let j = pos.y; j < pos.y + size.y; j++) {
                if (this.gameData.data['tiles'][i + j * this.gameData.worldProperties.width]) {
                    result.push(this.gameData.data['tiles'][i + j * this.gameData.worldProperties.width]);
                }
            }
        }

        return result;
    }

    private applyForceVector(dt: number): void {
        for (let type in this.gameData.data) {
            for (let id in this.gameData.data[type]) {
                if (this.gameData.data[type][id].forceVector.x !== 0 || this.gameData.data[type][id].forceVector.y !== 0) {
                    this.gameData.data[type][id].vector.x += dt * this.gameData.data[type][id].forceVector.x / this.gameData.data[type][id].weight;
                    this.gameData.data[type][id].vector.y += dt * this.gameData.data[type][id].forceVector.y / this.gameData.data[type][id].weight;
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
        this.emit('setWorldProperties');
    }

    private interpolationCharacterPosition(dt: number): void {
        for (let id in this.gameData.data['characters']) {
            const character: any = this.gameData.data['characters'][id];
            
            if (character.position.x < 0) {
                character.position.x = 0;
            } else if (character.position.x + character.size.x > this.gameData.worldProperties.width * TILE_SIZE.WIDTH) {
                character.position.x = this.gameData.worldProperties.width * TILE_SIZE.WIDTH - character.size.x;
            }
        }
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
        this.emit('addCharacter');

        // Test
        const state: State = new State();
        state.registState('idle');
        state.registState('jump');
        state.registState('walk');
        state.registMutate('idle', { mutateState: 'walk', conditions: [{ arg: 'vector.x', sign: '!==', value: 0}]});
        state.registMutate('idle', { mutateState: 'jump', conditions: [{ arg: 'land', sign: '===', value: 'false'}]});
        state.registMutate('jump', { mutateState: 'idle', conditions: [{ arg: 'land', sign: '===', value: 'true'}]});
        state.registMutate('walk', { mutateState: 'idle', conditions: [{ arg: 'vector.x', sign: '===', value: 0}]});
        state.registMutate('walk', { mutateState: 'jump', conditions: [{ arg: 'land', sign: '===', value: 'false'}]});
        state.setState('idle');
        this.stateMap[data.objectType][data.id] = state;
    }

    public deleteCharacter(data: any, dt: number): void {
        this.gameData.deleteData(data.id, data.objectType);
        if (data.objectType === 'tiles') {
            this.changeTile(data.id);
        }
        this.emit('deleteCharacter');

        // Test
        delete this.stateMap[data.objectType][data.id];
    }

    public changeTile(id: string): void {
        const width: number = this.gameData.worldProperties.width;
        const tiles: any = [Number(id)-1,Number(id)+1,Number(id)-width,Number(id)+width];

        tiles.forEach((key: number): void => {
            if (this.gameData.data['tiles'][key.toString()] !== undefined) {
                changeTileNumber(this.gameData.data['tiles'], key.toString(), width);
            }
        });
    }

    public setState(data: any, dt: number): void {
        const object: any = this.gameData.data[data.objectType][data.id];
        if (!object) return;
        
        object.position.x = data.position.x;
        object.position.y = data.position.y;

        object.vector.x = (((dt ** 2) * data.forceVector.x / 2) + (dt * data.vector.x)) / dt;
        object.vector.y = 0;
        if (!this.characterTileCollision(object, dt)) {
            object.position.x += ((dt ** 2) * data.forceVector.x / 2) + (dt * data.vector.x);
        }

        object.vector.x = 0;
        object.vector.y = (((dt ** 2) * data.forceVector.y / 2) + (dt * data.vector.y)) / dt;
        if (!this.characterTileCollision(object, dt)) {
            object.position.y += ((dt ** 2) * data.forceVector.y / 2) + (dt * data.vector.y);
        }

        object.vector.x = data.vector.x + dt * data.forceVector.x;
        object.vector.y = data.vector.y + dt * data.forceVector.y;
        object.forceVector.x = data.forceVector.x;
        object.forceVector.y = data.forceVector.y;
        object.land = data.land;
        this.gameData.dirty(data.id, data.objectType);
    }

    public runCommand(command: any, date: number): void {
        if (typeof((this as any)[command.script]) === 'function') {
            const dt: number = this.lastUpdate - date;
            (this as any)[command.script](command.data, dt);
        }
    }
}