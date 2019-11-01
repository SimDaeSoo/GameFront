<template>
  <DefaultLayout>
    <div class="Home" ref="Home">this is Home Form</div>
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
}
</script>