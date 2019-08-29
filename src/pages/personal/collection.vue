<template>
  <div class="collection-content">
      <div class="ls-container">
        <div class="header">
            <p class="title">我的收藏</p>
        </div>
        <div class="body">
            <div class="l-header">
                <div class="total-qtt">
                    <div class="type">
                        <el-cascader :options="typeList"
                            :show-all-levels="false" clearable
                            :props="props" size="small" @change="typeChange"
                          ></el-cascader>
                    </div>
                    <p class="quantity">共<span>{{totalCount}}</span>件商品</p>
                    <div class="pagnation">
                        <a @click="changePage(-1)"><i class="fa fa-angle-left"></i></a>
                        <span class="page"><span class="now">{{currentPage}}</span>/<span class="total">{{Math.ceil(totalCount/pageSize) == 0 ? 1:Math.ceil(totalCount/pageSize)}}</span></span>
                        <a @click="changePage(1)"><i class="fa fa-angle-right"></i></a>
                    </div>
                    <div class="search">
                        <input type="text" placeholder="请输入商品名称" v-model="searchLabel" maxlength="20"/>
                        <a @click="search">搜索</a>
                    </div>
                    <div class="searchcdn" v-if="queryStr != ''">
                        搜索条件：<div class="label" @click="closeLabel">{{queryStr}}<a @click="closeLabel"><i class="fa fa-close"></i></a></div>
                    </div>
                </div>
            </div>
            <div class="l-body" v-if="items.length > 0">
                <div class="item" v-for="(item,i) in items" :key="i" >
                    <a @click="toCommodity(item.commodity_id,item.typeId)"><img :src="item.thumbnail_url"></a>
                    <div class="info">
                        <p class="price">
                            <span class="sell">￥{{item.price}}</span>
                            <span class="cost">￥{{item.cost_price}}</span>
                        </p>
                        <p class="name"><a @click="toCommodity(item.commodity_id,item.typeId)">{{item.name}}</a></p>
                        <p class="content">{{dealContent(item.content)}}</p>
                        <div class="sells"><p>销量：<span>{{item.sold_out}}</span></p>
                            <a @click="changeFollow(item.commodity_id)" title="取消收藏"><i class="fa fa-heart"></i>
                                <!--<p class="tip">取消收藏</p>-->
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="l-tip" v-else>
                未查询到相关商品信息
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
</template>

<script>
import followApi from "@/services/follow";
export default {
  data() {
    return {
      typeList: [],
      type: "",
      items: [],
      pageSize: 1,
      currentPage: 1,
      searchLabel:"",
      queryStr:"",
      totalCount: 0,
      props: {
        label: "name",
        value: "id",
        children: "children"
      },
      
    };
  },
  mounted: function() {
    let vm = this;
    vm.load();
  },
  methods: {
    load(val) {
      let vm = this;
      if(!val)
        val = vm.currentPage;
      let params = {
          page: val,
          pageSize: vm.pageSize
      }
      if (vm.queryStr != "") params.name = vm.queryStr;
      if (vm.type != "") params.typeId = vm.type;
      followApi.getFollowList(params).then(res => {
        if (res.code == 0) {
          vm.items = res.data.data;
          vm.totalCount = res.data.total;
        } else vm.$message.err("收藏商品信息加载失败");
      });
      followApi.getTypes().then(res => {
        if (res.code == 0) {
          vm.typeList = res.data;
        } else vm.$message.error(res.errMsg);
      });
    },
    typeChange(val) {
      let vm = this;
      vm.type = val[1]
      vm.load();
    },
    search() {
      let vm = this;
      vm.queryStr = vm.searchLabel;
      vm.searchLabel = "";
      vm.load();
    },
    handleCurrentChange(val) {
        let vm = this;
        vm.load(val);
    },
    toCommodity(id,typeId) {
      let vm = this;
      vm.$router.push({ path: "/detail", query: { id: id ,typeId: typeId} });
    },
    changePage(op) {
      let vm = this;
      if (op > 0 && vm.currentPage < Math.ceil(vm.totalCount / vm.pageSize)) {
        vm.currentPage += 1;
      }
      if (vm.currentPage > 1 && op < 0) vm.currentPage -= 1;
      vm.load();
    },
    dealContent(val) {
      let p = /<[^>]*>|<\/[^>]*>/gm;
      let v = val.replace(p, "");
      v= v.replace(/&nbsp;/g, "")
      return v;
    },
    changeFollow(commodityId){
        let vm = this;
        vm
        .$confirm("此操作将删除该条收藏记录, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          followApi.changeFollow({commodityId: commodityId}).then(res => {
            if(res.code == 0){
                vm.$message.success(res.data);
                vm.load();
            }
        })
        })
        .catch(() => {
          vm.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    closeLabel() {
      let vm = this;
      vm.queryStr = "";
      vm.load();
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.collection-content {
  margin-top: 10px;
  margin-left: 20px;
  background: #fff;
  border: 1px solid #e9e9e9;
  width: 88%;
  .ls-container {
    .body .l-body .item .info .sells {
      a {
        color: #e4393c;
        position: relative;
        &:hover .tip {
          display: block;
        }
        .tip {
          display: none;
          padding: 2px 5px;
          background: #fff;
          position: absolute;
          border: 1px solid #e9e9e9;
          color: #000;
          left: 0;
          top: -25px;
          width: 50px;
          z-index: 10;
        }
      }
    }
  }
}
.el-cascader {
  width: 150px;
}
.searchcdn {
  margin: 5px;
  align-items: center;
  display: flex;
  .label {
    padding: 5px 6px;
    color: #666;
    word-break: break-all;
    max-width: 120px;
    border: 1px solid #e8e8e8;
    &:hover {
      border-color: #fe7300;
      cursor: pointer;
      a {
        color: #fe7300;
      }
    }
    a {
      margin-left: 5px;
      color: #e8e8e8;
    }
  }
}
.l-tip{
    margin-top: 10px;
    font-size: 20px;
    font-weight: 600;
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
