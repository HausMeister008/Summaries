<script lang="ts" setup>
    import {ref} from 'vue'
    const username_inpt = ref('')
    const pwd_inpt = ref('')
    async function login(){
        // console.log(username_inpt.value, pwd_inpt.value)
        var response = await fetch(`/api/login/${username_inpt.value}/${pwd_inpt.value}`)
        var result = await response.json()
        console.log(result)
    }
</script>

<template>
    <div class="login">
        <form action="/api/login" method="post" class="loginForm" @submit.prevent="login">
            <h1 class="loginHeadline">Login</h1>
            <div class="login_group">
                <input v-model="username_inpt" name="username" id="lgn_usr_name" class="logininput" type="text" required autocomplete="off"/>
                <label class="lgn_label" for="lgn_usr_name">Benutzername</label>
            </div>
            <div class="login_group">
                <input v-model="pwd_inpt" name="pwd" id="lgn_pwd" class="logininput" type="password" required autocomplete="off"/>
                <label class="lgn_label" for="lgn_pwd">Passwort</label>
            </div>
            <input type="submit" class="submit_form" value="Login">
        </form>
    </div>
</template>