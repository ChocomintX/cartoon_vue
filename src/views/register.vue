<template>
    <div class="root">
        <div class="fixed-top head">
            <img @click="back" class="return-img" src="../assets/return.png">
            注册
        </div>
        <div class="my-form">
            <mt-field label="用户名" placeholder="请输入用户名" v-model="username"></mt-field>
            <mt-field label="昵称" placeholder="请输入昵称" v-model="name"></mt-field>
            <mt-field label="密码" placeholder="请输入密码" type="password" v-model="password"></mt-field>
            <mt-field label="确认密码" placeholder="请再次输入密码" type="password" v-model="repassword"></mt-field>
            <mt-button @click="check" class="mint-button--primary btn" size="large" :disabled="btnActive">注册账号
            </mt-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "register",
        data() {
            return {
                username: '',
                name: '',
                email: '',
                password: '',
                repassword: ''
            }
        },
        methods: {
            back() {
                this.$router.back()
            },
            check() {
                let password = this.password
                let repassowrd = this.repassword
                console.log(password, repassowrd, password == repassowrd)
                if (password != repassowrd)
                    this.$messagebox.alert('两次密码输入不一致！')
                else {
                    this.$indicator.open('提交信息中...')
                    this.axios
                        .post(this.$root.serverUrl + '/register', {
                            username: this.username,
                            password: this.password,
                            name:this.name
                        }).then(r => {
                        this.$indicator.close()
                        const data = r.data
                        this.$messagebox
                            .confirm(data.message)
                            .then(() => {
                                if (data.code == 1) {
                                    this.$router.back()
                                }
                            })
                    }).catch(e => {
                        this.$indicator.close()
                        this.$messagebox.alert(e)
                    })
                }
            }
        },
        computed: {
            btnActive() {
                return this.username == '' || this.name == '' || this.password == '' || this.repassowrd == ''
            }
        }
    }
</script>

<style scoped>
    .my-form {
        width: 100%;
        margin-top: 50px;
    }

    .btn {
        width: 95%;
        margin: 10px 2.5% 10px 2.5%;
    }
</style>