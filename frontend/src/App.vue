<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { reactive, ref, onMounted, watch } from "vue";
import UserPanel, {
  Properties as UserProperties,
} from "./components/UserPanel.vue";

const username = ref('')

watch(username, (newUsername, oldUsername) => {
  fetch(`/api/users?usernameStartsWith=${encodeURIComponent(newUsername)}`)
    .then((response) => response.json())
    .then((result) => users.splice(0, users.length, ...result));
})

const users: UserProperties[] = reactive([]);

const load = () => fetch("/api/users")
  .then((response) => response.json())
  .then((result) => users.splice(0, users.length, ...result));

onMounted(load)

</script>

<template>
  <div id="search">
    <input id="searchBar" type="search" v-model="username" required />
    <label id="searchBarLabel" for="searchBar">Suche...</label>
    <!-- <div>Du suchst nach {{ username }}</div> -->
  </div>
  <div class="user_list">
    <user-panel
      v-for="user in users"
      :name="user.name"
      :n-summaries="user.nSummaries"
      :avatar="user.avatar"
    ></user-panel>
  </div>
</template>

<style>
:root {
  --search_height: 5rem;
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
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-family: Calibri;
  max-height: calc(100vh - 7rem);
  background: transparent;
}
.user_list {
  width: 100%;
  max-height: 100%;
  margin-top: var(--search_height);
  background: white;
  box-shadow: inset 0 0 15px #eee;
  overflow: auto;
  scrollbar-width: thin;
  z-index: 8;
}
.user_list::-webkit-scrollbar {
  width: 0.5rem;
}
.user_list::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 5px;
}
#search {
  width: 100vw;
  height: var(--search_height);
  padding: 0 15vw;
  position: absolute;
  top: 0;
  background: #fff;
}

#search * {
  font-size: 1.1rem;
  font-weight: 600;
}
#searchBar {
  width: 100%;
  height: 2.5rem;
  position: relative;
  margin-top: 1rem;
  padding: 0 1rem;
  outline: none;
  border: none;
  background: transparent;
  border-bottom: 2px solid #aaa;
  transition: border-color 0.2s;
  z-index: 10;
}
#searchBar:focus,
#searchBar:valid {
  border-bottom-color: #444;
}
#searchBarLabel {
  position: absolute;
  color: #888;
  left: calc(15vw + 1rem);
  top: 1.5rem;
  transition: top 0.2s, font-size 0.2s, color 0.2s;
  z-index: 11;
}
#searchBar:focus ~ #searchBarLabel,
#searchBar:valid ~ #searchBarLabel {
  top: 0.5rem;
  font-size: 0.9rem;
  color: #000;
}
</style>