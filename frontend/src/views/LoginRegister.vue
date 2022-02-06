<script lang="ts" setup>
import { ref } from 'vue'
import LoginForm from "../components/Login.vue";
import RegisterForm from "../components/Register.vue";
const lgn_or_rgstr = ref(true)
</script>

<template>
    <div class="page">
        <input type="checkbox" name="lgn_or_rgstr" id="lgn_or_rgstr" v-model="lgn_or_rgstr" />
        <label for="lgn_or_rgstr" id="lgn_or_rgstr_label">
            <span>Register</span>
            <span>Login</span>
        </label>
        <transition :name="lgn_or_rgstr?'to_login': 'to_register'" mode="out-in">
            <login-form v-if="lgn_or_rgstr"></login-form>
            <register-form v-else></register-form>
        </transition>
    </div>
</template>

<style scoped>
.page{
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  }
#lgn_or_rgstr {
    display: none;
}
#lgn_or_rgstr_label {
    position: absolute;
    top: 10vh;
    border-radius: 30px;
    background-color: transparent;
    height: 3rem;
    display: flex;
    justify-content: space-around;
    align-items: center;
}
#lgn_or_rgstr_label {
    box-shadow: 0 10px 20px var(--box_shadows);
}
#lgn_or_rgstr_label:hover {
    cursor: pointer;
}
#lgn_or_rgstr_label span {
    color: var(--base);
    font-size: 1.2rem;
    font-weight: 900;
    height: 100%;
    width: max-content;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 1rem;
    width: 8rem;
    overflow: hidden;
    position: relative;
    z-index: 2;
    transition: color 0.2s;
}
#lgn_or_rgstr_label span:before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background: var(--box_shadows_dark);
    left: 0;
    top: 0;
    z-index: -1;
    transition: transform 0.2s;
}
#lgn_or_rgstr_label span:first-child {
    border-radius: 30px 0 0 30px;
}
#lgn_or_rgstr_label span:last-child {
    border-radius: 0 30px 30px 0;
}
#lgn_or_rgstr_label span:first-child:before {
    transform: translateX(100%);
}
#lgn_or_rgstr_label span:last-child:before {
    transform: translateX(-100%);
}
#lgn_or_rgstr:not(:checked) ~ #lgn_or_rgstr_label span:first-child:before {
    transform: translateX(0);
}
#lgn_or_rgstr:checked ~ #lgn_or_rgstr_label span:last-child:before {
    transform: translateX(0);
}
#lgn_or_rgstr:not(:checked) ~ #lgn_or_rgstr_label span:first-child {
    color: var(--base);
}
#lgn_or_rgstr:checked ~ #lgn_or_rgstr_label span:last-child {
    color: var(--base);
}
.to_login-enter-from {
  opacity: 0;
  transform: translateX(-3rem);
}
.to_login-leave-to {
  opacity: 0;
  transform: translateX(3rem);
}
.to_register-enter-from {
  opacity: 0;
  transform: translateX(3rem);
}
.to_register-leave-to {
  opacity: 0;
  transform: translateX(-3rem);
}
.to_login-leave-active,
.to_login-enter-active,
.to_register-leave-active,
.to_register-enter-active {
  transition: all  0.3s;
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
    color: var(--base);
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
    margin-top: 2em;
    font-size: 1.2em;
    border-radius: 5px;
    padding: .5rem 1rem;
    font-weight: 600;
    background: transparent;
    box-shadow: 0 0 5px var(--box_shadows);
    border: none;
    color: var(--base);
    transition: all .2s;
}
.submit_form:hover {
    cursor: pointer;
    transform: scale(1.05);
}
.checkbox_input {
    display: none;
    outline: none;
    margin: 0 0.5rem;
}
.checkbox_input:checked {
    background: var(--base);
    color: var(--anti_base);
}
.checkbox_input:hover {
    cursor: pointer;
    transform: scale(1.1);
}
.lgn_label_checkbox {
    padding-left: 2em;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}
.lgn_label_checkbox::before {
    content: "\2713";
    font-size: 0.8em;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    left: 0.5em;
    width: 1rem;
    height: 1rem;
    background: var(--anti_base);
    color: var(--anti_base);
    border-radius: 5px;
    border: 1px solid var(--base);
    transition: color 0.1s, background 1s;
}
.checkbox_input:checked ~ .lgn_label_checkbox::before {
    color: var(--base);
}
.checkbox_input_group {
    justify-content: left;
    align-items: center;
}
.logged_in {
    text-decoration: none;
    margin-top: 2rem;
    font-size: 1.3em;
    font-weight: 900;
    background: var(--base);
    color: var(--anti_base);
    padding: 0.5rem 1rem;
    border-radius: 5px;
    box-shadow: 0 0 15px var(--box_shadows_dark);
}
.loggedin_link_symbol{
    transition: all .2s;
}

.logged_in:hover > .loggedin_link_symbol{
    margin-left: 5px;
}

.lgn_rgstr_conf_fade-enter-from {
  opacity: 0;
  transform: scale(0);
}
.lgn_rgstr_conf_fade-leave-to {
  opacity: 0;
  transform: scale(0);
}
.lgn_rgstr_conf_fade-leave-active,
.lgn_rgstr_conf_fade-enter-active {
  transition: all  0.4s;
}


</style>