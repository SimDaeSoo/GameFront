import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export const router: Router = new Router({
    mode: "history",
    routes: [
        { path: "/", component: () => import(/* webpackChunkName: "Home" */ "../views/Home.vue") },
        { path: "/lobby", component: () => import(/* webpackChunkName: "Lobby" */ "../views/Lobby.vue") },
        { path: "/game", component: () => import(/* webpackChunkName: "Game" */ "../views/Game.vue") }
    ]
});