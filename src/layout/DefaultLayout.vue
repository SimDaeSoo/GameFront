<template>
  <section>
    <Header />
    <div class="contents">
      <slot />
    </div>
    <Footer />
  </section>
</template>

<script lang = "ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";

@Component({
  components: {
    Header,
    Footer
  }
})
export default class DefaultLayout extends Vue {}
</script>

<style>
</style>