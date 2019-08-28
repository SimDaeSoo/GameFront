import Tile from "./tile";
import SungHoon from "../characters/sunghoon";

export default class ObjectFactory {
    constructor() {

    }

    public static create(data: any): any {
        let object: any;

        switch(data.objectType) {
            case 'tiles': 
                object = new Tile(data);
                break;
            case 'characters':
                object = new SungHoon(data);
                break;
        }

        return object;
    }
}