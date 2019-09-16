<template>
  <div id="app">
    <router-view></router-view>
    <modals-container />
  </div>
</template>

<script lang = "ts">
import { Vue, Component, Prop } from "vue-property-decorator"

export default class App extends Vue {
};
</script>

<style>
</style>