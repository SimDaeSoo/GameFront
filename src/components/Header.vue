<template>
  <div class="header">
    <a @click="toggle()" class="logo">Multi Shooting Game Project ADI</a>
    <input class="menu-btn" type="checkbox" id="menu-btn">
    <label class="menu-icon" for="menu-btn" ref="closeNav">
      <span class="navicon"></span>
    </label>
    <ul class="menu">
      <li>
        <a @click="linkTo('/')">· Home</a>
      </li>
      <li>
        <a @click="linkTo('lobby')">· Lobby</a>
      </li>
      <li>
        <a @click="linkTo('login')">· Login</a>
      </li>
      <li>
        <a @click="linkTo('register')">· Register</a>
      </li>
    </ul>
  </div>
</template>

<script lang = "ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class Header extends Vue {
  private linkTo(to: string): void {
    if (this.$router.currentRoute.path.replace(/\//g, '') !== to.replace(/\//g, '')) {
      this.$router.push(to);
    }
    this.toggle();
  }

  private toggle(): void {
    (this.$refs.closeNav as HTMLElement).click();
  }
}
</script>