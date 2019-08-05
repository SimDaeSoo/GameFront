import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
export function createRouter() {
    return new VueRouter({
        mode: 'history',
        routes: [
            { path: '', name: 'SpritePreviewPage', component: function () { return import('../views/SpritePreviewPage.vue'); } }
        ]
    });
}
//# sourceMappingURL=index.js.map