import Vue from "vue";
import { router } from "./router";
import { store } from "./store";
import App from "./App.vue";
import "./styles/App.scss";
import VModal from 'vue-js-modal';
import directives from './directives';
import * as Vue2TouchEvents from 'vue2-touch-events';

Vue.use(Vue2TouchEvents as any);
Vue.use(VModal, { dynamic: true });
directives.focus();

new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App)
});