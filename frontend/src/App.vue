<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
// import { reactive, ref, onMounted, watch } from "vue";
import { ref, onMounted } from "vue";
const display_modes = {
  dark:
  `--base: black; 
      --anti_base: white; 
      --box_shadows: #ccc; 
      --box_shadows_dark: #bbb;
      --top_nav_bg:#333;`,
  light: 
      `--base: white; 
      --anti_base: #111;
      --box_shadows: #050505;
      --box_shadows_dark: #000; 
      --top_nav_bg:#444;`
}
const display_mode = ref(localStorage.display_mode??'DarkMode')
const display_values = ref('')
function set_display_mode(mode:string){
  display_values.value = mode == 'LightMode' ? display_modes.light: display_modes.dark
  console.log(mode, display_values.value)
  document.getElementById('app')?.setAttribute('style', display_values.value) 
}
function switch_display_mode() {
  display_mode.value = display_mode.value == 'LightMode' ? 'DarkMode' : 'LightMode'
  localStorage.display_mode = display_mode.value
  set_display_mode(display_mode.value)
}
onMounted(()=>{
  set_display_mode(display_mode.value)
})

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
button{ 
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
}

#app *::selection{
  color: var(--anti_base);
  background: var(--base);
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
  box-shadow: 0 5px 10px var(--box_shadows_dark);
  transition: opacity 0.2s;
  bottom: 1rem;
  right: 1rem;
  opacity: 0.7;
  z-index: 20;
  transition: box-shadow .2s;
}
#light_dark_button:hover {
  cursor: pointer;
  opacity: .9;
}
</style>