<script lang="ts" setup>
import {ref} from 'vue'

import MySummaries from './MySummaries.vue';

const searched = ref('')

const props = defineProps<{
    middle_slide_direction: string|number,
    searched_sum: string,
}>()

const emit = defineEmits<{
    (e: 'update:searched_sum', value: string): void;
}>()
</script>

<template>
    <div class="user_sums" :style="`--slide_direction:${middle_slide_direction}`">
        <h1 class="profile_part_headline">Meine Zusammenfassungen</h1>
        <div id="search">
            <!-- here maybe ref and @change required -->
            <input id="searchBar" type="search" @keypress="emit('update:searched_sum', searched)" v-model="searched" required />
            <label id="searchBarLabel" for="searchBar">Suche (Name, Fach oder Schule)...</label>
        </div>
        <my-summaries v-model:searched_sum="searched_sum" />
    </div>
</template>

<style scoped>
.user_sums{
        position: relative;
        width: 90%;
        padding: 0 2rem 2rem 2rem;
        height: calc(80vh - var(--top_margin) - 4rem);
        overflow: auto;
        scrollbar-width: thin;
    }
    .profile_part_headline {
        position: sticky;
        top: 0;
    }

    #search {
        width: 100%;
        height: var(--search_height);
        padding: 0 15%;
        position: relative;
        background: var(--anti_base);
        color: var(--base);
    }

    #search * {
        font-size: 1.1rem;
        font-weight: 600;
        background: var(--anti_base);
        color: var(--base);
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
    }
    #searchBar:focus,
    #searchBar:valid {
        border-bottom-color: var(--base);
    }
    #searchBarLabel {
        position: absolute;
        background: transparent;
        color: #888;
        left: calc(15% + 1rem);
        top: 1.5rem;
        transition: top 0.2s, font-size 0.2s, color 0.2s, opacity 0.2s;
    }
    #searchBar:focus ~ #searchBarLabel,
    #searchBar:valid ~ #searchBarLabel {
        top: 0.5rem;
        font-size: 0.9rem;
        color: var(--base);
        opacity: 0.5;
    }
</style>