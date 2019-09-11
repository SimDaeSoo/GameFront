import * as io from "socket.io-client";
import GameLogic from "./gameLogic";
import Updater from "./updater";
import GameRenderer from "./gameRenderer";
import GameData from "./gameData";
import { system } from "../utils/utils";
import Keyboard from "./keyboard";

// Main Socket Server의 Room과 흡사.
export default class GameClient {
    private io: SocketIOClient.Socket;
    public gameLogic: GameLogic;
    public gameData: GameData;
    public gameRenderer: GameRenderer;
    public updater: Updater;
    public keyboard: Keyboard;
    public isInit: boolean;
    public pings: Array<number> = [];
    public avgPings: Array<number> = [];
    public checkPing: any;
    public pingInterpolation: number = 0;
    public avgPing: number = 0;
    private PING_CHECK_TIME: number = 200;
    private PING_TEST: number = 0;

    constructor() {
        this.keyboard = new Keyboard();
        this.gameLogic = new GameLogic();
        this.gameRenderer = new GameRenderer();
        this.updater = new Updater();
        this.isInit = false;
        this.gameData;
        this.checkPing = {
            start: 0,
            end: 0
        };

        this.gameLogic.on("setWorldProperties", () => {
            this.gameRenderer.init();
        });
    }

    public run(): any {
        // this.io = io.connect("ec2-13-124-180-130.ap-northeast-2.compute.amazonaws.com:3020");
        this.io = io.connect("http://localhost:3020");

        this.io.on("connect", (): void => {
            system({text: "connect success!"});
            system({text: `socket id : ${this.io.id}`});

            this.io.emit("init");
            this.io.on("init", (message: string, date: number): void => { this.init(message, date); });
            this.io.on("broadcast", (message: string, date: number): void => { this.broadcast(message, date); });
            this.io.on("pingTest", (date: number): void => { this.ping(date); });

            this.checkPing.start = Date.now();
            this.io.emit("pingTest", this.checkPing.start);
        });
    }
    
    private ping(date: number): void {
        if (this.pings.length >= 1000 / this.PING_CHECK_TIME) {
            this.pings.splice(0, 1);
            this.avgPings.splice(0, 1);
        }
        this.pingInterpolation = this.avgPing = 0;
        this.checkPing.end = Date.now();

        this.pings.push(date - (this.checkPing.start + this.checkPing.end) / 2);
        this.pings.forEach((eachPing: number): void => {
            this.pingInterpolation += eachPing;
        });
        this.pingInterpolation /= this.pings.length;
        this.pingInterpolation = Math.round(this.pingInterpolation);
        
        this.avgPings.push(this.checkPing.end - this.checkPing.start);
        this.avgPings.forEach((eachPing: number): void => {
            this.avgPing += eachPing;
        });
        this.avgPing = Number((this.avgPing / this.avgPings.length).toFixed(2));

        setTimeout((): void => {
            this.checkPing.start = Date.now();
            this.io.emit("pingTest", this.checkPing.start);
        }, this.PING_CHECK_TIME);
    }

    public broadcast(message: string, date: number): void {
        if (this.isInit) {
            const command: any = JSON.parse(message);
            this.gameLogic.runCommand(command, date - this.pingInterpolation);
        }
    }

    public init(message: string, date: number): void {
        this.updater.forceDisConnect = () => { this.io.disconnect(); };
        this.gameData = new GameData();
        this.gameLogic.gameData = this.gameData;
        this.gameRenderer.gameData = this.gameData;
        this.gameRenderer.owner = this.io.id;
        
        const data: any = JSON.parse(message);
        this.gameData.init(data);

        this.keyboard.onKeyDown = (keyCode: number) => {
            if (keyCode === 77) {
                if(this.gameRenderer.camera.targetZoom < 1) {
                    this.gameRenderer.camera.setZoom(1);
                } else {
                    this.gameRenderer.camera.setZoom(0.5);
                }
            }
            setTimeout(() => {
                this.io.emit("keydown", keyCode);
            }, this.PING_TEST);
            this.io.emit("keydown", keyCode);
        }

        this.keyboard.onKeyUp = (keyCode: number) => {
            setTimeout(() => {
                this.io.emit("keyup", keyCode);
            }, this.PING_TEST);
        }

        this.gameRenderer.on("broadcast", (data) => {
            setTimeout(() => {
                this.io.emit("broadcast", JSON.stringify(data), Date.now());
            }, this.PING_TEST);
        })

        // TODO 다른 곳으로 뺄 것.
        this.updater.onUpdate(async (dt: number): Promise<void> => {
            this.gameRenderer.systemData.ping = this.avgPing;
            this.gameRenderer.systemData.ups = this.updater.ups;
            await this.gameLogic.update(dt);
            await this.gameRenderer.update(dt);
        });
        this.gameRenderer.start();
        this.isInit = true;
    }
}