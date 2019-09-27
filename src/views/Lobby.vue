<template>
  <div class="Lobby" ref="Lobby">
    <CardList :statuses="statuses"/>
  </div>
</template>

<script lang = "ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { IServerStatus } from "../game/union/define";
import axios from 'axios';
import CardList from '../components/CardList.vue';

@Component({
  components: {
    CardList
  }
})
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