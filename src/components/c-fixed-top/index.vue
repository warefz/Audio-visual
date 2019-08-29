<template>
    <div class="c-fixed-top" v-if="isScroll">
        <div class="fixedtop" >
            <div class="container">
                <a class="s-title" @click="toUrl('/')"><img :src="['../static/nicon.png']"></a>
                <div class="s-bar">
                  <input class="s-in" :placeholder="searchTitle" v-model="searchContent" @click="showHistory"/>
                  <button class="s-btn" @click="handleSearch()">搜索</button>
                  <div class="s-history" v-if="showFixedSearch && (searchHistory.length > 0)">
                    <ul>
                      <li><span class="hit">历史搜索记录</span><a class="clear" @click="cleanSearch"><i class="fa fa-trash-o"></i>清除历史记录</a></li>
                      <li v-for="(s,i) in searchHistory" :key="i"><a class="item" @click="searchByName(s.query_str)">{{s.query_str}}</a></li>
                    </ul>
                  </div>
                </div>
                <a class="s-log" v-if="!user.userId" @click="toUrl('/login')">登录/注册</a>
                <div v-else class="s-wel">
                  <div class="img"><a> <img :src="user.headImg == '' ? ['../static/user.png'] :user.headImg" /></a></div>
                  <div class="fill"></div>
                  <div class="about" >
                    <!--<img  class="bck" :src="['../static/bck.png']"/>-->
                    <div class="hd">
                      <a class="head-img" @click="toUrl('/baseInfo')"><img :src="user.headImg == '' ? ['../static/user.png'] :user.headImg"></a>
                      <div class="info">
                        <p class="name"><span>欢迎，{{user.nickName == "" ? "":user.nickName}}访问本站</span></p>
                        <p  class="quit"><a @click="quit">退出登录</a></p>
                      </div>
                    </div>
                    <div class="list">
                      <p><a @click="toUrl('/purchased')">订单信息</a></p>
                      <p><a @click="toUrl('/baseInfo')">个人中心</a></p>
                      <p><a @click="toUrl('/cart')">购物车</a></p>
                      <p><a @click="toUrl('/collection')">我的收藏</a></p>
                      <p><a @click="toUrl('/address')">收货地址管理</a></p>
                      <p><a @click="toUrl('/history')">浏览记录</a></p>
                    </div>
                  </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import adminApi from '@/services/admin'
import searchApi from '@/services/search'
export default {
  name: "c-fixed-top",
  ready() {},
  props: ["isQuit"],
  data () {
    return {
      isScroll:false,
      searchTitle:"",
      searchContent:"",
      showFixedSearch:false,
      searchHistory: [],
      user:{}
    }
  },
  watch: {
      result(val){
        this.$emit("on-result-change",val);
      }
  },
  mounted:function(){
    let vm = this;
    window.addEventListener('scroll', vm.handleScroll);
    $(document).click(function() {
      vm.showFixedSearch = false;
    });
    let token = localStorage.getItem(vm.config.token);
    if(token){
      adminApi.isLogin().then(res => {
        if(res.code == 0){
          vm.user = res.data;
          searchApi.getList().then(res => {
            if(res.code == 0 && res.data != '')
              vm.searchHistory = res.data;
            else
              vm.searchHistory = [];
            vm.changeStr = false;
          })
        }
      })
    }
  },
  methods:{
    showHistory(val){
      let vm = this;
      if (!vm.showFixedSearch) vm.showFixedSearch = true;
      val.stopPropagation();
    },
    quit(){
      let vm = this;
      vm.result = !vm.result;
      localStorage.removeItem(vm.config.token)
      vm.user = {}
      vm.searchHistory = []
    },
    cleanSearch(){
      let vm = this;
        searchApi.cleanSearch().then(res => {
          if(res.code == 0)
            vm.searchHistory = [];
        })
    },
    handleScroll() {
      let vm = this;
      if($("#top-container").length == 0 )
        return;
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      let topHeight = document.getElementById("top-container").offsetHeight;
      vm.isScroll = scrollTop > topHeight;
    },
    searchByName(val) {
      let vm = this;
      val = val.trim();
      vm.showSearchList = false;
      if (val == "") {
        if (vm.$route.query.id)
          vm.$router.push({ path: "/list", query: { id: vm.$route.query.id } });
        else vm.$router.push({ path: "/" });
        return;
      }
      vm.searchContent = val;
      if (vm.$route.query.id)
        vm.$router.push({
          path: "/list",
          query: { queryStr: val, id: vm.$route.query.id }
        });
      else vm.$router.push({ path: "/list", query: { queryStr: val } });
      let params = {
        queryStr: val
      }
      searchApi.searchByName(params).then(res => {
        vm.changeStr = true;
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "./style";
</style>
