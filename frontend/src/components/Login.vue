<script lang="ts" setup>
import { ref, watch} from 'vue'
import {useRoute} from 'vue-router'
const username_inpt = ref('')
const pwd_inpt = ref('')
const route = useRoute()
var logged_in = false
async function login() {
    // console.log(username_inpt.value, pwd_inpt.value)
    var response = await fetch(`/api/login`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username_inpt.value,
            pwd: pwd_inpt.value
        })
    })
    const token = ref(localStorage.token)
    var result = await response.json()
    if (result.success) {
        localStorage.token = result.user_token
        token.value = result.user_token
        //swith to profile here
        logged_in = true
        console.log(logged_in)
    }
}
</script>
<template>
    <div class="login">
        <form action="/api/login" method="post" class="loginForm" @submit.prevent="login">
            <h1 class="loginHeadline">Login</h1>
            <div class="login_group">
                <input
                    v-model="username_inpt"
                    name="username"
                    id="lgn_usr_name"
                    class="logininput"
                    type="text"
                    required
                    autocomplete="off"
                />
                <label class="lgn_label" for="lgn_usr_name">Benutzername</label>
            </div>
            <div class="login_group">
                <input
                    v-model="pwd_inpt"
                    name="pwd"
                    id="lgn_pwd"
                    class="logininput"
                    type="password"
                    required
                    autocomplete="off"
                />
                <label class="lgn_label" for="lgn_pwd">Passwort</label>
            </div>
            <input type="submit" class="submit_form" value="Login" />
        </form>
        <div class="logged_in" :class="logged_in?'shown':''">Logged in</div>
    </div>
</template>