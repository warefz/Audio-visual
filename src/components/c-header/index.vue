<template>
    <div id="top-container" class="c-header">
      <div class="header-content">
        <div class="container">
          <div class="title">
            <a href="/">
                <img :src="['../static/icon1.png']">
            </a>
          </div>
          <div class="search">
            <div class="search-bar">
              <input class="search-in" @click="showHistory" :placeholder="searchTitle" v-model="searchContent"
                @keyup.enter="searchByName(searchContent)"/>
              <button class="search-btn" @click="searchByName(searchContent)">搜索</button>
              <div class="search-history" v-if="showSearchList && searchHistory.length > 0">
                <ul>
                  <li><span class="hit">历史搜索记录</span><a class="clear" @click="cleanSearch"><i class="fa fa-trash-o"></i>清除历史记录</a></li>
                  <li v-for="(s,i) in searchHistory" :key="i"><a class="item" @click="searchByName(s.query_str)" >{{s.query_str}}</a></li>
                </ul>
              </div>
            </div>
            <div class="search-list">
              <ul>
                <li v-for="(h,i) in hotSearch" :key="i"><a @click="searchByName(h.query_str)">{{h.query_str}}</a></li>
              </ul>
            </div>
          </div>
          <div class="user-info">
            <div class="personal info">
              <i class="fa fa-shopping-cart"></i>
              我的购物车
              <div class="count">{{cart.length}}</div>
              <div class="list">
                <div class="empty" v-if="cart.length == 0">
                  <img :src="['../static/shop.jpg']">
                  购物车中还没有商品，赶紧选购吧！
                </div>
                <div class="goods" v-else>
                  <div class="gs-content">
                    <ul>
                      <li v-for="(c,i) in cart" :key="i">
                        <a class="photo"  @click="toUrl('/detail',c.commodity_id)"><img  :src="c.thumbnail_url"/></a>
                        <div class="info">
                          <div class="it">
                            <a class="name" @click="toUrl('/detail',c.commodity_id)">{{c.name}}</a>
                            <span class="unit">￥{{c.price}}</span>
                          </div>
                          <span class="price">
                            <span>x<span class="number">{{c.count}}</span></span>
                            <a class="del" @click="deleteById(i)">删除</a>
                          </span>
                        </div>
                      </li>
                    </ul>
                    <span class="more">
                      <a @click="toUrl('/cart')">更多商品去购物车查看></a>
                    </span>
                  </div>
                  <div class="gs-count">
                    <div class="info">
                      <span class="number">
                        共<span>{{cart.length}}</span>件商品
                      </span>
                      <span class="total">
                        总价：<span>{{getTotalPrice()}}</span>元
                      </span>
                      <div class="balance"><a @click="toUrl('/cart')">去购物车</a></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="nav">
        <ul>
          <li :class="{'nav-focus':lid == 0}"><a @click="toUrl('/')" class="nav-link" >首页</a></li>
          <li  v-for="(it,idx) in navItems" :key="idx" v-if="idx < 9" :class="{'nav-focus':lid == it.id}" ><a @click="toCategory(it.id,it.name)" class="nav-link" >{{it.name}}</a></li>
        </ul>
      </div>
    </div>
</template>

<script>
import typeApi from "@/services/type";
import searchApi from "@/services/search";
import adminApi from "@/services/admin";
import purchaseApi from "@/services/purchase";
import commodityApi from "@/services/commodity";
export default {
  name: "c-header",
  ready() {},
  props: ["opCart"],
  mounted() {
    let vm = this;
    $(document).click(function() {
      vm.showSearchList = false;
    });
    vm.searchContent = vm.$route.query.queryStr;
    vm.load();
    typeApi.getRootType().then(res => {
      if (res.code == 0) vm.navItems = res.data;
      else vm.$message.error(res.errMsg);
    });
    let params = {
      page: 1,
      pageSize: 6
    };
    searchApi.getHotSearch(params).then(res => {
      if (res.code == 0) {
        vm.hotSearch = res.data;
      }
    });
  },
  watch: {
    $route: "upId",
    opCart(val) {
      let vm = this;
      vm.load();
    },
    result(val){
      this.$emit("on-cart-change",val);
    }
  },
  methods: {
    load() {
      let vm = this;
      vm.id = vm.$route.query.typeId || 0;
      let routeId = {
        id: vm.id
      };
      let path = ['/list']
      if (vm.id != 0)
        typeApi.typeRoute(routeId).then(res => {
          if (res.code == 0) {
            vm.lid = res.data[0].id;
          }
        });
      else vm.lid = 0;
      let token = localStorage.getItem(vm.config.token);
      if (token) {
        let params = { pageSize: 5 }
        purchaseApi.getPlainList(params).then(res => {
          if (res.code == 0) {
            vm.cart = [];
            for (let i of res.data) if (i.deleted == 0) vm.cart.push(i);
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
        commodityApi.getCartList({ commodities: cart }).then(res => {
          if (res.code == 0) {
            vm.cart = [];
            for (let i of res.data) if (i.deleted == 0) vm.cart.push(i);
          }
        });
      }else
        vm.cart = [];
    },
    upId() {
      let vm = this;
      vm.load();
    },
    showHistory(val) {
      let vm = this;
      if (!vm.showSearchList){
        vm.showSearchList = true;
        if(vm.changeStr)
          searchApi.getList().then(res => {
            if(res.code == 0 && res.data != '')
              vm.searchHistory = res.data;
            else
              vm.searchHistory = [];
            vm.changeStr = false;
          })
      }
      val.stopPropagation();
    },
    cleanSearch(){
      let vm = this;
        searchApi.cleanSearch().then(res => {
          if(res.code == 0)
            vm.searchHistory = [];
        })
    },
    toUrl(val, id) {
      let vm = this;
      let params = {
        path: val
      };
      if (id) params.query = { id: id };
      vm.$router.push(params);
    },
    deleteById(idx) {
      let vm = this;
      if (!vm.cart[idx].id) {
        let comms = localStorage.getItem(vm.config.cart);
        comms = JSON.parse(comms);
        for (let i in comms) {
          if (vm.cart[idx].commodity_id == comms[i].id) comms.splice(i, 1);
        }
        localStorage.setItem(vm.config.cart, JSON.stringify(comms));
        vm.load();
        vm.$message.success("删除成功");
        vm.result = !vm.result
        return;
      }
      let params = {
        id: vm.cart[idx].id,
        commodityId: vm.cart[idx].commodity_id
      };
      purchaseApi.deleteById(params).then(res => {
        if (res.code == 0) {
          vm.load();
          vm.result = !vm.result
        } else vm.$message.error("删除操作异常");
      });
    },
    getTotalPrice() {
      let vm = this;
      let total = 0;
      for (let i of vm.cart) {
        total += parseFloat(
          (parseInt(i.count) * parseFloat(i.price)).toFixed(2)
        );
      }
      return total;
    },
    searchByName(val) {
      let vm = this;
      val = val.trim();
      vm.showSearchList = false;
      
        console.log(val  + "lll   "+ vm.$route.path)
      if(vm.$route.path == '/list'){
        vm.searchContent = val;
        if (val == "") {
          if (vm.$route.query.typeId)
            vm.$router.push({ path: "/list", query: { typeId: vm.$route.query.typeId } });
          return;
        }
        if (vm.$route.query.typeId)
          vm.$router.push({
            path: "/list",
            query: { queryStr: val, typeId: vm.$route.query.typeId }
          });
        else vm.$router.push({ path: "/list", query: { queryStr: val } });
      }else{
        if (val == "")
          return vm.$router.push({ path: "/" });
        vm.searchContent = val;
        vm.$router.push({ path: "/list", query:{ queryStr: val } });
      }
      let params = {
        queryStr: val
      }
      searchApi.searchByName(params).then(res => {
        vm.changeStr = true;
      });
    },
    toCategory(id, name) {
      let vm = this;
      vm.$router.push({ path: "/list", query: { typeId: id } });
      vm.load();
    },
    handleSearch() {}
  },
  data() {
    return {
      id: "",
      lid: "",
      searchTitle: "请输入搜索内容",
      searchContent: "",
      showSearchList: false,
      hotSearch: [],
      cart: [],
      navItems: [],
      searchHistory: [],
      changeStr: true,
      result: this.opCart
    };
  },
  computed: {}
};
</script>

<style lang="scss" scoped>
@import "./style";
</style>