export default {
    install(vue: any, options: any) {
        vue.prototype.$pixi = require('pixi.js');
    }
}