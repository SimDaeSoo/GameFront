<template>
  <div class="Lobby" ref="Lobby">
    <ul>
      <li v-for="(status, index) in statuses" :key="index">{{status}}</li>
    </ul>
  </div>
</template>

<script lang = "ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import axios from 'axios';

interface IServerStatus {
  address: string;
  user: number;
  ups: number;
  ping: number;
  date?: number;
}

@Component
export default class Lobby extends Vue {
  private statuses: Array<IServerStatus> = [];

  mounted() {
    this.polling();
  }

  private serServerStatus(statuses: Array<IServerStatus>): void {
    Vue.set(this, 'statuses', statuses);
  }

  private polling(): void {
    const ping: any = () => {
      setTimeout(async (): Promise<void> => {
        const result: any = await axios.get('http://13.124.180.130:8000/server/status');
        // const result: any = await axios.get('http://localhost:8000/server/status');
        const data: Array<IServerStatus> = result.data;

        this.serServerStatus(data);
        ping();
      }, 500);
    }

    ping();
  }
}
</script>

<style>
</style>