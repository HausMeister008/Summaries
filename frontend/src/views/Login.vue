<template>
    <div class="login">
        <form action="/api/login" method="post" class="loginForm">
            <h1 class="loginHeadline">Login</h1>
            <div class="login_group">
                <input name="username" id="lgn_usr_name" class="logininput" type="text" required autocomplete="off"/>
                <label class="lgn_label" for="lgn_usr_name">Benutzername</label>
            </div>
            <div class="login_group">
                <input name="pwd" id="lgn_pwd" class="logininput" type="password" required autocomplete="off"/>
                <label class="lgn_label" for="lgn_pwd">Passwort</label>
            </div>
        </form>
    </div>
</template>

<style scoped>
.login {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 90vh;
    margin-top: 10vh;
}

.loginForm {
    width: max(300px, 40%);
    height: max(300px, 80%);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border-radius: 5px;
    box-shadow: 0 0 15px #ccc;
    position: relative;
}
.loginHeadline {
    position: absolute;
    top: 3rem;
    font-size: 3rem;
}
.logininput {
    width: 100%;
    border: none;
    outline: none;
    border-bottom: #aaa 2px solid;
    padding: 0 .5rem;
    transition: border-bottom-color .2s;
}
.logininput:focus ,.logininput:valid{
    border-bottom-color: black;
}
.login_group{
    width: 50%;
    min-width: 300px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}
.login_group *{
    font-size: 1.1rem;
    font-weight: 600;
}
.login_group + .login_group {
    margin-top: 1.2rem;
}

.lgn_label {
    position: absolute;
    color: #777;
    left: .5rem;
    top: 0;
    pointer-events: none;
    transition: top .2s ease-in-out, font-size .2s ease-in-out, color .2s;
}
.logininput:focus ~ .lgn_label,.logininput:valid ~ .lgn_label{
    top: -1.1em;
    font-size: .75em;
    color: #333;
}

</style>