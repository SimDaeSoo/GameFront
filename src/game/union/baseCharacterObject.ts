import BaseGameObject from "./baseGameObject";
import { State } from "./state";
import { IObjectData } from "./define";

export default class BaseCharacterObject extends BaseGameObject {
    public _updatable: boolean = true;
    public state: State = new State();

    constructor(data: IObjectData) {
        super(data);
        this.load();
    }

    public update(dt: number): void {
        this.state.mutation();
    }

    private load(): void {
        this.loadState();
    }

    private loadState(): void {
        const name: string = 'ksh001'; // 변경해야함. 들어온 Data에 해당 정보가 있어야 한다.
        const origin: any = require(`./data/characters/${name}.json`);

        this.state.setOwner(this);
        for (let stateName in origin.state) {
            this.state.registState(stateName);

            for (let mutateName in origin.state[stateName].mutations) {
                this.state.registMutate(stateName, { mutateState: mutateName, conditions: origin.state[stateName].mutations[mutateName] });
            }
        }
        this.state.setState(origin.baseState);
    }

    public get land(): boolean { return this.data.land; }
    public set land(land: boolean) { this.data.land = land; }
}