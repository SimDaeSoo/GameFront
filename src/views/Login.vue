<template>
  <DefaultLayout>
    <div class="Login" ref="Login">
      this is Login Form
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
export default class Login extends Vue {}
</script>