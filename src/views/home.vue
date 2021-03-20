<template>
    <div class="root">
        <div class="head">
            选择功能
        </div>
        <div class="option-group">
            <div @click="search" ontouchstart="" class="item">查找漫画</div>
            <div @click="like" ontouchstart="" class="item">我的收藏</div>
            <div @click="history" ontouchstart="" class="item">浏览记录</div>
        </div>
        <mt-button @click="exit" class="mint-button--danger btn">退出登录</mt-button>
    </div>
</template>

<script>
    export default {
        name: "home",
        data() {
            return {
            }
        },
        methods: {
            search() {
                this.$router.push('/search')
            },
            like() {
                this.$router.push('/like')
            },
            history() {
                this.$router.push('/history')
            },
            exit(){
                this.$messagebox
                    .confirm('确定要退出吗?')
                    .then(()=>{
                        sessionStorage.clear()
                        this.$router.push('/')
                    })
            }
        },
        created() {

        }
    }
</script>

<style>
    .option-group {
        width: 100%;
    }

    .item {
        display: -webkit-flex;
        width: 95%;
        height: 50px;
        background: white;
        border-top: 1px solid black;
        border-bottom: 1px solid black;
        padding: 0 0 0 5%;
        margin: 20px 0 0 0;
        overflow: hidden;
        align-items: center;
        justify-content: left;
    }

    .item:active {
        background: gray;
        color: white;
    }

    .btn {
        width: 95%;
        margin-top: 20px;
    }
</style>