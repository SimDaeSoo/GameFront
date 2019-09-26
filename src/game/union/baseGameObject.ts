import { IObjectData, Vector, Flip, Point, Size } from './define';

export default class BaseGameObject {
    private _data: IObjectData;
    private _dirty: boolean = false;

    constructor(data: IObjectData) {
        this._data = data;
        this.dirty();
    }

    private update(dt: number): void { }
    public _update(dt: number): void {
        this.applyVector(dt);
        this.update(dt);
    }

    public applyVector(dt: number): void {
        this.position.x += dt * this.vector.x;
        this.position.y += dt * this.vector.y;
        this.vector.x += dt * this.forceVector.x / this.weight;
        this.vector.y += dt * this.forceVector.y / this.weight;
        this.dirty();
    }

    public setData(data: IObjectData): void {
        this._data = data;
        this.dirty();
    }

    public dirty(): void {
        this._dirty = true;
    }

    public clean(): void {
        this._dirty = false;
    }

    // Public getter
    public get data(): IObjectData { return this._data; }
    public get isDirty(): boolean { return this._dirty; }
    public get id(): string { return this.data.id; }
    public get class(): string { return this.data.class; }
    public get objectType(): string { return this.data.objectType; }
    public get vector(): Vector { return this.data.vector; }
    public get forceVector(): Vector { return this.data.forceVector; }
    public get position(): Point { return this.data.position; }
    public get rotation(): number { return this.data.rotation; }
    public get rotationVector(): number { return this.data.rotationVector; }
    public get flip(): Flip { return this.data.flip; }
    public get size(): Size { return this.data.size; }
    public get weight(): number { return this.data.weight; }
}