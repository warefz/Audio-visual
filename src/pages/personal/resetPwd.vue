<template>
  <div class="own-content">
    <div class="container">
        <div class="header">
            <p class="title">修改密码</p>
        </div>
        <div class="base">
            <p class="title">基础信息</p>
            <!--<p class="username"><span>会员名</span>：fz696123123</p>-->
            <p class="mail"><span>绑定邮箱</span>：{{user.userName}}</p>
        </div>
        <div class="about">
            <div class="password"><span>密码： </span>
                <el-input type="password" placeholder="请输入密码" size="small" v-model="password"></el-input>
            </div>
            <div class="password"><span>确认密码： </span>
                <el-input type="password" size="small" placeholder="请再次输入密码" v-model="cfpassword"></el-input>
            </div>
            <div class="code"><span>验证码： </span>
                <el-input type="text" size="small" placeholder="请输入验证码" maxlength="6" v-model="code">
                </el-input>
                <a v-if="!newDown" @click="getResetCode">获取验证码</a><span class="recode" v-if="newDown">重新发送({{newRestTime}}s)</span>
            </div>
            <div class="save">
                <a @click="editPassword">确认</a>
                <a class="cancel" @click="cancel">取消</a>
            </div>
        </div>
    </div>
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
      password: "",
      cfpassword: "",
      code: "",
      newDown: false,
      newRestTime: 30
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
    getResetCode() {
      let vm = this;
      if (vm.user.userName == "") return vm.$message.error("用户邮箱不能为空");
      let data = {
        type: 1,
        username: vm.user.userName
      };
      adminApi.getCode(data).then(res => {
        if (res.code == 0) {
          vm.$message.success("验证码发送成功");
          vm.newDown = true;
          vm.newRestTime = 30;
          vm.resetCountDown();
        } else vm.$message.error(res.errMsg);
      });
    },
    resetCountDown() {
      let vm = this;
      let clock;
      clock = window.setInterval(() => {
        vm.newRestTime--;
        if (vm.newRestTime < 0) {
          window.clearInterval(clock);
          vm.newDown = false;
        }
      }, 1000);
    },
    testCode(tcode) {
      let vm = this;
      let code = tcode;
      let codeReg = /^\d+$/;
      if (code.length == 0) return { code: -1, errMsg: "验证码不能为空" };
      if (!codeReg.test(code) || code.length < 6)
        return { code: -1, errMsg: "验证码格式错误" };
      return { code: 0 };
    },
    encrypt() {
      let vm = this;
      let pub = vm.config.pub;
      let jencrypt = new JSEncrypt(); // 实例化加密对象
      jencrypt.setPublicKey(pub);
      let encryptoPasswd = jencrypt.encrypt(vm.password); // 加密明文
      return encryptoPasswd;
    },
    editPassword() {
      let vm = this;
      let code = vm.testCode(vm.code);
      if (code.code != 0) return vm.$message.error(code.errMsg);
      if (vm.password != vm.cfpassword)
        return vm.$message.error("两次密码输入不一致");
      if (vm.password == "" || vm.cfpassword == "")
        return vm.$message.error("密码不能为空");
      if (vm.password.length < 6)
        return vm.$message.error("密码长度必须大于6字符");
      vm
        .$confirm("是否确认修改密码?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          let params = {
            id: vm.user.userId,
            username: vm.user.userName,
            password: vm.encrypt(),
            code: vm.code
          };
          adminApi.editPassword(params).then(res => {
            if (res.code == 0) {
              vm.$message.success("密码修改成功，请重新登录");
              localStorage.removeItem(vm.config.token);
              vm.$router.push({ path: "/login" });
            } else vm.$message.error(res.errMsg);
          });
        })
        .catch(() => {
          vm.$message.info("已取消删除");
        });
    },
    cancel() {
      let vm = this;
      vm.$router.go(-1);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.el-input {
  width: 200px;
  input {
    width: 100%;
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
        width: 70px;
        text-align: right;
      }
      .password {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
      }
      .code {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
        a {
          margin-left: 10px;
          border-radius: 3px;
          background: rgb(65, 103, 179);
          color: #fff;
          padding: 8px 10px;
        }
        .recode {
          width: 90px;
          margin-left: 10px;
          font-weight: 400;
          border-radius: 3px;
          line-height: 18px;
          height: 18px;
          padding: 6px 10px;
          text-align: center;
          color: #909399;
          background: #f4f4f5;
          border: 1px solid #d3d4d6;
        }
      }
      .save {
        margin-top: 30px;
        margin-left: 70px;
        display: flex;
        a {
          color: #fff;
          background: #e4393c;
          padding: 6px 16px;
          border-radius: 3px;
        }
        .cancel {
          margin-left: 10px;
          padding: 6px 16px;
          border-radius: 3px;
          border: 1px solid #dcdfe6;
          border-color: #dcdfe6;
          background: #fff;
          color: #606266;
        }
      }
    }
  }
}
</style>
