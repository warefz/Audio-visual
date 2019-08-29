<template>
  <div class="sell-content">
    <div class="container">
        <div class="header">
            <p class="title">销售信息</p>
        </div>
        <div class="user">
          <div class="user-info">
            <div class="image"><img :src="user.head_img_url ? user.head_img_url:['../static/user.png']"></div>
            <div class="base">{{user.nick_name ? user.nick_name:'匿名用户'}}</div>
            <div class="shop">店铺名：{{user.name}}</div>
            <div class="count">已售出商品：{{user.count}}件</div>
            <div class="money">销售额：<span>{{'￥' + user.money}}</span></div>
          </div>
          <div class="sell-info">
            <div class="sold"><a @click="toolChange(0)">销售概览</a></div>
            <div class="detail"><a @click="toolChange(2)">订单概览</a></div>
            <div class="detail"><a @click="toolChange(1)">销售详情</a></div>
            <div class="detail"><a @click="toUrl('/commodity')">我的商品</a></div>
          </div>
        </div>
        <div id="detail0" class="preview">
          <div class="show">
              <div class="title">销售概览</div>
              <a class="record ds" @click="showChange(0)">默认</a>
              <a class="record" @click="showChange(1)">分类</a>
              <div class="line"></div>
            <a class="toLeft toExcel" @click="exportSoldCdn(0)">导出销售概览</a>
            <a class="toExcel" @click="exportSoldCdn(1)">导出销售明细</a>
          </div>
          <div id="myChart" style="width:850px;height:300px;margin:10px 20px"></div>
        </div>
        <div id="detail2">
          <div class="ods">
            <div class="title">订单概览</div>
            <a class="normal ds" @click="orderChange(0)">全部信息</a>
            <a class="normal" @click="orderChange(1)">待处理</a>
            <a class="normal" @click="orderChange(2)">已发货</a>
            <a class="normal" @click="orderChange(3)">已完成</a>
            <a class="normal" @click="orderChange(4)">退货中</a>
            <div class="line"></div>
          </div>
          <div class="order">
            <div class="item">
                <el-table :data="orderItems" style="width: 100%" >
                  <el-table-column type="expand">
                    <template slot-scope="scope">
                      <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="收货人：">
                          <span>{{ scope.row.receiver }}</span>
                        </el-form-item>
                        <el-form-item label="收货地址：">
                          <span>{{ scope.row.location }}</span>
                        </el-form-item>
                        <el-form-item label="详细地址：">
                          <span>{{ scope.row.detailed_address }}</span>
                        </el-form-item>
                        <el-form-item label="邮编：">
                          <span>{{ scope.row.postalcode }}</span>
                        </el-form-item>
                        <el-form-item label="联系方式：">
                          <span>{{ scope.row.telephone }}</span>
                        </el-form-item>
                        <el-form-item label="时间：">
                          <span>{{ formattime(scope.row.createdAt) }}</span>
                        </el-form-item>
                      </el-form>
                    </template>
                  </el-table-column>
                      <el-table-column  label="序号" align="center">
                          <template slot-scope="scope">
                              <span >{{scope.$index + 1 + orderPageSize * (orderCurrentPage - 1)}}</span>
                          </template>
                      </el-table-column>
                      <el-table-column prop="order_id" label="订单号" align="center"></el-table-column>
                      <el-table-column prop="location" label="订单地址" align="center" width="150"></el-table-column>
                      <el-table-column prop="detailed_address" label="详细地址" align="center" width="220"></el-table-column>
                      <el-table-column label="总金额" align="center">
                          <template slot-scope="scope">
                              <span class="total-price">￥{{scope.row.total}}</span>
                          </template>
                      </el-table-column>
                      <el-table-column  label="状态" align="center" width="70">
                          <template slot-scope="scope">
                              <span v-if="scope.row.state == 1">待处理</span>
                              <span v-if="scope.row.state == 2">已发货</span>
                              <span v-if="scope.row.state == 3">已完成</span>
                              <span v-if="scope.row.state == 4">退货中</span>
                          </template>
                      </el-table-column>
                      <el-table-column  label="操作" width="100" align="center">
                          <template slot-scope="scope">
                              <el-button size="small" @click="orderInfo(scope.row.order_id)">查看详情</el-button>
                          </template>
                      </el-table-column>
                  </el-table>
            </div>
          </div>
          <div class="pagn">
            <el-pagination 
              @current-change="handleOrderCurrentChange"
              :current-page.sync="orderCurrentPage"
              :page-size="orderPageSize"
              background
              layout="total, prev, pager, next"
              :total="orderTotalCount">
            </el-pagination>
          </div>
        </div>
        <div id="detail1">
          <div class="ods">
            <div class="title">销售概览</div>
            <a class="normal ds" @click="typeChange(0)">全部信息</a>
            <a class="normal" @click="typeChange(1)">待处理</a>
            <a class="normal" @click="typeChange(2)">已发货</a>
            <a class="normal" @click="typeChange(3)">已收货</a>
            <div class="line"></div>
          </div>
          <div class="order">
            <div class="item">
                <el-table :data="items" style="width: 100%" >
                  <el-table-column type="expand">
                    <template slot-scope="scope">
                      <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="收货人：">
                          <span>{{ scope.row.receiver }}</span>
                        </el-form-item>
                        <el-form-item label="收货地址：">
                          <span>{{ scope.row.location }}</span>
                        </el-form-item>
                        <el-form-item label="详细地址：">
                          <span>{{ scope.row.detailed_address }}</span>
                        </el-form-item>
                        <el-form-item label="邮编：">
                          <span>{{ scope.row.postalcode }}</span>
                        </el-form-item>
                        <el-form-item label="联系方式：">
                          <span>{{ scope.row.telephone }}</span>
                        </el-form-item>
                        <el-form-item label="时间：">
                          <span>{{ formattime(scope.row.createdAt) }}</span>
                        </el-form-item>
                      </el-form>
                    </template>
                  </el-table-column>
                      <el-table-column  label="序号" align="center">
                          <template slot-scope="scope">
                              <span >{{scope.$index + 1 + pageSize * (currentPage - 1)}}</span>
                          </template>
                      </el-table-column>
                      <el-table-column prop="order_id" label="订单号" align="center"></el-table-column>
                      <el-table-column  label="商品图片" width="90" align="center">
                          <template slot-scope="scope">
                              <a><img :src="scope.row.thumbnail_url"/></a>
                          </template>
                      </el-table-column>
                      <el-table-column prop="commodity_id" label="商品编号" align="center"></el-table-column>
                      <el-table-column prop="name" label="商品名称" align="center" width="120"></el-table-column>
                      <el-table-column prop="count" label="购买数量" align="center"></el-table-column>
                      <el-table-column label="总金额" align="center">
                          <template slot-scope="scope">
                              <span class="total-price">￥{{scope.row.count * scope.row.price}}</span>
                          </template>
                      </el-table-column>
                      <el-table-column  label="状态" align="center" width="70">
                          <template slot-scope="scope">
                              <span v-if="scope.row.is_sent == 0">未处理</span>
                              <span v-if="scope.row.is_sent == 1">待收货</span>
                              <span v-if="scope.row.is_sent == 2">已收货</span>
                          </template>
                      </el-table-column>
                      <el-table-column  label="操作" width="100" align="center">
                          <template slot-scope="scope">
                              <el-button size="small" @click="detailInfo(scope.row.id,scope.row.commodity_id)">查看详情</el-button>
                          </template>
                      </el-table-column>
                  </el-table>
            </div>
          </div>
          <div class="pagn">
            <el-pagination 
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage"
              :page-size="pageSize"
              background
              layout="total, prev, pager, next"
              :total="totalCount">
            </el-pagination>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import * as components from "@/components";
import orderApi from "@/services/order";
import purchaseApi from "@/services/purchase";
import shopApi from "@/services/shop"
import exportexcel from '@/utils/exportexcel'
import moment from "moment";
export default {
  components,
  data() {
    return {
      user: {
        count: 0,
        money: 0
      },
      orderItems:[],
      items: [],
      type: 0,
      toolType: 0,
      show: 0,
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      orderTotalCount: 0,
      orderType: 0,
      orderCurrentPage: 1,
      orderPageSize: 10,
      orderList: [],
      sellData: [],
      date: [],
      money: [],
      count: [],
      typeName: []
    };
  },
  mounted: function() {
    let vm = this;
    $("#detail1 .ods .normal").hover(
      function() {
        let index = $("#detail1 .ods .normal").index(this);
        $("#detail1 .ods .line").css("left", 90 + index * 70 + "px");
      },
      function() {
        $("#detail1 .ods .line").css("left", 90 + vm.type * 70 + "px");
      }
    );
    $("#detail2 .ods .normal").hover(
      function() {
        let index = $("#detail2 .ods .normal").index(this);
        $("#detail2 .ods .line").css("left", 90 + index * 70 + "px");
      },
      function() {
        $("#detail2 .ods .line").css("left", 90 + vm.orderType * 70 + "px");
      }
    );
    $(".show .record").hover(
      function() {
        let index = $(".show .record").index(this);
        $(".show .line").css("left", 90 + index * 70 + "px");
      },
      function() {
        $(".show .line").css("left", 90 + vm.show * 70 + "px");
      }
    );
    vm.drawLine();
    vm.load();
    purchaseApi.getSellerInfo().then(res => {
      if (res.code == 0) vm.user = res.data[0];
      else vm.$message.error(res.errMsg);
    });
  },
  methods: {
    exportSoldCdn(type){
      let vm = this;
      if(type == 0){
        let header=["店铺编号","商品编号","商品名称","销售数量","销售总金额"]
        let filterVal=["id","commodityId", "name","count", "total"]
        shopApi.getSoldList().then(res =>{
          if(res.code == 0){
            let data=JSON.parse(JSON.stringify(res.data))
            exportexcel.exportTable(data,header,filterVal,"销售情况表");
          }else{
            vm.$message.error('信息查询失败')
          }
        });
      }else if(type == 1){
        let header=["店铺编号","商品编号","商品名称","销售数量","售价","订单号","购买时间"]
        let filterVal=["id","commodityId", "name","count", "price","orderId","createdAt"]
        shopApi.getPurchasedList().then(res =>{
          if(res.code == 0){
            let data=JSON.parse(JSON.stringify(res.data))
            for(let i of data){
              i.createdAt = vm.formattime(i.createdAt)
            }
            exportexcel.exportTable(data,header,filterVal,"销售明细表");
          }else{
            vm.$message.error('信息查询失败')
          }
        });
      }
    },
    formattime(time) {
      return moment(time).format("YYYY-MM-DD HH:mm:ss");
    },
    load(val) {
      let vm = this;
      vm.getSoldList(val);
      vm.getOrderList(val);
    },
    getSoldList(val){
      let vm = this;
      if (!val) val = vm.currentPage;
      let params = {
        page: val,
        pageSize: vm.pageSize
      };
      if (vm.type != 0) params.isSent = vm.type - 1;
      orderApi.getSoldList(params).then(res => {
        if (res.code == 0) {
          vm.items = [];
          vm.items = res.data.data;
          vm.totalCount = res.data.total;
        } else {
          vm.$message.error("销售信息加载失败");
        }
      });
    },
    getOrderList(val){
      let vm = this;
      if (!val) val = vm.orderCurrentPage;
      let params = {
        page: val,
        pageSize: vm.orderPageSize
      };
      if (vm.orderType != 0) params.isComp = vm.orderType;
      orderApi.getOrderList(params).then(res => {
        if (res.code == 0) {
          vm.orderItems = [];
          vm.orderItems = res.data.data;
          vm.orderTotalCount = res.data.total;
        } else {
          vm.$message.error("订单信息加载失败");
        }
      });
    },
    toolChange(val) {
      let vm = this;
      $("html, body").animate(
        { scrollTop: $("#detail" + val).offset().top },
        200
      );
    },
    handleOrderCurrentChange(val) {
      let vm = this;
      vm.getOrderList(val);
    },
    handleCurrentChange(val) {
      let vm = this;
      vm.getSoldList(val);
    },
    orderChange(val) {
      let vm = this;
      $("#detail2 .ods .line").css("left", 90 + val * 70 + "px");
      $("#detail2 .ods .normal").removeClass("ds");
      $("#detail2 .ods .normal")
        .eq(val)
        .addClass("ds");
      vm.orderType = val;
      vm.orderCurrentPage = 1;
      vm.getOrderList();
    },
    typeChange(val) {
      let vm = this;
      $("#detail1 .ods .line").css("left", 90 + val * 70 + "px");
      $("#detail1 .ods .normal").removeClass("ds");
      $("#detail1 .ods .normal")
        .eq(val)
        .addClass("ds");
      vm.type = val;
      vm.currentPage = 1;
      vm.getSoldList();
    },
    showChange(val) {
      let vm = this;
      $(".show .line").css("left", 90 + val * 70 + "px");
      $(".show .record").removeClass("ds");
      $(".show .record")
        .eq(val)
        .addClass("ds");
      vm.show = val;
      if (val == 0) vm.drawLine();
      if (val == 1) vm.drawPie();
    },
    toUrl(val, id, typeId) {
      let vm = this;
      let params = {
        path: val
      };
      if (id) params.query = { id: id };
      if (typeId)
        if ("query" in params) params.query.typeId = typeId;
        else params.query = { typeId: typeId };
      vm.$router.push(params);
    },
    detailInfo(id, commodityId) {
      let vm = this;
      let routeData = this.$router.resolve({
        path: "/sellDetail",
        query: { id: id, commodityId: commodityId }
      });
      window.open(routeData.href, '_blank');
    },
    orderInfo(id) {
      let vm = this;
      let routeData = this.$router.resolve({
        path: "/sellOrderDetail",
        query: { id: id}
      });
      window.open(routeData.href, '_blank');
    },
    drawPie() {
      let vm = this;
      let myChart = echarts.init(document.getElementById("myChart"));

      purchaseApi.getUserSoldListByType().then(res => {
        if (res.code == 0) {
          vm.sellData = res.data;
          vm.date = [];
          vm.count = [];
          vm.money = [];
          vm.typeName = [];
          let maxCount = 0;
          let maxMoney = 0;
          for (let i of vm.sellData) {
            vm.date.push(i.y + "年" + i.m + "月");
            vm.count.push(parseInt(i.count));
            vm.money.push({ value: i.money, name: i.name });
            vm.typeName.push(i.name);
            maxCount =
              maxCount > parseInt(i.count) ? maxCount : parseInt(i.count);
            maxMoney = maxMoney > i.money ? maxMoney : i.money;
          }
          myChart.clear();
          myChart.setOption({
            title: {
              text: "分类销售情况",
              subtext: "销售额(元)",
              x: "center"
            },
            tooltip: {
              trigger: "item",
              formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
              orient: "vertical",
              left: "left",
              data: vm.typeName
            },
            series: [
              {
                name: "访问来源",
                type: "pie",
                radius: "55%",
                center: ["50%", "60%"],
                data: vm.money,
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)"
                  }
                }
              }
            ]
          });
        }
      });
    },
    drawLine() {
      let vm = this;
      let myChart = echarts.init(document.getElementById("myChart"));

      purchaseApi.getUserSoldList().then(res => {
        if (res.code == 0) {
          vm.sellData = res.data;
          vm.date = [];
          vm.count = [];
          vm.money = [];
          let maxCount = 0;
          let maxMoney = 0;
          for (let i of vm.sellData) {
            vm.date.push(i.y + "年" + i.m + "月");
            vm.count.push(parseInt(i.count));
            vm.money.push(i.money);
            maxCount =
              maxCount > parseInt(i.count) ? maxCount : parseInt(i.count);
            maxMoney = maxMoney > i.money ? maxMoney : i.money;
          }
          myChart.clear();
          myChart.setOption({
            title: {
              text: "商品销售情况",
              subtext: "近8个月"
            },
            tooltip: {
              trigger: "axis",
              axisPointer: {
                type: "cross",
                crossStyle: {
                  color: "#999"
                }
              }
            },
            toolbox: {
              feature: {
                magicType: { show: true, type: ["line", "bar"] },
                restore: { show: true },
                saveAsImage: { show: true }
              }
            },
            legend: {
              data: ["销量", "销售额"]
            },
            xAxis: [
              {
                type: "category",
                data: vm.date,
                axisPointer: {
                  type: "shadow"
                }
              }
            ],
            yAxis: [
              {
                type: "value",
                name: "销量",
                min: 0,
                interval: 20,
                axisLabel: {
                  formatter: "{value} 件"
                }
              },
              {
                type: "value",
                name: "销售额",
                interval: 1000,
                min: 0,
                axisLabel: {
                  formatter: "{value} (元)"
                }
              }
            ],
            series: [
              {
                name: "销量",
                type: "bar",
                yAxisIndex: 0,
                data: vm.count
              },
              {
                name: "销售额",
                type: "line",
                yAxisIndex: 1,
                data: vm.money
              }
            ]
          });
        }
      });
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
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
    .user {
      margin: 10px 20px;
      border: 1px solid #e4eaee;
      margin-bottom: 23px;
      font-size: 12px;
      color: #4b4b4b;
      position: relative;
      z-index: 3;
      .user-info {
        display: flex;
        color: #546d7e;
        padding: 10px;
        background: #f5f8fa;

        border-bottom: 1px solid #e4eaee;
        line-height: 23px;
        .image {
          display: flex;
          align-items: center;
          width: 60px;
          border-radius: 50%;
          border: 1px solid #dec57b;
          height: 60px;
          overflow: hidden;
          margin-right: 10px;
          img {
            width: 100%;
          }
        }
        .base {
          width: 130px;
          margin: 10px 10px 0 0;
          color: #000;
        }
        .shop {
          align-self: center;
          width: 150px;
          margin-right: 10px;
        }
        .count {
          align-self: center;
          width: 150px;
          margin-right: 10px;
        }
        .money {
          align-self: center;
          span {
            color: #e4393c;
            font-weight: 600;
            font-size: 14px;
          }
        }
      }
      .sell-info {
        display: flex;
        background: #fff;
        div:first-child a {
          border-left: none;
        }
        div {
          line-height: 18px;
          display: block;
          width: 25%;
          text-align: center;
          padding: 17px 0;
          a {
            width: 100%;
            display: inline-block;
            border-left: 1px solid #e4eaee;
            &:hover {
              color: #e4393c;
            }
          }
        }
      }
    }
    .preview {
      border-bottom: 1px solid #e4eaee;
    }
    .show {
      display: flex;
      margin: 15px 20px;
      position: relative;
      background: #f5f8fa;
      border: 1px solid #e4eaee;
      font-size: 18px;
      line-height: 18px;
      padding: 11px 10px;
      .title {
        display: flex;
        align-items: center;
        width: 80px;
        font-weight: 600;
      }
      .line {
        position: absolute;
        left: 90px;
        width: 60px;
        height: 3px;
        bottom: 0;
        transition: all 0.3s ease;
        background: #e4393c;
      }
      .toLeft{
          margin-left: 400px;
      }
      .toExcel{
        padding: 0 5px;
        margin-right: 5px;
        background: #e4393c;
        color: #fff;
        display: flex;
        align-items: center;
        font-size: 13px;
        border-radius: 4px;
        border: 1px solid transparent;
        transition: all .3s ease;
        &:hover{
          border-color: #e4393c;
          background: #fff;
          color: #e4393c;
        }
      }
      .record {
        width: 60px;
        text-align: center;
        color: #333;
        padding: 8px 0;
        -webkit-transition: all 0.1s;
        transition: all 0.1s;
        font-size: 14px;
        margin-right: 10px;
        &:hover {
          color: #e4393c;
        }
      }
      .ds {
        color: #e4393c;
      }
    }
    .ods {
      display: flex;
      margin: 15px 20px;
      position: relative;
      display: flex;
      background: #f5f8fa;
      border: 1px solid #e4eaee;
      font-size: 18px;
      line-height: 18px;
      padding: 11px 10px;
      .title {
        display: flex;
        align-items: center;
        width: 80px;
        font-weight: 600;
      }
      .line {
        position: absolute;
        left: 90px;
        width: 60px;
        height: 3px;
        bottom: 0;
        transition: all 0.3s ease;
        background: #e4393c;
      }
      .normal {
        width: 60px;
        text-align: center;
        color: #333;
        padding: 8px 0;
        -webkit-transition: all 0.1s;
        transition: all 0.1s;
        font-size: 14px;
        margin-right: 10px;
        &:hover {
          color: #e4393c;
        }
      }
      .ds {
        color: #e4393c;
      }
    }
    .order {
      margin: 10px 20px;
      .item {
        width: 830px;
        margin-bottom: 10px;
        img {
          width: 80px;
          height: 80px;
        }
        .total-price {
          color: #e4393c;
        }
      }
    }
    .pagn {
      width: 750px;
      margin: 20px;
      text-align: right;
    }
  }
}
</style>
