<script lang="ts" setup>
import { ref } from 'vue'
import CustomCheckbox from '../components/CustomCheckbox.vue'

const username_inpt = ref('')
const pwd_inpt = ref('')
const firstname_inpt = ref('')
const lastname_inpt = ref('')
const creator_account_inpt = ref(false)


const registered = ref(false)
const user_exists = ref(false)

async function register() {
    // console.log(username_inpt.value, pwd_inpt.value)
    var response = await fetch(
        `/api/register`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username_inpt.value,
                pwd: pwd_inpt.value,
                firstname: firstname_inpt.value,
                lastname: lastname_inpt.value,
                creator_account: creator_account_inpt.value
            })
        })
    var result = await response.json()
    console.log(result)
    if (result.success) {
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
            registered.value = true
        }
    }
    else if (result.user_exists) {
        user_exists.value = true
    }
}
</script>

<template>
    <div class="login">
        <form action="/api/login" method="post" class="loginForm" @submit.prevent="register">
            <h1 class="loginHeadline">Register</h1>
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
                    v-model="firstname_inpt"
                    name="firstname"
                    id="lgn_usr_name"
                    class="logininput"
                    type="text"
                    required
                    autocomplete="off"
                />
                <label class="lgn_label" for="lgn_usr_name">Vorname</label>
            </div>
            <div class="login_group">
                <input
                    v-model="lastname_inpt"
                    name="lastname"
                    id="lgn_usr_name"
                    class="logininput"
                    type="text"
                    required
                    autocomplete="off"
                />
                <label class="lgn_label" for="lgn_usr_name">Nachname</label>
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
            <div class="login_group checkbox_input_group">
                <!-- <checkbox
                    v-model="creator_account_inpt"
                    name="creator_account"
                    id="creator_account"
                    label-text="Creator-Account"
                />-->
                <custom-checkbox v-model="creator_account_inpt" label="Creator-Account" />
            </div>
            <input type="submit" class="submit_form" value="Register" />
            <router-link to="/userprofile" class="logged_in" v-if="registered">
                Registration Erfolgreich
                <br />Zum Profil
                <span class="loggedin_link_symbol">></span>
            </router-link>
            <div class="user_exists" v-if="user_exists">
                <h3>Dieser Benutzername ist bereits vergeben</h3>
            </div>
        </form>
    </div>
</template>

<style scoped>
.user_exists {
    margin-top: 1.5rem;
    color: rgb(214, 57, 57);
}
</style>