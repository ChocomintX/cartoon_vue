<template>
    <div id="app">
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
</template>

<script>
    // import MyCom from "@/components/MyCom";

    export default {
        name: 'App',
        components: {
            // HelloWorld,
            // MyCom,
        },
        computed:{
            username(){
                return this.$route
            }
        }
    }
</script>

<style>
    #app {
        text-align: center;
    }
    body{
        height: 100%;
        margin: 0;
        padding: 0;
    }
</style>
