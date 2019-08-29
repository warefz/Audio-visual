<template>
  <div class="sell-content">
    <div class="container">
        <div class="header">
            <p class="title">购买信息记录</p>
        </div>
        <div class="order">
           <div class="detail shadow1">
               <div class="time"><span class="name">时间：</span>{{formattime(order.createdAt)}}</div>
               <div class="receiver"><span class="name">收货人：</span>{{order.receiver}}</div>
               <div class="telephone"><span class="name">手机号码：</span>{{order.telephone}}</div>
               <div class="location"><span class="name">地址：</span>{{order.location}}</div>
               <div class="postalcode"><span class="name">邮编：</span>{{order.postalcode}}</div>
               <div class="address"><span class="name">详细地址：</span>{{order.detailed_address}}</div>
               <div class="count"><span class="name">数量：</span>{{order.count}}</div>
               <div class="total"><span class="name">总金额：</span>{{order.state == 0? '暂无':('￥'+order.total_price)}}</div>
               <div v-if="order.state != 0 && order.state != 3 && getRest(order.createdAt) > 0"><span class="name">订单自动完成时间：</span>{{time}}</div>
               <div class="express" v-if="order.state != 0 "><span class="name">订单号：</span>{{order.express_id?order.express_id:'暂无'}}</div>
               <div class="state">
                   <span class="name">订单状态：</span>
                   <span v-if="order.state == 0">未付款</span>
                    <span v-if="order.state == 1">待发货</span>
                    <span v-if="order.state == 2">已发货</span>
                    <span v-if="order.state == 3">已完成</span>
                    <span v-if="order.state == 4">退款中</span>
                </div>
               <div class="op" v-if="order.state == 2">
                    <a class="send" @click="beforeConfirm(1)">确认收货</a>
                </div>
           </div>
           <!-- <div class="image">
               <a @click="toUrl('/detail',order.commodity_id,order.typeId)"><img :src="order.thumbnail_url"/></a>
           </div> -->
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
    </div>
  </div>
</template>

<script>
import * as components from "@/components";
import orderApi from "@/services/order";
import commodityApi from "@/services/commodity";
import purchasedApi from "@/services/purchase";
import moment from "moment";
export default {
  components,
  data() {
    return {
      id: "",
      order: {
      },
      time: 0,
      items:[]
    };
  },
  mounted: function() {
    let vm = this;
    vm.load();
  },
  methods: {
    formattime(time) {
      return moment(time).format("YYYY-MM-DD HH:mm:ss");
    },
    load() {
      let vm = this;
      if (vm.$route.query.id) {
        vm.id = vm.$route.query.id;
        purchasedApi
          .getOrder({
            id: vm.id
          })
          .then(res => {
            if (res.code == 0) {
              vm.order = res.data.order;
              vm.items = res.data.data;
              vm.order.count = 0;
              for(let i of vm.items){
                vm.order.count += i.count
              }
              if(vm.order.state != 3 && vm.getRest(vm.order.createdAt) > 0)
                vm.startclock(vm.order.createdAt);
              else if(vm.order.state != 3){
                    vm.confirmReceive(0);
              }
            } else vm.$message.error(res.errMsg);
          });
      }
    },
    beforeConfirm(val){
        let vm = this;
        vm
        .$confirm("确认收货, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
            vm.confirmReceive(val);
        })
        .catch(() => {
          vm.$message.info("已取消删除");
        });
    },
    confirmReceive(val){
        let vm = this;
        orderApi .confirmReceive({ 
          id: vm.id
        }).then(res => {
            if (res.code == 0) {
                vm.load();
                if(val > 0)
                  vm.$message.success("确认收货操作成功");
            }else{
                if(val > 0)
                  vm.$message.error("确认收货操作失败");
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
    getFormat(time_distance) {
        let vm = this;
      if (time_distance > 0) {
        let int_day = Math.floor(time_distance / (60 * 60 * 24));
        let int_hour = Math.floor(time_distance / (60 * 60)) - int_day * 24;
        let int_minute =
          Math.floor(time_distance / 60) - int_day * 24 * 60 - int_hour * 60;
        let int_second =
          Math.floor(time_distance) -
          int_day * 24 * 60 * 60 -
          int_hour * 60 * 60 -
          int_minute * 60;
        if (int_hour < 10) int_hour = "0" + int_hour;
        if (int_minute < 10) int_minute = "0" + int_minute;
        if (int_second < 10) int_second = "0" + int_second;
        let str_time = int_day + "天" + int_hour + "小时" + 
            int_minute + "分钟" + int_second + "秒";
        vm.time = str_time;
      } else vm.time = 0;
    },
    startclock(time) {
      let vm = this;
      if(vm.getRest(time) > 0){
        let clock;
        clock = window.setInterval(() => {
            vm.getFormat(vm.getRest(time))
            if (vm.time < 0){
                window.clearInterval(clock);
                if(vm.order.purchaseState != 2){
                    vm.confirmReceive(0);
                }
            }
        }, 1000);
      }
    },
    getRest(time) {
      return (new Date(time) - new Date() + 1000 * 60 * 60 * 24 * 15) / 1000;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.sell-content {
  margin-top: 10px;
  margin-left: 20px;
  background: #fff;
  border: 1px solid #e9e9e9;
  width: 88%;
  .container {
    .header {
      border-bottom: 1px solid #e9e9e9;
      .title {
        color: #333;
        font-weight: 700;
        font-size: 20px;
        padding: 15px 20px;
      }
    }
    .order {
      margin: 10px 20px;
      position: relative;
      &:hover{
          .image{
              left: -80px;
          }
      }
      .shadow1{
        &:hover{
          box-shadow: 3px 3px 2px 1px rgba(145, 145, 145, 0.3),
                    9px 9px 2px 1px rgba(145, 145, 145, 0.2),
                    15px 15px 2px 1px rgba(145, 145, 145, 0.1);
        }
      }
      .detail {
        border: 1px solid #f1f1f1;
        margin: 0 20px 10px;
        padding: 15px 20px;
        padding-bottom: 0;
        display: flex;
        flex-wrap: wrap;
        position: relative;
        background: #fff;
        z-index: 10;
        div {
          width: 33%;
          margin-bottom: 10px;
        }
        .address {
          width: 100%;
        }
        .commname{
            width: 100%;
        }
        .name {
          font-weight: 600;
        }
        .op {
          width: 100%;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          .el-input {
            margin: 0;
          }
          .send {
            margin-left: 10px;
            padding: 6px 10px;
            color: #409eff;
            display: inline-block;
            height: 16px;
            background: #ecf5ff;
            border: 1px solid #b3d8ff;
            border-radius: 3px;
            &:hover {
              background: #409eff;
              color: #fff;
              border-color: #409eff;
            }
          }
        }
      }
      .image{
          position: absolute;
          left: 20px;
          top: 0;
          z-index: 1;
          transition: all .2s ease;
          img{
              width: 100px;
              height: 100px;
          }
      }
      .list{
          margin: 0 20px;

          .item:not(:first-child) {
            border-top: 0;
          }

          .item {
            width: 600px;
            border: 1px solid #e9e9e9;
            display: flex;
            align-items: center;
            img {
              padding: 10px 0 10px 20px;
              width: 56px;
              height: 56px;
            }

            .rt {
              padding: 10px 0;
              margin-left: 10px;
              .name {
                width: 220px;
                height: 32px;
                font-size: 12px;
                line-height: 16px;
                overflow: hidden;
              }
            }

            .aside {
              display: flex;
              .price {
                width: 60px;
                margin-left: 20px;
                margin-top: 5px;
                font-size: 16px;
                .pre {
                  text-decoration-line: line-through;
                }
                .now {

                  color: #e4393c;
                }
              }

              .number {
                width: 30px;
                align-self: center;
                padding: 10px 10px;
              }

              .total {
                width: 90px;
                padding: 10px;
                margin: 10px 0;
                border-left: 1px solid #dcdee3;
              }
              .del{
                width: 30px;
                padding: 10px;
                margin: 10px 0;
                border-left: 1px dotted #dcdee3;
              }
              .state {
                padding: 10px 15px;
                border-left: 1px solid #dcdee3;
                display: flex;
                align-items: center;

                .ot {
                  color: #fff;

                  a {
                    background-color: #e6a23c;
                    padding: 5px 8px;
                    border-radius: 3px;
                  }

                  span {
                    color: #fff;
                    background-color: #67c23a;
                    padding: 5px 8px;
                    border-radius: 3px;
                  }
                }
              }

              .evaluate {
                padding: 10px;
                border-left: 1px solid #dcdee3;

                .op {
                  margin-top: 10px;

                  a {
                    padding: 8px 10px;
                    color: #fff;
                    background: #5584ff;
                  }
                }
              }
            }
          }
      }
    }
  }
}
@keyframes hideIndex{
  0%{ opacity: 0; }
  100%{opacity: 1; }
}

</style>
