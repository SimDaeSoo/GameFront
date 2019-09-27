<template>
  <div class="header" ref="header">Hello Im Header</div>
</template>

<script lang = "ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class Header extends Vue {}
</script>

<style scoped>
.header {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 40px;
  background-color: tomato;
  color: white;
  z-index: 2;
}
</style>