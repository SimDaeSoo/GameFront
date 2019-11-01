<template>
  <div class="arrow_container">
    <div v-touch:start="leftStart" v-touch:end="leftEnd" class="arrow arrow-left">
      <i class="fi-arrow-left"></i>
    </div>
    <div v-touch:start="rightStart" v-touch:end="rightEnd" class="arrow arrow-right">
      <i class="fi-arrow-right"></i>
    </div>
  </div>
</template>

<script lang = "ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import BaseUI from './baseUI';

@Component
export default class DomUI extends BaseUI {
  private leftStart(): void {
    const command: any = {
      script: 'keydown',
      data: { keyCode: 37 }
    };
    this.ui.emit('controller', command);
  }

  private leftEnd(): void {
    const command: any = {
      script: 'keyup',
      data: { keyCode: 37 }
    };
    this.ui.emit('controller', command);
  }
  private rightStart(): void {
    const command: any = {
      script: 'keydown',
      data: { keyCode: 39 }
    };
    this.ui.emit('controller', command);
  }

  private rightEnd(): void {
    const command: any = {
      script: 'keyup',
      data: { keyCode: 39 }
    };
    this.ui.emit('controller', command);
  }
}
</script>