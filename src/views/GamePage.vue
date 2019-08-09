<template>
  <div class="GamePage" ref="GamePage">
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator';
import GameClient from '../game/gameClient';
import GameRenderer from '../game/gameRenderer';

@Component({})
export default class GamePage extends Vue {
  private client: GameClient;
  private gameRenderer: GameRenderer;

  created() {
  }

  mounted() {
    this.client = new GameClient();
    this.client.setRenderer(this.$pixi);
    this.client.run();

    (this.$refs.GamePage as HTMLElement).appendChild(this.client.gameRenderer.view);
  }
}
</script>

<style scoped>
.GamePage {
  width: 100%;
  height: 100%;
  text-align: center;
}
</style>
