<template>
  <div class="zoom_controller">
    <button class="option_button" ref="plusZoom">+</button>
    <button class="option_button" ref="minusZoom">-</button>
  </div>
</template>

<script lang = "ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import BaseUI from './baseUI';

@Component
export default class ZoomController extends BaseUI {
  mounted() {
    this.initializeTouchEvent(this.$refs.plusZoom as HTMLElement, 1);
    this.initializeTouchEvent(this.$refs.minusZoom as HTMLElement, -1);
  }

  private initializeTouchEvent(el: HTMLElement, zoom: number): void {
    el.addEventListener("touchstart", (): void => { this.touchStart(zoom); });
  }

  private destroyedTouchEvent(el: HTMLElement, zoom: number): void {
    el.removeEventListener("touchstart", (): void => { this.touchStart(zoom); });
  }

  private touchStart(zoom: number): void {
    const command: any = {
      script: 'zoom',
      data: { zoom }
    };
    this.ui.emit('controller', command);
  }
}
</script>