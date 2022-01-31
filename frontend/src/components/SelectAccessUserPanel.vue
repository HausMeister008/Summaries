<script setup lang="ts">

import { ref, watch, reactive, onMounted, Ref } from 'vue'
import {
    Properties as UserProperties,
} from "../components/UserPanel.vue";

import CustomCheckbox from '../components/CustomCheckbox.vue'


const username = ref('')
const users: UserProperties[] = reactive([])
const addusers: Ref<string[]> = ref([])

watch(username, async (newUsername, oldUsername) => {
    /*
    const a = [1,2,3,4,5]
    console.log(...a) = console.log(1,2,3,4,5) != console.log([1,2,3,4,5])
    */
    
    const response = await fetch(`/api/users?token=${localStorage.token}&usernameStartsWith=${encodeURIComponent(newUsername)}`)
    const result = await response.json()
    await users.splice(0, users.length, ...result)
    addusers.value.splice(0, addusers.value.length)
    console.log(users)

})
watch(addusers, (n,o)=>{
    console.log(n)
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
function tellme(){
    console.log('tellme')
}

const load = () => fetch(`/api/users?token=${localStorage.token}`)
    .then((response) => response.json())
    .then((result) => users.splice(0, users.length, ...result));
    console.log(users)

onMounted(load)


const checkedNames: Ref<string[]> = ref([])
//const checkedNames: string[] = reactive([])
</script>

<template>

    <div class="access_user_form">
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
        </div> -->


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
                <div class="checkbox_input_group">
                    <!--
                        bind the same array to multiple checkboxes, and have it filled with the checked items:
                        https://v3.vuejs.org/guide/forms.html#checkbox
                    -->
                    <input
                        :id="'adduser' + user.ID"
                        class="checkbox_input"
                        type="checkbox"
                        :value="user.ID.toString()"
                        v-model="addusers"
                    />
                    <label :for="'adduser' + user.ID" class="checkbox_label">Hinzufügen</label>
                    <custom-checkbox 
                    v-model:array="addusers"
                    :array-element="user.ID"
                    label="Hinzufügen"
                    />
                </div>

            </div>
        </div>
    
    </div>
</template>

<style scoped>

.access_user_form {
    position: absolute;
    width: 70%;
    height: 90%;
    background: var(--anti_base);
    box-shadow: 0 0 15px var(--box_shadows);
    color: var(--base);
    padding-top: 2rem;
    display: grid;
    grid-template-rows: 2.5rem var(--search_height) auto;
}
.select_access_users {
    display: flex;
    justify-content: baseline;
    align-items: center;
    flex-direction: column;
    padding: 2rem 0 0 0;
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
    height: 100px;
    width: 90%;
    padding: 0;
    margin-inline: auto;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    font-size: 1.1rem;
    background: var(--anti_base);
    box-shadow: 0 0 15px var(--box_shadows);
    border-radius: 5px;
    overflow: hidden;
    transition: all 1s, transform 0.2s;
}
.to_select_user:hover {
    transform: scale(1.02);
}
.to_select_user + .to_select_user {
    margin-top: 1.5rem;
}
.user_avatar {
    height: 100px;
    max-width: 150px;
}

</style>