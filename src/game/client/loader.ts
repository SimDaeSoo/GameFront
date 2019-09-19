import * as PIXI from "pixi.js";

const cache = {};

function memoryMiddleware(resource, next) {
    if (cache[resource.url]) {
        resource.data = cache[resource.url];
        resource.complete();
    }
    else {
        resource.onComplete.once(() => {
            cache[resource.url] = resource.data;
        });
    }

    next();
}


export function loadAniTexture(name, count) {
    const frames = [];
    for (let i = 0; i < count; i++) {
        frames.push(PIXI.Texture.from(name + i + ".png"));
    }
    return frames;
}

export default class Loader {
    private loader: PIXI.Loader;

    constructor() {
        this.loader = new PIXI.Loader();
        this.loader.pre(memoryMiddleware);
    }

    add(name?: string, url?: string) {
        if (this.loader.resources[name]) {
            return;
        }

        if (url) {
            url = "src/" + url;
        } else {
            url = "src/" + name;
        }

        this.loader.add(name, url);
    }

    load(onLoadComplete) {
        this.loader.load((_, resources) => {
            onLoadComplete(resources);
        });
    }

    asyncLoad() {
        return new Promise((resolve, reject) => {
            this.loader.onError.add(() => reject);
            this.loader.load((_, resources) => {
                resolve(resources);
            });
        });
    }
}