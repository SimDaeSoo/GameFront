<template lang="html">
    <router-view id="app"></router-view>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator';

@Component
export default class App extends Vue {
  created() {
    // ..
  }
  mounted() {
    // ..
  }
}
</script>
