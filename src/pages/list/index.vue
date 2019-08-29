<template>
 <div class="wrapper">
    <div>
        <c-top :isQuit="quit" @on-result-change="toQuit"/>
        <c-header :opCart="isOp"  @on-cart-change="cartChange"/>
        <c-tool-bar :opCart="isOp"/>
        <div class="list-content" >
            <div class="path">
                <i class="fa fa-home"></i>
                <span  v-if="queryStr != ''" class="str" @click="clearStr()">
                    <span class="query-str">{{queryStr}}
                     <a><i class="fa fa-times"></i></a>
                    </span>
                    <span><i class="fa fa-angle-right"></i></span>
                </span>
                <span v-for="(p,i) in path" :key="i" >
                    <span v-if="i != 0 "><i class="fa fa-angle-right"></i></span>
                    <a @click="changeQuery(p.id)">{{p.name}}</a>
                </span>
            </div>
            <div class="container">
                <div class="aside">
                    <div class="a-header">
                        <p class="title">全部商品分类</p>
                        <div class="typelist">
                            <!--<el-tree :data="typeList" :empty-text="'暂无数据'" @node-click="handleNodeClick" 
                            :render-after-expand="true" :expand-on-click-node="false" :props="typeProp"></el-tree>
                            -->
                            <div class="root" v-for="item in typeList" :key="item.id" >
                                <div class="label">
                                    <a @click="changeQuery(item.id)">{{item.name}}</a>
                                    <a v-if="'children' in item" class="tg down" @click="showNode($event)">
                                        <i class="fa fa-angle-up" ></i>
                                    </a>
                                </div>
                                <div v-if="'children' in item" >
                                  <div class="node" v-for="k in item.children" :key="k.id" >
                                      <div class="label">
                                          <a @click="changeQuery(k.id)">{{k.name}}</a>
                                          <a v-if="'children' in k" class="tg down" @click="showNode($event)">
                                              <i class="fa fa-angle-up" ></i>
                                          </a>
                                      </div>
                                  </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="a-body">
                        <p class="title">热门商品</p>
                        <div class="list">
                            <div class="goods">
                                <div class="single" v-for="item in hotItems" :key="item.id">
                                    <a @click="toCommodity(item.id,item.typeId)"><img :src="item.thumbnailImg"></a>
                                    <div class="about">
                                        <p class="des"><a @click="toCommodity(item.id,item.typeId)">{{item.name}}</a></p>
                                        <p class="price">￥{{item.price}}</p>
                                        <p class="pers">已销售{{item.sellQuantity}}件</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="l-main">
                    <div class="l-header">
                        <div class="sort-op">
                            <a :class="{sort:1,focus:sort.mixed}" @click="doSort(0)">综合<i class="fa fa-long-arrow-down"></i></a>
                            <a :class="{sort:1,focus:sort.time}" @click="doSort(1)">时间<i class="fa fa-long-arrow-down"></i></a>
                            <a :class="{sort:1,focus:sort.sells}" @click="doSort(2)">销量<i class="fa fa-long-arrow-down"></i></a>
                            <a :class="{sort:1,'price-sort':1,up:sort.price == 1,down:sort.price == 2}" @click="doSort(3)">价格<div class="ic"><i class="fa fa-caret-up"></i><i class="fa fa-caret-down"></i></div></a>
                            <div class="price-rand">
                                <div class="number">
                                    <input autocomplete="off" v-model="sort.fakPriceRand[0]" type="text" placeholder="￥" @blur="testPrice(0)"/>-
                                    <input autocomplete="off" v-model="sort.fakPriceRand[1]" type="text" placeholder="￥" @blur="testPrice(1)"/>
                                </div>
                                <div class="operation">
                                    <a class="clear" @click="clearSort">清空</a>
                                    <a class="confirm" @click="sortByPriceRand">确定</a>
                                </div>
                            </div>
                        </div>
                        <div class="total-qtt">
                            <p class="quantity">共<span>{{totalCount}}</span>件商品</p>
                            <div class="pagnation">
                                <a @click="changePage(-1)" :class="{dscg: currentPage == 1 ? 1: 0}"><i class="fa fa-angle-left"></i></a>
                                <span class="page"><span class="now">{{currentPage}}</span>/<span class="total">{{Math.ceil(totalCount/pageSize) == 0 ? 1:Math.ceil(totalCount/pageSize)}}</span></span>
                                <a @click="changePage(1)" :class="{dscg: currentPage < Math.ceil(totalCount / pageSize)  ? 0: 1}"><i class="fa fa-angle-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <div class="l-body">
                        <div class="item" v-for="(item,i) in items" :key="i">
                            <a @click="toCommodity(item.id,item.typeId)"><img :src="item.thumbnailImg"></a>
                            <div class="info">
                                <p class="price">
                                    <span class="sell">￥{{item.price}}</span>
                                    <span class="cost">￥{{item.costPrice}}</span>
                                </p>
                                <p class="name"><a @click="toCommodity(item.id,item.typeId)">{{item.name}}</a></p>
                                <p class="content">{{dealContent(item.content)}}</p>
                                <p class="sells">销量：<span>{{item.sellQuantity}}</span></p>
                            </div>
                        </div>
                    </div>
                    <div class="l-footer">
                        <el-pagination
                            @current-change="handleCurrentChange"
                            :current-page.sync="currentPage"
                            :page-size="pageSize"
                            layout="total,prev, pager, next, jumper"
                            :total="totalCount">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
    <footer style="background:#fff;border-top: 1px solid #e9e9e9;margin-top:20px;min-width:1040px;">
            <c-footer ></c-footer>
        </footer>
 </div>
</template>

<script>
import typeApi from "@/services/type";
import commodityApi from "@/services/commodity";
import * as components from "@/components";
export default {
  components,
  data() {
    return {
      path: [],
      items: [],
      typeList: [],
      hotItems: [],
      sort: {
        mixed: true,
        time: false,
        sells: false,
        price: 0,
        fakPriceRand: ["", ""],
        priceRand: ["", ""],
        isPriceRand: false
      },
      isOp: false,
      quit: false,
      queryStr: "",
      id: "",
      currentPage: 1,
      totalCount: 0,
      pageSize: 100,
      typeProp: {
        children: "children",
        label: "name"
      }
    };
  },
  mounted: function() {
    let vm = this;
    vm.load();
    typeApi.getList().then(res => {
      if (res.code == 0) vm.typeList = res.data;
      else vm.$message.error(res.errMsg);
    });
  },
  watch: {
    $route: "upPage"
  },
  methods: {
    load(val) {
      let vm = this;
      vm.id = vm.$route.query.typeId || 0;
      vm.queryStr = vm.$route.query.queryStr || "";
      if (vm.id != 0) {
        let routeId = { id: vm.id };
        typeApi.typeRoute(routeId).then(res => {
          if (res.code == 0) {
            vm.path = [];
            vm.path.push({ name: "首页", id: 0 });
            for (let i of res.data) vm.path.push({ name: i.name, id: i.id });
          } else vm.$message.error(res.errMsg);
        });
      } else {
        vm.path = [];
        vm.path.push({ name: "首页", id: 0 });
      }

      vm.getCommodityList(val);
      vm.getHotSell();
      $("html,body").animate({ scrollTop: "0px" }, 200);
    },
    cartChange() {
      let vm = this;
      vm.isOp = !vm.isOp;
    },
    toQuit() {
      let vm = this;
      vm.isOp = !vm.isOp;
    },
    getHotSell() {
      let vm = this;
      let condition = {
        page: 1,
        pageSize: 5,
        typeId: vm.id,
        checked: 1
      };
      commodityApi.getHotSell(condition).then(res => {
        if (res.code == 0) vm.hotItems = res.data;
        else vm.$message.error(res.errMsg);
      });
    },
    getCommodityList(val) {
      let vm = this;
      
      if(val)
        vm.currentPage = val;
      let condition = vm.getCommodityCdn();
      commodityApi.getList(condition).then(res => {
        if (res.code == 0) {
          vm.items = res.data.data;
          vm.totalCount = res.data.total;
        } else vm.$message.error(res.errMsg);
      });
    },
    toCommodity(id, typeId) {
      let vm = this;
      vm.$router.push({ path: "/detail", query: { id: id, typeId: typeId } });
    },
    sortByPriceRand() {
      let vm = this;
      if (
        vm.sort.fakPriceRand[0].length == 0 ||
        vm.sort.fakPriceRand[1].length == 0
      ) return vm.$message.error("商品价格不能为空");
      vm.sort.isPriceRand = true;
      let low = parseFloat(vm.sort.fakPriceRand[0]);
      let high = parseFloat(vm.sort.fakPriceRand[1]);
      if (low > high) {
        let tmp = low;
        low = high;
        high = tmp;
      }
      vm.sort.priceRand = [low, high];
      vm.sort.fakPriceRand = [low, high];
      vm.getCommodityList(1);
    },
    dealContent(val) {
      let p = /<[^>]*>|<\/[^>]*>/gm;
      let v = val.replace(p, "");
      v = v.replace(/&nbsp;/g, "");
      return v;
    },
    changeQuery(val) {
      let vm = this;
      if (val == 0) vm.$router.push({ path: "/" });
      else {
        if (!val) return;
        vm.$router.push({ path: "/list", query: { typeId: val } });
        vm.init();
      }
    },
    init(){
      let vm = this;
      vm.sort = {
        mixed: true,
        time: false,
        sells: false,
        price: 0,
        fakPriceRand: ["", ""],
        priceRand: ["", ""],
        isPriceRand: false
      };
      $(".node").hide();
      $(".root .tg").attr("class","tg down");
    },
    
    upPage() {
      let vm = this;
      vm.init();
      vm.load(1);
    },
    showNode(val) {
      let t = val.currentTarget;
      $(t).toggleClass("up");
      $(t).toggleClass("down");
      $(t).parent().next().children().toggle();
    },
    doSort(i) {
      let vm = this;
      vm.sort.mixed = false;
      vm.sort.time = false;
      vm.sort.sells = false;
      switch (i) {
        case 3:
          vm.sort.price = vm.sort.price == 1 ? 2 : 1;
          break;
        case 0:
          vm.sort.mixed = true;
          break;
        case 1:
          vm.sort.time = true;
          break;
        case 2:
          vm.sort.sells = true;
          break;
        default:
          break;
      }
      if (i != 3) vm.sort.price = 0;
      vm.getCommodityList(1);
    },
    getCommodityCdn() {
      let cdn = {};
      let vm = this;
      if (vm.id != 0) cdn.typeId = vm.id;
      if (vm.queryStr != "") cdn.name = vm.queryStr;
      if (vm.sort.mixed) cdn.mixed = true;
      if (vm.sort.time) cdn.time = true;
      if (vm.sort.sells) cdn.sellQuantity = 2;
      if (vm.sort.price != 0) cdn.price = vm.sort.price;
      if (vm.sort.isPriceRand) cdn.priceRand = vm.sort.priceRand;
      cdn.page = vm.currentPage;
      cdn.pageSize = vm.pageSize;
      cdn.checked = 1;
      return cdn;
    },
    testPrice(i) {
      let vm = this;
      let price = vm.sort.fakPriceRand[i];
      let priceReg = /^\d+(\.\d+)?$/;
      if (!priceReg.test(price)) vm.sort.fakPriceRand.splice(i, 1, "");
    },
    clearSort() {
      let vm = this;
      vm.sort.fakPriceRand = ["", ""];
      vm.sort.priceRand = ["", ""];
      vm.sort.isPriceRand = false;
      vm.load();
    },
    changePage(op) {
      let vm = this;
      if (op > 0 && vm.currentPage < Math.ceil(vm.totalCount / vm.pageSize))
        return vm.handleCurrentChange(vm.currentPage + 1);
      if (vm.currentPage > 1 && op < 0) vm.handleCurrentChange(vm.currentPage - 1)
    },
    handleCurrentChange(val) {
      let vm = this;
      vm.load(val);
    },
    clearStr() {
      let vm = this;
      if (vm.id != 0)
        vm.$router.push({ path: "/list", query: { typeId: vm.id } });
      else vm.$router.push({ path: "/list" });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "./style";
</style>
