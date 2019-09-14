import { State } from "./class/state";
import MapGenerator from "./class/mapGenerator";

interface IGameData<T> {
    [type: string]: { [id:string]: T };
}

interface IGameDataIDs {
    [type: string]: Array<string>;
}

interface IWorldProperties {
    width: number;
    height: number;
}

export default class GameData {
    public worldProperties: IWorldProperties = { width: 0, height: 0 };
    public data: IGameData<any> = { tiles: {}, objects: {}, characters: {} };
    public beGenerates: IGameDataIDs = { tiles: [], objects: [], characters: [] };
    public beDeletes: IGameDataIDs = { tiles: [], objects: [], characters: [] };
    public dirties: IGameDataIDs = { tiles: [], objects: [], characters: [] };
    public stateMap: IGameData<any> = { tiles: {}, objects: {}, characters: {}};

    public init(data: any): void {
        for (let type in data) {
            for (let id in data[type]) {
                this.generate(id, data[type][id]);
            }
        }
    }

    public setData(id: string, data: any): void {
        this.data[data.objectType][id] = data;
        this.dirty(id, data.objectType);
    }

    public generate(id: string, data: any): void {
        if (!this.data[data.objectType][id]) {
            this.data[data.objectType][id] = data;
        }

        if (this.beGenerates[data.objectType].indexOf(id) < 0) {
            this.beGenerates[data.objectType].push(id);
        }
    }

    public doneGenerate(id: string, type: string): void {
        const index: number = this.beGenerates[type].indexOf(id);
        
        if (index >= 0) {
            this.setState(this.data[type][id]);
            this.beGenerates[type].splice(index, 1);
        }
    }

    public delete(id: string, type: string): void {
        delete this.data[type][id];
        delete this.stateMap[type][id];

        if (this.beDeletes[type].indexOf(id) < 0) {
            this.beDeletes[type].push(id);
        }
    }

    public doneDelete(id: string, type: string): void {
        const index: number = this.beDeletes[type].indexOf(id);
        
        if (index >= 0) {
            this.beDeletes[type].splice(index, 1);
        }
    }

    public dirty(id: string, type: string): void {
        const index: number = this.dirties[type].indexOf(id);
        
        if (index < 0) {
            this.dirties[type].push(id);
        }
    }

    public clean(id: string, type: string): void {
        const index: number = this.dirties[type].indexOf(id);
        
        if (index >= 0) {
            this.dirties[type].splice(index, 1);
        }
    }

    // ------------------------------------------------------------------------------------

    public setState(data: any): void {
        if (data.objectType === "characters") {
            const state: State = new State();
            state.registState("idle");
            state.registState("jump");
            state.registState("walk");
            state.registMutate("idle", { mutateState: "walk", conditions: [{ arg: "data.vector.x", sign: "!==", value: 0}]});
            state.registMutate("idle", { mutateState: "jump", conditions: [{ arg: "Math.abs(data.vector.y)", sign: ">=", value: "0.1"}]});
            state.registMutate("jump", { mutateState: "idle", conditions: [{ arg: "Math.abs(data.vector.y)", sign: "<", value: "0.04"}, { arg: "data.land", sign: "===", value: "true"}]});
            state.registMutate("walk", { mutateState: "idle", conditions: [{ arg: "data.vector.x", sign: "===", value: 0}]});
            state.registMutate("walk", { mutateState: "jump", conditions: [{ arg: "Math.abs(data.vector.y)", sign: ">=", value: "0.1"}]});
            state.setState("idle");
            this.stateMap[data.objectType][data.id] = state;
        }
    }

    public updateState(): void {
        for (let type in this.stateMap) {
            for (let id in this.stateMap[type]) {
                const object: any = this.data[type][id];

                if (object !== undefined) this.stateMap[type][id].mutation(object);
            }
        }
    }

    public createWorldData(width: number, height: number): void {
        const mapGenerator: MapGenerator = new MapGenerator();
        const worldMap: any = mapGenerator.generate(width, height);

        for (let key in worldMap.map) {
            this.generate(key, worldMap.map[key]);
        }

        this.worldProperties = worldMap.worldProperties;
    }
}