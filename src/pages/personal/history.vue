<template>
  <div class="history-content">
      <div class="ls-container">
        <div class="header">
            <p class="title">浏览记录</p>
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
                    <div class="search">
                        <input type="text" placeholder="请输入商品名称" v-model="searchLabel" maxlength="20"/>
                        <a @click="search">搜索</a>
                    </div>
                     <div class="searchcdn" v-if="queryStr != ''">
                      搜索条件：<div class="label" @click="closeLabel">{{queryStr}}<a @click="closeLabel"><i class="fa fa-close"></i></a></div>
                  </div>
                </div>
                <a class="clear" @click="clearBrowse">清空浏览记录</a>
            </div>
           
            <div class="l-time" v-if="items.length > 0">
              <div class="line">
                <div class="arrow"><i class="fa fa-caret-up"></i></div>
                <div class="arrow-bar">
                </div>
              </div>
              <div v-for="(block,k) in items" :key="k" class="block">
                <div class="ball"></div>
                <div class="preview">
                  <div class="time">{{block.date}}</div>
                  <div class="number">共{{block.data.length}}件商品</div>
                </div>
                <div class="list">
                  <div class="item" v-for="(item,i) in block.data" :key="i">
                      <a @click="toCommodity(item.commodity_id,item.typeId)"><img :src="item.thumbnail_url"></a>
                      <div class="info">
                          <p class="price">
                              <span class="sell">￥{{item.price}}</span>
                              <span class="cost">￥{{item.cost_price}}</span>
                          </p>
                          <p class="name"><a @click="toCommodity(item.commodity_id,item.typeId)">{{item.name}}</a></p>
                          <p class="content">{{dealContent(item.content)}}</p>
                          <div class="sells"><p>销量：<span>{{item.sold_out}}</span></p>
                              <a @click="delHistoryById(item.commodity_id)">删除</a>
                          </div>
                      </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="l-tip" v-else>
              未查询到相关商品信息
            </div>
        </div>
        <!--
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
                        <input type="text" placeholder="请输入商品名称" v-model="searchLabel"/>
                        <a @click="search">搜索</a>
                    </div>
                </div>
                <a class="clear" @click="clearBrowse">清空浏览记录</a>
            </div>
            <div class="searchcdn" v-if="queryStr != ''">
                搜索条件：<div class="label" @click="closeLabel">{{queryStr}}<a @click="closeLabel"><i class="fa fa-close"></i></a></div>
            </div>
            <div class="l-body">
                <div class="item" v-for="(item,i) in items" :key="i">
                    <a @click="toCommodity(item.commodity_id)"><img :src="item.thumbnail_url"></a>
                    <div class="info">
                        <p class="price">
                            <span class="sell">￥{{item.price}}</span>
                            <span class="cost">￥{{item.cost_price}}</span>
                        </p>
                        <p class="name"><a @click="toCommodity(item.commodity_id)">{{item.name}}</a></p>
                        <p class="content">{{dealContent(item.content)}}</p>
                        <div class="sells"><p>销量：<span>{{item.sold_out}}</span></p>
                            <a @click="delHistoryById(item.commodity_id)">删除</a>
                        </div>
                        <div class="time">{{item.createdAt}}
                        </div>
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
        -->
      </div>
  </div>
</template>

<script>
import typeApi from "@/services/type";
import historyApi from "@/services/history";
export default {
  data() {
    return {
      typeList: [],
      type: "",
      props: {
        label: "name",
        value: "id",
        children: "children"
      },
      items: [],
      pageSize: 2,
      currentPage: 1,
      totalCount: 0,
      queryStr: "",
      searchLabel: ""
    };
  },
  mounted: function() {
    let vm = this;
    vm.load();
  },
  methods: {
    load(val) {
      let vm = this;
      let params = {
        page: 1,
        pageSize: 100
      };
      if (vm.queryStr != "") params.name = vm.queryStr;
      if (vm.type != "") params.typeId = vm.type;
      historyApi.getBrowseByDay(params).then(res => {
        if (res.code == 0) {
          vm.items = res.data;
        } else vm.$message.error(res.errMsg);
      });
      historyApi.getTypes(params).then(res => {
        if (res.code == 0) {
          vm.typeList = res.data;
        } else vm.$message.error(res.errMsg);
      });
    },
    clearBrowse() {
      let vm = this;
      vm
        .$confirm("此操作将删除所有浏览记录记录, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          historyApi.delBrowseHistory().then(res => {
            if (res.code == 0) {
              vm.load(1);
              vm.$message.success("历史纪录删除成功");
            } else vm.$message.error(res.errMsg);
          });
        })
        .catch(() => {
          vm.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    delHistoryById(id) {
      let vm = this;
      let page = vm.currentPage;
      if (
        vm.currentPage > 1 &&
        vm.totalCount - (vm.currentPage - 1) * vm.pageSize == 1
      )
        page = page - 1;
      vm
        .$confirm("此操作将删除该条记录, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          historyApi.delBrowseHistoryById({ id: id }).then(res => {
            if (res.code == 0) {
              vm.load(page);
              vm.$message.success("删除成功");
            } else vm.$message.error(res.errMsg);
          });
        })
        .catch(() => {
          vm.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    search() {
      let vm = this;
      vm.queryStr = vm.searchLabel;
      vm.searchLabel = "";
      vm.load();
    },
    toCommodity(id,typeId) {
      let vm = this;
      vm.$router.push({ path: "/detail", query: { id: id ,typeId: typeId} });
    },
    closeLabel() {
      let vm = this;
      vm.queryStr = "";
      vm.load();
    },
    dealContent(val) {
      let p = /<[^>]*>|<\/[^>]*>/gm;
      let v = val.replace(p, "");
      v= v.replace(/&nbsp;/g, "")
      return v;
    },
    typeChange(val) {
      let vm = this;
      vm.type = val[1];
      vm.load();
    },
    handleCurrentChange(val) {
      let vm = this;
      vm.load(val);
    },
    changePage(op) {
      let vm = this;
      if (op > 0 && vm.currentPage < Math.ceil(vm.totalCount / vm.pageSize)) {
        vm.currentPage += 1;
        return;
      }
      if (vm.currentPage > 1 && op < 0) vm.currentPage -= 1;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.history-content {
  margin-top: 10px;
  margin-left: 20px;
  background: #fff;
  border: 1px solid #e9e9e9;
  width: 88%;
}
.searchcdn {
  margin: 0 5px;
  align-items: center;
  display: flex;
  .label {
    padding: 5px 6px;
    color: #666;
    word-break: break-all;
    max-width: 140px;
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
.el-cascader {
  width: 150px;
}
.l-time {
  width: 734px;
  position: relative;
  margin: 20px 0;
  .line {
    .arrow {
      left: 130px;
      top: -20px;
      position: absolute;
      color: #dfe1e8;
      font-size: 20px;
    }
    .arrow-bar {
      left: 135px;
      bottom: 0;
      background-color: #dfe1e8;
      width: 1px;
      top: -10px;
      position: absolute;
    }
  }
  .block {
    display: flex;
    position: relative;
    .preview {
      text-align: right;
      width: 120px;
    }
    .time {
      font-size: 24px;
      margin-top: 10px;
      color: #deb85b;
    }
    .ball {
      width: 10px;
      height: 10px;
      border-radius: 5px;
      background-color: #dfe1e8;
      position: absolute;
      left: 130.5px;
      top: 20px;
    }
    .list {
      display: flex;
      flex-wrap: wrap;
      margin-left: 35px;
      .item {
        margin-top: 10px;
        margin-right: 10px;
        padding: 10px 12px;
        background: #fff;
        border: 1px solid #e9e9e9;
        width: 150px;

        &:hover {
          //border-color: #fc4768;
          box-shadow: 0 0 8px 1px #e9e9e9;
        }

        img {
          width: 150px;
          height: 150px;
        }

        .info {
          .price {
            .sell {
              color: #e4393c;
              font-weight: 600;
              font-size: 20px;
            }

            .cost {
              text-decoration: line-through;
            }
          }

          .name {
            margin-top: 5px;
            height: 30px;
            overflow: hidden;
            word-break: break-all;
            text-align: justify;
          }

          .content {
            margin-top: 5px;
            height: 30px;
            line-height: 16px;
            overflow: hidden;
            word-break: break-all;
            color: #999;
            text-align: justify;
          }

          .sells {
            margin-top: 5px;
            height: 15px;
            word-break: break-all;
            display: flex;
            justify-content: space-between;

            p {
              height: 15px;
              max-width: 135px;
              overflow: hidden;

              span {
                color: #646fb0;
                font-weight: 550;
              }
            }

            a {
              position: relative;

              &:hover {
                display: block;
                color: #e4393c;
              }
            }
          }
        }
      }
    }
  }
}
.l-tip {
  margin-top: 20px;
  font-size: 20px;
  font-weight: 600;
  margin-top: 120px;
  height: 150px;
  text-align: center;
}
</style>
