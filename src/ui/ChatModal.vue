<template>
  <div id="js-chatbar" class="chat-bar">
    <div class="chat-bar__message">
      <input v-focus class="chat-bar__input" type="text" v-model="text" placeholder="Message...">
      <button class="send_button" @click="close()">Send</button>
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
    const command: ICommand<any> = this.parseChat(this.text);
    this.emit('broadcast', command);
  }

  private isVaild(text: string): boolean {
    return text.length > 0;
  }

  private parseChat(text: string): ICommand<any> {
    const command: ICommand<any> = { script: '', data: {} };

    return command;
  }

  private close(): void {
    this.ui.toggleChatting();
  }
}
</script>