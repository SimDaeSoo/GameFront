var Sprite = (function () {
    function Sprite(data) {
        var _this = this;
        this.animation = [];
        this.currentAnimationIndex = 0;
        this.currentFrame = 0;
        this.id = '';
        this.offsetX = 0;
        this.offsetY = 0;
        this.width = 0;
        this.height = 0;
        this.outputSprite = null;
        this.isLoaded = false;
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
        this.outputSprite.src = '/assets/sprites/' + this.id + '.png';
        this.outputSprite.addEventListener('load', function () {
            _this.isLoaded = true;
            if (_this.outputSprite) {
                _this.setSize(_this.outputSprite.width, _this.outputSprite.height);
            }
        });
    }
    Sprite.prototype.setSize = function (width, height) {
        this.width = width;
        this.height = height;
        var maxRow = 1;
        var maxColumn = 1;
        this.animation.forEach(function (anima) {
            if (anima.length > maxColumn) {
                maxColumn = anima.length;
            }
            if (anima.row + 1 > maxRow) {
                maxRow = anima.row + 1;
            }
        });
        this.width /= maxColumn;
        this.height /= maxRow;
    };
    Sprite.prototype.animationIds = function () {
        return this.animation.map(function (anima) {
            return anima.id;
        });
    };
    Sprite.prototype.changeAnimation = function (id) {
        var _this = this;
        this.animation.forEach(function (anima, i) {
            if (anima.id === id) {
                _this.currentAnimationIndex = i;
                _this.currentFrame = 0;
            }
        });
    };
    Sprite.prototype.nextFrame = function () {
        this.currentFrame += 1;
        this.currentFrame %= this.animation[this.currentAnimationIndex].length;
    };
    Sprite.prototype.getAnimationAttr = function () {
        var column = this.currentFrame;
        var row = this.animation[this.currentAnimationIndex].row;
        var xyAttr = this.getImageXY(column, row);
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
    };
    Sprite.prototype.getImageXY = function (column, row) {
        var sx = column * this.width;
        var sy = row * this.height;
        var ex = 0;
        var ey = 0;
        return { sx: sx, sy: sy, ex: ex, ey: ey };
    };
    return Sprite;
}());
export default Sprite;
//# sourceMappingURL=Sprite.js.map