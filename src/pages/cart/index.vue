<template>
  <div class="wrapper">
    <div class="cart-content">
      <c-top/>
      <c-header :opCart="isOp" @on-cart-change="cartChange"/>
      <div class="container">
        <div v-if="items.length != 0 || losItems.length != 0 ">
            <div class="head">
                <span>全部商品{{items.length}}</span>
                <div class="address">
                    <label>收货地址：</label>
                    <select v-model="address" v-if="addresses.length > 0" style="max-width:200px">
                        <option :value="t.id" v-for="(t,d) in addresses" :key="d">{{t.location.replace(/\//g,' ') + ' ' + t.detailAddress}}</option>
                    </select>
                    <a class="add" @click="toUrl('/address')">点击添加收货地址</a>
                </div>
            </div>
            <div class="cart">
                <div class="header">
                    <div class="c-sel">
                        <input v-model="allSelected" type="checkbox" @click="selAll()"/>
                        <span>全选</span>
                    </div>
                    <div class="c-goods">
                        <span>商品</span>
                    </div>
                    <div class="c-price">
                        <span>单价</span>
                    </div>
                    <div class="c-quantity">
                        <span>数量</span>
                    </div>
                    <div class="c-sum">
                        <span>小计</span>
                    </div>
                    <div class="c-operation">
                        <span>操作</span>
                    </div>
                </div>
                <div class="body">
                    <div class="item" v-for="(item,i) in items" :key="i">
                        <input @click="changeCheck(i)" type="checkbox" v-model="item.selected"/>
                        <div class="info">
                            <a  class="img" @click="toUrl('/detail',item.commodity_id,item.typeId)"><img :src="item.thumbnail_url"/></a>
                            <div class="content">
                                <p class="title"><a @click="toUrl('/detail',item.commodity_id,item.typeId)">{{item.name}}</a></p>
                                <div class="about" v-html="dealContent(item.content)"></div>
                            </div>
                        </div>
                        <div class="price">
                            ￥<span>{{item.price}}</span>
                        </div>
                        <div class="quantity">
                            <span :class="{minus:1,disable:item.count <= 1}" @click="doOp(i,-1)">-</span>
                            <input v-model="item.count" autocomplete="off" type="text" minnum="1" @change="testSum(i)" @focus="saveSum(i)" @blur="editSum(i)">
                            <span :class="{add:1,disable:item.count >= item.quantity}" @click="doOp(i,1)">+</span>
                        </div>
                        <div class="sum">
                            ￥<div>{{Math.floor(item.price*item.count*100)/100}}</div>
                        </div>
                        <div class="operation">
                            <a @click="deleteById(i)">删除</a>
                        </div>
                    </div>
                    <div v-if="losItems.length > 0" >
                      <div class="item los" v-for="(item,k) in losItems" :key="k">
                          <input type="checkbox" v-model="item.selected" disabled/>
                          <div class="info">
                              <img :src="item.thumbnail_url"/>
                              <div class="content">
                                  <p class="title">{{item.name}}</p>
                                  <div class="about" v-html="dealContent(item.content)"></div>
                              </div>
                          </div>
                          <div class="price">
                              ￥<span>{{item.price}}</span>
                          </div>
                          <div class="quantity">
                              <span class="minus disable ">-</span>
                              <input  disabled v-model="item.count" autocomplete="off" type="text"  minnum="1">
                              <span class="add disable " >+</span>
                          </div>
                          <div class="sum">
                              ￥<div>{{Math.floor(item.price*item.count*100)/100}}</div>
                          </div>
                          <div class="operation">
                              <a @click="deleteLosById(k)">删除</a>
                          </div>
                      </div>
                    </div>
                </div>
                <div class="footer">
                    <div class="lt">
                        <div class="f-sel">
                            <input v-model="allSelected" type="checkbox" @click="selAll()"/>
                            <span>全选</span>
                        </div>
                        <a class="f-del" @click="deleteList">删除选中的商品</a>
                        <a class="f-clean" @click="clean">清理购物车</a>
                    </div>
                    <div class="rt">
                        <p class="total-quantity">已选择<span>{{getTotalQuantity()}}</span>件商品</p>
                        <p class="total-price">总价：<span>￥{{getTotalPrice()}}</span></p>
                        <a class="deal" @click="makeDeal">去结算</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="n-exist" v-else>
            <div class="img"><img :src="['../static/shop.jpg']"/></div>
            <div class="block">
                <p class="title">您的购物车中暂无商品信息</p>
                <a @click="toUrl('/')">挑选商品</a>
            </div>
        </div>
        <div class="recommend">
            <p class="title">精品推荐</p>
            <div class="content">
              <swiper :options="cartSwiper">
                  <swiper-slide v-for="(item,l) in recommends" :key="l">
                      <div class="fine">
                          <a @click="toUrl('/detail',item.id,item.typeId)"><img :src="item.thumbnail_url"/></a>
                          <div class="name">{{item.name}}</div>
                          <div class="price">￥{{item.price}}</div>
                          <a class="tocart" v-if="!item.isSelf" @click="addToCart(item.id)">加入购物车</a>
                          <a class="tocart" v-else @click="toUrl('/newProduct',item.id)">查看商品详情</a>
                      </div>
                  </swiper-slide>
                  <div class="swap swiper-button-prev" slot="button-prev"><i class="fa fa-angle-left"></i></div>
                  <div class="swap swiper-button-next" slot="button-next"><i class="fa fa-angle-right"></i></div>
              </swiper>
            </div>
        </div>
      </div>
      <c-tool-bar :opCart="isOp"/>
    </div>
    <footer style="border-top: 1px solid #e9e9e9;background:#fff;margin-top:20px;min-width:1040px;">
        <c-footer ></c-footer>
    </footer>
  </div>
</template>

<script>
import * as components from "@/components";
import purchaseApi from "@/services/purchase";
import addressApi from "@/services/address";
import adminApi from "@/services/admin";
import commodityApi from "@/services/commodity";
export default {
  components,
  data() {
    return {
      items: [],
      losItems: [],
      addresses: [],
      address: "",
      sels: [],
      isOp: false,
      totalQuantity: 0,
      totalPrice: 0,
      allSelected: false,
      lastModSum: 0,
      recommends: [],
      cartSwiper: {
        slidesPerView: 4,
        slidesPerGroup: 4,
        loop: true,
        loopFillGroupWithBlank: true,
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        }
      }
    };
  },
  mounted: function() {
    let vm = this;
    vm.load();

    commodityApi.getSomeRecommend({ pageSize: 12 }).then(res => {
      if (res.code == 0) vm.recommends = res.data;
      else vm.$message.error("商品信息查询失败");
    });
  },
  methods: {
    load() {
      let vm = this;
      let token = localStorage.getItem(vm.config.token);
      if (token) {
        adminApi.isLogin().then(res => {
          if (res.code == 0) {
            purchaseApi.getList().then(res => {
              if (res.code == 0) {
                vm.sels = [];
                vm.items = [];
                vm.losItems = [];
                for (let i of res.data) {
                  if (i.deleted == 0) {
                    i.selected = true;
                    i.clickable = true;
                    vm.sels.push(i);
                    vm.items.push(i);
                  } else vm.losItems.push(i);
                }
                vm.allSelected = true;
              }
            });
            addressApi.getList().then(res => {
              if (res.code == 0) {
                vm.addresses = res.data;
                if (vm.addresses.length > 0) vm.address = vm.addresses[0].id;
              }
            });
          } else if (res.code == 100) vm.localToCart();
        });
      } else {
        vm.localToCart();
      }
    },
    localToCart() {
      let vm = this;
      let cart = localStorage.getItem(vm.config.cart);
      if (cart) {
        cart = JSON.parse(cart);
        commodityApi.getCartList({ commodities: cart }).then(res => {
          if (res.code == 0) {
            vm.sels = [];
            vm.items = [];
            for (let i of res.data) {
              i.selected = true;
              vm.sels.push(i);
              vm.items.push(i);
            }
            vm.allSelected = true;
          }
        });
      }
    },
    cartChange(){
      let vm = this;
      vm.isOp = !vm.isOp;
    },
    addToCart(id) {
      let vm = this;
      let params = {
        id: id,
        count: 1
      };
      purchaseApi.addToCart(params).then(res => {
        if (res.code == 0) {
          vm.$message.success("商品加入购物车成功");
          vm.isOp = !vm.isOp;
        } else {
          let cart = localStorage.getItem(vm.config.cart);
          if (cart) {
            cart = JSON.parse(cart);
            let flag = false;
            for (let i of cart) {
              if (i.id == id) {
                i.count += 1;
                flag = true;
              }
            }
            if (!flag)
              cart.splice(0, 0, {
                id: id,
                count: 1
              });
            if (cart.length > 5) cart.slice(5);
            localStorage.setItem(vm.config.cart, JSON.stringify(cart));
          } else {
            let item = [
              {
                id: id,
                count: 1
              }
            ];
            localStorage.setItem(vm.config.cart, JSON.stringify(item));
          }
          vm.$message.success("商品加入购物车成功");
          vm.isOp = !vm.isOp;
        }
        vm.load();
      });
    },
    toUrl(val, id, typeId) {
      let vm = this;
      let params = { 
        path: val
      }
      let toLogin = ['/address']
      if(toLogin.indexOf(val) != -1){
          if(!localStorage.getItem(vm.config.token))
             return vm.$router.push({ path: '/login',query: { redirect: '/cart' }});
      }
      if (id) 
        params.query = {id: id}
      if (typeId)
        if('query' in params)
          params.query.typeId = typeId
        else
          params.query = {typeId: typeId}
      vm.$router.push(params);
    },
    clean() {
      let vm = this;
      if (vm.losItems.length == 0) return;
      purchaseApi.clean().then(res => {
        if (res.code == 0) {
          vm.load();
          vm.isOp = !vm.isOp;
          vm.$message.success("清理操作成功");
        } else vm.$message.error("清理操作失败");
      });
    },
    edit(item) {
      let vm = this;
      let params = {
        count: item.count,
        commodityId: item.commodity_id
      };
      purchaseApi.edit(params).then(res => {
        if (res.code == 0) {
          vm.load();
          vm.isOp = !vm.isOp;
        } else vm.$message.error("编辑操纵失败");
      });
    },
    dealContent(val) {
      let p = /<[^>]*>|<\/[^>]*>/gm;
      let v = val.replace(p, "");
      v = v.replace(/&nbsp;/g, "");
      return v;
    },
    doOp(idx, op) {
      let vm = this;
      if (!vm.items[idx].id) {
        if (vm.items[idx].count > 1 && op < 0) {
          vm.items[idx].count = vm.items[idx].count - 1;
          return;
        }
        if (op > 0 && vm.items[idx].count < vm.items[idx].quantity) {
          vm.items[idx].count = vm.items[idx].count + 1;
          return;
        }
      }
      if (!vm.items[idx].clickable) return;
      if (vm.items[idx].count > 1 && op < 0) {
        vm.items[idx].count = vm.items[idx].count - 1;
        vm.items[idx].clickable = false;
        vm.edit(vm.items[idx]);
        return;
      }
      if (op > 0 && vm.items[idx].count < vm.items[idx].quantity) {
        vm.items[idx].count = vm.items[idx].count + 1;
        vm.items[idx].clickable = false;
        vm.edit(vm.items[idx]);
        return;
      }
    },
    getIndex(val) {
      let vm = this;
      for (let i in vm.sels) if (vm.sels[i].id == val.id) return i;
      return -1;
    },
    deleteLosById(k) {
      let vm = this;

      vm
        .$confirm("此操作将从购物车删除该商品, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          let params = {
            id: vm.losItems[idx].id,
            commodityId: vm.losItems[idx].commodity_id
          };
          purchaseApi.deleteById(params).then(res => {
            if (res.code == 0) {
              vm.$message.success("删除成功");
              vm.load();
              vm.isOp = !vm.isOp;
            } else vm.$message.error("删除操作异常");
          });
        })
        .catch(() => {
          vm.$message.info("已取消删除");
        });
    },
    deleteById(idx) {
      let vm = this;

      vm
        .$confirm("此操作将从购物车删除该商品, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          if (!vm.items[idx].id) {
            let cart = localStorage.getItem(vm.config.cart);
            cart = JSON.parse(cart);
            for (let i in cart) {
              if (vm.items[idx].commodity_id == cart[i].id) cart.splice(i, 1);
            }
            localStorage.setItem(vm.config.cart, JSON.stringify(cart));
            vm.load();
            vm.isOp = !vm.isOp;
            vm.$message.success("删除成功");
            return;
          }
          let params = {
            id: vm.items[idx].id,
            commodityId: vm.items[idx].commodity_id
          };
          purchaseApi.deleteById(params).then(res => {
            if (res.code == 0) {
              vm.$message.success("删除成功");
              vm.load();
              vm.isOp = !vm.isOp;
            } else vm.$message.error("删除操作异常");
          });
        })
        .catch(() => {
          vm.$message.info("已取消删除");
        });
    },
    deleteList() {
      let vm = this;
      vm
        .$confirm("此操作将删除选中所有商品, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          if (vm.sels.length == 0) return;
          if (!vm.sels[0].id) {
            let cart = localStorage.getItem(vm.config.cart);
            cart = JSON.parse(cart);
            for (let i of vm.sels) {
              for (let j in cart) {
                if (i.commodity_id == cart[j].id) {
                  cart.splice(j, 1);
                  break;
                }
              }
            }
            localStorage.setItem(vm.config.cart, JSON.stringify(cart));
            vm.load();
            vm.isOp = !vm.isOp;
            vm.$message.success("删除成功");
            return;
          }
          let params = {
            commodities: vm.sels
          };
          purchaseApi.deleteSelected(params).then(res => {
            if (res.code == 0) {
              vm.$message.success("删除成功");
              vm.load();
              vm.isOp = !vm.isOp;
            } else vm.$message.error("删除操作异常");
          });
        })
        .catch(() => {
          vm.$message.info("已取消删除");
        });
    },
    testSum(idx) {
      let vm = this;
      let numReg = /^\+?[1-9][0-9]*$/;
      if (!numReg.test(vm.items[idx].count))
        vm.items[idx].count = vm.lastModSum;
      vm.items[idx].count = parseInt(vm.items[idx].count);
    },
    editSum(idx) {
      let vm = this;
      if (!vm.items[idx].id) {
        vm.items[idx].count =
          vm.items[idx].count > vm.items[idx].quantity
            ? vm.items[idx].quantity
            : vm.items[idx].count;
        return;
      }
      vm.edit(vm.items[idx]);
    },
    saveSum(idx) {
      let vm = this;
      vm.lastModSum = vm.items[idx].count;
    },
    selAll() {
      let vm = this;
      let flag = true;
      if (vm.sels.length == vm.items.length) flag = false;
      for (let i of vm.items) {
        if (flag && vm.getIndex(i)) vm.sels.push(i);
        i.selected = flag;
      }
      if (!flag) vm.sels.splice(0, vm.sels.length);
    },
    changeCheck(idx) {
      let vm = this;
      if (vm.items[idx].selected) {
        let index = vm.getIndex(vm.items[idx]);
        if (index > -1) vm.sels.splice(index, 1);
      } else vm.sels.push(vm.items[idx]);
      if (
        (vm.sels.length != vm.items.length && vm.allSelected) ||
        (vm.sels.length == vm.items.length && !vm.allSelected)
      )
        vm.allSelected = !vm.allSelected;
    },
    getTotalPrice() {
      let vm = this;
      let totalPrice = 0;
      for (let i of vm.sels) totalPrice += i.count * i.price;
      return totalPrice;
    },
    getTotalQuantity() {
      let vm = this;
      let total = 0;
      for (let i of vm.sels) total += parseInt(i.count);
      return total;
    },
    makeDeal() {
      let vm = this;
      if (vm.sels.length == 0) return vm.$message.error("请选择商品");
      if (vm.address == "") return vm.$message.error("请选择收货地址");
      let params = {
        commodities: vm.sels,
        addressId: vm.address
      };
      let loading = vm.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      purchaseApi.makeDeal(params).then(res => {
        if (res.code == 0) {
          vm.$router.push({ path: "/order", query: { oid: res.data.id } });
          vm.$message.success("订单创建成功");
        } else vm.$message.error("结算操作异常");
        loading.close();
      });
    }
  }
};
</script>

<style scoped lang="scss">
@import "./style";
</style>
