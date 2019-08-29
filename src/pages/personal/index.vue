<template>
    <div class="wrapper">
        <div class="personal-content">
            <div class="top-head">
                <div class="container">
                    <c-top :isQuit="quit" :changeU="changeU" @on-result-change="toQuit"/>
                </div>
            </div>
            <div class="top">
                <div class="hl">
                    <div class="s-title">
                        <a class="icon" @click="toUrl('/')"><img :src="['../static/nicon.png']"></a>
                        <a class="home" @click="toUrl('/recommend')">主页</a>
                        <div class="settings"><span>设置<i class="fa fa-angle-down"></i></span>
                            <div class="content">
                                <div class="safe">
                                    <p class="title">安全设置</p>
                                    <a @click="toUrl('/resetPwd')">修改登录密码</a>
                                    <a @click="toUrl('/baseInfo')">修改绑定邮箱</a>
                                </div>
                                <div class="personal">
                                    <p class="title">个人资料</p>
                                    <a @click="toUrl('/baseInfo')">修改头像</a>
                                    <a @click="toUrl('/address')">修改收货地址</a>
                                </div>
                            </div>
                        </div>
                        <a class="cart" @click="toUrl('/cart')">购物车</a>
                    </div>
                    <div class="s-bar">
                        <input class="s-in" :placeholder="searchTitle" v-model="searchContent"/>
                        <button class="s-btn" @click="searchByName()">搜索</button>
                    </div>
                </div>
            </div>
            <div class="container">
                <div class="aside">
                    <div class="portrait"><img :src="user.headImg ? user.headImg:['../static/user.png']"/></div>
                    <div class="list">
                        <p class="manage" >账号管理</p>
                        <a :class="{personal:1,nowTab:pageN == '/baseInfo'}"
                        @click="toUrl('/baseInfo')">个人资料</a>
                        <a :class="{address: 1,nowTab:pageN == '/address'}"
                        @click="toUrl('/address')">收货地址</a>
                        <a :class="{purchased: 1,nowTab:pageN == '/purchased'}" @click="toUrl('/purchased')">我的订单</a>
                        <a :class="{browse: 1,nowTab:pageN == '/history'}" @click="toUrl('/history')">我的足迹</a>
                        <a :class="{collection: 1,nowTab:pageN == '/collection'}" @click="toUrl('/collection')">收藏的商品</a>
                        <a :class="{commodity: 1,nowTab:pageN == '/shop'}" @click="toUrl('/shop')">我的店铺</a>
                    </div>
                </div>
                <router-view v-on:success="success" />
            </div>
        </div>
        <footer style="background:#fff;border-top: 1px solid #e9e9e9;margin-top:20px;min-width:1040px">
            <c-footer ></c-footer>
        </footer>
    </div>
</template>

<script>
import * as components from '@/components'
import baseInfoApi from "@/services/baseInfo";
export default {
  components,
  data () {
    return {
        searchTitle:"",
        searchContent:"",
        pageN: this.$route.path,
        user:{},
        quit:false,
        changeU:false
    }
  },
  mounted:function(){
      let vm = this;
      vm.load();
  },
  watch: {
  },
  methods:{
    toQuit() {
      let vm = this;
      vm.load();
    },
    success(){
        let vm = this;
        vm.load();
        vm.changeU = !vm.changeU;
    },
    load(){
      let vm = this;
      baseInfoApi.getSomeInfo().then( res => {
          if(res.code == 0)
            vm.user = res.data;
      })
    },
    toUrl(val){
        let vm = this;
        vm.$router.push({path:val});
        vm.pageN = val;
    },
    searchByName() {
      let vm = this;
      let val = vm.searchContent;
      val = val.trim();
      if (val == "") {
        return;
      }
      vm.$router.push({ path: "/list", query: { queryStr: val } });
      let params = {
        queryStr: val
      }
      searchApi.searchByName(params);
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.personal-content{
    width: 100%;
    .top-head{
        background: #f0f0f0;
        font-size: 12px;
        ul{
            list-style-type: none;
            li{
                float: left;
                padding: 0 5px;
                &:hover{
                    cursor: pointer;
                    color: #e4393c;
                }
            }
            li:last-child{
                padding-right: 0;
            }
        }
        .container{
            align-items: center;
            height: 30px;
            width: 1040px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            a{
                padding: 0 5px;
                &:hover{
                    cursor: pointer;
                    color: #e4393c;
                }
            }
            .welcome{
                opacity: .8;
            }
        }
    }
    .top {
        width: 100%;
        color: #000;
        background: #e4393c;
        .hl{
            background: #e4393c;
            padding: 10px 0;
            width: 1040px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            align-items: center;
            .s-title{
                display: flex;
                align-items: center;
                margin-right: 20px;
                color: #fff;
                font-size: 14px;
                img{
                    width: 150px;
                }
                a{
                    margin: 0 20px;
                }
                .icon{
                    margin:0;
                }
                .settings{
                    position: relative;
                    padding: 10px 0;
                    span{
                        cursor: pointer;
                    }
                    i{
                        margin-left: 5px;
                        transform-origin:center center;
                        transition: transform .2s;
                    }
                    .content{
                        z-index: 10;
                        display: none;
                        position: absolute;
                        left: -130px;
                        top: 100%;
                        padding: 20px 20px;
                        width: 250px;
                        height: 90px;
                        background: #fff;
                        box-shadow: 0 1px 2px #ddd;
                        justify-content: space-around;
                        a{
                            margin: 0;
                            &:hover{
                                cursor: pointer;
                                color: #e4393c;
                            }
                        }
                        .safe{
                            text-align: center;
                            display: flex;
                            flex-direction: column;
                            color: #000;
                            .title{
                                font-size: 16px;
                                color: #3aac8a;
                                padding-bottom: 8px;
                            }
                            a{
                                height: 32px;
                                font-size: 13px;
                                font-weight: 400;
                                line-height: 32px;
                            }
                        }
                        .personal{
                            display: flex;
                            text-align: center;
                            flex-direction: column;
                            color: #000;
                            .title{
                                font-size: 16px;
                                color: #ea746b;
                                padding-bottom: 8px;
                            }
                            a{
                                height: 32px;
                                font-size: 13px;
                                font-weight: 400;
                                line-height: 32px;
                            }
                        }
                        &:before{
                            content:" ";
                            position: absolute;
                            width: 10px;
                            transform: rotate(-45deg);
                            height: 10px;
                            left: 50%;
                            top: -5px;
                            background: #fff;
                        }
                    }
                    &:hover{
                        .content{
                            display: flex;
                        }
                        i{
                            transform: rotate(180deg);
                        }
                    }
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
                    border: 1px solid #fff;
                }
                .s-in:focus {
                    transition: box-shadow 217ms ease;
                }
                .s-btn {
                    color: #fff;
                    background-color: #e4393c;
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
                cursor: pointer;
            }
        }
    }
    .container{
        width: 1040px;
        margin:0 auto;
        display: flex;
        .aside{
            width: 12%;
            background: #fff;
            border: 1px solid #e9e9e9;
            .portrait{
                padding: 0 10px;
                margin-top: 10px;
                width: 105px;
                height: 105px;
                display: flex;
                align-items: center;
                text-align: center;
                overflow: hidden;
                img{
                    width: 100%;
                }
            }
            .list{
                display: flex;
                flex-direction: column;
                color: #000;
                .manage{
                    padding: 0 10px;
                    color: #e4393c;
                    font-size: 15px;
                    font-weight: 600;
                    line-height: 28px;
                    margin: 5px 10px 1px 0;
                }
                a{
                    padding: 0 10px;
                    line-height: 28px;
                    color: #000;
                    height: 28px;
                    &:hover{
                        background: #e9e9e9;
                    }
                }
                .nowTab{
                    color: #e4393c;
                }
            }
        }
    }
}
</style>
