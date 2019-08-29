<template>
    <div class="layt">
        <router-view ></router-view>
        <div class="fixedtop" v-if="isScroll">
        <div class="container">
            <a class="s-title" @click="toUrl('/')"><img :src="['../static/nicon.png']"></a>
            <div class="s-bar">
            <input class="s-in" :placeholder="searchTitle" v-model="searchContent"/>
            <button class="s-btn" @click="handleSearch()">搜索</button>
            </div>
            <a class="s-log" v-if="!userShow" href="/login">登录/注册</a>
            <span v-if="userShow" class="s-wel">欢迎，{{username}}<a @click="quit()">退出</a></span>
        </div>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      isScroll:false,
      userShow:false,
      searchTitle:"",
      searchContent:"",
    }
  },
  mounted:function(){
    let vm = this;
    window.addEventListener('scroll', vm.handleScroll);
  },
  methods:{
    handleSearch(){

    },
    toUrl(val){
        let vm = this;
        vm.$router.push({path:val})
    },
    quit(){

    },
    handleScroll() {
      let vm = this;
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      let topHeight = document.getElementById("top-container").offsetHeight;
      vm.isScroll = scrollTop > topHeight;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.fixedtop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  height: 54px;
  background: #f46;
  color: #fff;
  .container{
    width: 1040px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: center;
    .s-title{
      margin-right: 20px;
      width: 150px;
      color: #fff;
      img{
        width: 100%;
      }
      &:hover{
        text-decoration: none;
      }
    }
    .s-bar{
      display: flex;
      align-items: center;
      position: relative;
      .fa-search{
        color: #000;
        position: absolute;
        font-size: 15px;
        left: 3px;
      }
      .s-in {
        font-size: 12px;
        line-height: 40px;
        padding-left: 20px;
        min-width: 350px;
        height: 38px;
        outline-style: none;
        border-top-left-radius: 2px;
        border-bottom-left-radius: 2px;
        border: 1px solid transparent;
      }
      .s-in:focus {
        transition: box-shadow 217ms ease;
      }
      .s-btn {
        color: #fff;
        background-color: #f46;
        border: 1px solid #fff;
        height: 40px;
        width: 90px;
        border-top-right-radius: 2px;
        border-bottom-right-radius: 2px;
        outline: none;
        &:hover{
          cursor: pointer;
        }
      }
    }
    .s-log {
      background: #fff;
      color: #f46;
      width: 150px;
      height: 32px;
      line-height: 32px;
      background: #fff;
      text-align: center;
      border-radius: 2px;
      display: block;
      text-decoration:none;
      margin: 11px 0 11px 30px;
    }
    a:hover {
      text-decoration: underline;
      cursor: pointer;
    }
  }
}
</style>
