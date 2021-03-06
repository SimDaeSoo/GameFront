import * as http from "http";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as path from "path";
import * as fs from 'fs';

// Electron과 함께 사용하게 될 것 같다.
class ServerApp {
    public express: express.Application;
    public server: http.Server;
    public port: string | number | boolean;

    constructor() {
        this.express = express();
    }

    public async initialize(): Promise<void> {
        this.middleware();
        this.routes();
        this.setNormalizePort(80);
    }

    public createServer(): void {
        this.express.set("port", this.port);

        this.server = http.createServer(this.express);
        this.server.listen(this.port);
    }

    private setNormalizePort(port: number): void {
        this.port = this.normalizePort(port);
    }

    private middleware(): void {
        this.express.use(bodyParser.json({ limit: "10mb" }));
        this.express.use(bodyParser.urlencoded({ extended: false, limit: "10mb", parameterLimit: 1000000 }));
    }

    private routes(): void {
        this.express.get("*", (req: express.Request, res: express.Response, next: express.NextFunction): void => {
            const filePath: string = path.join("dist", req.url);
            const isFile: boolean = fs.existsSync(filePath);
            if (isFile) {
                res.sendfile(filePath);
            } else {
                res.sendfile(path.join("dist", "index.html"));
            }
        });
    }

    private normalizePort(val: number | string): number | string | boolean {
        const normalizedPort: number = (typeof val === "string") ? parseInt(val, 10) : val;
        if (isNaN(normalizedPort)) {
            return val;
        } else if (normalizedPort >= 0) {
            return normalizedPort;
        } else {
            return false;
        }
    }
}

const serverApp: ServerApp = new ServerApp();
serverApp.initialize();
serverApp.createServer();