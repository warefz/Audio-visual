

<template>
    <div class="c-top">
        <div class="container">
            <div class="lt">
              <span class="welcome">欢迎访问音像销售平台</span>
              <div v-if="user.userId == ''">
                <a @click="toUrl('/login')">登录</a>|
                <a @click="toUrl('/register')">注册</a>
              </div>
              <div class="t-info" v-else>
                <div class="name">
                  <p class="user"><a @click="toUrl('/baseInfo')">{{user.nickName == "" ? "匿名用户":user.nickName}}</a></p>
                  <i class="fa fa-angle-down"></i>
                </div>
                <div class="line"></div>
                <div class="wrapper">
                  <div class="about">
                    <div class="hd">
                      <a class="head-img" @click="toUrl('/baseInfo')"><img :src="user.headImg == '' ? ['../static/user.png'] :user.headImg"></a>
                      <div class="info">
                        <p class="name"><span>欢迎，{{user.nickName == "" ? "":user.nickName}}访问本站</span></p>
                        <p  class="quit"><a @click="quit">退出登录</a></p>
                      </div>
                    </div>
                    <div class="list">
                      <p><a @click="toUrl('/purchased')">订单信息</a></p>
                      <p><a @click="toUrl('/baseInfo')">个人资料</a></p>
                      <p><a @click="toUrl('/cart')">购物车</a></p>
                      <p><a @click="toUrl('/collection')">我的收藏</a></p>
                      <p><a @click="toUrl('/address')">收货地址管理</a></p>
                      <p><a @click="toUrl('/history')">浏览记录</a></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="rt">
            <ul>
                <li @click="toUrl('/')">网站首页</li>
                <li @click="toUrl('/recommend')">个人中心</li>
                <li @click="toUrl('/cart')">购物车</li>
                <li @click="toUrl('/history')">我的足迹</li>
            </ul>
            </div>
        </div>
    </div>
</template>

<script>
import adminApi from "@/services/admin";
export default {
  name: "c-top",
  ready() {},
  props: ["isQuit","changeU"],
  mounted() {
    let vm = this;
    vm.load();
  },
  methods: {
      load(){
      let vm = this;
      let token = localStorage.getItem(vm.config.token);
      if(token){
        adminApi.isLogin().then(res => {
          if(res.code == 0)
            vm.user = res.data;
        })
      }
    },
    toUrl(val){
      let vm = this;
      let toLogin = ['/baseInfo','/history' ,'/address',
        '/collection' ,'/purchased','/recommend']
      if(toLogin.indexOf(val) != -1){
          if(!localStorage.getItem(vm.config.token))
             return vm.$router.push({ path: '/login',query:{redirect: val}});
      }
      vm.$router.push({path:val});
    },
    quit(){
      let vm = this;
      vm.result = !vm.result;
      localStorage.removeItem(vm.config.token);
      let list = ['/baseInfo','/address','/purchased','/resetPwd',
        '/purDetail','/collection','/history','/commodity',
        '/newProduct','/shop','/sellList','/sellDetail','/recommend']
      if(list.indexOf(vm.$route.path) != -1)
        vm.$router.push({path:'/'})
      vm.user = {
        userId:"",
        nickName:"",
        headImg:""
      }
    }
  },
  data() {
    return {
      result: this.isQuit,
      user:{
        userId:"",
        nickName:"",
        headImg:""
      }
    };
  },
  computed: {},
  watch: {
    isQuit(val){
      let vm = this;
      vm.quit();
    },
    changeU(val){
      let vm = this;
      vm.load();
    },
    result(val){
      let vm = this;
      vm.$emit("on-result-change",val);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./style";
</style>