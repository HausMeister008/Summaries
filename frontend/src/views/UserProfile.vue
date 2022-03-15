<script lang="ts" setup>

import { ref, onMounted, reactive } from 'vue'

import UserProfile, {
    Properties as UserProfileProperties,
} from "../components/Profile.vue";


const user_info: UserProfileProperties[] = reactive([])

async function get_user_data() {
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
    user_info.splice(0, user_info.length, ...json_r)

}
onMounted(get_user_data)
</script>

<template>
    <div class="userprofile page">
        <user-profile
            v-if="user_info[0]"
            :username="user_info[0].username"
            :firstname="user_info[0].firstname"
            :lastname="user_info[0].lastname"
            :avg_rating="user_info[0].avg_rating"
            :nSummaries="user_info[0].nSummaries"
            :avatar="user_info[0].avatar"
            :is_creator="user_info[0].is_creator"
        ></user-profile>
        
    </div>
</template>

<style scoped>
.userprofile{
    position: relative;
    margin-top: var(--top_margin);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: calc(100vh - var(--top_margin));
}
@media (max-width: 750px){
    .userprofile{
        height: 100vh;
        margin:auto;
    }
}
</style>