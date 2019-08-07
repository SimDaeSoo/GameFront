import Vue from 'vue';;
import { createApp } from './App';
import customPixi from './plugins/customPixi';

const { app, router, store } = createApp();

if ((window as any).__INITIAL_STATE__) {
    store.replaceState((window as any).__INITIAL_STATE__)
}

Vue.use(customPixi);

router.onReady((): void => {
    router.beforeResolve((to, from, next) => {
        const matched = router.getMatchedComponents(to);
        const prevMatched = router.getMatchedComponents(from);
        let diffed = false;

        const activated = matched.filter((component, i) => {
            return diffed || (diffed = (prevMatched[i] !== component))
        });

        if (!activated.length) {
            return next();
        }

        Promise.all(matched.map((component: any) => {
            if (component.asyncData) {
                return component.asyncData({ store, route: to });
            }
        })).then(() => {
            // TODO: 찾고자 하는 경로의 component 를 찾은 상황 => 이 때 딱히 현재는 action을 따로 하고있지는 않지만. 추후 뭔가 있을지도.
            next();
        }).catch(next);
    });

    app.$mount('#app');
});