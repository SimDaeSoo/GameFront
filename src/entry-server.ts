import Vue from 'vue';
import { createApp } from './App';

export default function createContext(context: any): Promise<Vue> {
    return new Promise<Vue>((resolve, reject) => {
        const { app, router, store } = createApp();

        router.push(context.url);

        router.onReady(() => {
            const matchedComponents = router.getMatchedComponents();

            if (!matchedComponents.length) {
                // TODO: 찾고자 하는 route 경로의 파일이 없음. 즉 404 page -> redirect 를 하건 뭘 하건 해야할듯.
                return reject({ code: 404 });
            }

            Promise.all(matchedComponents.map((component: any) => {
                if (component.asyncData) {
                    return component.asyncData({
                        store,
                        route: router.currentRoute
                    });
                }
            })).then(() => {
                context.state = store.state;
                resolve(app);
            });
        }, reject);
    });
}