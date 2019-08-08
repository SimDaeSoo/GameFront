import * as io from 'socket.io-client';
import GameLogic from './gameLogic';
import Updater from './updater';
import GameRenderer from './gameRenderer';
import GameData from './gameData';

// Main Socket Server의 Room과 흡사.
export default class GameClient {
    private io: SocketIOClient.Socket;
    public gameLogic: GameLogic;
    public gameData: GameData;
    public gameRenderer: GameRenderer;
    public updater: Updater;

    constructor() {
        this.gameLogic = new GameLogic();
        this.updater = new Updater();
        this.gameData = new GameData();
        this.gameLogic.data = this.gameData;
    }

    public initRenderer(pixi: any): void {
        this.gameRenderer = new GameRenderer(pixi);
        this.gameRenderer.data = this.gameData;
    }

    public run(): any {
        this.io = io.connect('http://localhost:3020');
        this.updater.onUpdate(async (dt: number): Promise<void> => {
            await this.gameLogic.update(dt);
            await this.gameRenderer.update(dt);
        });
        this.gameRenderer.start();

        this.io.on('connect', (socket: any): void => {
            console.log('connect success!');
            console.log(`socket id : ${this.io.id}`);

            this.io.emit('init');
            this.io.on('initGameData', (message: string, date: number): void => {
                const data: any = JSON.parse(message);
                this.gameData.initGameData(data);
            });

            this.io.on('broadcast', (message: string, date: number): void => {
                const command: any = JSON.parse(message);
                this.gameLogic.runCommand(command, date);
            });
        });
    }
}