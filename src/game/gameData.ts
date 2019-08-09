export default class GameData {
    public worldProperties: any;
    public data: {[id:string]: any};
    public beGenerates: {[id:string]: any};
    public beDeletes: {[id:string]: any};
    public dirties: {[id:string]: any};

    constructor() {
        this.worldProperties = {
            width: 0,
            height: 0
        };
        this.data = {
            tiles: {},
            objects: {},
            characters: {}
        };
        this.beGenerates = {
            tiles: [],
            objects: [],
            characters: []
        };
        this.beDeletes = {
            tiles: [],
            objects: [],
            characters: []
        };
        this.dirties = {
            tiles: [],
            objects: [],
            characters: []
        };
    }

    public setData(id: string, data: any): void {
        this.data[data.objectType][id] = data;
        this.dirty(id, data.objectType);
    }

    public deleteData(id: string, type: string): void {
        delete this.data[type][id];

        if (this.beDeletes[type].indexOf(id) < 0) {
            this.beDeletes[type].push(id);
        }
    }

    public insertData(id: string, data: any): void {
        this.data[data.objectType][id] = data;

        if (this.beGenerates[data.objectType].indexOf(id) < 0) {
            this.beGenerates[data.objectType].push(id);
        }
    }

    public initGameData(data: any): void {
        this.data = data;

        for (let type in this.data) {
            for (let id in this.data[type]) {
                if (id && this.beGenerates[type].indexOf(id) < 0) {
                    this.beGenerates[type].push(id);
                }
            }
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
        }
    }
}