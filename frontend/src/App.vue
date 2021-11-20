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
  <div>
    <input type="search" v-model="username">
    <div>Du suchst nach {{ username }}</div>
  </div>

  <button @click="load()">User laden</button>

  <div class="user-list">
    <user-panel
      v-for="user in users"
      :name="user.name"
      :n-summaries="user.nSummaries"
      :avatar="user.avatar"
    ></user-panel>
  </div>
</template>

<style>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

#app {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-height: 100vh;
  font-family: Calibri;
}
</style>
