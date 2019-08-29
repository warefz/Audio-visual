<template>
  <div class="purchased-content">
    <div class="container">
        <div class="header">
            <p class="title">我的订单</p>
        </div>
        <div class="ods">
          <a class="normal all ds" @click="typeChange(0)">全部订单</a>
          <a class="normal pd" @click="typeChange(1)">已支付</a>
          <a class="normal wait" @click="typeChange(2)">待支付</a>
          <div class="line"></div>
        </div>
        <div class="slt" v-if="type == 1">
          <div class="normal ds"><a @click="stateChange(0,$event)">全部商品</a></div>
          <div class="normal"><a @click="stateChange(3,$event)">已完成</a></div>
          <div class="normal"><a @click="stateChange(2,$event)">待收货</a></div>
          <div class="normal"><a @click="stateChange(1,$event)">等待处理</a></div>
          </div>
        <div class="order">
           <div class="item" v-for="(item,i) in items" :key="i">
               <table>
                   <thead>
                       <tr><th> 
                           <div class="header">
                              <div class="about">
                                  <div class="time">{{formattime(item.order.updatedAt)}}</div>
                                  <div class="number">订单号：{{item.order.id}}</div>
                                  <div class="person">收货人：{{item.order.receiver}}</div>
                                  <div class="detail">收货地址：{{item.order.detailed_address}}</div>
                                  <div class="money" v-if="item.order.state == 0">订单金额：￥{{getTotalPrice(item)}}</div>
                                  <div class="money" v-else>订单金额：￥{{item.order.total_price}}</div>
                              </div>
                                <div class="op">
                                  <a class="dec" title="查看详情" @click="detailInfo(item.order.id)">查看详情</a>
                                  <a class="back" title="退款" @click="reqBack(item.order)">申请退款</a>
                                  <a class="del" title="删除订单" @click="delOrder(item.order.id)"><i class="fa fa-trash-o"> </i></a>
                                </div>
                            </div>
                        </th></tr>
                   </thead>
                   <tbody>
                        <tr><td>
                            <div class="body">
                                <div class="content" v-for="(c,l) in item.data" :key="l">
                                    <a class="c-image" @click="toUrl('/detail',c.commodity_id,c.typeId)"><img :src="c.thumbnail_url"></a>
                                    <div class="rt">
                                        <div class="name">
                                            <a @click="toUrl('/detail',c.commodity_id,c.typeId)">{{c.name}}</a>
                                        </div>
                                        <div class="price">￥{{c.price}}</div>
                                    </div>
                                    <div class="aside">
                                        <div class="number">x{{c.count}}</div>
                                        <div class="total">总额：￥{{Math.floor(c.count * c.price*100)/100}}</div>
                                        <div class="state">
                                            <div class="ot">
                                                <a v-if="item.order.state == 0" @click="toPay(item.order.id)">点击付款</a>
                                                <span v-if="c.state == 0">等待处理</span>
                                                <span v-if="c.state == 1">等待收货</span>
                                                <span v-if="c.state == 2">订单完成</span>
                                            </div>
                                        </div>
                                        <div class="evaluate">
                                            <div class="op">
                                                <!-- <a v-if="item.order.state != 0" @click="detailInfo(c.id,c.commodity_id)">查看详情</a> -->
                                                <a  @click="toCart(c.commodity_id)">再次购买</a>
                                                <!-- <a  v-if="c.state == 1" @click="confirmReceive(c.id,c.commodity_id)">确认收货</a> -->
                                                <a v-if="c.state == 2 && c.evaluate == 0" @click="showMessage(c.id)">点击评价</a>
                                                <div class="cont">
                                                  <a v-if="c.state == 2 && c.evaluate == 1" @click="viewDetail(c.id)">查看评价</a>
                                                  <a  class="del" v-if="c.state == 2 && c.evaluate == 1" @click="delEvaById(c.id)">删除评价</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </td>
                        </tr>
                   </tbody>
               </table>
           </div>
        </div>
        <div class="n-exist" v-if="totalCount == 0">
          暂无订单信息
        </div>
        <div class="pagn" v-if="totalCount > 0">
          <el-pagination 
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            background
            layout="total, prev, pager, next"
            :total="totalCount">
          </el-pagination>
        </div>
        <div class="message" v-if="showEvaBlock" @click="doMessage">
            <div class="eva-block" >
                <p class="title">商品评价<span class="close" @click="closeMessage"><i class="fa fa-close"></i></span></p>
                <div class="level"><label class="name">评价等级:</label>
                    <el-rate v-model="evaBlock.level" show-score text-color="#ff9900"> </el-rate>
                </div>
                <div class="content"><label class="name">评价内容:</label><textarea placeholder="请输入评价内容" rows="6" cols="46"  v-model="evaBlock.content"></textarea></div>
                <div class="images"><label>评价图片:</label>
                    <div class="list">
                        <div class="item" v-for="d in evaBlock.images" :key="d.seq">
                            <div class="content-area">
                                <img v-if="d.type === 'EVALUATE_IMAGE'" :src="d.content" width="300px" >
                            </div>
                            <div class="item-operation">
                                <a class="op"><i class="fa fa-plus " ></i></a>
                                <ul class="dropdown-menu" aria-labelledby="dLabel">
                                    <li class="dropdown-item">
                                        <file-wrapper  @on-file-change="addImage(d.seq-1,...arguments)">
                                            <a>上面插入图片</a>
                                        </file-wrapper>
                                    </li>
                                    <li class="dropdown-item">
                                        <a  @click="removeCurrentImage(d.seq)">删除当前节点</a>
                                    </li>
                                    <li class="dropdown-item">
                                        <file-wrapper  @on-file-change="addImage(d.seq,...arguments)">
                                            <a>下面插入图片</a>
                                        </file-wrapper>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="new-content">
                            <a><file-wrapper id="newImg3" class="text-btn" @on-file-change="addImage(evaBlock.images.length,...arguments)">
                                添加图片
                            </file-wrapper></a>
                        </div>
                    </div>
                </div>
                <div class="operation"><a class="confirm" @click="submitEva">提交评价</a><a class="cancel" @click="closeMessage">取消</a></div>
            </div>
        </div>
        <div class="back-message" v-if="showBackBlock">
          <div class="eva-block" >
                <p class="title">申请退款<span class="close" @click="closeBackMessage"><i class="fa fa-close"></i></span></p>
                <div>
                  <p style="font-weight:600">订单信息</p>
                  <div class="time">{{formattime(back.updatedAt)}}</div>
                  <div class="number">订单号：{{back.id}}</div>
                  <div class="person">收货人：{{back.receiver}}</div>
                  <div class="detail">收货地址：{{back.detailed_address}}</div>
                  <div class="money" v-if="back.state == 0">订单金额：￥{{getTotalPrice(item)}}</div>
                  <div class="money" v-else>订单金额：￥{{back.total_price}}</div>
                </div>
                <div class="reason">
                  <p class="title">退款理由</p>
                  <div><input type="radio" v-model="reason" value="0" />拍错了</div>
                  <div><input type="radio" v-model="reason" value="1" />地址填写错误</div>
                  <div><input type="radio" v-model="reason" value="2" />效果不好不喜欢</div>
                  <div><input type="radio" v-model="reason" value="3" />七天无理由退货</div>
                  <div><input type="radio" v-model="reason" value="4" />其他<textarea v-model="reasonContent" /></div>
                </div>
                <a class="confirm" @click="backConfirm">确认</a>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import * as components from "@/components";
import purchaseApi from "@/services/purchase";
import evaluateApi from "@/services/evaluate";
import orderApi from "@/services/order";
import moment from "moment";
import fileUploader from "@/utils/fileUploader";
export default {
  components,
  data() {
    return {
      reason:"",
      items: [],
      evaluate: 5,
      type: 0,
      showEvaBlock: false,
      showBackBlock: false,
      evaBlock: {
        id: "",
        level: 0,
        content: "",
        images: []
      },
      back:{
      },
      currentPage: 1,
      pageSize: 5,
      totalCount: 0,
      state: 0,
      reasonContent:""
    };
  },
  mounted: function() {
    let vm = this;
    $(".ods .normal").hover(
      function() {
        let index = $(".ods .normal").index(this);
        $(".ods .line").css("left", index * 90 + "px");
      },
      function() {
        $(".ods .line").css("left", vm.type * 90 + "px");
      }
    );
    vm.load();
  },
  methods: {
    backConfirm(){
      let vm = this;
      if(vm.reason.length == 0)return vm.$message.error("退款理由不能为空");
      let s = "";
      if(vm.reason == 0) s = "拍错了"
      if(vm.reason == 1) s = "地址填写错误"
      if(vm.reason == 2) s = "效果不好不喜欢"
      if(vm.reason == 3) s = "七天无理由退货"
      if(vm.reason == 4) s = vm.reasonContent.trim().length == 0 ? "其他":vm.reasonContent.trim()
      console.log(s)
    },
    formattime(time) {
      return moment(time).format("YYYY-MM-DD HH:mm:ss");
    },
    load(val) {
      let vm = this;
      if (!val) val = vm.currentPage;
      let params = {
        page: val,
        pageSize: vm.pageSize
      };
      if (vm.type != 0) params.type = vm.type;
      if (vm.state != 0) params.state = vm.state - 1;
      purchaseApi.getOrderList(params).then(res => {
        if (res.code == 0) {
          vm.items = [];
          vm.items = res.data.data;
          vm.totalCount = res.data.total;
        } else {
          vm.$message.error("订单信息加载失败");
        }
      });
    },
    reqBack(order){
      let vm = this;
      vm.back = order;
      vm.showBackBlock = true;
    },
    closeBackMessage() {
      let vm = this;
      vm.showBackBlock = false;
      vm.back = {};
    },
    doMessage(val) {
      let vm = this;
      if (val.target.className == "message") vm.showChangeMail = false;
    },
    closeMessage() {
      let vm = this;
      vm.showEvaBlock = false;
      vm.initMess();
    },
    initMess() {
      let vm = this;
      vm.evaBlock = {
        id: "",
        level: 0,
        content: "",
        images: []
      };
    },
    showMessage(id) {
      let vm = this;
      vm.evaBlock.id = id;
      vm.showEvaBlock = true;
    },
    submitEva() {
      let vm = this;
      if (!vm.evaBlock.id) return vm.$message.error("商品信息错误");
      if (vm.evaBlock.content.trim() == "")
        return vm.$message.error("评论内容不能为空");
      let params = {
        evaluate: vm.evaBlock
      };
      evaluateApi.edit(params).then(res => {
        if (res.code == 0) {
          vm.$message.success("评价成功");
          vm.initMess();
          vm.showEvaBlock = false;
          vm.load();
        } else vm.$message.error("评价异常");
      });
    },
    viewDetail(id) {
      let vm = this;
      evaluateApi.getById({ id: id }).then(res => {
        if (res.code == 0) {
          vm.showEvaBlock = true;
          vm.evaBlock.id = id;
          vm.evaBlock.level = parseInt(res.data.level.content);
          vm.evaBlock.content = res.data.content.content;
          vm.evaBlock.images = res.data.images;
        } else vm.$message.error("评论信息加载失败");
      });
    },
    delEvaById(id) {
      let vm = this;
      vm
        .$confirm("此操作将删除该评论信息, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          let params = {
            id: id
          };
          evaluateApi.delById(params).then(res => {
            if (res.code == 0) {
              vm.$message.success("评论信息删除成功");
              vm.load();
            } else vm.$message.error("评论信息删除异常");
          });
        })
        .catch(() => {
          vm.$message.info("已取消删除");
        });
    },
    removeCurrentImage(pos) {
      let vm = this;
      vm.evaBlock.images.splice(pos - 1, 1);
      for (let i = pos - 1; i < vm.evaBlock.images; i++) {
        vm.evaBlock.images[i].seq--;
      }
    },
    addImage(pos, file) {
      let vm = this;
      fileUploader.normal(file).then(res => {
        if (res.code == 0) {
          vm.evaBlock.images.splice(pos, 0, {
            type: "EVALUATE_IMAGE",
            content: res.data,
            seq: pos + 1
          });
          for (let i = pos + 1; i < vm.evaBlock.images.length; i++) {
            vm.evaBlock.images[i].seq++;
          }
        } else vm.$message.error("图片上传异常");
      });
    },
    delOrder(id) {
      let vm = this;
      vm
        .$confirm("此操作将删除该订单信息, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          purchaseApi.delOrderById({ id: id }).then(res => {
            if (res.code == 0) {
              vm.$message.success("订单信息删除成功");
              vm.load();
            } else {
              vm.$message.error(res.errMsg);
            }
          });
        })
        .catch(() => {
          vm.$message.info("已取消删除");
        });
    },
    toCart(id) {
      let vm = this;
      let params = {
        id: id,
        count: 1
      };
      purchaseApi.addToCart(params).then(res => {
        if (res.code == 0) {
          vm.$message.success("商品加入购物车成功");
        }
      });
    },
    handleCurrentChange(val) {
      let vm = this;
      vm.load(val);
    },
    toPay(id) {
      let vm = this;
      vm.$router.push({ path: "/order", query: { oid: id } });
    },
    typeChange(val) {
      let vm = this;
      $(".line").css("left", val * 90 + "px");
      $(".ods .normal").removeClass("ds");
      $(".ods .normal")
        .eq(val)
        .addClass("ds");
      vm.type = val;
      vm.state = 0;
      vm.currentPage = 1;
      vm.load();
    },
    stateChange(val,e){
      $(".slt .normal").removeClass("ds");
      $(e.currentTarget).parent().addClass("ds");
      let vm = this;
      vm.state = val;
      vm.currentPage = 1; 
      vm.load();
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
    viewOrder(id){

    },
    // confirmReceive(id, commodityId) {
    //   let vm = this;
    //   orderApi
    //     .confirmReceive({
    //       id: id,
    //       commodityId: commodityId,
    //       state: 2
    //     })
    //     .then(res => {
    //       if (res.code == 0) {
    //         vm.$message.success("确认收货操作成功");
    //         vm.load();
    //       } else vm.$message.error("确认收货操作失败");
    //     });
    // },
    detailInfo(id){
      let vm = this;
      vm.$router.push({path:'/purDetail',query:{id: id}});
    },
    getTotalPrice(item){
      let price = 0;
      for(let i of item.data){
        price += Math.floor(i.count * i.price*100)/100
      }
      return price;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.message {
  position: fixed;
  top: 0;
  height: 100%;
  left: 0;
  right: 0;
  padding: 5px 10px;
  background: rgba(9, 9, 9, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  .eva-block {
    background: #fff;
    left: 50%;
    top: 50%;
    width: 500px;
    max-height: 80%;
    overflow-y: auto;
    padding: 30px 60px;
    border-radius: 4px;
    label {
      font-size: 16px;
      font-weight: 600;
      margin-right: 10px;
    }
    label.name:before {
      margin-right: 4px;
      content: "*";
      color: #ff3000;
    }
    .level {
      margin: 20px 0;
      display: flex;
    }
    .content {
      margin: 20px 0;
      display: flex;
      textarea {
        resize: none;
        outline: none;
        padding: 8px;
        border-radius: 3px;
        border-color: #cecece;
      }
    }
    .images {
      display: flex;
      margin-top: 10px;
    }
    .close {
      position: absolute;
      right: -30px;
      top: -10px;
      font-size: 18px;
      &:hover {
        cursor: pointer;
      }
    }
    .title {
      color: #000;
      font-size: 18px;
      font-weight: 600;
      margin: 10px 0;
      position: relative;
      text-align: center;
    }
    .operation {
      display: flex;
      justify-content: center;
      margin: 30px 0;
      a {
        padding: 8px 15px;
      }
      .confirm {
        background: #5584ff;
        color: #fff;
        border-radius: 3px;
        margin-right: 20px;
      }
      .cancel {
        border: 1px solid #e9e9e9;
        border-radius: 3px;
      }
    }
    .item {
      display: flex;
      align-items: center;
      .content-area {
        margin-left: 5px;
      }
      .item-operation {
        position: relative;
        &:hover {
          ul {
            display: block;
          }
        }
        .op {
          margin-left: 10px;
          padding: 10px 0;
          i {
            font-size: 16px;
            color: #5c90d2;
            padding: 3px 4px;
            border: 3px solid #5c90d2;
            border-radius: 50%;
          }
        }
        ul {
          z-index: 10;
          display: none;
          list-style-type: none;
          position: absolute;
          left: -10px;
          top: 30px;
          background: #fff;
          border: 1px solid #dad7d7;
          text-align: center;
          padding: 10px 0;
          border: 1px solid rgba(0, 0, 0, 0.15);
          border-radius: 4px;
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
          li {
            a {
              padding: 7px 12px;
              display: block;
              padding: 3px 20px;
              font-weight: 400;
              line-height: 1.42857143;
              color: #333;
              white-space: nowrap;
              &:hover {
                background: transparent;
              }
            }
          }
        }
      }
    }
    .new-content {
      display: flex;
      margin-left: 5px;
      .text-btn {
        padding: 7px 15px;
        border-radius: 3px;
        background-color: #70b9eb;
        border: 1px solid #43a3e5;
        color: #fff;
      }
      .img-btn {
        padding: 7px 15px;
        border-radius: 3px;
        color: #fff;
        margin-right: 10px;
        background-color: #46c37b;
        border: 1px solid #34a263;
      }
      .addimg:hover {
        cursor: pointer;
      }
    }
  }
  input {
    padding: 5px 10px;
    width: 180px;
    margin: 5px;
    margin-right: 0;
    border-radius: 3px;
    border: 1px solid #e9e9e9;
  }
}
.back-message{
  position: fixed;
  top: 0;
  height: 100%;
  left: 0;
  right: 0;
  padding: 5px 10px;
  background: rgba(9, 9, 9, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  
  .eva-block {
    background: #fff;
    left: 50%;
    top: 50%;
    width: 500px;
    max-height: 80%;
    overflow-y: auto;
    padding: 30px 60px;
    border-radius: 4px;
    .confirm{
      display: inline-block;
      margin:10px 20px;
      background: #5c90d2;
      color:white;
      padding: 8px 15px;
      border-radius: 4px;
    }
    .title {
      color: #000;
      font-size: 18px;
      font-weight: 600;
      margin: 10px 0;
      position: relative;
      text-align: center;
    }
    .reason{
      div{
        padding: 5px;
        display: flex;
        align-items: flex-start;
        input{
          margin-right: 5px;
        }
        textarea{
          margin-left: 5px;
        }
      }
    }
  .close {
      position: absolute;
      right: -30px;
      top: -10px;
      font-size: 18px;
      &:hover {
        cursor: pointer;
      }
    }
  }
}
.purchased-content {
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
    .ods {
      display: flex;
      margin: 15px 20px;
      position: relative;
      .line {
        position: absolute;
        left: 0;
        width: 80px;
        height: 3px;
        bottom: -5px;
        transition: all 0.3s ease;
        background: #e4393c;
      }
      .normal {
        width: 80px;
        text-align: center;
        color: #333;
        padding: 8px 0;
        -webkit-transition: all 0.1s;
        transition: all 0.1s;
        font-size: 20px;
        font-weight: 600;
        margin-right: 10px;
        &:hover {
          color: #e4393c;
        }
      }
      .ds {
        color: #e4393c;
      }
    }
    .slt{
      position: relative;
      width: 100%;
      border-top: solid 1px #ebebeb;
      display: flex;
      background: #fafafa;
      &::before{
          content: '';
          position: absolute;
          left: 142px;
          top: -7px;
          border-left: 7px solid transparent;
          border-right: 7px solid transparent;
          border-bottom: 7px solid #ebebeb;
          z-index: 10;
      }
      .ds{
        a{
          color:#deb85b;
        }
      }
      .normal{
        color: #858585;
        padding: 0 30px;
        margin: 10px 0;
        border-left: solid 1px #ebebeb;
        a{
          &:hover{
            color: #deb85b;
          }
        }
      }
      .normal:first-child{
        border-left-color: transparent;
      }
    }
    .order {
      margin: 10px 20px;
      .item {
        width: 830px;
        margin-bottom: 10px;
        table {
          width: 100%;
          border-collapse: collapse;
          th {
            padding: 0;
            background: #ebecf0;
            text-align: left;
            font-weight: 400;
            border: 1px solid #dcdee3;
          }
          td {
            padding: 0;
            border: 1px solid #dcdee3;
          }
          .header {
            width: 100%;
            box-sizing: border-box;
            padding: 10px 20px;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: center;
            .about {
              display: flex;
              max-width: 750px;
              flex-wrap: wrap;
              line-height: 22px;
            }
            .op {
              margin: 0;
              display: flex;
              align-items: center;
              a:hover{
                color:#e4393c;
              }
              .dec{
                margin-right: 4px;
              }
              .back{
                margin-right: 4px;
              }
              i {
                font-size: 20px;
              }
            }
            div {
              margin-right: 20px;
            }
          }
          .body {
            .content:first-child {
              border-top: none;
            }
            .content {
              transition: all 0.3s ease;
              border-top: 1px solid #e9e9e9;
              display: flex;
              &:hover {
                background: #f7f5f5;
              }
              .c-image {
                margin: 10px 0 10px 20px;
                width: 56px;
                height: 56px;
              }
              img {
                width: 56px;
                height: 56px;
              }
              .rt {
                padding: 10px 0;
                margin-left: 10px;
                .name {
                  width: 200px;
                  height: 32px;
                  line-height: 16px;
                  overflow: hidden;
                }
                .price {
                  margin-top: 5px;
                  color: #e4393c;
                }
              }
              .aside {
                display: flex;
                .number {
                  width: 40px;
                  align-self: center;
                  padding: 10px 20px;
                }
                .total {
                  width: 100px;
                  padding: 10px 20px;
                  border-left: 1px solid #dcdee3;
                }

                .state {
                  width: 110px;
                  border-left: 1px solid #dcdee3;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  padding: 0 10px;
                  .ot {
                    display: flex;
                    flex-direction: column;
                    color: #333;
                    a {
                      padding: 5px 8px;
                      border-radius: 3px;
                      &:hover {
                        color: #e4393c;
                      }
                    }
                    span {
                      padding: 5px 8px;
                      border-radius: 3px;
                    }
                    .del {
                      margin-left: 10px;
                      padding: 5px 8px;
                      border-radius: 3px;
                      &:hover {
                        color: #e4393c;
                      }
                    }
                  }
                }
                .evaluate {
                  display: flex;
                  align-items: center;
                  padding: 10px 20px;
                  border-left: 1px solid #dcdee3;
                  .op {
                    color: #333;
                    display: flex;
                    flex-direction: column;
                    a {
                      margin: 4px 10px;
                      &:hover {
                        color: #e4393c;
                      }
                    }
                    .cont {
                      display: flex;
                      flex-direction: column;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    .n-exist {
      height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 20px;
      color: #333;
    }
    .pagn {
      width: 750px;
      margin: 20px;
      text-align: right;
    }
  }
}
</style>
