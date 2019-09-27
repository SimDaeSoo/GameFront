<template>
  <div class="card">
    <img class="card__image" src="https://img.icons8.com/cotton/2x/server.png">
    <div class="card-title">
      <h2>
        {{status.name}}<br/>
        {{status.address}}
        <small>User - {{status.user}} / 100</small>
        <small>Ping - {{status.ping.toFixed(2)}} ms</small>
        <small>UPS - {{status.ups}} update / sec</small>
        <div class="date">{{parsingDate(status.date)}} Last Update</div>
        <button class="connect">Connect</button>
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

  private parsingDate(date: number): string {
    const stringDate: string = new Date(date).toLocaleTimeString();
    return stringDate;
  }
}
</script>

<style>
</style>