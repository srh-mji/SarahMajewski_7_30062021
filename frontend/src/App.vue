<template>
  <v-app>
    <div id="app">
      <router-view></router-view>
    </div>
  </v-app>
</template>

<style>
  body {
    margin:0;
  }

  a {
    color: inherit;
    text-decoration: none;
  }
  
  a.router-link-exact-active {
    color: inherit;
  }

  #app {
    font-family:Arial, Helvetica, sans-serif;
  }
</style>