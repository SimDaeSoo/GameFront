// 1. 'vue'를 보충된 타입 선언 전에 import해야 합니다.
import Vue from 'vue';
import VueI18n, { IVueI18n } from 'vue-i18n';

// 2. 보충하고자 하는 타입이 있는 파일을 지정하세요.
//    Vue의 constructor type은 types/vue.d.ts에 있습니다.
declare module 'vue/types/vue' {
    // 3. Vue에 보강할 내용을 선언
    interface Vue {
        readonly $i18n: VueI18n & IVueI18n;
        readonly $pixi: any;
    }

    interface VueConstructor {
    }
}
