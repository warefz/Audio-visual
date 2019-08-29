<template>
  <div class="sell-content">
    <div class="container">
        <div class="header">
            <p class="title">销售信息</p>
        </div>
        <div class="order">
           <div class="detail">
               <div class="time"><span class="name">时间：</span>{{formattime(order.createdAt)}}</div>
               <div class="receiver"><span class="name">收货人：</span>{{order.receiver}}</div>
               <div class="telephone"><span class="name">手机号码：</span>{{order.telephone}}</div>
               <div class="location"><span class="name">地址：</span>{{order.location}}</div>
               <div class="postalcode"><span class="name">邮编：</span>{{order.postalcode}}</div>
               <div class="address"><span class="name">详细地址：</span>{{order.detailed_address}}</div>
               <div class="total"><span class="name">总金额：</span>￥{{order.total_price}}</div>
               <div class="express" ><span class="name">单号：</span>{{order.id}}</div>
               <div class="express" v-if="order.state != 1"><span class="name">订单号：</span>{{order.express_id}}</div>
               <div class="state">
                   <span class="name">订单状态：</span>
                   <span v-if="order.state == 1">尚未处理</span>
                    <span v-if="order.state == 2">等待收货</span>
                    <span v-if="order.state == 3">订单完成</span>
                    <span v-if="order.state == 4">退款中</span>
                </div>
               <div class="op" >
                   <el-input  v-if="order.state == 1" v-model="expId" placeholder="请输入快递单号" size="small"></el-input>
                   <a class="send" v-if="order.state == 1" @click="send">确认发货</a>
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
    </div>
  </div>
</template>

<script>
import * as components from "@/components";
import orderApi from "@/services/order";
import commodityApi from "@/services/commodity";
import purchaseApi from "@/services/purchase";
import moment from "moment";
export default {
  components,
  data() {
    return {
      id: "",
      expId: "",
      orderId: "",
      order: {
        count: 0,
        price: 0
      },
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
        vm.orderId = vm.$route.query.id;
        orderApi
          .getOrder({
            id: vm.orderId
          })
          .then(res => {
            if (res.code == 0) {
              vm.order = res.data.order;
              vm.items = res.data.data;
            } else vm.$message.error(res.errMsg);
          });
      }
    },
    toUrl(val, id) {
      let vm = this;
      let params = {
        path: val
      };
      if (id) params.query = { id: id };
      vm.$router.push(params);
    },
    send(){
        let vm = this;
        if(vm.expId.trim() == '')
            return  vm.$message.error('订单号不能为空')
        orderApi.sendOrder({
            orderId: vm.orderId,
            expressId: vm.expId
        }).then(res => {
            if(res.code == 0){
                vm.$message.success('状态更新成功')
                vm.load();
            }
            else
                vm.$message.error('状态更新失败')
        })
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
      .detail {
        border: 1px solid #ddd;
        margin: 0 20px 10px;
        padding: 15px 20px;
        padding-bottom: 0;
        display: flex;
        flex-wrap: wrap;
        div {
          width: 33%;
          margin-bottom: 10px;
        }
        .address {
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
            .el-input{
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
      // .item {
      //   width: 850px;
      //   margin-bottom: 10px;
      //   .el-input {
      //     width: 200px;
      //     margin-right: 20px;
      //   }
      //   .name {
      //     margin-right: 10px;
      //     width: 100px;
      //     text-align: right;
      //     font-weight: 600;
      //   }
      //   .item-name {
      //     display: flex;
      //     align-items: center;
      //     input {
      //       width: 350px;
      //     }
      //   }
      //   .item-type {
      //     display: flex;
      //     align-items: center;
      //     margin: 20px 0;
      //   }
      //   .item-banner {
      //     display: flex;
      //     align-items: flex-start;
      //     margin: 20px 0;
      //     .images {
      //       margin-left: 5px;
      //       img {
      //         max-width: 600px;
      //         max-height: 300px;
      //       }
      //     }
      //   }
      //   .item-thumbnail {
      //     margin-top: 15px;
      //     display: flex;
      //     .images {
      //       margin-left: 5px;
      //       display: flex;
      //       .image {
      //         display: flex;
      //         justify-content: center;
      //         border-bottom: 1px solid #ebeef5;
      //         .source {
      //           text-align: center;
      //           width: 85px;
      //           padding: 0 5px;
      //           img {
      //             width: 80px;
      //             height: 80px;
      //           }
      //         }
      //       }
      //       .bt {
      //         width: 260px;
      //         color: #e6a23c;
      //         padding-top: 5px;
      //         i {
      //           margin-right: 5px;
      //         }
      //       }
      //     }
      //   }
      //   .item-cost {
      //     margin-top: 20px;
      //     display: flex;
      //     align-items: center;
      //   }
      //   .item-price {
      //     margin-top: 20px;
      //     display: flex;
      //     align-items: center;
      //   }
      //   .item-quantity {
      //     margin-top: 20px;
      //     display: flex;
      //     align-items: center;
      //   }
      //   .item-sell {
      //     margin-top: 20px;
      //     display: flex;
      //     align-items: center;
      //     .number {
      //       margin: 0 10px;
      //       span {
      //         margin-right: 5px;
      //       }
      //     }
      //   }
      //   .item-attribute {
      //     margin-top: 20px;
      //     display: flex;
      //     .list {
      //       .sitem {
      //         display: flex;
      //         margin-bottom: 10px;
      //         .content-area {
      //           display: flex;
      //           align-items: center;
      //           margin-left: 5px;
      //         }
      //       }
      //     }
      //   }
      //   .item-intro {
      //     margin: 20px 0;
      //     display: flex;
      //     .ql-editor {
      //       border: 1px solid #e9e9e9;
      //     }
      //   }
      // }
    }
  }
}
</style>
