<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
// import { reactive, ref, onMounted, watch } from "vue";
import { ref, onMounted } from "vue";
import TopNavigation from "./components/TopNavigation.vue";


</script>

<template>
  <top-navigation></top-navigation>
  <router-view v-slot="{ Component, route }">
    <transition name="slide" mode="out-in" appear>
      <component :is="Component" :key="route.path" />
    </transition>
  </router-view>
</template>



<style>
:root {
  --search_height: 5rem;
  --nav_height: 4rem;
  --top_margin: 4rem;
}
@media (max-width: 750px) {
  :root {
    --nav_height: 100vh;
    --top_margin: 0;
    /* --good_color:rgb(14, 70, 92); */
  }
}
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  transition: background 1s, color 1s, box-shadow 1s;
  font-family: Calibri;
}
body {
  overflow: hidden;
  background: transparent;
}
button {
  outline: none;
}
#app {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  font-family: Calibri;
  height: 100vh;
  background: var(--anti_base);
  transition: background 1s, color 1s;
}

#app *::selection {
  color: var(--anti_base);
  background: var(--base);
}
.page {
  width: 100%;
  height: calc(100vh - var(--top_margin));
  margin-top: var(--top_margin);
  z-index: 9;
}
.slide-enter-from {
  transform: translateY(-10%);
  opacity: 0;
}
.slide-leave-to {
  transform: translateY(30%);
  opacity: 0;
}
.slide-leave-active,
.slide-enter-active {
  transition: transform 0.4s, opacity 0.4s;
}

@media (max-width: 750px) {
  .slide-enter-from {
    transform: translateX(-10%);
    opacity: 0;
  }
  .slide-leave-to {
    transform: translateX(20%);
    opacity: 0;
  }
  .slide-leave-active,
  .slide-enter-active {
    transition: transform 0.3s ease-out, opacity 0.3s;
  }
}
</style>