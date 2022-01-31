<script setup lang="ts">

import {ref} from 'vue'
const username = ref('')

</script>

<template>
    <div id="search">
        <input id="searchBar" type="search" v-model="username" required />
        <label id="searchBarLabel" for="searchBar">Suche...</label>
        <!-- <div>Du suchst nach {{ username }}</div> -->
    </div>
</template>

<script lang="ts">



</script>