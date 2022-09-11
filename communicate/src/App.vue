<template>
  <v-app>
    <v-main>
      <HomePage />
    </v-main>
  </v-app>
</template>

<script>
import HomePage from './components/HomePage.vue'

export default {
  name: 'App',
  components: {
    HomePage
  }
}
</script>

<style>
body {
  margin: 0;
}
#app {
  font-family: Montserrat, sans-serif;
  margin:0;
  padding:0;
  width:100vw;
  height:100vh;
}
</style>
