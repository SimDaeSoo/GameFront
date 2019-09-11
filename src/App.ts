import Vue from "vue";
import { router } from "./router";
import { store } from "./store";
import App from "./App.vue";
import "./styles/App.scss";

new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App)
});