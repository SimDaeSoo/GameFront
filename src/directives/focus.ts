import Vue from 'vue';

// element의 model 데이터가 바뀌면 element의 높이를 리사이즈한다
const focus = () => {
    Vue.directive('focus', {
        inserted: function (el: HTMLElement) {
            // 엘리먼트에 포커스를 줍니다
            el.focus()
        }
    });
};

export default focus;