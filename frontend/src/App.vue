<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
// import { reactive, ref, onMounted, watch } from "vue";
import { ref, onMounted } from "vue";

const display_mode = ref('LightMode')
const display_values = ref('')
function switch_display_mode() {
  display_mode.value = display_mode.value == 'LightMode' ? 'DarkMode' : 'LightMode'
  display_values.value = (
    display_mode.value == 'DarkMode' ?
      `--base: black; 
      --anti_base: white; 
      --box_shadows: #ccc; 
      --box_shadows_dark: #bbb;
      --top_nav_bg:#333;`
      :
      `--base: white; 
      --anti_base: #111;
      --box_shadows: #1b1b1b;
      --box_shadows_dark: #171717; 
      --top_nav_bg:#444;`
  )
  document.getElementById('app')?.setAttribute('style', display_values.value) 
}
onMounted(switch_display_mode)

</script>

<template>
    <top-navigation></top-navigation>
    <router-view/>
    <button id="light_dark_button" @click="switch_display_mode">{{ display_mode }}</button>
</template>

<script lang='ts'>
import TopNavigation from "./components/TopNavigation.vue";

export default {
  components: { TopNavigation }
}
</script>


<style>
:root {
  /* --base: black;
  --anti_base: white;
  --box_shadows: #ccc;
  --box_shadows_dark: #bbb;
  --top_nav_bg: #333; */
  /* --base: white; --anti_base: black; --box_shadows: #333; --box_shadows_dark: #222; --top_nav_bg:#444; */
  --search_height: 5rem;
  --nav_height: 4rem;
}
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  transition: background 1s, color 1s, box-shadow 1s;
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
  min-height: 100vh;
  background: var(--anti_base);
}
#light_dark_button {
  position: absolute;
  font-size: 1.2rem;
  font-weight: 600;
  padding: 0.5rem 1.5rem;
  border: 2px solid transparent;
  border-radius: 30px;
  color: var(--base);
  background: var(--box_shadows);
  box-shadow: 5px 10px 10px var(--box_shadows_dark);
  transition: opacity 0.2s;
  bottom: 1rem;
  right: 1rem;
  opacity: 0.7;
  z-index: 20;
}
#light_dark_button:hover {
  cursor: pointer;
  opacity: .9;
}
</style>