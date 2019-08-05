export default class Sprite {
    private animation: Array<{ id: string, length: number, row: number }> = [];
    private currentAnimationIndex: number = 0;
    private currentFrame: number = 0;

    private id: string = '';
    private offsetX: number = 0;
    private offsetY: number = 0;
    private width: number = 0;
    private height: number = 0;

    public outputSprite: HTMLImageElement | null = null;

    private isLoaded: boolean = false;

    constructor(data: any) {
        this.id = data.id ? data.id : '';
        this.offsetX = data.offsetX ? data.offsetX : 0;
        this.offsetY = data.offsetY ? data.offsetY : 0;

        if (data.animations) {
            for (var key in data.animations) {
                this.animation.push({
                    id: key,
                    length: data.animations[key].length ? data.animations[key].length : 0,
                    row: data.animations[key].row ? data.animations[key].row : 0
                });
            }
        }

        this.outputSprite = new Image();
        this.outputSprite.src = '/assets/sprites/' + this.id + '.png'
        this.outputSprite.addEventListener('load', () => {
            this.isLoaded = true;
            if (this.outputSprite) {
                this.setSize(this.outputSprite.width, this.outputSprite.height);
            }
        });
    }

    public setSize(width: number, height: number): void {
        this.width = width;
        this.height = height;

        var maxRow: number = 1;
        var maxColumn: number = 1;
        this.animation.forEach((anima) => {
            if (anima.length > maxColumn) {
                maxColumn = anima.length;
            }
            if (anima.row + 1 > maxRow) {
                maxRow = anima.row + 1;
            }
        });

        this.width /= maxColumn;
        this.height /= maxRow;
    }

    public animationIds(): Array<string> {
        return this.animation.map((anima): string => {
            return anima.id;
        });
    }

    public changeAnimation(id: string): void {
        this.animation.forEach((anima, i) => {
            if (anima.id === id) {
                this.currentAnimationIndex = i;
                this.currentFrame = 0;
            }
        });
    }

    public nextFrame(): void {
        this.currentFrame += 1;
        this.currentFrame %= this.animation[this.currentAnimationIndex].length;
    }

    public getAnimationAttr(): { sx: number, sy: number, width: number, height: number, ex: number, ey: number, screenWidth: number, screenHeight: number } {
        const column: number = this.currentFrame;
        const row: number = this.animation[this.currentAnimationIndex].row;
        const xyAttr = this.getImageXY(column, row);

        return {
            sx: xyAttr.sx,
            sy: xyAttr.sy,
            width: this.width,
            height: this.height,
            ex: xyAttr.ex,
            ey: xyAttr.ey,
            screenWidth: this.width,
            screenHeight: this.height
        };
    }

    public getImageXY(column: number, row: number): { sx: number, sy: number, ex: number, ey: number } {
        const sx: number = column * this.width;
        const sy: number = row * this.height;
        const ex: number = 0;
        const ey: number = 0;

        return { sx, sy, ex, ey };
    }
}