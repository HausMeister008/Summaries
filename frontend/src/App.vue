<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
// import { reactive, ref, onMounted, watch } from "vue";
</script>

<template>
  <title>{{ $route.name }}</title>
  <top-navigation></top-navigation>
  <router-view />
</template>

<script lang='ts'>
import TopNavigation from "./components/TopNavigation.vue";

export default {
  components: { TopNavigation }
}
</script>


<style>
:root {
  --search_height: 5rem;
  --base: black;
  --nav_height: 4rem;
}
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
body {
  overflow: hidden;
  background: transparent;
}
#app {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  font-family: Calibri;
  height: calc(100vh - 7rem);
  background: transparent;
}
</style>