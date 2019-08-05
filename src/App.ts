import Vue from 'vue';
import App from './App.vue';

// TODO: Lazy-load, vuex도 추가해야한다,
// TODO: 음 국제화 추가해야 하는데..
import i18n from './translations';
import { createRouter } from './router';
import { createStore } from './store';
import { sync } from 'vuex-router-sync';


// Vue.mixin({
//     beforeMount () {
//       const { asyncData } = this.$options
//       if (asyncData) {
//         // assign the fetch operation to a promise
//         // so that in components we can do `this.dataPromise.then(...)` to
//         // perform other tasks after data is ready
//         this.dataPromise = asyncData({
//           store: this.$store,
//           route: this.$route
//         })
//       }
//     }
// });

export function createApp() {
    const router = createRouter();
    const store = createStore();

    sync(store, router);

    const app = new Vue({
        router,
        store,
        i18n,
        render: h => h(App)
    });

    return { app, router, store };
}