<template>
  <div class="action_container">
    <div class="action" ref="jump">
      <span class="button_text">Jump</span>
    </div>
  </div>
</template>

<script lang = "ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import BaseUI from './baseUI';

@Component
export default class ActionController extends BaseUI {
  mounted() {
    this.initializeTouchEvent(this.$refs.jump as HTMLElement, 38);
  }

  private initializeTouchEvent(el: HTMLElement, keyCode: number): void {
    el.addEventListener("touchstart", (): void => { this.touchStart(keyCode); });
    el.addEventListener("touchend", (): void => { this.touchEnd(keyCode); });
  }

  private destroyedTouchEvent(el: HTMLElement, keyCode: number): void {
    el.removeEventListener("touchstart", (): void => { this.touchStart(keyCode); });
    el.removeEventListener("touchend", (): void => { this.touchEnd(keyCode); });
  }

  private touchStart(keyCode: number): void {
    const command: any = {
      script: 'keydown',
      data: { keyCode }
    };
    this.ui.emit('controller', command);
  }

  private touchEnd(keyCode: number): void {
    const command: any = {
      script: 'keyup',
      data: { keyCode }
    };
    this.ui.emit('controller', command);
  }
}
</script>