import Vue from 'vue';
import VueI18n from 'vue-i18n';
import en from './i18n/en_us.json';
import ko from './i18n/ko_kr.json';
Vue.use(VueI18n);
export default new VueI18n({
    locale: 'ko',
    messages: {
        en: {
            lang: en,
        },
        ko: {
            lang: ko,
        }
    },
});
//# sourceMappingURL=index.js.map