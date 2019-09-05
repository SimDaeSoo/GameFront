export interface IMutateCondition {
    arg: string;
    sign: '<' | '>' | '>=' | '<=' | '===' | '!==';
    value: number | string;
}

export interface IMutateMap {
    mutateState: string;
    conditions: Array<IMutateCondition>;
}

export class State {
    private stateMap: {[stateName: string]: {[stateName: string]: IMutateMap}};
    public currentState: string;

    constructor() {
        this.init();
    }

    private init(): void {
        this.stateMap = {};
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

    public mutation(data: any): string {
        let lastState: string;

        while (this.currentState !== lastState) {
            const mutatableState: {[stateName: string]: IMutateMap} = this.stateMap[this.currentState];
            lastState = this.currentState;
            
            for (let state in mutatableState) {
                let result: boolean = true;
                const conditions: Array<IMutateCondition> = mutatableState[state].conditions;
    
                conditions.forEach((condition: IMutateCondition): void => {
                    const arg: any = eval(`data.${condition.arg}`);
                    if (arg === undefined || !eval(`${arg}${condition.sign}${condition.value}`)) {
                        result = false;
                    }
                });
    
                if (result) {
                    this.currentState = state;
                    break;
                }
            }
        }

        return this.currentState;
    }
}