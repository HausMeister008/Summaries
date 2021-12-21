<script lang="ts" setup>

import { ref, onMounted,reactive } from 'vue'

import UserProfile, {
    Properties as UserProfileProperties,
} from "../components/Profile.vue";


const user_info: UserProfileProperties[] = reactive([])

async function get_user_data(){
    var result = await fetch('/api/userprofile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token: localStorage.token
        })
    })
    var json_r = [await result.json()]
    console.log(json_r)
    user_info.splice(0, user_info.length, ...json_r)
    console.log(user_info)

}
onMounted(get_user_data)
</script>

<template>
    <user-profile class="user_profile_info"
    v-if="user_info[0]"
    :username="user_info[0].username"
    :firstname= "user_info[0].firstname"
    :lastname= "user_info[0].lastname"
    :avg_rating= "user_info[0].avg_rating"
    :nSummaries= "user_info[0].nSummaries"
    :avatar = "user_info[0].avatar"
    ></user-profile>
    
</template>

<style scoped>
    .user_profile_info{
        color: var(--base);
        background: var(--anti_base);
        position:absolute;
        top:var(--nav_height);
        left: 0;
        width: 100%;
        height: calc(100vh - var(--nav_height));
        text-align:center;
        display:flex;
        justify-content:center;
        align-items:center;
        flex-direction:column;
    }
</style>