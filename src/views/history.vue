<template>
    <div class="root">
        <div class="fixed-top head">
            <img @click="back" class="return-img" src="../assets/return.png">
            浏览历史
        </div>
        <div class="like-item-group">
            <div @click="toBookInfo(index)"  class="like-item" v-for="(item,index) in likes" :key="index">
                <img :src="item.bookimg">
                <div class="like-item-right">
                    <div >
                        书名：
                        <div style="color: blue">{{item.bookname}}</div>
                    </div>
                    <div >
                        上次看到：
                        <div style="color: blue">{{item.chaptername}}</div>
                    </div>
                    <div>上次阅读时间：{{item.lastreadtime}}</div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    export default {
        name: "history",
        data(){
            return{
                likes: [],
            }
        },
        methods: {
            back() {
                this.$router.go(-1)
            },
            toBookInfo(index) {
                if (this.isEdit) {
                    return
                } else {
                    this.$router.push('/info/'+this.likes[index].bookid)
                }
            }
        },
        created(){
            this.$indicator.open('加载中...')
            this.axios.post(this.$root.serverUrl+'/gethistory',{
                id:sessionStorage.getItem('id'),
                token:sessionStorage.getItem('token'),
                mode:'history'
            }).then(r=>{
                this.$indicator.close()
                const data=r.data
                if(data.code==-1){
                    this.$messagebox.alert(data.message)
                    return
                }else {
                    this.likes=data.historys
                }
            }).catch(e=>{
                this.$indicator.close()
                this.$messagebox.alert(e)
            })
        }
    }
</script>

<style scoped>

</style>