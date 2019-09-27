<template>
  <div class="contents">
      <slot/>
  </div>
</template>

<script lang = "ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class DefaultLayout extends Vue {}
</script>

<style>
</style>