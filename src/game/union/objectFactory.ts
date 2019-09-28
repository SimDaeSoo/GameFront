import BaseGameObject from "./baseGameObject";
import BaseTileObject from "./baseTileObject";
import BaseCharacterObject from "./baseCharacterObject";

export default class ObjectFactory {
    public static create(data: any): BaseGameObject {
        let object: BaseGameObject;

        switch (data.objectType) {
            case "tiles":
                object = new BaseTileObject(data);
                break;
            case "characters":
                object = new BaseCharacterObject(data);
                break;
        }

        return object;
    }
}