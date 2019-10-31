const SEC_FOR_MINUTE: number = 60;
const MINUTE_FOR_HOUR: number = 60;
const HOUR_FOR_DAY: number = 24;
const SEC_FOR_DAY: number = 86400;

export default class Clock {
    private _hours: number;
    private _minutes: number;
    private _seconds: number;

    constructor() {
        this._hours = this._minutes = this._seconds = 0;
    }

    public initialize(sec: number): void {
        this._seconds = sec;
        this._minutes = this._hours = 0;
        this.update();
    }

    public update(): void {
        this._minutes += Math.floor(this._seconds / SEC_FOR_MINUTE);
        this._hours += Math.floor(this._minutes / MINUTE_FOR_HOUR);

        this._seconds = this._seconds % SEC_FOR_MINUTE;
        this._minutes = this._minutes % MINUTE_FOR_HOUR;
        this._hours = this._hours % HOUR_FOR_DAY;
    }

    public applySecond(sec: number): void {
        this._seconds += sec;
        this.initialize(this.time);
    }

    public get time(): number { return (this.hours * MINUTE_FOR_HOUR + this.minutes) * SEC_FOR_MINUTE + this.seconds; }
    public get currentTimePeriod(): number { return Math.sin(this.time / SEC_FOR_DAY * 2 * Math.PI); }
    public get hours(): number { return this._hours; }
    public get minutes(): number { return this._minutes; }
    public get seconds(): number { return this._seconds; }
}