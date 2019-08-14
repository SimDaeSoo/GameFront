<template>
  <div class="GamePage" ref="GamePage">
  </div>
</template>

<script lang = 'ts'>
import { Vue, Component, Prop } from "vue-property-decorator";
import GameClient from '../game/gameClient';
import GameRenderer from '../game/gameRenderer';

@Component
export default class Home extends Vue {
  private client: GameClient;
  private gameRenderer: GameRenderer;

  created() {
  }

  mounted() {
    this.client = new GameClient();
    this.client.setRenderer(PIXI);
    this.client.run();

    (this.$refs.GamePage as HTMLElement).appendChild(this.client.gameRenderer.view);
  }
};
</script>

<style>
</style>