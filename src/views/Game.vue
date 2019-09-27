<template>
  <div class="Game" ref="Game">
    <dom-ui/>
  </div>
</template>

<script lang = "ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import GameClient from "../game/client/gameClient";
import Loader from "../game/client/loader";
import DomUI from "../ui/DomUI.vue";

@Component({
  components: {
    'dom-ui': DomUI
  }
})
export default class Game extends Vue {
  private client: GameClient;
  private loader: Loader;

  created() { }

  mounted() {
    this.start();
  }

  private async start(): Promise<void> {
    const server: string = this.$store.getters.server;
    const channel: string = this.$store.getters.channel;

    this.loader = new Loader();
    await this.$preload();

    this.loader.load(() => {
      this.client = new GameClient(server, channel);
      this.client.run();

      (this.$refs.Game as HTMLElement).appendChild(
        this.client.gameRenderer.view
      );
    });
  }

  private async $preload() {
    const preloads = require("../json/preloads.json");

    for (const r of preloads) {
      this.loader.add(...r);
    }

    await this.loader.asyncLoad();
  }
}
</script>

<style>
.Home {
  text-align: center;
}
</style>