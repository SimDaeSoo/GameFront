import BaseGameObject from "./baseGameObject";
import { State } from "./state";
import { IObjectData } from "./define";
import Keyboard from "../client/keyboard";

export default class BaseCharacterObject extends BaseGameObject {
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
        this.test();
    }

    // 제거 되어야 한다 ( Union에는 DOM 이나 Window같은 것이 없기 때문에 해당 keyboard 못쓰지만 임시로 잠시 테스트 )
    // 시간이 지나면 풀리는 State에 대해서 처리하고싶다. -> 어떻게 처리하면 좋을까?
    private test(): void {
        const keyBoard: Keyboard = new Keyboard();
        keyBoard.onKeyDown = (a) => {
            if (a === 32) {

            }
        }
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