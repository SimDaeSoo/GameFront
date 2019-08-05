import Vue from 'vue';
import App from './App.vue';
import i18n from './translations';
import { createRouter } from './router';
import { createStore } from './store';
import { sync } from 'vuex-router-sync';
export function createApp() {
    var router = createRouter();
    var store = createStore();
    sync(store, router);
    var app = new Vue({
        router: router,
        store: store,
        i18n: i18n,
        render: function (h) { return h(App); }
    });
    return { app: app, router: router, store: store };
}
//# sourceMappingURL=App.js.map