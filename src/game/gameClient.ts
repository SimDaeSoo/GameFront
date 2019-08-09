import * as io from 'socket.io-client';
import GameLogic from './gameLogic';
import Updater from './updater';
import GameRenderer from './gameRenderer';
import GameData from './gameData';
import { system } from '../utils/utils';
import Keyboard from './keyboard';

// Main Socket Server의 Room과 흡사.
export default class GameClient {
    private io: SocketIOClient.Socket;
    public gameLogic: GameLogic;
    public gameData: GameData;
    public gameRenderer: GameRenderer;
    public updater: Updater;
    public keyboard: Keyboard;

    constructor() {
        this.keyboard = new Keyboard();
        this.gameLogic = new GameLogic();
        this.updater = new Updater();
        this.gameData;
    }

    public setRenderer(pixi: any): void {
        this.gameRenderer = new GameRenderer(pixi);
    }

    public run(): any {
        let isInit: boolean = false;
        this.io = io.connect('http://localhost:3020');

        this.io.on('connect', (socket: any): void => {
            system({text: 'connect success!'});
            system({text: `socket id : ${this.io.id}`});

            this.io.emit('init');
            this.io.on('initGameData', (message: string, date: number): void => {
                system({text: `init start`});
                this.updater.forceDisConnect = () => { this.io.disconnect(); };
                this.gameData = new GameData();
                this.gameLogic.gameData = this.gameData;
                this.gameRenderer.gameData = this.gameData;
                
                const data: any = JSON.parse(message);
                this.gameData.initGameData(data);
                this.gameRenderer.clearRenderer();
                console.log(this.gameData);
                system({text: `init done`});

                this.keyboard.onKeyDown = (keyCode: number) => {
                    this.io.emit('keydown', keyCode);
                }

                this.keyboard.onKeyUp = (keyCode: number) => {
                    this.io.emit('keyup', keyCode);
                }

                // TODO 다른 곳으로 뺄 것.
                this.updater.onUpdate(async (dt: number): Promise<void> => {
                    await this.gameLogic.update(dt);
                    await this.gameRenderer.update(dt);
                });
                this.gameRenderer.start();
                isInit = true;
            });

            this.io.on('broadcast', (message: string, date: number): void => {
                if (isInit) {
                    const command: any = JSON.parse(message);
                    this.gameLogic.runCommand(command, date);
                }
            });
        });
    }
}