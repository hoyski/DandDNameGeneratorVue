<template>
  <div id="namegen-app">
    <nav>
      <router-link v-bind:to="{ name: 'taverns' }">Taverns</router-link> |
      <router-link v-bind:to="{ name: 'magicShops' }">Magic Shops</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {};
</script>

<style>
#namegen-app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 60px;
}
</style>
