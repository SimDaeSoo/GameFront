<template>
  <DefaultLayout>
    <div class="Lobby" ref="Lobby">
      <CardList :statuses="statuses" v-on:connect="stop"/>
    </div>
  </DefaultLayout>
</template>

<script lang = "ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { IServerStatus } from "../game/union/define";
import axios from 'axios';
import CardList from '../components/CardList.vue';
import DefaultLayout from "../layout/DefaultLayout.vue";

@Component({
  components: {
    DefaultLayout,
    CardList
  }
})
export default class Lobby extends Vue {
  private statuses: Array<IServerStatus> = [];
  private pollingID: any;

  mounted() {
    this.setServerStatus();
    this.polling();
  }

  beforeDestroy() {
    this.stop();
  }

  private async setServerStatus(): Promise<void> {
    // const result: any = await axios.get('http://localhost:8000/server/status');
    const result: any = await axios.get('http://15.164.141.35:8000/server/status');
    const data: Array<IServerStatus> = result.data;
    Vue.set(this, 'statuses', data);
  }

  public polling(): void {
    this.pollingID = setInterval(async () => {
      this.setServerStatus();
    }, 500);
  }

  public stop(): void {
    clearInterval(this.pollingID);
  }
}
</script>