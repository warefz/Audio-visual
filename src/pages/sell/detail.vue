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
               <div class="price"><span class="name">单价：</span>￥{{order.price}}</div>
               <div class="count"><span class="name">数量：</span>{{order.count}}</div>
               <div class="total"><span class="name">总金额：</span>￥{{order.count * order.price}}</div>
               <div class="express" v-if="order.is_sent != 0"><span class="name">订单号：</span>{{order.express_id}}</div>
               <div class="state">
                   <span class="name">订单状态：</span>
                   <span v-if="order.is_sent == 0">尚未处理</span>
                    <span v-if="order.is_sent == 1">等待收货</span>
                    <span v-if="order.is_sent == 2">订单完成</span>
                </div>
               <!-- <div class="op" >
                   <el-input  v-if="order.is_sent == 0" v-model="expId" placeholder="请输入快递单号" size="small"></el-input>
                   <a class="send" v-if="order.is_sent == 0" @click="send">确认发货</a>
                </div> -->
           </div>
           <div class="item">
                <div class="item-name">
                    <span class="name">商品名称：</span>
                    <el-input type="text" disabled size="small" v-model="commodity.name"></el-input>
                </div>
                <div class="item-type">
                    <span class="name">商品编号：</span>
                    <el-input type="text" disabled size="small" v-model="commodityId"></el-input>
                </div>
                <div class="item-type">
                    <span class="name">商品分类：</span>
                    <el-input type="text" disabled size="small" v-model="commodity.rootType"></el-input>
                    <el-input type="text" disabled size="small" v-model="commodity.type"></el-input>
                </div>
                <div class="item-banner">
                    <span class="name">横幅图片：</span>
                    <div class="images">
                    <img :src="commodity.bannerImg"/>
                    </div>
                </div>
                <div class="item-thumbnail">
                    <span class="name">商品缩略图：</span>
                    <div class="images">
                        <div class="tip" v-if="commodity.thumbnails.length == 0">
                        暂无缩略图信息
                        </div>
                        <div class="image" v-else v-for="(t,i) in commodity.thumbnails" :key="i">
                            <div class="source">
                                <img :src="t.src"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="item-cost">
                    <span class="name">原价：</span>
                    <el-input type="text"  disabled size="small" placeholder="请输入商品原价" v-model="commodity.costPrice"></el-input>
                </div>
                <div class="item-price">
                    <span class="name">现价：</span>
                    <el-input type="text" disabled size="small" placeholder="请输入商品售价" v-model="commodity.price"></el-input>
                </div>
                <div class="item-quantity">
                    <span class="name">数量：</span>
                    <el-input type="text" disabled size="small" placeholder="请输入商品数量" v-model="commodity.quantity"></el-input>
                </div>
                <div class="item-sell" v-if="id != ''">
                    <span class="name">销量：</span>
                    <span class="number"><span>{{commodity.sellQuantity}}</span>件</span>
                </div>
                <div class="item-attribute">
                    <span class="name">商品属性：</span>
                    <div class="list" v-if="commodity.attributeContent.length > 0">
                        <div class="sitem" v-for="d in commodity.attributeContent" :key="d.seq">
                            <div class="content-area">
                                <el-select v-model="d.name" disabled size="small" placeholder="请选择">
                                    <el-option v-for="item in commodity.attributes" :key="item.id" 
                                    :label="item.name" :value="item.name" >
                                    </el-option>
                                </el-select>
                                <el-input type="text" disabled v-model="d.content" size="small"></el-input>
                            </div>
                        </div>
                    </div>
                    <span v-if="commodity.attributeContent.length == 0" style="margin-left: 10px;">暂无</span>
                </div>
                <div class="item-intro">
                    <span class="name">商品介绍：</span>
                    <div style="width:720px;" class="ql-editor" v-html="commodity.intro"> </div>
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
import attributeApi from "@/services/attribute";
import moment from "moment";
export default {
  components,
  data() {
    return {
      id: "",
      expId: "",
      commodityId: "",
      commodity: {
        thumbnails: [],
        attributeContent: []
      },
      order: {
        count: 0,
        price: 0
      }
    };
  },
  mounted: function() {
    let vm = this;
    vm.load();
  },
  updated() {
    $(".ql-editor img").css("max-width", "100%");
  },
  methods: {
    formattime(time) {
      return moment(time).format("YYYY-MM-DD HH:mm:ss");
    },
    load() {
      let vm = this;
      if (vm.$route.query.id) {
        vm.commodityId = vm.$route.query.commodityId;
        vm.id = vm.$route.query.id;
        attributeApi.getList().then(res => {
          vm.commodity.attributes = res.data;
        });
        orderApi
          .getSoldItem({
            purchaseId: vm.id,
            commodityId: vm.commodityId
          })
          .then(res => {
            if (res.code == 0) {
              vm.order = res.data;
            } else vm.$message.error(res.errMsg);
          });
        commodityApi.getInfo({ id: vm.commodityId }).then(res => {
          if (res.code == 0) {
            let ls = res.data;
            let item = vm.commodity;
            item.intro = ls.content;
            item.name = ls.name;
            item.bannerImg = ls.bannerImg;
            item.costPrice = ls.costPrice == 0 ? "" : ls.costPrice;
            item.quantity = ls.quantity;
            item.price = ls.price;
            item.checked = ls.checked;
            item.sellQuantity = ls.sellQuantity;
            for (let i of ls.thumbnails)
              item.thumbnails.push({ src: i.thumbnail_url, seq: i.seq });
            item.attributeContent = ls.attributeContent;
            item.rootType = ls.typeRoute[0].name;
            item.type = ls.typeRoute[1].name;
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
    // send(){
    //     let vm = this;
    //     if(vm.expId.trim() == '')
    //         return  vm.$message.error('订单号不能为空')
    //     orderApi.sendCommodity({
    //         id: vm.id,
    //         commodityId: vm.commodityId,
    //         expressId: vm.expId
    //     }).then(res => {
    //         if(res.code == 0){
    //             vm.$message.success('状态更新成功')
    //             vm.load();
    //         }
    //         else
    //             vm.$message.error('状态更新失败')
    //     })
    // }
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
      .item {
        width: 850px;
        margin-bottom: 10px;
        .el-input {
          width: 200px;
          margin-right: 20px;
        }
        .name {
          margin-right: 10px;
          width: 100px;
          text-align: right;
          font-weight: 600;
        }
        .item-name {
          display: flex;
          align-items: center;
          input {
            width: 350px;
          }
        }
        .item-type {
          display: flex;
          align-items: center;
          margin: 20px 0;
        }
        .item-banner {
          display: flex;
          align-items: flex-start;
          margin: 20px 0;
          .images {
            margin-left: 5px;
            img {
              max-width: 600px;
              max-height: 300px;
            }
          }
        }
        .item-thumbnail {
          margin-top: 15px;
          display: flex;
          .images {
            margin-left: 5px;
            display: flex;
            .image {
              display: flex;
              justify-content: center;
              border-bottom: 1px solid #ebeef5;
              .source {
                text-align: center;
                width: 85px;
                padding: 0 5px;
                img {
                  width: 80px;
                  height: 80px;
                }
              }
            }
            .bt {
              width: 260px;
              color: #e6a23c;
              padding-top: 5px;
              i {
                margin-right: 5px;
              }
            }
          }
        }
        .item-cost {
          margin-top: 20px;
          display: flex;
          align-items: center;
        }
        .item-price {
          margin-top: 20px;
          display: flex;
          align-items: center;
        }
        .item-quantity {
          margin-top: 20px;
          display: flex;
          align-items: center;
        }
        .item-sell {
          margin-top: 20px;
          display: flex;
          align-items: center;
          .number {
            margin: 0 10px;
            span {
              margin-right: 5px;
            }
          }
        }
        .item-attribute {
          margin-top: 20px;
          display: flex;
          .list {
            .sitem {
              display: flex;
              margin-bottom: 10px;
              .content-area {
                display: flex;
                align-items: center;
                margin-left: 5px;
              }
            }
          }
        }
        .item-intro {
          margin: 20px 0;
          display: flex;
          .ql-editor {
            border: 1px solid #e9e9e9;
          }
        }
      }
    }
  }
}
</style>
