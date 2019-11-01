<template>
  <div class="UI no-drag" ref="UI">
    <ChatController :ui="this"/>
    <ZoomController :ui="this"/>
    <ArrowController :ui="this"/>
    <ActionController :ui="this"/>
  </div>
</template>

<script lang = "ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import ChatModal from "./ChatModal.vue";
import ArrowController from './ArrowController.vue';
import ActionController from './ActionController.vue';
import ChatController from './ChatController.vue';
import ZoomController from './ZoomController.vue';
import { EventEmitter } from 'events';

@Component({
  components: {
    ArrowController,
    ActionController,
    ChatController,
    ZoomController
  }
})
export default class DomUI extends Vue {
  private emitter: EventEmitter = new EventEmitter();
  private chatFlag: boolean = false;

  public on(eventName: string, listener: any): void {
    this.emitter.on(eventName, listener);
  }

  public emit(eventName: string, ...args): void {
    this.emitter.emit(eventName, ...args);
  }

  mounted() {
    this.initialize();
  }

  beforeDestroy() {
    window.removeEventListener("keydown", this.keyDown);
    window.removeEventListener("keyup", this.keyUp);
  }

  private initialize(): void {
    window.addEventListener("keydown", this.keyDown);
    window.addEventListener("keyup", this.keyUp);
  }

  private chat(): void {
    this.toggleChatting();
  }

  // Keyboard Event
  private keyDown(event: KeyboardEvent): void {
    const keyCode: number = event.keyCode;

    switch (keyCode) {
      case 13:
        this.toggleChatting();
        break;
    }
  }

  private keyUp(event: KeyboardEvent): void {
    const keyCode: number = event.keyCode;
  }

  // Modal Show & Hide
  private toggleChatting(): void {
    if (!this.chatFlag) {
      this.showChatModal();
    } else {
      this.hideChatModal();
    }
    this.chatFlag = !this.chatFlag;
  }

  private showChatModal(): void {
    this.$modal.show(ChatModal, {
      ui: this
    }, {
        name: 'ChatModal',
        classes: 'ChatModal',
        width: '100%',
        height: 'auto',
        pivotY: 1,
        clickToClose: false,
        backgroundColor: 'transparent'
      });
  }

  private hideChatModal(): void {
    this.$modal.hide('ChatModal');
  }
}
</script>