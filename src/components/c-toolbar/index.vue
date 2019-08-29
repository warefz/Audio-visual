

<template>
    <div class="c-tool-bar">  
      <ul>
        <li @click="toUrl('/recommend')"><span>个人中心</span><i class="fa fa-user-o"></i></li>
        <li @click="toUrl('/cart')"><span>购物车</span><i class="fa fa-shopping-cart"><div class="count">{{cart}}</div></i></li>
        <li @click="toUrl('/history')"><span>我的足迹</span><i class="fa fa-history"></i></li>
        <li @click="toUrl('/collection')"><span>我的关注</span><i class="fa fa-heart-o"></i></li>
        <li @click="toTop()"><span>顶部</span><i class="fa fa-angle-up" style="font-size:26px"></i></li>
      </ul>
    </div>
</template>

<script>
import purchaseApi from '@/services/purchase'
export default {
  name: "c-tool-bar",
  ready() {},
  props: ["opCart"],
  mounted() {
    let vm = this;
    vm.load();
  },
  methods: {
    load(){
      let vm = this;
      let token = localStorage.getItem(vm.config.token);
      if (token) {
        purchaseApi.getCartCount().then(res => {
          if (res.code == 0) {
            vm.cart = res.data;
          }else if(res.code == 100)
            vm.localCart();
        });
      } else vm.localCart();
    },
    localCart() {
      let vm = this;
      let cart = localStorage.getItem(vm.config.cart);
      if (cart) {
        cart = JSON.parse(cart);
        vm.cart = cart.length;
      }else
        vm.cart = 0;
    },
    toTop(){
      $('html,body').animate({scrollTop: '0px'}, 300);
    },
    toUrl(val){
      let vm = this;
      let toLogin = ['/baseInfo','/history', '/collection' ]
      if(toLogin.indexOf(val) != -1){
          if(!localStorage.getItem(vm.config.token))
             return vm.$router.push({ path: '/login',query:{redirect: val}});
      }
      vm.$router.push({path:val});
    },
  },
  data() {
    return {
      cart:0
    };
  },
  computed: {},
  watch: {
    opCart(val) {
      let vm = this;
      vm.load();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./style";
</style>