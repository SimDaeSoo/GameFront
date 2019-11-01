<template>
  <div class="action_container">
    <div v-touch:start="jumpStart" v-touch:end="jumpEnd" class="action"></div>
  </div>
</template>

<script lang = "ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import BaseUI from './baseUI';

@Component
export default class ActionController extends BaseUI {
  private jumpStart(): void {
    const command: any = {
      script: 'keydown',
      data: { keyCode: 38 }
    };
    this.ui.emit('controller', command);
  }

  private jumpEnd(): void {
    const command: any = {
      script: 'keyup',
      data: { keyCode: 38 }
    };
    this.ui.emit('controller', command);
  }
}
</script>