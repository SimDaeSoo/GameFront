import { TILE_SIZE } from "./define";
import { changeTileNumber } from "./utils";

/*
    플레이어는 초당 30발의 armo를 생성 => 10명제한 => 300개의 Object
    타일은 총 600 * 150 => 900,000개의 Tile Object
    HitTest Object => 해당 오브젝트의 크기 * Vector 범위검사.
*/
// Map Generating 다시 볼 것.
export default class MapGenerator {
    // 600 * 150의 맵을 목표 => 9600px * 2400px => 9600px * 4000px 의 맵..
    // 60 * 15 => 960px * 240px => 960px * 1840px 의 맵.. => 화면에 보이는 크기만큼만 렌더링 할 수 있도록 해야할 것.
    // 하늘의 크기는 Default 100 tile 로 하자. (1600px)
    public generate(width: number, height: number): any {
        let map: any = {};
        const defaultSkyHeight: number = 17;

        for (let y = defaultSkyHeight; y < height + defaultSkyHeight; y++) {
            for (let x = 0; x < width; x++) {
                if (!MapGenerator.isDeletedTile(x, y, defaultSkyHeight + 2)) {
                    if (Math.random() <= 0.91 - 1.1 * (y / (20 + defaultSkyHeight)) || (map[x + (y - 1) * width] !== undefined && map[x - 1 + y * width] !== undefined)) {
                        const positionToIndex: number = x + y * width;
                        map[positionToIndex] = this.newTile(x, y);
                        map[positionToIndex].id = positionToIndex;
                    }
                    if (x > 0) {
                        if (Math.random() <= 0.91 - 1.1 * (y / (20 + defaultSkyHeight)) || (map[(width - x - 1) + (y - 1) * width] !== undefined && map[(width - x) + y * width] !== undefined)) {
                            const positionToIndex = (width - x - 1) + y * width;
                            map[positionToIndex] = this.newTile((width - x - 1), y);
                            map[positionToIndex].id = positionToIndex;
                        }
                    }
                }
            }
        }

        for (let y = height + defaultSkyHeight - 2; y < height + defaultSkyHeight; y++) {
            for (let x = 0; x < width; x++) {
                const positionToIndex: number = x + y * width;
                map[positionToIndex] = this.newTile(x, y);
                map[positionToIndex].id = positionToIndex;
            }
        }

        for (let key in map) {
            changeTileNumber(map, key, width);
            if (map[key].tileNumber === 15) {
                delete map[key];
            }
        }

        return {
            map: this.makingGroup(map, width, height),
            worldProperties: {
                width: width,
                height: height + defaultSkyHeight
            }
        };
    }

    private makingGroup(map: any, width: number, height: number): any {
        const defaultSkyHeight: number = 17;

        for (let y = defaultSkyHeight; y < height + defaultSkyHeight; y++) {
            let startXAxis: number | undefined;
            let endXAxis: number | undefined;

            for (let x = 0; x < width; x++) {
                const positionToIndex: number = x + y * width;

                if (map[positionToIndex] !== undefined) {
                    if (startXAxis === undefined) {
                        startXAxis = positionToIndex;
                    }
                    map[positionToIndex].startXAxis = startXAxis;
                } else {
                    startXAxis = undefined;
                }
            }

            for (let x = width - 1; x >= 0; x--) {
                const positionToIndex: number = x + y * width;

                if (map[positionToIndex] !== undefined) {
                    if (endXAxis === undefined) {
                        endXAxis = positionToIndex;
                    }
                    map[positionToIndex].endXAxis = endXAxis;
                } else {
                    endXAxis = undefined;
                }
            }
        }

        for (let x = 0; x < width; x++) {
            let startYAxis: number | undefined;
            let endYAxis: number | undefined;

            for (let y = defaultSkyHeight; y < height + defaultSkyHeight; y++) {
                const positionToIndex: number = x + y * width;

                if (map[positionToIndex] !== undefined) {
                    if (startYAxis === undefined) {
                        startYAxis = positionToIndex;
                    }
                    map[positionToIndex].startYAxis = startYAxis;
                } else {
                    startYAxis = undefined;
                }
            }

            for (let y = height + defaultSkyHeight - 1; y >= defaultSkyHeight; y--) {
                const positionToIndex: number = x + y * width;

                if (map[positionToIndex] !== undefined) {
                    if (endYAxis === undefined) {
                        endYAxis = positionToIndex;
                    }
                    map[positionToIndex].endYAxis = endYAxis;
                } else {
                    endYAxis = undefined;
                }
            }
        }

        return map;
    }

    public static isDeletedTile(x: number, y: number, baseY: number): boolean {
        const HEIGHT: number = 3;
        const CYCLE: number = 60;
        const Y: number = Math.sin(Math.PI * 2 / CYCLE * (x + CYCLE / 4 * 3)) * HEIGHT / 2;

        return (y - baseY) < Y;
    }

    // TODO 변경
    public newTile(x: number, y: number): any {
        const tileProperties: any = {
            class: 'dirt',
            objectType: 'tiles',
            size: { width: TILE_SIZE.WIDTH, height: TILE_SIZE.HEIGHT },
            scale: { x: 1.5, y: 1.5 },
            weight: 10000000000000000000,
            tileNumber: 0,

            position: { x: x * (TILE_SIZE.WIDTH), y: y * (TILE_SIZE.HEIGHT) },
            vector: { x: 0, y: 0 },
            forceVector: { x: 0, y: 0 },
            flip: { x: false, y: false },
            rotation: 0,
            rotationVector: 0
        }

        return tileProperties;
    }
}