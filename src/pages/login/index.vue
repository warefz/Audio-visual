<template>
<div class="login-content" >
    <div class="login-header">
        <div class="container">
            <div class="title">
                <a href="/">
                    <img :src="['../static/icon1.png']">
                </a>
            </div>
            <div class="welcome">
                欢迎登录，没有帐号?
                <a @click="toReg()">点击注册</a>
            </div>
        </div>
    </div>
    <div class="login-body" :style="'background-image:url('+[imgUrl]+')'">
        <div class="container">
            <div class="login-form">
                <div class="head">
                    <div class="login-tab pos">
                        <a>登录</a>
                    </div>
                    <div class="login-tab ">
                        <a @click="toReg()">注册</a>
                    </div>
                </div>
                <div class="body">
                    <div class="item">
                        <span class="input-label"><i class="fa fa-user-o fa-fw"></i></span>
                        <input id="loginname" v-model="username" @input="changeUser()" type="text" class="text" placeholder="用户名/邮箱"/>
                        <span class="close-label" v-if="showClose"><i @click="clearUser()" ><img :src="['../static/close.png']"></i></span>
                    </div>
                    <div class="item">
                        <span class="input-label"><i class="fa fa-key fa-fw"></i></span>
                        <input id="loginpwd" v-model="password" type="password" @keyup.enter="login" class="text" placeholder="密码"/>
                    </div>
                    <a class="forpwd" @click="toUrl('/reset')">忘记密码</a>
                    <a class="login-btn" @click="login">登录</a>
                </div>
            </div>
        </div>
    </div>
    <footer style="margin-top:20px;">
        <c-footer></c-footer>
    </footer>
  </div>
</template>

<script>
import adminApi from "@/services/admin";
import purchaseApi from "@/services/purchase";
import JSEncrypt from "jsencrypt";
import * as components from "@/components";
export default {
  components,
  data() {
    return {
      username: "",
      password: "",
      showClose: false,
      imgUrl: "../static/timg3.jpg"
    };
  },
  mounted: function() {
  },
  beforeRouteEnter(to,from,next){
    let token = localStorage.getItem('ASIONX_asd_OYGQLMBADSAD9adA');
    if(token)
        adminApi.isLogin().then(res => {
            if(res.code == 0){
                next({path: '/'})
            }else
                next();
        })
    else
        next();
  },
  methods: {
    toUrl(val){
        let vm = this;
        vm.$router.push({path: val});
    },
    toReg() {
      let vm = this;
      vm.$router.push({ path: "/register" });
    },
    changeUser() {
      let vm = this;
      if (vm.username.length > 0) vm.showClose = true;
      else vm.showClose = false;
    },
    clearUser() {
      let vm = this;
      vm.username = "";
      vm.showClose = false;
    },
    encrypt() {
      let vm = this;
      let pub = vm.config.pub;
      let jencrypt = new JSEncrypt(); // 实例化加密对象
      jencrypt.setPublicKey(pub);
      let encryptoPasswd = jencrypt.encrypt(vm.password); // 加密明文
      return encryptoPasswd;
    },
    login() {
      let vm = this;
      if(vm.username.length == 0 || vm.password == 0)
        return vm.$message.error("用户名/密码不能为空")
      let pass = vm.encrypt();
      let user = {
        username: vm.username,
        password: pass
      };
      adminApi.login(user).then(res => {
        if (res.code == 0){
          localStorage.setItem(vm.config.token, res.data.token);
          let cart = localStorage.getItem(vm.config.cart);
            if(cart){
                cart = JSON.parse(cart);
                let userId = res.data.userId
                for(let i of cart){
                    i.userId = userId;
                }
                purchaseApi.addToCartList({commodities: cart}).then(res => {
                    localStorage.removeItem(vm.config.cart);
                    
                    if(vm.$route.query.redirect){
                        vm.$router.replace({path:vm.$route.query.redirect});
                    }
                    else
                        vm.$router.replace({path:'/'});
                });
            }else{
                if(vm.$route.query.redirect){
                    vm.$router.replace({path:vm.$route.query.redirect});
                }
                else
                    vm.$router.replace({path:'/'});
            }
        }
        else vm.$message.error(res.errMsg);
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "./style";
</style>
