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
    public isInit: boolean;

    constructor() {
        this.keyboard = new Keyboard();
        this.gameLogic = new GameLogic();
        this.gameRenderer = new GameRenderer();
        this.updater = new Updater();
        this.isInit = false;
        this.gameData;

        this.gameLogic.on('setWorldProperties', () => {
            this.gameRenderer.init();
        });
    }

    public run(): any {
        this.io = io.connect('http://localhost:3020');

        this.io.on('connect', (): void => {
            system({text: 'connect success!'});
            system({text: `socket id : ${this.io.id}`});

            this.io.emit('init');
            this.io.on('initGameData', (message: string, date: number): void => { this.initGameData(message, date); });
            this.io.on('broadcast', (message: string, date: number): void => { this.broadcast(message, date); });
        });
    }

    public broadcast(message: string, date: number): void {
        if (this.isInit) {
            const command: any = JSON.parse(message);
            this.gameLogic.runCommand(command, date);
        }
    }

    public initGameData(message: string, date: number): void {
        system({text: `init start`});
        this.updater.forceDisConnect = () => { this.io.disconnect(); };
        this.gameData = new GameData();
        this.gameLogic.gameData = this.gameData;
        this.gameRenderer.gameData = this.gameData;
        this.gameRenderer.owner = this.io.id;
        
        const data: any = JSON.parse(message);
        this.gameData.initGameData(data);
        system({text: `init done`});

        this.keyboard.onKeyDown = (keyCode: number) => {
            if (keyCode === 77) {
                if(this.gameRenderer.camera.targetZoom < 1) {
                    this.gameRenderer.camera.setZoom(1);
                } else {
                    this.gameRenderer.camera.setZoom(0.5);
                }
            }
            this.io.emit('keydown', keyCode);
        }

        this.keyboard.onKeyUp = (keyCode: number) => {
            this.io.emit('keyup', keyCode);
        }

        this.gameRenderer.on('broadcast', (data) => {
            this.io.emit('broadcast', JSON.stringify(data), Date.now());
        })

        // TODO 다른 곳으로 뺄 것.
        this.updater.onUpdate(async (dt: number): Promise<void> => {
            await this.gameLogic.update(dt);
            await this.gameRenderer.update(dt);
        });
        this.gameRenderer.start();
        this.isInit = true;
    }
}