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