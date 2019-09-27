<template>
  <div class="cards">
    <Card v-for="(status, index) in statuses" :key="index" :status="status" v-on:connect="connect"/>
  </div>
</template>

<script lang = 'ts'>
import { Vue, Component, Prop } from 'vue-property-decorator';
import { IServerStatus } from '../game/union/define';
import Card from './Card.vue';

@Component({
  components: {
    Card
  }
})
export default class CardList extends Vue {
  @Prop()
  private statuses: Array<IServerStatus>;

  mounted() {
  }
  
  private connect(): void {
    this.$emit('connect');
  }
}
</script>

<style>
</style>