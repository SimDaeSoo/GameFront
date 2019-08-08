import { gameLog } from "../utils/utils";
import GameData from "./gameData";

export default class GameLogic {
    public data: GameData;
    private lastUpdate: number;
    
    public async update(dt: number): Promise<void> {
        this.lastUpdate = Date.now();
    }

    // data broadCast방식 수정하자. 
    // Run Script는 소켓 통신으로부터 온다. 전달받는데 걸리는 시간이 dt였으므로, dt만큼 더 움직여 줘야겠지?
    /*
    data : {
        script: name,
        data: 
    }
    */
    public addCharacter(data: any): void {
        this.data.insertData(data.id, data);
    }

    public runCommand(command: any, date: number): void {
        if (typeof((this as any)[command.script]) === 'function') {
            let dt: number = this.lastUpdate - date>0?this.lastUpdate - date:0;
            gameLog({ text: `${command.script}(${command.data})(${dt}ms)`, ping: Date.now() - date });
            (this as any)[command.script](command.data, dt);
        }
    }
}