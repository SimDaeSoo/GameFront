<template>
  <DefaultLayout>
    <div class="Home" ref="Home">
      Hello this is Home
      <button @click="go('lobby')">Go To Lobby</button>
      <button @click="go('login')">Go To Login</button>
      <button @click="go('register')">Go To Register</button>
    </div>
  </DefaultLayout>
</template>

<script lang = "ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import DefaultLayout from "../layout/DefaultLayout.vue";

@Component({
  components: {
    DefaultLayout
  }
})
export default class Home extends Vue {
  mounted() {}

  public go(to: string): void {
    this.$router.replace(to);
  }
}
</script>

<style>
</style>