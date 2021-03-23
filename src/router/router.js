import Vue from 'vue'
import VueRouter from "vue-router"
import register from "@/views/register";
import home from "@/views/home";
import search from "@/views/search";
import like from "@/views/like";
import history from "@/views/history";
import info from "@/views/info";
import show from "@/views/show";
import login from "@/views/login";

Vue.use(VueRouter)

export default new VueRouter({
    base:'/manga/',
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