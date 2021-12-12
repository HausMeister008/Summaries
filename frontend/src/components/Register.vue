<script lang="ts" setup>
    import {ref} from 'vue'
    const username_inpt = ref('')
    const pwd_inpt = ref('')
    const firstname_inpt = ref('')
    const lastname_inpt = ref('')
    async function register(){
        // console.log(username_inpt.value, pwd_inpt.value)
        var response = await fetch(
            `/api/register`,
            {
                method: 'POST',
                headers:{
                    contentType: 'application/json'
                },
                body: JSON.stringify({
                    pwd: pwd_inpt.value
                })
            })
        var result = response.status
        console.log(result)
    }
</script>

<template>
    <div class="login">
        <form action="/api/login" method="post" class="loginForm" @submit.prevent="register">
            <h1 class="loginHeadline">Register</h1>
            <div class="login_group">
                <input v-model="username_inpt" name="username" id="lgn_usr_name" class="logininput" type="text" required autocomplete="off"/>
                <label class="lgn_label" for="lgn_usr_name">Benutzername</label>
            </div>
            <div class="login_group">
                <input v-model="firstname_inpt" name="firstname" id="lgn_usr_name" class="logininput" type="text" required autocomplete="off"/>
                <label class="lgn_label" for="lgn_usr_name">Vorname</label>
            </div>
            <div class="login_group">
                <input v-model="lastname_inpt" name="lastname" id="lgn_usr_name" class="logininput" type="text" required autocomplete="off"/>
                <label class="lgn_label" for="lgn_usr_name">Nachname</label>
            </div>
            <div class="login_group">
                <input v-model="pwd_inpt" name="pwd" id="lgn_pwd" class="logininput" type="password" required autocomplete="off"/>
                <label class="lgn_label" for="lgn_pwd">Passwort</label>
            </div>
            <input type="submit" class="submit_form" value="Register">
        </form>
    </div>
</template>