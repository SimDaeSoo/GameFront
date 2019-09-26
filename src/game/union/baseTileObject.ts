import BaseGameObject from "./baseGameObject";

export default class BaseTileObject extends BaseGameObject {
    public get tileNumber(): number { return this.data.tileNumber; }
    public get startXAxis(): number { return this.data.startXAxis; }
    public get endXAxis(): number { return this.data.endXAxis; }
    public get startYAxis(): number { return this.data.startYAxis; }
    public get endYAxis(): number { return this.data.endYAxis; }
}