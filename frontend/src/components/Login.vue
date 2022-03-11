<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
const username_inpt = ref('')
const pwd_inpt = ref('')
const route = useRoute()
const logged_in = ref(false)
const form = ref()
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
        logged_in.value = true
        form.value.reset()
    }
}
</script>
<template>
    <div class="login">
        <form action="/api/login" method="post" class="loginForm" @submit.prevent="login" ref="form">
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
            <transition name="lgn_rgstr_conf_fade" appear>
                <router-link to="/userprofile" class="logged_in" v-if="logged_in">
                    Eingeloggt! Zum Profil
                    <span class="loggedin_link_symbol">></span>
                </router-link>
            </transition>
        </form>
    </div>
</template>