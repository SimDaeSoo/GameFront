<template>
  <div class="card">
    <div class="card-title">
      <h2>
        <div class="title">
          <span>{{status.name}}</span>
        </div>
        <button class="connect" @click="connect">Connect</button>
        <div class="date">{{status.user}} user / {{status.ups}} ups</div>
      </h2>
    </div>
  </div>
</template>

<script lang = "ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { IServerStatus } from "../game/union/define";

@Component
export default class Card extends Vue {
  @Prop()
  private status: IServerStatus;

  mounted() {
  }

  private connect(): void {
    const channel: string = this.status.address.match(/:[0-9][0-9][0-9][0-9]/g)[0].replace(':', '');
    const server: string = this.status.address.replace(`:${channel}`, '');
    this.$store.dispatch('setServer', { server });
    this.$store.dispatch('setChannel', { channel });
    this.$router.replace('game');
    this.$emit('connect');

  }

  private parsingDate(date: number): string {
    const stringDate: string = new Date(date).toLocaleTimeString();
    return stringDate;
  }
}
</script>

<style>
</style>