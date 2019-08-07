<template>
  <div class="GamePage">
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
    this.client.initRenderer(this.$pixi);
    this.client.run();

    document.body.appendChild(this.client.gameRenderer.view);
  }
}
</script>

<style scoped>
.SpritePreviewPage {
  width: 100%;
  height: 100%;
  display: flex;
}
</style>
