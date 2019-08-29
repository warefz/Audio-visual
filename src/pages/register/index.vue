<template>
<div class="login-content" >
    <div class="login-header">
        <div class="container">
            <div class="title">
                <a href="/">
                    <img :src="['../static/icon1.png']">
                </a>
            </div>
            <div class="welcome" >
                欢迎注册，已有帐号?
                <a @click="toLog()">点击登录</a>
            </div>
        </div>
    </div>
    <div class="login-body" :style="'background-image:url('+[imgUrl]+')'">
        <div class="container">
            <div class="login-form">
                <div class="head">
                    <div class="login-tab ">
                        <a @click="toLog()">登录</a>
                    </div>
                    <div class="login-tab pos">
                        <a>注册</a>
                    </div>
                </div>
                <div class="body">
                    <div class="item">
                        <span class="input-label"><i class="fa fa-envelope-o fa-fw" ></i></span>
                        <input v-model="username" @focus="editEmail()" @blur="testEmail()" type="text" class="text" placeholder="请输入常用邮箱"/>
                    </div>
                    <div class="tip" v-if="tip.showUserTip"><i class="fa fa-times-circle-o fa-lg error"></i>{{tip.username}}</div>
                    <div class="item">
                        <span class="input-label"><i class="fa fa-key fa-fw"></i></span>
                        <input v-model="password" @focus="editPwd()" @blur="testPwd()" @input="testPwdStrength()" type="password" class="text" placeholder="密码"/>
                    </div>
                    <div class="tip" v-if="tip.showPwdTip"><i class="fa fa-times-circle-o fa-lg error"></i>{{tip.password}}</div>
                    <div class="strong">
                        <p :class="{gcolor:pwdLevel >= 3,ycolor:pwdLevel == 2,rcolor: pwdLevel== 1}"> </p>
                        <p :class="{gcolor:pwdLevel >= 3,ycolor:pwdLevel == 2}"> </p>
                        <p :class="{gcolor:pwdLevel >= 3}"> </p>
                        <div class="showtip">
                            检测密码强度<br>
                            当前密码强度为:{{pwdStrength}}
                        </div>
                    </div>
                    <div class="item  topz">
                        <span class="input-label"><i class="fa fa-key fa-fw"></i></span>
                        <input v-model="confpwd" type="password" class="text" placeholder="请确认密码"/>
                    </div>
                    <div class="tip" v-if="tip.showCPwdTip"><i class="fa fa-times-circle-o fa-lg error"></i>{{tip.confpwd}}</div>
                    <div class="item space">
                        <input v-model="code" type="text" @focus="editCode()" @blur="testCode()" @keypress="codeChange($event)"  class="text code" maxlength="6" placeholder="请输入验证码"/>
                        <a class="sdcode" v-if="!down" @click="getCode">获取验证码</a>
                        <span class="recode" v-if="down">重新发送({{restTime}}s)</span>
                    </div>
                    <div class="tip" v-if="tip.showCodeTip"><i class="fa fa-times-circle-o fa-lg error"></i>{{tip.code}}</div>
                    <a class="login-btn toSib" @click="register">注册</a>
                </div>
            </div>
        </div>
    </div>
    <c-footer/>
  </div>
</template>

<script>
import JSEncrypt from "jsencrypt";
import adminApi from "@/services/admin";
import * as components from "@/components";
export default {
  components,
  data() {
    return {
      restTime: 30,
      username: "",
      down: false,
      password: "",
      confpwd: "",
      code: "",
      imgUrl: "../static/timg3.jpg",
      pwdStrength: "",
      pwdLevel: 0,
      tip: {
        showUserTip: false,
        showPwdTip: false,
        showCPwdTip: false,
        showCodeTip: false,
        username: "邮箱地址格式错误",
        password: "密码格式错误",
        confpwd: "密码格式错误",
        code: "验证码应为6位数字"
      }
    };
  },
  mounted: function() {
  },
  methods: {
    editEmail() {
      let vm = this;
      vm.tip.showUserTip = false;
    },
    editCode() {
      let vm = this;
      vm.tip.showCodeTip = false;
    },
    editPwd() {
      let vm = this;
      vm.tip.showPwdTip = false;
    },
    testEmail() {
      let vm = this;
      let email = vm.username;
      let emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      vm.tip.showUserTip = false;
      vm.tip.showCodeTip = false;
      vm.tip.showPwdTip = false;
      vm.tip.showCPwdTip = false;
      if (email.length == 0) {
        vm.tip.showUserTip = true;
        vm.tip.username = "邮箱地址不能为空!";
        return -1;
      }
      if (!emailReg.test(email)) {
        vm.tip.showUserTip = true;
        vm.tip.username = "邮箱地址格式错误!";
        return -1;
      }
      return 0;
    },
    testPwd() {
      let vm = this;
      let pwd = vm.password;
      vm.tip.showUserTip = false;
      vm.tip.showCodeTip = false;
      vm.tip.showPwdTip = false;
      vm.tip.showCPwdTip = false;
      if (pwd.length == 0) {
        vm.tip.showPwdTip = true;
        vm.tip.password = "密码不能为空!";
        return;
      }
      if (pwd.length < 6 || pwd.length > 16) {
        vm.tip.showPwdTip = true;
        vm.tip.password = "密码格式错误!";
        return;
      }
    },
    testCode() {
      let vm = this;
      let code = vm.code;
      let codeReg = /^\d+$/;
      vm.tip.showUserTip = false;
      vm.tip.showCodeTip = false;
      vm.tip.showPwdTip = false;
      vm.tip.showCPwdTip = false;
      if (code.length == 0) {
        vm.tip.showCodeTip = true;
        vm.tip.code = "验证码不能为空!";
        return;
      }
      if (!codeReg.test(code) || code.length < 6) {
        vm.tip.showCodeTip = true;
        vm.tip.username = "邮箱地址格式错误!";
        return;
      }
    },
    toLog() {
      let vm = this;
      vm.$router.push({ path: "/login" });
    },
    testPwdStrength() {
      let vm = this;
      let pwd = vm.password;
      let result = 0;
      if (pwd.length <= 0) {
        vm.pwdStrength = "";
        vm.pwdLevel = 0;
        return;
      }
      for (let i = 0, len = pwd.length; i < len; ++i)
        result |= vm.charType(pwd.charCodeAt(i));

      let level = 0;

      for (let i = 0; i <= 4; i++) {
        if (result & 1) level++;
        result = result >>> 1;
      }
      switch (level) {
        case 1:
          vm.pwdLevel = level;
          vm.pwdStrength = "弱";
          break;
        case 2:
          vm.pwdLevel = level;
          vm.pwdStrength = "中";
          break;
        case 3:
        case 4:
          vm.pwdLevel = level;
          vm.pwdStrength = "强";
          break;
      }
    },
    codeChange(e){
      if(!(/^[0-9]/).test(e.key)){
        e.preventDefault();
      }
    },
    charType(num) {
      if (num >= 48 && num <= 57) return 1;
      if (num >= 97 && num <= 122) return 2;
      if (num >= 65 && num <= 90) return 4;
      return 8;
    },
    encrypt() {
      let vm = this;
      let pub = vm.config.pub;
      let jencrypt = new JSEncrypt();
      jencrypt.setPublicKey(pub);
      let encryptoPasswd = jencrypt.encrypt(vm.password);
      return encryptoPasswd;
    },
    getCode() {
      let vm = this;
      if (vm.testEmail(vm.username) != 0) return;
      let user = {
        username: vm.username,
        type: 0
      };
      adminApi.getCode(user).then(res => {
        if (res.code == 0) {
          vm.$message.success("验证码已发送");
          vm.restTime = 30;
           vm.down = true;
          vm.countDown();
        } else vm.$message.error(res.errMsg);
      });
    },
    countDown() {
      let vm = this;
      let clock;
      clock = window.setInterval(() => {
        vm.restTime--;
        if (vm.restTime < 0){
          window.clearInterval(clock);
          vm.down = false;
      }
      }, 1000);
    },
    register() {
      let vm = this;
      let pass = vm.encrypt();
      let user = {
        username: vm.username,
        password: pass,
        code: vm.code
      };
      adminApi.register(user).then(res => {
        if (res.code == 0){
          vm.$message.success("注册成功");
          vm.$router.push({path:'/login'});
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
