<template>
  <div class="Home" ref="Home"></div>
</template>

<script lang = "ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import GameClient from "../game/client/gameClient";
import Loader from "../game/client/loader";
import ChatModal from "../modals/ChatModal.vue";

@Component
export default class Home extends Vue {
  private client: GameClient;
  private loader: Loader;
  private chatFlag: boolean = false;

  created() { }

  mounted() {
    this.start();
  }

  private async start(): Promise<void> {
    this.loader = new Loader();
    await this.$preload();

    this.loader.load(() => {
      this.client = new GameClient();
      this.client.run();

      (this.$refs.Home as HTMLElement).appendChild(
        this.client.gameRenderer.view
      );
      this.chatInitialize();
    });
  }

  private async $preload() {
    const preloads = require("../json/preloads.json");

    for (const r of preloads) {
      this.loader.add(...r);
    }

    await this.loader.asyncLoad();
  }

  private chatInitialize(): void {
    window.addEventListener("keydown", (event: KeyboardEvent): void => {
      const keyCode: number = event.keyCode;
      if (keyCode === 13) {
        if (!this.chatFlag) {
          this.showChatModal();
        } else {
          this.hideChatModal();
        }
        this.chatFlag = !this.chatFlag;
      }
    });
  }

  private showChatModal(): void {
    this.$modal.show(ChatModal, {}, {
      name: 'ChatModal',
      width: '330px',
      height: '130px'
    })
  }

  private hideChatModal(): void {
    this.$modal.hide('ChatModal');
  }
}
</script>

<style>
.Home {
  text-align: center;
}
</style>