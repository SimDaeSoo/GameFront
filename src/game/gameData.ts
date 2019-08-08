export default class GameData {
    public data: { [id:string]: any };
    public beGenerates: Array<string>;
    public beDeletes: Array<string>;
    public dirties: Array<string>;

    constructor() {
        this.data = {};
        this.beGenerates = [];
        this.beDeletes = [];
        this.dirties = [];
    }

    public setData(id: string, data: any): void {
        this.data[id] = data;
        this.dirty(id);
        console.log(`setData: ${this}`);
    }

    public deleteData(id: string): void {
        delete this.data[id];

        if (this.beDeletes.indexOf(id) < 0) {
            this.beDeletes.push(id);
        }
        console.log(`deleteData: ${this}`);
    }

    public insertData(id: string, data: any): void {
        this.data[id] = data;

        if (this.beGenerates.indexOf(id) < 0) {
            this.beGenerates.push(id);
        }
        console.log(`insertData: ${this}`);
    }

    public initGameData(data: { [id: string]: any }): void {
        this.data = data;

        for (let id in this.data) {
            if (id && this.beGenerates.indexOf(id) < 0) {
                this.beGenerates.push(id);
            }
        }
        console.log(`initGameData: ${this}`);
    }

    public doneGenerate(id: string): void {
        const index: number = this.beGenerates.indexOf(id);
        
        if (index >= 0) {
            this.beGenerates.splice(index, 1);
        }
        console.log(`doneGenerate: ${this}`);
    }

    public doneDelete(id: string): void {
        const index: number = this.beDeletes.indexOf(id);
        
        if (index >= 0) {
            this.beDeletes.splice(index, 1);
        }
        console.log(`doneDelete: ${this}`);
    }

    public dirty(id: string): void {
        const index: number = this.dirties.indexOf(id);
        
        if (index < 0) {
            this.dirties.push(id);
        }
        console.log(`dirty: ${this}`);
    }

    public clean(id: string): void {
        const index: number = this.dirties.indexOf(id);
        
        if (index >= 0) {
            this.dirties.splice(index, 1);
        }
        console.log(`clean: ${this}`);
    }
}