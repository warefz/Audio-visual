<template>
  <div class="own-content">
    <div class="container">
        <div class="header">
            <p class="title">个人资料</p>
        </div>
        <div class="base">
            <p class="title">基础信息</p>
            <!--<p class="username"><span>会员名</span>：fz696123123</p>-->
            <p class="mail"><span>绑定邮箱</span>：{{user.userName}} <a class="rebind" @click="rebind">修改邮箱</a></p>
        </div>
        <div class="about">
            <p class="title">相关信息</p>
            <div class="portrait">
                <span>当前头像</span>：
                <div class="image">
                    <img :src="user.headImg == '' ?['../static/user.png']:user.headImg">
                    <p class="change"><a @click="upload">上传图片</a></p>
                </div>
            </div>
            <div class="nickname"><span>昵称</span>： <input type="text" v-model="user.nickName"/></div>
            <div class="realname"><span>真实姓名</span>： <input type="text" v-model="user.realName"/></div>
            <div class="telephone"><span>联系方式</span>： <input type="text" v-model="user.telephone"/></div>
            <div class="gender"><span>性别</span>： 
                <label><input type="radio" value="1" v-model="user.gender"/>男</label>
                <label><input type="radio" value="0" v-model="user.gender"/>女</label>
            </div>
            <div class="save"><a @click="editUserInfo">保存</a></div>
        </div>
        <div class="message" v-if="showChangeMail" @click="doMessage">
            
            <div class="container">
                <p class="title">修改绑定邮箱<span class="close" @click="closeMessage"><i class="fa fa-close"></i></span></p>
                <el-steps :active="active" align-center>
                    <el-step title="步骤1"  description="确认个人信息">
                    </el-step>
                    <el-step title="步骤2" description="确认新邮箱">
                    </el-step>
                </el-steps>
                <div v-if="active == 1" class="block">
                    <div class="old"><label>邮箱地址:</label><input type="text" v-model="user.userName" disabled/></div>
                    <div class="code"><label>验证码:</label>
                      <div>
                        <input type="text" v-model="reviseCode" placeholder="请输入验证码" maxlength="6"/>
                        <a class="getcode" v-if="!revDown" @click="getCode">获取验证码</a>
                        <span class="recode" v-if="revDown">重新发送({{revRestTime}}s)</span>
                      </div>
                    </div>
                     <div class="operation"><a class="confirm" @click="confirmPerInfo">确认</a><a class="cancel" @click="closeMessage">取消</a></div>
                     
                </div>
                <div v-else class="block">
                    <div class="new"><label>新邮箱地址:</label><input type="text" placeholder="请输入新的邮箱地址"  v-model="newMail"/></div>
                    <div class="confirm"><label>确认新邮箱:</label><input type="text" placeholder="确认新邮箱地址" v-model="cfNewMail"/></div>
                    <div class="code"><label>验证码:</label>
                      <div>
                        <input type="text" v-model="changeMailCode" placeholder="请输入验证码" maxlength="6"/>
                        <a class="getcode" v-if="!newDown" @click="getNewMailCode">获取验证码</a>
                        <span class="recode" v-if="newDown">重新发送({{newRestTime}}s)</span>
                      </div>
                    </div>
                    <div class="operation"><a class="confirm" @click="editMail">确认</a><a class="cancel" @click="closeMessage">取消</a></div>
                </div>
            </div>
        </div>
    </div>
    <file-wrapper @on-file-change="imgChange" ref="fileWrap"></file-wrapper>
  </div>
</template>

<script>
import * as components from "@/components";
import fileUploader from "@/utils/fileUploader";
import config from "@/config.js";
import baseInfoApi from "@/services/baseInfo";
import adminApi from "@/services/admin";
export default {
  components,
  data() {
    return {
      user: {},
      showChangeMail: false,
      active: 1,
      reviseCode: "",
      changeMailCode: "",
      newMail: "",
      cfNewMail: "",
      revDown:false,
      revRestTime: 30,
      newDown:false,
      newRestTime:30
    };
  },
  mounted: function() {
    let vm = this;
    vm.load();
  },
  methods: {
    load() {
      let vm = this;
      baseInfoApi.getBaseInfo().then(res => {
        if (res.code == 0) vm.user = res.data;
        else vm.$message.error(res.errMsg);
      });
    },
    upload() {
      let vm = this;
      vm.$refs.fileWrap.openFinder();
    },
    getCode() {
      let vm = this;
      if(vm.user.userName == '')
        return vm.$message.error('用户邮箱不能为空');
      let data = {
        type: 2,
        username: vm.user.userName
      };
      adminApi.getReviseMailCode(data).then(res => {
        if (res.code == 0){
          vm.$message.success('验证码发送成功');
          vm.revDown = true;
          vm.revRestTime = 30;
          vm.revCountDown();
        } 
        else vm.$message.error(res.errMsg);
      });
    },
    revCountDown() {
      let vm = this;
      let clock;
      clock = window.setInterval(() => {
        vm.revRestTime--;
        if (vm.revRestTime < 0){
          window.clearInterval(clock);
          vm.revDown = false;
        }
      }, 1000);
    },
    testEmail(val){
      let vm = this;
      let email = val;
      let emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (email.length == 0) {
        return {code: -1 , errMsg: '邮箱地址不能为空'};
      }
      if (!emailReg.test(email)) {
        return {code: -1 , errMsg: '邮箱地址格式错误'};
      }
      return {code: 0};
    },
    getNewMailCode() {
      let vm = this;
      let test = vm.testEmail(vm.newMail);
      if(test.code != 0)
        return vm.$message.error(test.errMsg);
      let data = {
        type: 3,
        username: vm.newMail
      };
      adminApi.getBindMailCode(data).then(res => {
        if (res.code == 0){
          vm.$message.success('验证码发送成功');
          vm.newDown = true;
          vm.newRestTime = 30;
          vm.newCountDown();
        }else vm.$message.error(res.errMsg);
      });
    },
    newCountDown() {
      let vm = this;
      let clock;
      clock = window.setInterval(() => {
        vm.newRestTime--;
        if (vm.newRestTime < 0){
          window.clearInterval(clock);
          vm.newDown = false;
        }
      }, 1000);
    },
    imgChange(file) {
      let vm = this;
      fileUploader.normal(file).then(data => {
        if (data.code == 0) {
          vm.user.headImg = data.data;
        } else vm.$message.error(data.errMsg);
      });
    },
    editMail() {
      let vm = this;
      if (vm.newMail == "") return vm.$message.error("邮箱地址不能为空");
      if (vm.newMail != vm.cfNewMail)
        return vm.$message.error("两次邮箱输入不一致");
      if (vm.code == "") return vm.$message.error("验证码不能为空");
      let data = {
        code: vm.changeMailCode,
        username: vm.newMail,
        odUserName: vm.user.userName,
        odCode: vm.reviseCode
      };
      adminApi.editMail(data).then(res => {
        if (res.code == 0) {
          let token = localStorage.getItem(config.token);
          if (token) {
            adminApi.logOut({ token: token }).then(res =>{
              localStorage.removeItem(config.token);
              vm.$message.success("修改绑定邮箱成功")
              vm.$router.push({path:"/login"})
            });
          }
        } else vm.$message.error(res.errMsg);
      });
    },
    editUserInfo() {
      let vm = this;
      let data = {
        nickName: vm.user.nickName,
        gender: vm.user.gender,
        headImg: vm.user.headImg,
        telephone: vm.user.telephone,
        userId: vm.user.userId,
        realName: vm.user.realName
      };
      baseInfoApi.editInfo(data).then(res => {
        if (res.code == 0) {
          vm.$message.success('信息修改成功');
          vm.$router.push({path:'/baseInfo'});
          vm.load();
          vm.$emit('success',false);
        } else vm.$message.error(res.errMsg);
      });
    },
    testCode(tcode){
      let vm = this;
      let code = tcode;
      let codeReg = /^\d+$/;
      if (code.length == 0) 
        return {code: -1 ,errMsg:'验证码不能为空'};
      if (!codeReg.test(code) || code.length < 6) 
        return {code: -1 ,errMsg: '验证码格式错误'};
      return {code: 0};
    },
    confirmPerInfo() {
      let vm = this;
      let test = vm.testCode(vm.reviseCode);
      if(test.code != 0)
        return vm.$message.error(test.errMsg);
      let data = {
        code: vm.reviseCode,
        username: vm.user.userName
      };
      adminApi.reviseMail(data).then(res => {
        if (res.code == 0){
          vm.active += 1;
          vm.revRestTime = 0;
          vm.revDown = false;
        }
        else vm.$message.error(res.errMsg);
      });
    },
    rebind() {
      let vm = this;
      vm.showChangeMail = true;
    },
    doMessage(val) {
      let vm = this;
      if (val.target.className == "message") vm.showChangeMail = false;
    },
    closeMessage() {
      let vm = this;
      vm.showChangeMail = !vm.showChangeMail;
      vm.reviseCode = "";
      vm.revDown = false;
      vm.revRestTime = 0;
      vm.newMail = "";
      vm.cfNewMail = "";
      vm.newDown = false;
      vm.newRestTime = 0;
      vm.changeMailCode = "";
      vm.active = 1;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.message {
  position: fixed;
  top: 0;
  height: 100%;
  left: 0;
  right: 0;
  padding: 5px 10px;
  background: rgba(9, 9, 9, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  .container {
    background: #fff;
    left: 50%;
    top: 50%;
    padding: 15px 50px;
    border-radius: 4px;
    label {
      width: 75px;
      text-align: right;
      display: block;
      margin-right: 5px;
      &:before {
        margin-right: 4px;
        content: "*";
        color: #ff3000;
      }
    }
    .close {
      position: absolute;
      right: -30px;
      top: -10px;
      font-size: 18px;
      &:hover {
        cursor: pointer;
      }
    }
    .title {
      color: #000;
      font-size: 18px;
      font-weight: 600;
      margin: 10px 0;
      position: relative;
      text-align: center;
    }
    .block {
      margin-top: 15px;
    }
    .old {
      display: flex;
      align-items: center;
      margin-bottom: 5px;
      input{
        padding: 8px 10px;
      }
    }
    .code {
      display: flex;
      align-items: center;
      justify-content: space-between;
      input {
        width: 80px;
        padding: 8px 10px;
      }
      a {
        padding: 8px 10px;
        background: #5584ff;
        color: #fff;
        border-radius: 3px;
        margin-left: 15px;
      }
    }
    .recode{
      font-weight: 400;
      border-radius: 3px;
      line-height: 18px;
      height: 18px;
      padding: 8px 10px;
      text-align: center;
      color: #909399;
      background: #f4f4f5;
      border: 1px solid #d3d4d6;
    }
    .new {
      display: flex;
      align-items: center;
      margin-bottom: 5px;
      input{
        padding: 8px 10px;
      }
    }
    div.confirm {
      display: flex;
      align-items: center;
      margin-bottom: 5px;
      input{
        padding: 8px 10px;
      }
    }
    .operation {
      display: flex;
      justify-content: center;
      margin: 10px 0;
      a {
        padding: 8px 15px;
      }
      .confirm {
        background: #5584ff;
        color: #fff;
        border-radius: 3px;
        margin-right: 20px;
      }
      .cancel {
        border: 1px solid #e9e9e9;
        border-radius: 3px;
      }
    }
  }
  input {
    padding: 5px 10px;
    width: 180px;
    margin: 5px;
    margin-right: 0;
    border-radius: 3px;
    border: 1px solid #e9e9e9;
  }
}
.own-content {
  background: #fff;
  border: 1px solid #e9e9e9;
  margin-left: 20px;
  margin-top: 10px;
  width: 88%;
  .container {
    .header {
      border-bottom: 1px solid #e9e9e9;
      .title {
        color: #666;
        font-weight: 700;
        font-size: 16px;
        padding: 10px 20px;
      }
    }
    .base {
      border-bottom: 1px solid #e9e9e9;
      color: #000;
      margin: 0 10px;
      padding: 10px 10px;
      p {
        display: flex;
        span {
          display: block;
        }
        span:first-child {
          width: 50px;
        }
      }
      .title {
        font-weight: 700;
        padding-bottom: 10px;
      }
      .username {
        padding-left: 10px;
        line-height: 22px;
      }
      .mail {
        padding-left: 10px;
        line-height: 22px;
        a {
          padding-left: 10px;
          color: #36c;
          &:hover {
            color: #e4393c;
          }
        }
      }
    }
    .about {
      color: #000;
      margin: 0 10px;
      padding: 10px 10px;
      color: #000;
      span {
        display: block;
        width: 50px;
      }
      div {
        display: flex;
      }
      input {
        padding: 5px;
        border: 1px solid #cecece;
      }
      .title {
        font-weight: 700;
        padding-bottom: 10px;
      }
      .portrait {
        padding-left: 10px;
        padding-bottom: 8px;
        .image {
          position: relative;
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          overflow: hidden;
          &:hover .change {
            display: block;
          }
          img {
            width: 100%;
          }
          .change {
            color: #fff;
            position: absolute;
            width: 100%;
            text-align: center;
            background: rgba(0, 0, 0, 0.7);
            bottom: 0;
            left: 0;
            height: 21px;
            line-height: 21px;
            display: none;
            a:hover {
              text-decoration: underline;
            }
          }
        }
      }
      .nickname {
        padding-left: 10px;
        align-items: center;
        padding-bottom: 8px;
      }
      .realname {
        padding-left: 10px;
        align-items: center;
        padding-bottom: 8px;
      }
      .telephone {
        padding-left: 10px;
        align-items: center;
        padding-bottom: 8px;
      }
      .gender {
        padding-left: 10px;
        align-items: center;
        padding-bottom: 8px;
        label {
          display: flex;
          align-items: center;
          margin-right: 10px;
        }
      }
      .save {
        margin-top: 10px;
        margin-left: 76px;
        a {
          color: #fff;
          background: #e4393c;
          padding: 8px 14px;
          border-radius: 3px;
        }
      }
    }
  }
}
</style>
