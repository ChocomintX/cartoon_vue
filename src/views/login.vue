<template>
    <div class="root">
        <div class="login-form">
            <div class="title">登录</div>
            <div class="label">用户名</div>
            <input class="input-text" v-model="username" type="text">
            <div class="label">密码</div>
            <input class="input-text" v-model="password" type="password">
            <div class="remember">
                <router-link class="link" to="/register">注册</router-link>
                <input v-model="autoLogin" type="checkbox">
                <span>记住密码</span>
            </div>
            <mt-button @click="submit" class="mint-button--primary login" :disabled="disabled">登录</mt-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "login",
        data() {
            return {
                username: '',
                password: '',
                autoLogin: false,
                disabled: true
            }
        },
        methods: {
            submit() {
                let data = {
                    username: this.username,
                    password: this.password
                }
                this.$indicator.open('验证中...')
                this.axios
                    .post(this.$root.serverUrl + '/login', data)
                    .then(r => {
                        this.$indicator.close()
                        data = r.data
                        console.log(data)
                        if (data.code === -1) {
                            this.$messagebox('提示', '用户名或密码错误！')
                            return
                        }

                        if (this.autoLogin) {
                            localStorage.setItem('username', this.username)
                            localStorage.setItem('password', this.password)
                        } else {
                            localStorage.clear()
                        }
                        sessionStorage.setItem('id', data.id)
                        sessionStorage.setItem('token', data.token)
                        this.$router.push('/home')
                    })
            }
        },
        watch: {
            username() {
                if (this.username === '' || this.password === '')
                    this.disabled = true
                else
                    this.disabled = false
            },
            password() {
                if (this.username === '' || this.password === '')
                    this.disabled = true
                else
                    this.disabled = false
            }
        },
        created() {
            let username = localStorage.getItem('username')
            let password = localStorage.getItem('password')
            if (username != null && password != null) {
                this.username = username
                this.password = password
                this.autoLogin = true
            }
        }
    }

</script>

<style scoped>
    .root {
        height: 100vh;
        background-image: url("../assets/home.gif");
    }

    .login-form {
        width: 80%;
        background: rgba(255, 255, 255, 0.9);
        padding: 0 5% 5% 5%;
        border: 3px solid gray;
        border-radius: 20px;
    }

    .title {
        font-size: 30px;
        color: black;
        margin: 5%;
    }

    .label {
        color: black;
        text-align: left;
        font-size: 20px;
        margin: 10px 0 10px 0;
    }

    .login {
        width: 100%;
        margin: 10px 0 10px 0;
    }

    .remember {
        display: -webkit-flex;
        justify-content: flex-end;
        margin: 10px 10px 0 0;
        font-size: 15px;
    }

    .link{
        align-self: flex-start;
        justify-self: flex-start;
        color: blue;
        border-bottom: 1px solid blue;
    }
</style>