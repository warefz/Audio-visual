<template>
  <div class="goods-content">
      <div class="ls-container">
        <div class="header">
            <p class="title">我的商品</p>
        </div>
        <div class="body">
            <div class="l-header">
                <div class="total-qtt">
                    <div class="type">
                        <el-select v-model="sort" placeholder="请选择分类" @change="sortChange" size="small">
                          <el-option v-for="item in sorts" :key="item.id" :label="item.label" 
                          :value="item.id" >
                          </el-option>
                        </el-select>
                    </div>
                    <div class="type state">
                        <el-cascader :options="typeList"
                            :show-all-levels="false" clearable
                            :props="props" size="small" @change="typeChange"
                          ></el-cascader>
                    </div>
                    <div class="type state">
                        <el-select v-model="state" placeholder="请选择状态" @change="stateChange" size="small" >
                          <el-option v-for="item in states" :key="item.id" :label="item.label" 
                          :value="item.id" >
                          </el-option>
                        </el-select>
                    </div>
                    <div class="search">
                        <input type="text" placeholder="请输入商品名称" v-model="searchLabel"/>
                        <a @click="search">搜索</a>
                    </div>
                </div>
                <a class="new" @click="toUrl('/newProduct')">新增商品</a>
            </div>
            
            <div class="searchcdn" v-if="queryStr != ''">
                  搜索条件：<div class="label" @click="closeLabel">{{queryStr}}<a @click="closeLabel"><i class="fa fa-close"></i></a></div>
              </div>
            <div class="l-body">
                <div class="commodity" v-for="(item,i) in commodities" :key="i">
                    <a @click="toUrl('/detail',item.id,item.typeId)"><img :src="item.thumbnailImg"></a>
                    <div class="info">
                        <div class="lt">
                            <p class="name"><a @click="toUrl('/detail',item.id,item.typeId)">{{item.name}}</a></p>
                            <p class="content">{{dealContent(item.content)}}</p>
                            <p class="price">
                                <span class="sell">￥{{item.price}}</span>
                                <span class="cost">￥{{item.costPrice}}</span>
                            </p>
                        </div>
                        <div class="rt">
                            <div class="sells"><p>销量:
                                <span>{{item.sellQuantity}}</span></p>
                            </div>
                            
                            <div class="rest"><p>余量:
                                <span :class="{low:item.quantity < 50 && item.quantity >= 20,warn:item.quantity < 20}">{{item.quantity}}</span></p>
                            </div>
                        </div>
                    </div>
                    <div class="operation">
                        <a class="detail" @click="getInfo(item.id)">查看详情</a>
                        <a class="detail" v-if="item.checked == 2" @click="setChecked(item.id,1)">上架</a>
                        <a class="detail" v-if="item.checked == 1" @click="setChecked(item.id,2)">下架</a>
                        <a class="delete" @click="deleteById(item.id)" >删除</a>
                    </div>
                    <span class="state wait" v-if="item.checked == -1">审核中</span>
                    <span class="state fail" v-else-if="item.checked == 0">审核失败</span>
                    <span class="state checked" v-else-if="item.checked == 1">正在销售</span>
                    <span class="state success" v-else-if="item.checked == 2">审核成功</span>
              
                </div>
                <div class="n-exist" v-if="commodities.length == 0">暂无商品信息</div>
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
import commodityApi from '@/services/commodity'
import typeApi from '@/services/type'
import adminApi from '@/services/admin'
import shopApi from '@/services/shop'
export default {
  data() {
    return {
      types: [],
      type: "",
      sort:"",
      sorts:[
        { label: "综合排序",id:0},
        { label: "销量升序",id:1},
        { label: "销量降序",id:2},
        { label: "余量降序",id:3}
      ],
      state: "",
      states: [
        { label: "全部状态",id:99},
        { label: "正在销售",id:1},
        { label: "审核成功",id:2},
        { label: "审核中",id:-1},
        { label: "审核失败",id:0}
      ],
      commodities: [],
      pageSize: 10,
      currentPage: 1,
      totalCount: 0,
      searchLabel:"",
      queryStr:"",
      typeList:[],
      userId:"",
      props: {
        label: 'name',
        value: 'id',
        children: 'children'
      }
    };
  },
  mounted: function() {
    let vm = this;
    vm.state = vm.states[0].id;
    vm.sort = vm.sorts[0].id;
    shopApi.getTypes().then(res => {
      if (res.code == 0){
        vm.typeList = res.data;
      }
      else vm.$message.error(res.errMsg);
    });
    adminApi.isLogin().then(res => {
      if(res.code == 0){
        vm.userId = res.data.userId
        vm.load();
      }
    })
    
  },
  methods: {
    load(val){
      let vm = this;
      let params = {
        pageSize: vm.pageSize,
        page: val ? val: vm.currentPage,
      }
      if(vm.userId != "")
        params.userId = vm.userId;
      if(vm.type)
        params.typeId = vm.type
      if(vm.sort == 1)
        params.sellQuantity = 1
      if(vm.sort == 2)
        params.sellQuantity = 2
      if(vm.sort == 3)
        params.quantity = 1;
      if(vm.state != 99 )
        params.checked = vm.state;
      if(vm.queryStr != "")
        params.name = vm.queryStr;
      commodityApi.getList(params).then(res => {
        if(res.code == 0){
          vm.commodities = res.data.data;
          vm.totalCount = res.data.total;
        }else
          vm.$message.error(res.errMsg);
          
      })
    },
    setChecked(id,val){
      let vm = this;
      let params = {
          id: id,
          checked: val
      }
      commodityApi.setChecked(params).then(res => {
          if(res.data == 0){
              vm.$message.success('商品状态更新成功');
              vm.load();
          }
      })
    },
    deleteById(id){
      let vm = this;
      vm
        .$confirm("此操作将删除该商品, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          let params = {
            id: id
          }
          commodityApi.delById(params).then(res => {
            if(res.code == 0){
              vm.$message.success('删除成功')
              
              let currentPage = vm.currentPage
              if(currentPage > 1 && vm.commodities == 1 )
                currentPage -= 1;
              vm.load(currentPage);
            }
            else
              vm.$message.error('删除失败')
          })
        })
        .catch(() => {
          vm.$message.info("已取消删除");
        });
    },
    getInfo(id){
      let vm = this;
      vm.$router.push({path:'/newProduct',query:{id:id}})
    },
    closeLabel(){
      let vm = this;
      vm.queryStr = "";
      vm.load();
    },
    search(){
      let vm = this;
      vm.queryStr = vm.searchLabel;
      vm.load();
    },
    dealContent(val){
        let p = /<[^>]*>|<\/[^>]*>/gm;
        let v = val.replace(p,"");
        v= v.replace(/&nbsp;/g, "") 
        return v;
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
    sortChange(){
      let vm = this;
      vm.currentPage = 1;
      vm.load();
    },
    typeChange(val) {
      let vm = this;
      vm.type = val[1]
      vm.currentPage = 1;
      vm.load();
    },
    stateChange(val){
      let vm  = this;
      vm.currentPage = 1;
      vm.load();
    },
    handleCurrentChange(val) {
      let vm = this;
      vm.load(val);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.searchcdn{
    margin: 5px;
    align-items: center;
    display: flex;
    .label{
        padding: 5px 6px;
        color: #666;
        border: 1px solid #e8e8e8;
        &:hover{
            border-color: #fe7300;
            cursor: pointer;
            a{
                color: #fe7300;
            }
        }
        a{
            margin-left: 5px;
            color: #e8e8e8;
        }
    }
}
.goods-content {
  margin-top: 10px;
  margin-left: 20px;
  background: #fff;
  border: 1px solid #e9e9e9;
  width: 88%;
  .ls-container {
    .body {
      .l-header {
        width: 760px;
        .new {
          padding: 8px 14px;
          border: 1px solid #e9e9e9;
          border-radius: 3px;
          width: 75px;
          text-align: center;
          &:hover {
            border: 1px solid #409eff;
            color: #409eff;
          }
        }
      }
      .l-body {
        width:800px;
        .commodity {
          position: relative;
          display: flex;
          border: 1px solid #e9e9e9;
          margin-top: 10px;
          width: 100%;
          &:hover {
            box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
          }
          img {
            margin: 10px;
            width: 80px;
            height: 80px;
          }
          .info {
            display: flex;
            .lt {
              margin-top: 10px;
              padding-right: 10px;
              width: 350px;
              .name {
                font-size: 16px;
                line-height: 24px;
                height: 24px;
                overflow: hidden;
              }
              .content {
                text-indent: 2em;
                margin-top: 5px;
                font-size: 12px;
                line-height: 14px;
                height: 26px;
                overflow: hidden;
              }
              .price {
                margin-top: 5px;
                .sell {
                  font-size: 16px;
                  color: #e4393c;
                  font-weight: 600;
                }
                .cost {
                  text-decoration: line-through;
                }
              }
            }
            .rt {
              border-left: 1px solid #e9e9e9;
              padding: 20px;
              font-size: 14px;
              display: flex;
              flex-direction: column;
              justify-content: center;
              .sells {
                span {
                  color: #646fb0;
                  font-weight: 600;
                }
              }
              .rest {
                margin-top: 5px;
                span {
                  font-weight: 600;
                }
                .low {
                  color: #e6a23c;
                }
                .warn {
                  color: #e4393c;
                }
              }
            }
          }
          .operation {
            border-left: 1px solid #e9e9e9;
            font-size: 14px;
            display: flex;
            align-items: center;
            a {
              margin-left: 10px;
            }
            .detail {
              padding: 7px 10px;
              color: #409eff;
              border: 1px solid #b3d8ff;
              background: #ecf5ff;
              border-radius: 3px;
              transition: 0.1s;
              &:hover {
                background: #409eff;
                color: #fff;
                border-color: #409eff;
              }
            }
            .delete {
              padding: 8px 12px;
              background: #ecf5ff;
              border-radius: 3px;
              transition: 0.1s;
              background: #f56c6c;
              color: #fff;
              &:hover {
                opacity: 0.9;
              }
            }
          }
          .state {
            position: absolute;
            right: 0;
            top: 0;
            padding: 3px 5px;
            color: #fff;
          }
          .wait {
            background: #909399;
          }
          .checked {
            background: #67c23a;
          }
          .success{
            background: #e6a23c;
          }
          .fail {
            background: #f56c6c;
          }
        }
        .n-exist{
          height: 300px;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          font-weight: 600;
          font-size: 20px;
        }
      }
      .l-footer{
        width: 760px;
      }
    }
  }
}
</style>
