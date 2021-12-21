<script setup lang="ts">
import { defineProps } from 'vue'

export interface Properties {
    name: string,
    nSummaries: number,
    ID: number,
    avatar?: string
}

const props = defineProps<Properties>();
</script>

<template>
  <router-link :to="{name: 'UserDetails', params:{id:props.ID, name:props.name}}" class="user_panel">
    <img
      :src = "props.avatar ? '/src/assets/images/'+props.avatar : '/src/assets/images/headphones_small.jpg'"
      alt="profile picture"
      class="profile_image"
    />
    <div class="user_name"><p>{{ props.name }}</p></div>
    <div class="amount_summaries">Zusammenfassungen: {{ props.nSummaries }}</div>
  </router-link>
</template>

<style>
.user_panel:first-child{
  margin-top: 2rem;
}
.user_panel:last-child{
  margin-bottom: 5rem;
}
.user_panel{
    text-decoration:none;
    color: var(--base);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    height: 100px;
    width: 90%;
    margin-left: 5%;
    background: var(--anti_base);
    box-shadow: 0 0 15px var(--box_shadows);
    padding: 0 2rem 0 0;
    border-radius: 5px;
    overflow: hidden;
    transition: background 1s, color 1s,transform 0.2s, box-shadow 0.2s;
    font-weight: 800;
    font-size: 1.1rem;
    margin-top: 1rem;
}

.user_panel:hover{
    transform: scale(1.01);
    box-shadow: 0 0 15px var(--box_shadows_dark);
    cursor: pointer;
    z-index: 8;
}
.user_name{
  font-size: 1.2em;
}
.profile_image{
    width: 150px;
}
</style>
