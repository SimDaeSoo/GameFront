<template>
  <div class="Home" ref="Home">
    Hello this is Home
    <button @click="go('lobby')">Go To Lobby</button>
  </div>
</template>

<script lang = "ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class Home extends Vue {
  mounted() {
  }

  public go(to: string): void {
    this.$router.replace(to);
  }
}
</script>

<style>
</style>