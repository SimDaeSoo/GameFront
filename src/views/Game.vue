<template>
  <GameLayout>
    <div class="Game" ref="Game">
      <DomUI ref="ui"/>
    </div>
  </GameLayout>
</template>

<script lang = "ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import DomUI from "../ui/DomUI.vue";
import GameLayout from "../layout/GameLayout.vue";
import GameClient from "../game/client/gameClient";
import Loader from "../game/client/loader";

@Component({
  components: {
    GameLayout,
    DomUI
  }
})
export default class Game extends Vue {
  private client: GameClient;
  private loader: Loader;
  private ui: DomUI;

  mounted() {
    this.checkVaildRoute();
    this.initialize();
  }

  beforeDestroy() {
    window.removeEventListener('resize', this.resize)
  }

  private initialize(): void {
    window.addEventListener('resize', this.resize);
    this.ui = this.$refs.ui as DomUI;

    this.ui.on('controller', (command: any): void => {
      this.client.io.emit(command.script, command.data.keyCode);
    });
  }

  private async start(): Promise<void> {
    const server: string = this.$store.getters.server;
    const channel: string = this.$store.getters.channel;

    this.loader = new Loader();
    await this.$preload();

    this.loader.load(() => {
      this.client = new GameClient(server, channel, (this.$refs.Game as HTMLElement));
      this.client.on('disconnect', (): void => {
        this.linkTo("/");
      });
      this.client.run();

      (this.$refs.Game as HTMLElement).appendChild(
        this.client.gameRenderer.view
      );
    });
  }

  private linkTo(to: string): void {
    if (this.$router.currentRoute.path.replace(/\//g, '') !== to.replace(/\//g, '')) {
      this.$router.push(to);
    }
  }

  private checkVaildRoute(): void {
    if (!this.$store.getters.server) {
      this.linkTo("/");
    } else {
      this.start();
    }
  }

  private async $preload(): Promise<void> {
    const preloads = require("../json/preloads.json");

    for (const r of preloads) {
      this.loader.add(...r);
    }

    await this.loader.asyncLoad();
  }

  private resize(): void {
    this.client.resize();
  }
}
</script>