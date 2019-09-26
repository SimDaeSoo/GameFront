import BaseGameObject from "./baseGameObject";

export default class ObjectFactory {
    public static create(data: any): BaseGameObject {
        let object: BaseGameObject;

        switch (data.objectType) {
            case "tiles":
                object = new BaseGameObject(data);
                break;
            case "characters":
                object = new BaseGameObject(data);
                break;
        }

        return object;
    }
}