<template>
  <div id="app">
    <Header/>
    <DefaultLayout>
      <router-view />
    </DefaultLayout>
    <Footer/>
    <modals-container />
  </div>
</template>

<script lang = "ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import Header from "./components/Header.vue";
import DefaultLayout from "./layout/DefaultLayout.vue";
import Footer from "./components/Footer.vue";

@Component({
  components: {
    Header,
    DefaultLayout,
    Footer
  }
})
export default class App extends Vue {}
</script>

<style>
</style>