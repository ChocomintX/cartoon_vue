import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import MintUI from "mint-ui"
import 'mint-ui/lib/style.css'
import '@/css/root.css'
import axios from "axios";
import router from "@/router/router";

Vue.use(VueRouter)
Vue.use(MintUI)


Vue.prototype.axios = axios;
Vue.config.productionTip = false


new Vue({
    render: h => h(App),
    router,
    data() {
        return {
            serverUrl: 'https://chocomint.cn/manga/api'
        }
    },
    mounted() {
    }
}).$mount('#app')
