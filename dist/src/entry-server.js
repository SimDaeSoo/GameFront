import { createApp } from './App';
export default function createContext(context) {
    return new Promise(function (resolve, reject) {
        var _a = createApp(), app = _a.app, router = _a.router, store = _a.store;
        router.push(context.url);
        router.onReady(function () {
            var matchedComponents = router.getMatchedComponents();
            if (!matchedComponents.length) {
                return reject({ code: 404 });
            }
            Promise.all(matchedComponents.map(function (component) {
                if (component.asyncData) {
                    return component.asyncData({
                        store: store,
                        route: router.currentRoute
                    });
                }
            })).then(function () {
                context.state = store.state;
                resolve(app);
            });
        }, reject);
    });
}
//# sourceMappingURL=entry-server.js.map