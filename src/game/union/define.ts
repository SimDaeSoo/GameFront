export const enum ERROR_CODE {
    SUCCESS = 1,
    WRONG_REQUEST = 2,
    QUERY_ERROR = 3,
    UNKNOWN = 4
};

export interface IResponse {
    success: ERROR_CODE;
    data: any;
};

export const TILE_SIZE = {
    WIDTH: 24,
    HEIGHT: 24
};

export interface ICommand {
    script: string;
    data: any;
}

export const enum CHAT_TYPE {
    ALL = 'all',
    PRIVATE = 'private',
    NOTICE = 'notice',
    TEAM = 'team'
};

export interface Dictionary<T> {
    [id: string]: T
}

export interface Vector {
    x: number;
    y: number;
}

export interface Scale {
    x: number;
    y: number;
}

export interface Point {
    x: number;
    y: number;
}

export interface Size {
    width: number;
    height: number;
}

export interface Scale {
    x: number;
    y: number;
}

export interface Flip {
    x: boolean;
    y: boolean;
}

export interface Scale {
    x: number;
    y: number;
}

export interface IObjectData {
    id: string;
    class: string;
    objectType: string;
    vector: Vector;
    forceVector: Vector;
    position: Point;
    rotation: number;
    rotationVector: number;
    flip: Flip;
    size: Size;
    scale: Scale;
    weight: number;
    [property: string]: any;
}

export interface IServerStatus {
    address: string;
    user: number;
    ups: number;
    ping: number;
    date?: number;
    name: string;
}