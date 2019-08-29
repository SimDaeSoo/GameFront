<template>
  <div class="Home" ref="Home">
  </div>
</template>

<script lang = 'ts'>
import { Vue, Component, Prop } from "vue-property-decorator";
import GameClient from '../game/gameClient';
import Loader from '../game/loader';

@Component
export default class Home extends Vue {
  private client: GameClient;
  private loader :Loader;

  created() {
  }

  mounted() {
    this.start();
  }

  private async start(): Promise<void> {
    this.loader = new Loader;
    await this.$preload();

    this.loader.load(() =>{
      this.client = new GameClient();
      this.client.run();

      (this.$refs.Home as HTMLElement).appendChild(this.client.gameRenderer.view);
    });
  }

  private async $preload() {
    const preloads = require('../json/preloads.json');

    for(const r of preloads) {
      this.loader.add(...r);
    }

    await this.loader.asyncLoad();
  }
};
</script>

<style>
.Home {
  font-family: 'soya_direct10';
  text-align: center;
}

canvas {
  border-style: double;
}
</style>