<!-- onclick only with button with checkbox other functions -->

<script setup lang="ts">

import { ref, watch, reactive, onMounted, Ref } from 'vue'
import {
    Properties as UserProperties,
} from "../components/UserPanel.vue";

import CustomCheckbox from '../components/CustomCheckbox.vue'


const username = ref('')
const users: UserProperties[] = reactive([])
const addusers: Ref<number[]> = ref([])

const props = defineProps<{
    show: boolean,
    adduser_array:Array<number>
}>();

const emit = defineEmits<{
    (e: 'update:show', value: boolean): void;
    (e: 'update:adduser_array', value: number[]): void;
}>();

const onClick = () => {
    emit('update:show', !props.show);
    console.log(addusers.value)
    emit('update:adduser_array', addusers.value);
}
watch(username, async (newUsername, oldUsername) => {
    /*
    const a = [1,2,3,4,5]
    console.log(...a) = console.log(1,2,3,4,5) != console.log([1,2,3,4,5])
    */

    const response = await fetch(`/api/users?token=${localStorage.token}&usernameStartsWith=${encodeURIComponent(newUsername)}&onlycreators=false`)
    const result = await response.json()
    await users.splice(0, users.length, ...result)

})
watch(addusers, (n, o) => {
    // console.log(...n.filter(x=>!o.includes(x)))
})

// function adduser(id:number, checked:boolean){
//     if(checked){
//         addusers.value.push(id)
//     }else{
//         var ind:number = addusers.value.indexOf(id)
//         if(ind > -1)  addusers.value.splice(ind, 1) 
//         else return 
//     }
// }

const load = () => fetch(`/api/users?token=${localStorage.token}&onlycreators=false`)
    .then((response) => response.json())
    .then((result) => users.splice(0, users.length, ...result));

onMounted(load)
//const checkedNames: string[] = reactive([])
</script>

<template>
    <transition name="fade_in_selection_panel">
        <div class="access_user_form" v-if="show">
            <button id="close_access_user_form" @click="onClick">🗙</button>
            <h1 id="access_headline">Grant Access</h1>
            <!-- {{ addusers }}
        <div id="v-model-multiple-checkboxes">
        <input type="checkbox" id="jack" value="Jack" v-model="checkedNames" />
        <label for="jack">Jack</label>
        <input type="checkbox" id="john" value="John" v-model="checkedNames" />
        <label for="john">John</label>
        <input type="checkbox" id="mike" value="Mike" v-model="checkedNames" />
        <label for="mike">Mike</label>
        <br />
        <span>Checked names: {{ checkedNames }}</span>
            </div>-->

            <div id="search">
                <input id="searchBar" type="search" v-model="username" required />
                <label id="searchBarLabel" for="searchBar">Suche...</label>
            </div>
            <!-- <div>Du suchst nach {{ username }}</div> -->

            <div class="select_access_users" v-if="users">
                <div class="to_select_user" v-for="user in users" :key="user.ID">
                    <img
                        :src="'/src/assets/images/' + user.avatar"
                        :alt="user.name.charAt(0)"
                        class="user_avatar"
                    />
                    <p>{{ user.name }}</p>
                    <!--
                        bind the same array to multiple checkboxes, and have it filled with the checked items:
                        https://v3.vuejs.org/guide/forms.html#checkbox
                    -->
                    <custom-checkbox
                        class="checkbox_input_group"
                        v-model:array="addusers"
                        :array-element="user.ID"
                        label="Hinzufügen"
                    ></custom-checkbox>
                </div>
            </div>
        </div>
    </transition>
</template>

<style scoped>
.access_user_form {
    position: absolute;
    width: 70%;
    height: 90%;
    background: var(--anti_base);
    box-shadow: 0 0 15px var(--box_shadows);
    border-radius: 5px;
    color: var(--base);
    padding: 2rem 0;
    display: grid;
    grid-template-rows: 2.5rem var(--search_height) auto;
}
#close_access_user_form {
    width: 2rem;
    height: 2rem;
    font-size: 1.5rem;
    padding: 0 0 0.25rem 0;
    margin: 0;
    position: absolute;
    top: 0;
    right: 0;
    background: var(--anti_base);
    color: var(--base);
    opacity: 0.5;
    border: none;
    border-radius: 5px;
    display: grid;
    align-content: center;
    transition: 1s all, opacity 0.2s, transform 0.2s, color 0.2s;
}
#close_access_user_form:hover {
    cursor: pointer;
    opacity: 1;
    transform: scale(1.1);
    background: rgba(255, 0, 0, 0.5);
    color: var(--anti_base);
}
.select_access_users {
    width: 90%;
    margin-left: 5%;
    display: flex;
    justify-content: baseline;
    align-items: center;
    flex-direction: column;
    padding: 2rem 0;
    overflow: auto;
    scrollbar-width: thin;
    box-shadow: inset 0px 0 15px var(--box_shadows);
    border-radius: 5px;
}
#access_headline {
    width: 100%;
    height: auto;
    text-align: center;
}
#search {
    width: 100%;
    padding: 0 10%;
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
    z-index: 10;
}
#searchBar:focus,
#searchBar:valid {
    border-bottom-color: var(--base);
}
#searchBarLabel {
    position: absolute;
    background: transparent;
    color: #888;
    left: calc(10% + 1rem);
    top: 1.5rem;
    transition: top 0.2s, font-size 0.2s, color 0.2s, opacity 0.2s;
    z-index: 11;
}
#searchBar:focus ~ #searchBarLabel,
#searchBar:valid ~ #searchBarLabel {
    top: 0.5rem;
    font-size: 0.9rem;
    color: var(--base);
    opacity: 0.5;
}
.to_select_user {
    min-height: 100px;
    max-height: 100px;
    width: 90%;
    padding: 0;
    margin-inline: auto;
    display: grid;
    grid-template-columns: 150px auto max-content;
    align-items: center;
    font-size: 1.1rem;
    background: var(--anti_base);
    box-shadow: 0 0 15px var(--box_shadows);
    border-radius: 5px;
    overflow: hidden;
    transition: all 1s, transform 0.2s, margin-top .5s;
}
.to_select_user *{
    height: 100%;
    display: flex;
    align-items: center;
    justify-content:center;
}
.to_select_user:hover {
    transform: scale(1.02);
}
.to_select_user + .to_select_user {
    margin-top: 1.5rem;
}
.user_avatar {
    object-fit: cover;
    height: 100%;
    max-width: 150px;
}
.checkbox_input_group{
    padding: 0 2rem 0 0;
}
.fade_in_selection_panel-enter-from {
    transform: translateX(-10%);
    opacity: 0;
}
.fade_in_selection_panel-leave-to {
    transform: translateX(30%);
    opacity: 0;
}
.fade_in_selection_panel-leave-active,
.fade_in_selection_panel-enter-active {
    transition: transform 0.4s, opacity 0.4s;
}
</style>