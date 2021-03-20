<template>
    <div v-show="state" class="root">
        <div class="fixed-top">
            <div class="head">
                <img @click="back" class="return-img" src="../assets/return.png">
                <div>{{title}}</div>
            </div>
        </div>
        <div class="main-group">
            <img class="info-img" :src="imgUrl">
            <div class="info-right">
                <div>作者:{{author}}</div>
                <div>简介:{{content}}</div>
            </div>
        </div>
        <div class="detail-group">
            <button @click="show(index)" class="detail-button" v-for="(detail,index) in details" :key="detail.url">
                {{detail.name}}
            </button>
        </div>
        <div class="fixed-bottom info-footer">
            <div @click="like" class="like-button">
                <span>{{likeState}}</span>
            </div>
            <div @click="read" class="read-button">
                <span>{{lastReadChapter}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['bookID'],
        name: "info",
        data() {
            return {
                state: false,
                title: '',
                imgUrl: '',
                author: '',
                content: '',
                isLike:0,
                lastReadName:'',
                lastReadID:'',
                details: []
            }
        },
        methods: {
            show(index) {
                sessionStorage.setItem('details', JSON.stringify(this.details))
                this.$router.push('/show/' + this.bookID + '/' + index)
            },
            like() {
                this.$indicator.open('请稍候...')
                this.axios.post(this.$root.serverUrl+'/like',{
                    id:sessionStorage.getItem('id'),
                    token:sessionStorage.getItem('token'),
                    bookid:this.bookID,
                    bookname:this.title,
                    bookimg:this.imgUrl,
                    chaptername:'',
                    chapterid:'',
                }).then(r=>{
                    const data=r.data
                    sessionStorage.setItem('token',data.token)
                    this.isLike=data.isLike
                    this.$indicator.close()
                    this.$messagebox.alert('操作成功!')
                }).catch(()=>{
                    this.$indicator.close
                    this.$messagebox.alert('操作失败!')
                })
            },
            read() {
                if(this.lastReadID!=''){
                    sessionStorage.setItem('details', JSON.stringify(this.details))
                    this.$router.push('/show/' + this.bookID + '/' + this.lastReadID)
                }
            },
            back() {
                this.$router.back()
            }
        },
        computed:{
            likeState(){
                return this.isLike==0?'收藏':'取消收藏'
            },
            lastReadChapter(){
                return this.lastReadID===''?'开始阅读':'继续阅读'+this.lastReadName
            }
        },
        created() {
            this.$indicator.open('爬取漫画信息中...')
            this.axios.post(this.$root.serverUrl + '/info', {
                id: sessionStorage.getItem('id'),
                token: sessionStorage.getItem('token'),
                bookID: this.bookID
            }).then(r => {
                this.$indicator.close()
                let data = r.data
                console.log(data)
                if (data.code == -1) {
                    this.$messagebox.alert(data.message)
                    this.$router.push('/login')
                } else {
                    sessionStorage.setItem('token', data.token)
                    sessionStorage.setItem('bookImg',data.imgUrl)
                    sessionStorage.setItem('bookName',data.title)
                    this.details = data.list
                    this.title = data.title
                    this.imgUrl = data.imgUrl
                    this.author = data.author
                    this.content = data.content
                    this.isLike=data.isLike
                    this.lastReadName=data.chaptername
                    this.lastReadID=data.chapterid
                    this.state = true
                }

            })
        }
    }
</script>

<style>
    .return-img {
        position: fixed;
        width: 20px;
        padding: 10px;
        left: 10px;
    }

    .main-group {
        margin-top: 50px;
        width: 100%;
        background: white;
        border-bottom: 1px solid gray;
    }

    .info-img {
        width: 30%;
        margin: 10px;
        border-radius: 10px;
    }

    .info-right {
        margin: 10px;
        display: -webkit-flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .info-right div {
        max-width: 100%;
        font-size: 15px;
        text-align: left;
    }

    .detail-group {
        margin: 10px 0 50px 0;
        max-width:100%;
        min-width: 100%;
        display: -webkit-flex;
        flex-direction: row;
        flex-wrap: wrap;
    }

    .detail-button {
        width: 31%;
        margin: 10px 1% 10px 1%;
        height: 40px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: black;
        background: #e3e3e3;
        border-radius: 5px;
    }

    .info-footer {
        height: 50px;
        background: white;
        border-top: 1px solid gray;
        display: -webkit-flex;
    }

    .like-button {
        width: 30%;
        height: 100%;
        display: -webkit-flex;
        align-items: center;
        justify-content: center;
    }

    .read-button {
        width: 70%;
        height: 100%;
        color: white;
        background: #ff4838;
        display: -webkit-flex;
        align-items: center;
        justify-content: center;
    }
</style>