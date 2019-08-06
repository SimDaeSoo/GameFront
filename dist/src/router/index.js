import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
export function createRouter() {
    return new VueRouter({
        mode: 'history',
        routes: [
            { path: '', name: 'GamePage', component: function () { return import('../views/GamePage.vue'); } }
        ]
    });
}
//# sourceMappingURL=index.js.map