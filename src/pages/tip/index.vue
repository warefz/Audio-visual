<template>
 <div class="wrapper">
    <div>
        <c-top :isQuit="quit" @on-result-change="toQuit"/>
        <c-header :opCart="opCart" @on-cart-change="cartChange"/>
        <c-tool-bar :opCart="opCart"/>
        <div class="list-content" >
            <div class="path">
                <i class="fa fa-home"></i>
                <span v-for="(p,i) in path" :key="i" >
                    <span v-if="i != 0 "><i class="fa fa-angle-right"></i></span>
                    <span v-if="i == 1" style="color:#000">{{p.name}}</span>
                    <a v-if="i != 1" @click="changeQuery(p.id)">{{p.name}}</a>
                </span>
            </div>
            <div class="container">
                <div class="aside">
                    <div class="a-header">
                        <p class="title">全部商品分类</p>
                        <div class="typelist">
                            <el-tree :props="tipProps" accordion
                             :data="tipList"  @node-click="handleNodeClick"></el-tree>
                        </div>
                    </div>
                </div>
                <div class="main" >
                    <p class="title">{{item.name}}</p>
                    <div class="ql-editor" v-html="item.content"></div>
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
import tipApi from "@/services/tip";
import commodityApi from "@/services/commodity";
import * as components from "@/components";
export default {
  components,
  data() {
    return {
      path: [],
      item: {},
      tipList: [],
      id: "",
      quit: false,
      opCart: false,
      tipProps: {
        label: "name",
        value: "id",
        children: "children"
      }
    };
  },
  mounted: function() {
    let vm = this;
    vm.load();
    tipApi.getList().then(res => {
      if (res.code == 0) vm.tipList = res.data;
      else vm.$message.error(res.errMsg);
    });
  },
  watch: {
    $route: "upPage"
  },
  updated() {
    let vm = this;
    $(".ql-editor img").css("max-width", "90%");
  },
  methods: {
    load() {
      let vm = this;
      vm.id = vm.$route.query.id || 0;
      let routeId = { id: vm.id };
      tipApi.tipRoute(routeId).then(res => {
        if (res.code == 0) {
          vm.path = [];
          vm.path.push({ name: "首页", id: 0 });
          for (let i of res.data) vm.path.push({ name: i.name, id: i.id });
        }
      });
      tipApi.getTip(routeId).then(res => {
        if (res.code == 0) {
          vm.item = res.data;
        }
      });
      $("html,body").animate({ scrollTop: "0px" }, 200);
    },
    upPage(){
        let vm = this;
        vm.load();
    },
    cartChange(){
      let vm = this;
      vm.opCart = !vm.opCart;
    },
    toQuit() {
      let vm = this;
      vm.opCart = !vm.opCart;
    },
    changeQuery(val) {
      let vm = this;
      if (val == 0) vm.$router.push({ path: "/" });
      else {
        if (!val) return;
        vm.$router.push({ path: "/tip", query: { id: val } });
      }
    },
    handleNodeClick(val){
        if(!val.parent_id)
            return;
        let vm = this;
        vm.changeQuery(val.id)
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "./style";
</style>
