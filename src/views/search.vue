<template>
    <div class="root">
        <div class="fixed-top">
            <div class="head">
                <img @click="back" class="return-img" src="../assets/return.png">
                搜索结果
            </div>
            <div class="search-group">
                <img class="icon" src="../assets/search.png">
                <input v-model="search_text" class="input-text">
                <mt-button @click="search" class="mint-button--primary search-btn" :disabled="searchActive">搜索</mt-button>
            </div>
        </div>
        <div class="manga-list">
            <router-link :to="item.url" v-html="item.html" class="manga-item" v-for="(item,index) in results" :key="index"></router-link>
        </div>
        <mt-button @click="nextPage" v-show="nextActive" class="mint-button--default next-page" >加载更多</mt-button>
    </div>
</template>

<script>
    export default {
        name: "search",
        data(){
            return{
                page:1,
                search_text:'',
                searchActive:true,
                nextActive:false,
                results:''
            }
        },
        methods:{
            back(){
                this.$router.go(-1)
            },
            search(){
                this.page=1;
                this.getList()
            },
            nextPage(){
                this.page+=1
                this.getList()
            },
            getList(){
                this.$indicator.open('搜索中....请稍候')
                this.axios.post(this.$root.serverUrl+'/search', {
                    id: sessionStorage.getItem('id'),
                    token: sessionStorage.getItem('token'),
                    search_text:this.search_text,
                    page:this.page
                }).then(r => {
                    this.$indicator.close()
                    const data = r.data
                    if (data.code === -1) {
                        this.$messagebox.alert(data.message)
                        this.$router.push('/login')
                    } else {
                        sessionStorage.setItem('token', data.token)
                        this.nextActive=true
                        if(this.page===1)
                            this.results=data.results
                        else
                            this.results+=data.results
                    }
                }).catch(()=>this.$indicator.close)
            }
        },
        watch:{
            search_text(){
                this.searchActive=this.search_text === ''
            }
        }
    }
</script>

<style>
    .search-group{
        align-items: center;
        width: 100%;
        height: 50px;
        background: white;
        border-bottom: 1px solid gray;
        display: -webkit-flex;
    }

    .icon{
        width: 20px;
        height: 20px;
        margin: 15px;
    }

    .input-text{
        margin-right: 10px;
        /*height: 50%;*/
    }

    .search-btn{
        height: 70%;
        width: 100px;
        margin-right: 10px;
        color: white;
    }

    .next-page{
        width: 95%;
        margin: 20px 20px;
    }

    .manga-list{
        margin-top: 100px;
    }

    .manga-item{
        background: #f7f7f7;
        display: -webkit-flex;
        align-items: flex-start;
        border-bottom: 1px solid gray;
        padding: 10px;
    }

    .manga-item-cover{
        width: 40%;
        margin-right: 10px;
        border-radius: 10px;
    }

    .manga-right{
        width: 100%;
        max-height: 100%;
        padding-top: 5px;
        display: -webkit-flex;
        flex-direction: column;
        justify-content: center;
    }


    .manga-item div{
        color: black;
        text-align: left;
        margin: 0 10px 5px 0;
        font-size: 15px;
    }

    .manga-item-title{
        font-size: 20px!important;
    }

    a{
        text-decoration: none;
    }
</style>