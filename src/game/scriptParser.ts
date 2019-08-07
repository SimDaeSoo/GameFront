export interface IScript {
    script: string,
    args: any
};

export default class ScriptParser {
    constructor() {

    }

    public parsing(textScript: string): IScript {
        textScript = textScript.replace(/ /g, '');
        const re = /(\w+)\s*\((.*)\)\s*/g;
        const result = re.exec(textScript);
        const array: Array<any> = result?result:[];
        let args: Array<any> = array[2]?array[2].match(/({([\w_+-/"]+:[\w+-./"]+,*)*})|(\w+)/g):[];

        args.forEach((arg: any, index: number) => {
            if (arg.match(/({([\w_+-/"]+:[\w+-./"]+,*)*})/g)) {
                args[index] = eval(`(${arg})`);
            } else if (arg.match(/(\"*([+-]*\d+(\.\d+)*)+\"*)+/g) && arg.match(/(\"*([+-]*\d+(\.\d+)*)+\"*)+/g)[0] === arg) {
                args[index] = Number(arg);
            }
        });
        
        return {
            script: array?array[1]:'',
            args: args
        };
    }
}