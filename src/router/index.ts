import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export const router: Router = new Router({
    mode: "history",
    routes: [
        { path: "/", component: () => import(/* webpackChunkName: "Home" */ "../views/Home.vue")}
    ]
});