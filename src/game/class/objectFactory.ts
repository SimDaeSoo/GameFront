import Tile from "./tile";
import SungHoon from "../characters/sunghoon";
import BaseObject from "../baseObject";

export default class ObjectFactory {
    constructor() {

    }

    public static create(data: any): BaseObject {
        let object: BaseObject;

        switch (data.objectType) {
            case "tiles":
                object = new Tile(data);
                break;
            case "characters":
                object = new SungHoon(data);
                break;
        }

        return object;
    }
}