import { createApp } from './App';
var _a = createApp(), app = _a.app, router = _a.router, store = _a.store;
if (window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__);
}
router.onReady(function () {
    router.beforeResolve(function (to, from, next) {
        var matched = router.getMatchedComponents(to);
        var prevMatched = router.getMatchedComponents(from);
        var diffed = false;
        var activated = matched.filter(function (component, i) {
            return diffed || (diffed = (prevMatched[i] !== component));
        });
        if (!activated.length) {
            return next();
        }
        Promise.all(matched.map(function (component) {
            if (component.asyncData) {
                return component.asyncData({ store: store, route: to });
            }
        })).then(function () {
            next();
        }).catch(next);
    });
    app.$mount('#app');
});
//# sourceMappingURL=entry-client.js.map