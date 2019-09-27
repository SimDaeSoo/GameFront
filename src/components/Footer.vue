<template>
  <div class="footer" ref="footer">Hello Im Footer</div>
</template>

<script lang = "ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class Footer extends Vue {}
</script>

<style scoped>
.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 40px;
  background-color: tomato;
  color: white;
  z-index: 2;
}
</style>