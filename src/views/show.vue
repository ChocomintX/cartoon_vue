<template>
    <div class="root">
        <transition name="menu-fade-top">
            <div v-if="menuActive" class="fixed-top">
                <div class="head show-head">
                    <img @click="back" class="return-img" src="../assets/return.png">
                    <div>{{title}}</div>
                </div>
            </div>
        </transition>
        <img class="img-item" @click="showMemu(index)" v-for="(img,index) in imgs" :id="setID(index)" :key="index"
             v-lazy="img" @error="errorImage()">
        <transition name="menu-fade-bottom">
            <div v-show="menuActive" class="fixed-bottom show-foot">
                <div class="range-group">
                    <div>当前页面:</div>
                    <mt-range class="show-foot-range" v-model="page" :min="1" :max="imgs.length" :step="1"
                              :bar-height="5"></mt-range>
                    <div>{{page}}/{{imgs.length}}</div>
                </div>
                <div class="menu-button-group">
                    <div @click="lastChapter">上一章</div>
                    <div @click="nextChapter">下一章</div>
                </div>
            </div>
        </transition>

        <transition name='list-button-fade'>
            <div @click="showList" v-show="menuActive" class="list-button">目录</div>
        </transition>
        <transition name="list-fade">
            <div v-show="listActive" class="chapter-list">
                <div :id="setChapterID(index)" @click="changeChapter(index)" class="chapter-item"
                     :class="{'chapter-item-active':index==chapterIndex}" v-for="(detail,index) in details"
                     :key="index">
                    {{detail.name}}
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    export default {
        props: ['bookID', 'chapterIndex'],
        name: "show",
        data() {
            return {
                title: '',
                details: JSON.parse(sessionStorage.getItem('details')),
                imgs: [],
                urlNum: 1,
                page: 1,
                nowPage: 1,
                menuActive: false,
                menuLoading: false,
                listActive: false
            }
        },
        methods: {
            back() {
                this.$router.go(-1)
            },
            showMemu(index) {
                this.page = index + 1
                this.listActive = false
                this.menuActive = !this.menuActive
                this.menuLoading = false
            },
            showList() {
                this.listActive = true
                this.menuActive = false
                this.menuLoading = false
                setTimeout(() => {
                    const index = parseInt(this.chapterIndex) + 1
                    const chapter = document.querySelector('#chapter' + index)
                    chapter.scrollIntoView()
                }, 100)
            },
            setID(index) {
                index += 1
                return 'img' + index
            },
            setChapterID(index) {
                index += 1
                return 'chapter' + index
            },
            lastChapter() {
                if (this.chapterIndex == 0){
                    this.$messagebox.alert('已经是第一章啦！')
                } else{
                    const index=parseInt(this.chapterIndex-1)
                    const url = '/show/' + this.bookID + '/' + index
                    this.$router.replace(url)
                }
            },
            nextChapter() {
                if (this.chapterIndex == this.details.length - 1){
                    this.$messagebox.alert('已经是最后一章啦！')
                } else{
                    const index=parseInt(this.chapterIndex)+1
                    const url = '/show/' + this.bookID + '/' + index
                    this.$router.replace(url)
                }
            },
            changeChapter(index) {
                const url = '/show/' + this.bookID + '/' + index
                this.$router.replace(url)
            },
            errorImage() {
                event.target.src = require('@/assets/home.gif')
            }
        },
        watch: {
            page() {
                if (this.menuActive && this.menuLoading) {
                    const img = document.querySelector('#img' + this.page)
                    img.scrollIntoView()
                } else {
                    this.menuLoading = true
                }
            },
            $route(){
                location.reload()
            }
        },
        created() {
            this.$indicator.open('请求章节图片中...')
            this.title = this.details[this.chapterIndex].name

            const bookID = this.bookID.replace(/[^0-9]/g, '')
            const chapterID = this.details[this.chapterIndex].url.replace(/[^0-9]/g, '')
            const chapterName = this.details[this.chapterIndex].name

            this.axios.post(this.$root.serverUrl + '/show', {
                id: sessionStorage.getItem('id'),
                token: sessionStorage.getItem('token'),
                bookID: bookID,
                chapterID: chapterID,
                index: this.chapterIndex,
                chapterName: chapterName,
                bookName:sessionStorage.getItem('bookName'),
                bookImg:sessionStorage.getItem('bookImg')
            }).then(r => {
                this.$indicator.close()
                const data = r.data
                if (data.code == '-1') {
                    this.$messagebox.alert('请求失败!错误信息:' + data['message'])
                    return
                } else {
                    sessionStorage.setItem('token', data.token)
                    this.imgs = data.imgs
                }
            }).catch(() => {
                this.$indicator.close()
            })

        }
    }
</script>

<style>
    .show-head {
        background: rgba(0, 0, 0, 0.8);
    }

    .show-foot {
        background: rgba(0, 0, 0, 0.8);
        color: white;
    }

    .range-group {
        width: 90%;
        margin: 15px 5% 10px 5%;
        display: -webkit-flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }

    .show-foot-range {
        flex-grow: 1;
        margin: 0 10px 0 10px;
    }

    .menu-button-group {
        width: 100%;
        display: -webkit-flex;

        align-items: center;
    }

    .menu-button-group div {
        flex-grow: 0.5;
        padding: 5px 0 20px 0;
    }

    .img-item {
        width: 100%;
    }

    .img-item[lazy=loading] {
        width: 100%;
        background-image: url("../assets/home.gif");
    }

    .list-button {
        background: rgba(0, 0, 0, 0.8);
        color: white;
        width: 60px;
        height: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        right: 10px;
        bottom: 120px;
        border: 1px solid gray;
        border-radius: 50%;
    }

    .chapter-list {
        position: fixed;
        width: 50%;
        right: 0;
        top: 0;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        scroll-behavior: smooth;
        overflow: scroll;
        display: -webkit-flex;
        flex-direction: column;
    }

    .chapter-item {
        min-height: 30px;
        color: white;

        text-align: left;
        padding: 10% 0 0 10px;
        border-bottom: 1px solid gray;
    }

    .chapter-item-active {
        background: deepskyblue;
    }

    .chapter-item:active {
        background: gray;
    }

    .list-fade-enter-active {
        animation: chapterListAnim 0.3s
    }

    .list-fade-leave-active {
        animation: chapterListAnim 0.3s reverse;
    }

    .menu-fade-top-enter-active {
        animation: menuTopAnim 0.3s
    }

    .menu-fade-top-leave-active {
        animation: menuTopAnim 0.3s reverse;
    }

    .menu-fade-bottom-enter-active {
        animation: menuBottomAnim 0.3s
    }

    .menu-fade-bottom-leave-active {
        animation: menuBottomAnim 0.3s reverse;
    }

    .list-button-fade-enter-active {
        animation: listButtonAnim 0.5s;
    }

    .list-button-fade-leave-active {
        animation: listButtonAnim 0.5s reverse;
    }

    @-webkit-keyframes menuTopAnim {
        0% {
            margin-top: -50px;
        }
        100% {
            margin-top: 0;
        }
    }

    @-webkit-keyframes menuBottomAnim {
        0% {
            bottom: -106px;
        }
        100% {
            bottom: 0;
        }
    }

    @-webkit-keyframes listButtonAnim {
        0% {
            transform: rotate(360deg);
            right: -50px;
        }
        100% {
            right: 10px;
            transform: rotate(0deg);
        }
    }

    @-webkit-keyframes chapterListAnim {
        0% {
            right: -50%;
        }
        100% {
            bottom: 0;
        }
    }
</style>