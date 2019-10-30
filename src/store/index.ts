import Vue from "vue"
import Vuex, { Store } from "vuex"

Vue.use(Vuex);

export const store: Store<{}> = new Vuex.Store({
    // Data
    state: {
        server: '',
        channel: ''
    },
    getters: {
        server: (state, getters): string => { return state.server; },
        channel: (state, getters): string => { return state.channel; },
    },
    mutations: {
        setServer: (state, payload): void => { state.server = payload.server; },
        setChannel: (state, payload): void => { state.channel = payload.channel; },
    },
    actions: {
        async setServer({ commit, state }, payload): Promise<void> { await commit('setServer', payload); },
        async setChannel({ commit, state }, payload): Promise<void> { await commit('setChannel', payload); },
    }
});