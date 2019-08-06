<template>
  <div class="GamePage">
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator';
import io from 'socket.io-client';

@Component({})
export default class GamePage extends Vue {
  private socket: any;

  created() {
  }

  mounted() {
    this.socket = io('http://localhost:3020');
    this.socket.on('connect', (): void => {
      this.socket.emit('broadcast', `addCharacter(${this.socket.id}, 1, { x: ${Math.random()*100}, y: ${Math.random()*100}})`, Date.now());

      this.socket.on('broadcast', (message: string, date: number): void => {
        console.log(`Broadcast: ${message} (${Date.now() - date}ms)`);
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
