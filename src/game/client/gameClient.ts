import * as io from "socket.io-client";
import GameLogic from "../union/gameLogic";
import Updater from "../union/updater";
import GameData from "../union/gameData";
import { system } from "../union/utils";
import GameRenderer from "./gameRenderer";
import Keyboard from "./keyboard";
import { EventEmitter } from 'events';


// Main Socket Server의 Room과 흡사.
export default class GameClient {
    private emitter: EventEmitter = new EventEmitter();
    private server: string;
    private channel: string;
    public io: SocketIOClient.Socket;
    public gameLogic: GameLogic;
    public gameData: GameData;
    public gameRenderer: GameRenderer;
    public updater: Updater;
    public keyboard: Keyboard;
    public isInitialized: boolean;

    // TODO : 제거되어야 할 각.
    private zoomLevel: number = 0;

    // Ping Test
    public pings: Array<number> = [];
    public avgPings: Array<number> = [];
    public checkPing: any;
    public pingInterpolation: number = 0;
    public avgPing: number = 0;
    private PING_CHECK_TIME: number = 200;

    constructor(server: string, channel: string, element: HTMLElement) {
        this.server = server;
        this.channel = channel;
        this.keyboard = new Keyboard();
        this.gameLogic = new GameLogic();
        this.gameRenderer = new GameRenderer(element);
        this.updater = new Updater();
        this.isInitialized = false;
        this.gameData;
        this.checkPing = {
            start: 0,
            end: 0
        };
    }

    public initialize(message: string, date: number): void {
        this.updater.forceDisConnect = () => { this.io.disconnect(); this.emit('disconnect'); };

        const data: any = JSON.parse(message);
        this.gameData = new GameData();
        this.gameData.initialize(data);

        this.gameRenderer.gameData = this.gameData;
        this.gameRenderer.owner = this.io.id;
        this.gameRenderer.initialize();

        this.gameLogic.gameData = this.gameData;

        this.keyboard.onKeyDown = (keyCode: number) => {
            if (keyCode === 77) {
                this.zoom();
            }
            this.io.emit("keydown", keyCode);
        }

        this.keyboard.onKeyUp = (keyCode: number) => {
            this.io.emit("keyup", keyCode);
        }

        // TODO 다른 곳으로 뺄 것.
        this.updater.onUpdate((dt: number): void => {
            this.gameLogic.update(dt);
            this.gameRenderer.update(dt);
        });
        this.gameRenderer.start();
        this.isInitialized = true;
    }

    public run(): void {
        // this.io = io.connect("http://localhost:8080");
        this.io = io.connect(`${this.server}:${this.channel}`);

        this.io.on("connect", (): void => {
            system({ text: "connect success!" });
            system({ text: `socket id : ${this.io.id}` });

            this.io.emit("initialize");
            this.io.on("initialize", (message: string, date: number): void => { this.initialize(message, date); });
            this.io.on("broadcast", (message: string, date: number): void => { this.broadcast(message, date); });
            this.io.on("pingTest", (date: number): void => { this.ping(date); });

            this.checkPing.start = Date.now();
            this.io.emit("pingTest", this.checkPing.start);
        });
    }

    public resize(): void {
        this.gameRenderer.resize();
    }

    public broadcast(message: string, date: number): void {
        if (this.isInitialized) {
            const command: string = JSON.parse(message);
            this.gameLogic.runCommand(command, date - this.pingInterpolation);
        }
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

    public zoom(value?: number): void {
        const zoomRatio: Array<number> = [1, 2, 0.5];
        if (!value) value = 1;
        this.zoomLevel += Number(value);
        if (this.zoomLevel < 0) {
            this.zoomLevel = 0;
        } else if (this.zoomLevel > 2) {
            this.zoomLevel = 2;
        }
        this.gameRenderer.camera.setZoom(zoomRatio[this.zoomLevel]);
    }

    public on(eventName: string, listener: any): void {
        this.emitter.on(eventName, listener);
    }

    public emit(eventName: string, ...args): void {
        this.emitter.emit(eventName, ...args);
    }
}