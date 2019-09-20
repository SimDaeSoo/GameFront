<template>
  <div id="js-chatbar" class="chat-bar">
    <div class="chat-bar__message">
      <input v-focus class="chat-bar__input" type="text" v-model="text" placeholder="Message...">
    </div>
  </div>
</template>

<script lang = "ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import BaseUI from './baseUI';
import { ICommand, CHAT_TYPE } from '../game/union/define';

@Component
export default class ChatModal extends BaseUI {
  private text: string = '';

  beforeDestroy() {
    if (!this.isVaild(this.text)) return;
    const command: ICommand = this.parseChat(this.text);
    this.emit('broadcast', command);
  }

  private isVaild(text: string): boolean {
    return text.length > 0;
  }

  private parseChat(text: string): ICommand {
    const command: ICommand = { script: '', data: {} };

    console.log('parse');

    return command;
  }
}
</script>

<style>
</style>