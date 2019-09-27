<template>
  <div class="Lobby" ref="Lobby">
    Select Server
    <CardList :statuses="statuses" v-on:connect="stop"/>
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
  private pollingID: any;

  mounted() {
    this.polling();
  }

  private serServerStatus(statuses: Array<IServerStatus>): void {
    Vue.set(this, 'statuses', statuses);
  }

  public polling(): void {
    this.pollingID = setInterval(async () => {
      const result: any = await axios.get('http://13.124.180.130:8000/server/status');
      // const result: any = await axios.get('http://localhost:8000/server/status');
      const data: Array<IServerStatus> = result.data;

      this.serServerStatus(data);
    }, 500);
  }

  public stop(): void {
    clearInterval(this.pollingID);
  }
}
</script>

<style>
</style>