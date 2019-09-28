<template>
  <div class="game-controller">Hello Im GameController</div>
</template>

<script lang = "ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class GameController extends Vue {}
</script>

<style scoped>
.game-controller {
}
</style>