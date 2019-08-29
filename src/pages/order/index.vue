<template>
  <div class="wrapper">
    <div class="cart-content">
      <c-top :isQuit="quit" @on-result-change="toQuit"/>
      <c-header :opCart="isOp"  @on-cart-change="cartChange"/>
      <div class="container">
        <div class="order">
            <div class="lft" v-if="show">
                <div class="header">
                    <div class="person">
                        <div class="name">收货人:<span>{{order.receiver}}</span></div>
                        <div class="telephone">联系方式:<span>{{order.telephone}}</span></div>
                        <div class="location">地址:<span>{{order.location.replace(/\//g,' ')}}</span></div>
                        <div class="address">详细地址:<span>{{order.detailed_address}}</span></div>
                    </div>
                </div>
                <div class="list">
                    <div class="item" v-for="(item ,i ) in items" :key="i">
                        <a @click="toUrl('/detail',item.commodity_id,item.typeId)"><img :src="item.thumbnail_url"></a>
                        <div class="rt">
                            <div class="name">
                                <a @click="toUrl('/detail',item.commodity_id,item.typeId)">{{item.name}}</a>
                            </div>
                        </div>
                        <div class="aside">
                            <div class="price">
                                <div class="pre">￥{{item.cost_price}}</div>
                                <div class="now">￥{{item.price}}</div>
                            </div>
                            <div class="number">x{{item.count}}</div>
                            <div class="total">总额：￥{{Math.floor(item.count * item.price*100)/100}}</div>
                            <!-- <div class="del" v-if="order.deleted == 0 && order.state == 0"><a @click="delFromZOrder(item.id)">删除</a></div> -->
                        </div>
                    </div>
                </div>
            </div>
            <div class="rit" v-if="show">
                <div class="total">总金额:<span>￥{{getTotalPrice()}}</span></div>
                <div class="quantity">件数:<span>{{items.length}}</span></div>
                <div class="total-quantity">总数:<span>{{getTotalCount()}}</span></div>
                <div class="order-state">状态:<span>{{order.deleted == 1? '已删除':order.state == 0?'待支付':'已完成'}}</span></div>
                <div class="op" v-if="order.deleted == 0 && order.state == 0">
                    <a class="pur" @click="pay(order.id)">付款</a>
                    <a class="del" @click="delById(order.id)">删除订单</a>
                </div>
                <div class="op" v-else-if="order.deleted == 0" >
                    <a class="del" @click="delById(order.id)">删除订单</a>
                </div>
            </div>
            <div class="n-exist" v-if="items.length == 0">
                <img :src="['../static/empty.png']" />
                <div class="block">
                    <p class="title">不存在该订单信息</p>
                    <a @click="toUrl('/')">挑选商品</a>
                </div>
            </div>
        </div>
        <div class="recommend">
            <p class="title">精品推荐</p>
            <div class="content">
              <swiper :options="cartSwiper">
                  <swiper-slide v-for="(item,l) in recommends" :key="l">
                      <div class="fine">
                          <a @click="toUrl('/detail',item.id,item.typeId)"><img :src="item.thumbnail_url"/></a>
                          <div class="name"><a @click="toUrl('/detail',item.commodity_id,item.typeId)">{{item.name}}</a></div>
                          <div class="price">￥{{item.price}}</div>
                          <a class="tocart" @click="addToCart(item.id)">加入购物车</a>
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
import orderApi from "@/services/order";
export default {
  components,
  data() {
    return {
      items: [],
      recommends:[],
      id:"",
      order:{
          receiver:""
      },
      isOp: false,
      quit: false,
      show: false,
      totalQuantity: 0,
      totalPrice: 0,
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
      vm.id = vm.$route.query.oid || 0;
      if(vm.id == 0)
        return;
      let params = {
          id: vm.id
      } 
      purchaseApi.getOrder(params).then( res => {
          if(res.code == 0){
              vm.order = res.data.order;
              vm.items = res.data.data;
              vm.show = true;
          }else{
            vm.items = [];
            vm.order = {
                receiver:""
            };
            vm.show = false;
            vm.$message.error(res.errMsg)
          }
      })
    },
    toUrl(val, id, typeId) {
      let vm = this;
      let params = { 
        path: val
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
        }
        vm.load();
      });
    },
    cartChange(){
        let vm = this;
        vm.isOp = !vm.isOp;
    },
    toQuit() {
      let vm = this;
      vm.isOp = !vm.isOp;
      vm.load();
    },
    getTotalCount(){
        let vm = this;
        let total = 0;
        for(let i of vm.items){
            total += parseInt(i.count);
        }
        return total;
    },
    getTotalPrice(){
        let vm = this;
        let price = 0;
        for(let i of vm.items){
            price += parseInt(i.count)*parseFloat(i.price);
        }
        return price;
    },
    delById(id){
        let vm = this;
        vm
        .$confirm("此操作将删除该订单, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
            let params = {
                id: vm.order.id
            }
            purchaseApi.delOrderById(params).then(res => {
                if(res.code == 0){
                    vm.$message.success('订单删除成功');
                    vm.$router.replace({path:'/cart'})
                }else
                    vm.$message.error(res.errMsg);
            })
        })
        .catch(() => {
          vm.$message.info("已取消删除");
        });
    },
    pay(id){
        let vm = this;
        vm
        .$confirm(`确认付款, 是否继续?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
            let params = {
                id: vm.order.id
            }
            let loading = vm.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            purchaseApi.pay(params).then(res => {
                if(res.code == 0){
                    vm.$message.success('支付成功');
                    vm.load();
                }else
                    vm.$message.error('支付异常');
                loading.close();
            })
        })
        .catch(() => {
          vm.$message.info("已取消删除");
        });
    },
    delFromZOrder(id){
        let vm = this;
        let q = '';
        if(vm.items.length == 1)
            q = `此操作将删除该订单, 是否继续？`;
        else
            q = `此操作将从订单中删除该商品, 是否继续？`
        vm
        .$confirm(q, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
            let params = {
                id: id,
                orderId: vm.id 
            }
            orderApi.delFromZOrder(params).then(res => {
                if(res.code == 0){
                    vm.$message.success('删除操作成功');
                    if(vm.items.length == 1)
                        vm.$router.push({path:'/'})
                    else
                        vm.load();
                }else
                    vm.$message.error('删除操作异常');
            })
        })
        .catch(() => {
          vm.$message.info("已取消删除");
        });
    }
  }
};
</script>

<style scoped lang="scss">
@import "./style";
</style>
