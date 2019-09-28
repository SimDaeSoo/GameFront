import MapGenerator from "./mapGenerator";
import { Size, Dictionary } from "./define";
import ObjectFactory from "./objectFactory";

export default class GameData {
    public worldProperties: Size = { width: 0, height: 0 };
    public data: Dictionary<Dictionary<any>> = { tiles: {}, objects: {}, characters: {} };
    public beGenerates: Dictionary<Array<string>> = { tiles: [], objects: [], characters: [] };
    public beDeletes: Dictionary<Array<string>> = { tiles: [], objects: [], characters: [] };
    public dirties: Dictionary<Array<string>> = { tiles: [], objects: [], characters: [] };

    public initialize(data: any): void {
        for (let type in data) {
            for (let id in data[type]) {
                this.generate(id, data[type][id]);
            }
        }
    }

    public update(dt: number): void {
        for (let type in this.data) {
            for (let id in this.data[type]) {
                if (this.data[type][id]._update) {
                    this.data[type][id]._update(dt);
                    if (this.data[type][id].isDirty) {
                        this.dirty(id, type);
                    }
                }
            }
        }
    }

    public get exportData(): Dictionary<Dictionary<any>> {
        const data: Dictionary<Dictionary<any>> = {};

        for (let key in this.data) {
            data[key] = {};
            for (let id in this.data[key]) {
                data[key][id] = this.data[key][id].data;
            }
        }

        return data;
    }

    public generate(id: string, data: any): void {
        if (!this.data[data.objectType][id]) {
            this.data[data.objectType][id] = ObjectFactory.create(data);
        }

        if (this.beGenerates[data.objectType].indexOf(id) < 0) {
            this.beGenerates[data.objectType].push(id);
        }
    }

    public delete(id: string, type: string): void {
        delete this.data[type][id];

        if (this.beDeletes[type].indexOf(id) < 0) {
            this.beDeletes[type].push(id);
        }
    }

    public doneGenerate(id: string, type: string): void {
        const index: number = this.beGenerates[type].indexOf(id);

        if (index >= 0) {
            this.beGenerates[type].splice(index, 1);
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
            this.data[type][id].clean();
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