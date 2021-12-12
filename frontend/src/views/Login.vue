<script lang="ts" setup>
import { ref } from 'vue'
import LoginForm from "../components/Login.vue";
import RegisterForm from "../components/Register.vue";
const lgn_or_rgstr = ref(true)
</script>

<template>
    <input type="checkbox" name="lgn_or_rgstr" id="lgn_or_rgstr" v-model="lgn_or_rgstr" />
    <label for="lgn_or_rgstr" id="lgn_or_rgstr_label">
        <span>Register</span>
        <span>Login</span>
    </label>
    <login-form v-if="lgn_or_rgstr"></login-form>
    <register-form v-else></register-form>
</template>

<style scoped>
#lgn_or_rgstr{
    display: none;
}
#lgn_or_rgstr_label {
    position: absolute;
    top: 10vh;
    border-radius: 30px;
    background-color: transparent;
    height:3rem;
    display: flex;
    justify-content:space-around;
    align-items:center;
}
#lgn_or_rgstr_label {
    box-shadow: 0 10px 20px var(--box_shadows);
}
#lgn_or_rgstr_label:hover{
    cursor: pointer;
}
#lgn_or_rgstr_label span{
    color: var(--base);
    font-size: 1.2rem;
    font-weight: 900;
    height: 100%;
    width: max-content;
    display: flex;
    justify-content:center;
    align-items:center;
    padding: 0 1rem;
    width: 8rem;
    overflow: hidden;
    position: relative;
    z-index: 2;
    transition: color .2s;
}
#lgn_or_rgstr_label span:before{
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: var(--box_shadows_dark);
    left: 0;
    top: 0;
    z-index: -1;
    filter: blur(1px);
    transition: transform .2s;
}
#lgn_or_rgstr_label span:first-child{
    border-radius: 30px 0 0 30px;
}
#lgn_or_rgstr_label span:last-child{
    border-radius: 0 30px 30px 0;
}
#lgn_or_rgstr_label span:first-child:before{
    transform: translateX(100%);
}
#lgn_or_rgstr_label span:last-child:before{
    transform: translateX(-100%);
}
#lgn_or_rgstr:not(:checked) ~ #lgn_or_rgstr_label span:first-child:before{
    transform: translateX(0);
}
#lgn_or_rgstr:checked ~ #lgn_or_rgstr_label span:last-child:before{
    transform: translateX(0);
}
#lgn_or_rgstr:not(:checked) ~ #lgn_or_rgstr_label span:first-child{
    color: var(--base);
}
#lgn_or_rgstr:checked ~ #lgn_or_rgstr_label span:last-child{
    color: var(--base);
}
</style>

<style>
.login {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 90vh;
    margin-top: 10vh;
    color: var(--base);
    background: var(--anti_base);
}

.loginForm {
    width: max(300px, 40%);
    height: max(300px, 80%);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border-radius: 5px;
    box-shadow: 0 0 15px var(--box_shadows);
    position: relative;
}
.loginHeadline {
    margin-bottom: 3rem;
    margin-top: -6rem;
    font-size: 3rem;
}
.logininput {
    width: 100%;
    border: none;
    outline: none;
    border-bottom: #aaa 2px solid;
    padding: 0 0.5rem;
    transition: border-bottom-color 0.2s;
    color: var(--base);
}
.logininput:focus,
.logininput:valid {
    border-bottom-color: var(--base);
}
.login_group {
    width: 50%;
    min-width: 300px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}
.login_group * {
    font-size: 1.1rem;
    font-weight: 600;
    background: transparent;
}
.login_group + .login_group {
    margin-top: 1.2rem;
}

.lgn_label {
    position: absolute;
    color: #777;
    left: 0.5rem;
    top: 0;
    pointer-events: none;
    transition: top 0.2s ease-in-out, font-size 0.2s ease-in-out, color 0.2s,
        opacity 0.2s;
}
.logininput:focus ~ .lgn_label,
.logininput:valid ~ .lgn_label {
    top: -1.1em;
    font-size: 0.75em;
    color: var(--base);
    opacity: 0.5;
}
.submit_form {
    margin-top: 1em;
    font-size: 1em;
    font-weight: 600;
    background: transparent;
    border: none;
    color: var(--base);
}
.submit_form:hover {
    cursor: pointer;
}
</style>