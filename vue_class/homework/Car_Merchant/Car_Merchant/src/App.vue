<script setup lang="ts">
import Nav_header from './components/Nav_header.vue'
</script>

<template>
  <Nav_header />
  <router-view />
</template>

<style>
html,
body {
  margin: 0;
  padding: 0;
  font-family: 'Nunito-Regular', sans-serif;
}

button,
input {
  font-family: inherit;
}

.title {
  font-family: 'BebasNeue-Regular', sans-serif;
}

.text {
  font-family: 'Nunito-Regular', sans-serif;
}
</style>
