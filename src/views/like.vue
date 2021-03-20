<template>
    <div class="root">
        <div class="fixed-top head">
            <img @click="back" class="return-img" src="../assets/return.png">
            我的收藏
            <div class="edit-button" @click="isEdit=!isEdit" ontouchstart="">{{mode}}</div>
        </div>
        <div class="like-item-group">
            <div @click="toBookInfo(index)" class="like-item" v-for="(item,index) in likes" :key="index">
                <img :src="item.bookimg">
                <div class="like-item-right">
                    <div>
                        书名：
                        <div style="color: blue">{{item.bookname}}</div>
                    </div>
                    <div >
                        上次看到：
                        <div style="color: blue">{{item.chaptername}}</div>
                    </div>
                    <div>上次阅读时间：{{item.lastreadtime}}</div>
                </div>
                <input v-show="isEdit" v-model="selected[index]" class="like-item-checkbox" type="checkbox">
            </div>

        </div>
        <div v-show="isEdit" class="fixed-bottom like-bottom">
            <mt-button @click="deleteLike" class="mint-button--danger" :disabled="disabledDelete">确认删除({{selectNum}})
            </mt-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "like",
        data() {
            return {
                isEdit: false,
                likes: [],
                selected: [true, false, false]
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
            },
            deleteLike() {
                this.$messagebox
                    .confirm('确认删除?')
                    .then(()=>{
                        this.$indicator.open('请求中...')
                        this.axios.post(this.$root.serverUrl+'/deletelike',{
                            id:sessionStorage.getItem('id'),
                            token:sessionStorage.getItem('token'),
                            list:this.selectedList
                        }).then(r=>{
                            this.$indicator.close()
                            let data=r.data
                            if(data.code==-1){
                                this.$messagebox.alert(data.message)
                            }else {
                                this.likes=data.likes
                                this.isEdit=false
                            }
                            this.$messagebox.alert('操作成功!')
                        }).catch(e=>{
                            this.$indicator.close()
                            this.$messagebox.alert(e)
                        })
                })

            }
        },
        computed: {
            mode() {
                return this.isEdit ? '完成' : '修改'
            },
            selectNum() {
                return this.selected.filter(item => {
                    return item
                }).length
            },
            selectedList(){
                let list=[]

                for(let i=0;i<this.likes.length;i++){
                    if(this.selected[i])
                        list.push(this.likes[i])
                }
                return list
            },
            disabledDelete() {
                return this.selected.filter(item => {
                    return item
                }).length === 0
            }
        },
        watch: {
            isEdit() {
                this.selected = []
            }
        },
        created(){
            this.$indicator.open('加载中...')
            this.axios.post(this.$root.serverUrl+'/gethistory',{
                id:sessionStorage.getItem('id'),
                token:sessionStorage.getItem('token'),
                mode:'like'
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

<style>
    .edit-button {
        position: fixed;
        top: 0;
        right: 20px;
        height: 50px;
        display: -webkit-flex;
        align-items: center;
    }

    .edit-button:active {
        color: gray;
    }

    .like-item-group {
        width: 100%;
        background: white;
        margin-top: 50px;

        display: -webkit-flex;
        flex-direction: column;
    }

    .like-item {
        flex-grow: 1;
        font-size: 15px;
        padding: 10px 2% 10px 2%;
        border-bottom: 1px solid gray;
        display: -webkit-flex;
        flex-direction: row;
    }

    .like-item img {
        max-width: 30%;
        max-height: 165px;
    }

    .like-item-right {
        flex-grow: 1;
        padding-left: 5px;
        display: -webkit-flex;
        flex-direction: column;
    }

    .like-item-right div {
        flex-grow: 0.33;
        text-align: left;
        display: -webkit-flex;
        align-items: center;
    }

    .like-item-checkbox {
        align-self: center;
    }

    .like-bottom {
        height: 50px;
        width: 100%;
        background: white;
        border-top: 1px solid gray;
        display: -webkit-flex;
        align-items: center;
        justify-content: center;
    }

    .like-bottom .mint-button {
        width: 95%;
    }
</style>