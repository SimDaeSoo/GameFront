import BaseGameObject from "./baseGameObject";
import { Dictionary } from "./define";

export const enum SIGN {
    SAME = "===",
    UN_SAME = "!==",
    LEFT_SAME_LARGER = ">=",
    RIGHT_SAME_LARGER = "<=",
    LEFT_LARGER = ">",
    RIGHT_LARGER = "<"
}
export const enum LOGIC_SIGN {
    AND = "&&",
    OR = "||"
}
export interface IMutateCondition {
    args: Array<string>;
    sign: SIGN;
    value: number | boolean;
    operator: LOGIC_SIGN;
}

export interface IMutateMap {
    mutateState: string;
    conditions: Array<IMutateCondition>;
}

export class State {
    private stateMap: Dictionary<Dictionary<IMutateMap>>;
    private owner: BaseGameObject;
    public currentState: string;

    constructor() {
        this.initialize();
    }

    private initialize(): void {
        this.stateMap = {};
    }

    public setOwner(owner: BaseGameObject): void {
        this.owner = owner;
    }

    public setState(state: string): void {
        if (this.stateMap[state] !== undefined) {
            this.currentState = state;
        }
    }

    public registState(stateName: string): void {
        this.stateMap[stateName] = {};
    }

    public registMutate(entryState: string, mutateMap: IMutateMap): void {
        if (this.stateMap[entryState] !== undefined) {
            this.stateMap[entryState][mutateMap.mutateState] = mutateMap;
        }
    }

    public mutation(): string {
        const mutatableState: Dictionary<IMutateMap> = this.stateMap[this.currentState];

        for (let state in mutatableState) {
            let isMutationable: boolean;
            const conditions: Array<IMutateCondition> = mutatableState[state].conditions;

            conditions.forEach((condition: IMutateCondition): void => {
                const arg = this.getConditionArguments(this.owner.data, condition);
                isMutationable = this.getLogicResult(isMutationable, this.getConditionResult(arg, condition.sign, condition.value), condition.operator);
            });

            if (isMutationable) {
                this.currentState = state;
                break;
            }
        }

        return this.currentState;
    }

    private getLogicResult(prev: boolean, current: boolean, sign: LOGIC_SIGN): boolean {
        let logicResult: boolean = prev !== undefined ? prev : current;
        switch (sign) {
            case LOGIC_SIGN.AND:
                logicResult = logicResult && current;
                break;
            case LOGIC_SIGN.OR:
                logicResult = logicResult || current;
                break;
        }
        return logicResult;
    }

    private getConditionArguments(data: any, condition: IMutateCondition): any {
        let arg: any = data;
        for (let i = 0; i < condition.args.length; i++) {
            arg = arg[condition.args[i]];
        }
        return arg;
    }

    private getConditionResult(arg: any, sign: SIGN, value: any): boolean {
        let condition: boolean;
        switch (sign) {
            case SIGN.LEFT_LARGER:
                condition = arg > value;
                break;
            case SIGN.LEFT_SAME_LARGER:
                condition = arg >= value;
                break;
            case SIGN.RIGHT_LARGER:
                condition = arg < value;
                break;
            case SIGN.RIGHT_SAME_LARGER:
                condition = arg <= value;
                break;
            case SIGN.SAME:
                condition = arg === value;
                break;
            case SIGN.UN_SAME:
                condition = arg !== value;
                break;
            default:
                console.log('warn');
                break;
        }
        return condition;
    }
}