<template>
  <div class="chat_controller">
      <button class="option_button" ref="chat">Chat</button>
  </div>
</template>

<script lang = "ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import BaseUI from './baseUI';

@Component
export default class ChatController extends BaseUI {
  mounted() {
    this.initializeTouchEvent(this.$refs.chat as HTMLElement, 13);
  }

  private initializeTouchEvent(el: HTMLElement, keyCode: number): void {
    el.addEventListener("touchstart", (): void => { this.touchStart(keyCode); });
  }

  private destroyedTouchEvent(el: HTMLElement, keyCode: number): void {
    el.removeEventListener("touchstart", (): void => { this.touchStart(keyCode); });
  }

  private touchStart(keyCode: number): void {
      this.ui.toggleChatting();
  }
}
</script>