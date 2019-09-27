import { changeTileNumber } from "../union/utils";
import BaseObject from "./baseObject";

export default class Tile extends BaseObject {
    public sprite: PIXI.Sprite;

    constructor(options: any) {
        super(options);

        this.sprite = PIXI.Sprite.from(`TerrainTileset${options.tileNumber !== undefined ? options.tileNumber : 6}.png`);
        this.container.addChild(this.sprite);
    }

    public update(dt: number): void {
    }

    public changeTile(gameData: any, key: string, width: number): void {
        const tileNumber: number = changeTileNumber(gameData, key, width);
        this.removeChild(this.sprite);
        this.sprite = PIXI.Sprite.from(`TerrainTileset${tileNumber}.png`);
        this.addChild(this.sprite);
    }
}