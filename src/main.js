import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import MintUI from "mint-ui"
import 'mint-ui/lib/style.css'
import '@/css/root.css'
import axios from "axios";
import login from "@/views/login";
import home from "@/views/home";
import search from "@/views/search";
import info from "@/views/info";
import show from "@/views/show";
import like from "@/views/like";
import history from "@/views/history";
import register from "@/views/register";

Vue.use(VueRouter)
Vue.use(MintUI)


Vue.prototype.axios = axios;
Vue.config.productionTip = false

const router = new VueRouter({
    routes: [
        {path: '/register', component: register},
        {path: '/home', component: home},
        {path: '/search', name: 'search', component: search, meta: {keepAlive: true}},
        {path: '/like', component: like},
        {path: '/history', component: history},
        {path: '/info/:bookID', component: info, props: true},
        {path: '/show/:bookID/:chapterIndex', component: show, props: true},
        {path: '/*', component: login},
    ]
})

new Vue({
    render: h => h(App),
    router,
    data() {
        return {
            serverUrl: 'https://chocomint.cn/api'
        }
    },
    mounted() {
    }
}).$mount('#app')
