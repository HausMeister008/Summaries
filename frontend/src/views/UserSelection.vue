<script setup lang="ts">

import { reactive, ref, onMounted, watch } from "vue";

import UserPanel, {
    Properties as UserProperties,
} from "../components/UserPanel.vue";

const users: UserProperties[] = reactive([]);
const username = ref('')


watch(username, (newUsername, oldUsername) => {
    fetch(`/api/users?usernameStartsWith=${encodeURIComponent(newUsername)}`)
        .then((response) => response.json())
        .then((result) => users.splice(0, users.length, ...result));
})


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
            :ID="user.ID"
            :avatar="user.avatar"
        ></user-panel>
        <div class="none_found" v-if="users.length == 0">
            <h2>Keine Ergebnisse!</h2>
        </div>
    </div>
</template>

<style scoped>
.user_list {
    width: 100%;
    height: 100%;
    margin-top: calc(var(--search_height) + var(--nav_height));
    background: white;
    box-shadow: inset 0 15px 15px -15px #eee;
    overflow: auto;
    scrollbar-width: thin;
    display: flex;
    justify-content: baseline;
    align-items: center;
    flex-direction: column;
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
    top: var(--nav_height);
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
.none_found{
    margin-top: 2rem;
    padding: .5rem 1rem;
    box-shadow: 0 0 15px #ccc;
    border-radius: 5px;
}
</style>