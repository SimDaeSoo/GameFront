import * as io from 'socket.io-client';
import GameLogic from './gameLogic';
import Updater from './updater';
import GameRenderer from './gameRenderer';

// Main Socket Server의 Room과 흡사.
export default class GameClient {
    private io: SocketIOClient.Socket;
    public gameLogic: GameLogic;
    public gameRenderer: GameRenderer;
    public updater: Updater;

    constructor() {
        this.gameLogic = new GameLogic();
        this.updater = new Updater();
        this.updater.setGameLogic(this.gameLogic);
    }

    public initRenderer(pixi: any): void {
        this.gameRenderer = new GameRenderer(pixi);
    }

    public run(): any {
        this.io = io.connect('http://localhost:3020');
        this.updater.updateLoop();
        this.gameRenderer.start();

        this.io.on('connect', (): void => {
          this.io.emit('broadcast', `addCharacter(${this.io.id}, 1, { x: ${Math.random()*100}, y: ${Math.random()*100}})`, Date.now());
        
          this.io.on('broadcast', (message: string, date: number): void => {
            const result = this.gameLogic.runScript(message, date);
            this.gameRenderer.runscript(result);
          });
        });
    }
}