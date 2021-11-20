<script setup lang="ts">
import { defineProps } from 'vue'

export interface Properties {
    name: string,
    nSummaries: number,
    avatar?: string
}

const props = defineProps<Properties>();
</script>

<template>
  <div class="user_panel">
    <img
      :src = "props.avatar ?? '/src/assets/images/headphones2.jpg'"
      alt="profile picture"
      class="profile_image"
    />
    <div class="user_name"><p>{{ props.name }}</p></div>
    <div class="amount_summaries">Zusammenfassungen: {{ props.nSummaries }}</div>
  </div>
</template>

<style>
.user_panel{
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    height: 100px;
    width: 90vw;
    background: rgb(255, 255, 255);
    box-shadow: 0 0 15px #ccc;
    padding: 0 2rem 0 0;
    border-radius: 5px;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
    font-weight: 800;
    font-size: 1.1rem;
    margin-top: 1rem;
}

.user_panel:hover{
    transform: scale(1.01);
    box-shadow: 0 0 15px #bbb;
    cursor: pointer;
}

.profile_image{
    height: 100px;
    max-width: 150px;
}
</style>
