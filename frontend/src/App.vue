<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { reactive } from "vue";

import UserPanel, { Properties as UserProperties } from "./components/UserPanel.vue";

const users: UserProperties[] = reactive();
</script>

<template>
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
