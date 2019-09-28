import { IObjectData, Vector, Flip, Point, Size, Scale } from './define';

export default class BaseGameObject {
    private _data: IObjectData;
    private _dirty: boolean = false;

    // 받아오는 데이터는 패킷 데이터. -> 해당 패킷 데이터를 이용해서 생성될 때 자신의 Data로 Initializing한다.
    constructor(data: IObjectData) {
        this._data = data;
        this.initialize();
    }

    private initialize(): void {
        /*
            JSON 읽어서 아래의 데이터를 기본적으로 가져오도록 한다. -> 패킷 데이터에서는 제거한다.
            "size": { "width": 14, "height": 68 },
            "scale": { "x": 1, "y": 1 },
            "weight": 1,
            "movingSpeed": 0.15,
            "jumpForceVector": -0.35,
        */
    }

    public update(dt: number): void { }
    public _update(dt: number): void {
        this.applyVector(dt);
        this.update(dt);
    }

    public applyVector(dt: number): void {
        if (this.vector.x !== 0 || this.vector.y !== 0) {
            this.position.x += dt * this.vector.x;
            this.position.y += dt * this.vector.y;
            this.dirty();
        }

        if (this.forceVector.x !== 0 || this.forceVector.y !== 0) {
            this.vector.x += dt * this.forceVector.x / this.weight;
            this.vector.y += dt * this.forceVector.y / this.weight;
        }
    }

    // Public getter
    public dirty(): void { this._dirty = true; }
    public clean(): void { this._dirty = false; }
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
    public get scale(): Scale { return this.data.scale; }
    public get weight(): number { return this.data.weight; }
}