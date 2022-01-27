<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
// import { reactive, ref, onMounted, watch } from "vue";
import { ref, onMounted } from "vue";
import TopNavigation from "./components/TopNavigation.vue";
const display_modes = {
  dark:
    `--base: #000; 
      --anti_base: #ddd; 
      --box_shadows: #bcbcbc; 
      --box_shadows_dark: #bbb;
      --top_nav_bg:#333;
      --button_color_light: #fff;
      --button_color_dark: #ddd;
      --button_bg: #f9f9f9;`,
  light:
    `--base: #fff; 
      --anti_base: #111;
      --box_shadows: #050505;
      --box_shadows_dark: #000; 
      --top_nav_bg:#444;
      --button_color_light: #000;
      --button_color_dark: #222;
      --button_bg: #090909;`
}
const display_mode = ref(localStorage.display_mode ?? 'DarkMode')
const display_values = ref('')
function set_display_mode(mode: string) {
  display_values.value = mode == 'LightMode' ? display_modes.light : display_modes.dark
  document.getElementById('app')?.setAttribute('style', display_values.value)
}
function switch_display_mode() {
  display_mode.value = display_mode.value == 'LightMode' ? 'DarkMode' : 'LightMode'
  localStorage.display_mode = display_mode.value
  set_display_mode(display_mode.value)
}
onMounted(() => {
  set_display_mode(display_mode.value)
})

</script>

<template>
  <top-navigation></top-navigation>
  <router-view v-slot="{ Component, route }">
    <transition name="slide" mode="out-in" appear>
      <component :is="Component" :key="route.path" />
    </transition>
  </router-view>
  <button id="light_dark_button" @click="switch_display_mode">{{ display_mode }}</button>
</template>



<style>
:root {
  --search_height: 5rem;
  --nav_height: 4rem;
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
  min-height: 100vh;
  background: var(--anti_base);
  transition: background 1s, color 1s;
}

#app *::selection {
  color: var(--anti_base);
  background: var(--base);
}
.page {
  width: 100%;
  height: calc(100vh - var(--nav_height));
  z-index: 9;
}
#light_dark_button {
  position: absolute;
  font-size: 1.2rem;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 30px;
  color: var(--base);
  background: var(--button_bg);
  box-shadow: 
  -5px -5px 20px var(--button_color_light),
  5px 5px 10px var(--button_color_dark),
  inset -2px -2px 5px var(--button_color_light),
  inset 2px 2px 5px var(--button_color_dark);
  transition: all 1s;
  bottom: 1.5rem;
  right: 1.5rem;
  /* opacity: 0.7; */
  z-index: 20;
}
#light_dark_button:hover {
  cursor: pointer;
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
</style>