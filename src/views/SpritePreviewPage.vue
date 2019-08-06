<template>
  <div class="SpritePreviewPage">
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator';
import io from 'socket.io-client';

@Component({})
export default class SpritePreviewPage extends Vue {
  private socket: any;

  created() {
  }

  mounted() {
    this.socket = io('http://localhost:3020');
    this.socket.on('connect', (): void => {
      this.socket.emit('broadcast', 'addCharacter(1)');

      this.socket.on('broadcast', (message: string): void => {
        console.log(`broadcast: ${message}`);
      });
    });
  }
}
</script>

<style scoped>
.SpritePreviewPage {
  width: 100%;
  height: 100%;
  display: flex;
}
</style>
