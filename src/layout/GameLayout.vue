<template>
  <section>
    <div class="contents game">
      <slot />
    </div>
  </section>
</template>

<script lang = "ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class DefaultLayout extends Vue {}
</script>

<style>
</style>