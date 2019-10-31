<template>
  <div class="game-controller">
    Hello Im GameController
    <div @click="click()">click me!</div>
  </div>
</template>

<script lang = "ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class GameController extends Vue {
  private click(): void {
    console.log('click');
  }
}
</script>

<style scoped>
.game-controller {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>