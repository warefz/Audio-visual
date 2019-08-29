<template>
  <div class="recommend-content">
    <div class="user">
      <div class="user-info">
        <div class="image">
          <img :src="user.head_img_url ? user.head_img_url:['../static/user.png']">
        </div>
        <div class="base">{{user.nick_name ? user.nick_name:'匿名用户'}}</div>
        <div class="mail">绑定邮箱：{{user.e_mail}}</div>
        <div class="count">已购买商品：{{user.count?user.count:0}}件</div>
        <div class="money">
          消费额：
          <span>{{'￥' + (user.total?user.total:0)}}</span>
        </div>
      </div>
      <div class="sell-info">
        <div class="detail">
          <a @click="toUrl('/baseInfo')">个人信息</a>
        </div>
        <div class="sold">
          <a @click="toolChange(0)">消费概览</a>
        </div>
        <div class="detail">
          <a @click="toolChange(1)">推荐商品</a>
        </div>
        <div class="detail">
          <a @click="toUrl('/history')">浏览记录</a>
        </div>
      </div>
    </div>
    <div class="purchased" id="detail0">
      <div class="title">
        <div class="t1">已购买商品</div>
        <div class="detail" @click="toUrl('purchased')">
          查看更多
          <i class="fa fa-angle-right"></i>
        </div>
      </div>
      <div class="n-detail" v-if="pItems.length == 0">暂无内容</div>
      <div class="p-content">
        <div class="item" v-for="(item,i) in pItems" :key="i">
          <a @click="toCommodity(item.id,item.type_id)">
            <img :src="item.thumbnail_url">
          </a>
          <div class="info">
            <p class="price">
              <span class="sell">￥{{item.price}}</span>
              <span class="cost">￥{{item.cost_price}}</span>
            </p>
            <p class="name">
              <a @click="toCommodity(item.id,item.type_id)">{{item.name}}</a>
            </p>
            <p class="content">{{dealContent(item.content)}}</p>
            <div class="sells">
              <p>
                购买数量：
                <span>{{item.count}}</span>
              </p>
            </div>
            <div class="total">
              <p>
                消费金额：
                <span>￥{{item.bprice*item.count}}</span>
              </p>
            </div>
            <p class="time">{{formattime(item.createdAt)}}</p>
            <p class="order">订单号：{{item.order_id}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="recommend" id="detail1">
      <div class="title">
        <div class="t1">推荐商品</div>
        <div class="more">
          <a @click="showNext">
            <img :src="['../static/refresh.png']" @click="spin">换一批
          </a>
        </div>
      </div>

      <div class="n-detail" v-if="recommend.length == 0">暂无内容</div>
      <div class="detail" v-loading="loading" element-loading-background="rgba(255, 255, 255, 0.8)">
        <div class="item" v-for="(item,i) in recommend" :key="i">
          <a @click="toCommodity(item.id,item.type_id)">
            <img :src="item.thumbnail_url">
          </a>
          <div class="info">
            <p class="price">
              <span class="sell">￥{{item.price}}</span>
              <span class="cost">￥{{item.cost_price}}</span>
            </p>
            <p class="name">
              <a @click="toCommodity(item.id,item.type_id)">{{item.name}}</a>
            </p>
            <p class="content">{{dealContent(item.content)}}</p>
            <div class="sells"><p>销量：<span>{{item.sold_out}}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as components from "@/components";
import userApi from "@/services/baseInfo";
import commodityApi from "@/services/commodity";
import moment from "moment";
export default {
  components,
  data() {
    return {
      recommend: [],
      loading: false,
      user: {},
      pItems: [],
      current: 0,
      page: 1,
      pageSize: 5
    };
  },
  mounted: function() {
    let vm = this;
    vm.load();
  },
  methods: {
    load() {
      let vm = this;
      userApi.getShoppingInfo().then(res => {
        if (res.code == 0) {
          vm.user = res.data[0];
        } else {
          vm.$message.error("个人信息加载失败");
        }
      });
      userApi
        .getShoppingList({
          page: 1,
          pageSize: 5
        })
        .then(res => {
          if (res.code == 0) {
            vm.pItems = res.data;
          } else {
            vm.$message.error("个人消费信息加载失败");
          }
        });
      commodityApi
        .getPersonalRec({
          page: vm.page,
          pageSize: vm.pageSize
        })
        .then(res => {
          if (res.code == 0) {
            vm.total = res.data.count
            vm.recommend = res.data.data;
          } else {
            vm.$message.error("个人消费信息加载失败");
          }
        });
    },
    toCommodity(id, typeId) {
      let vm = this;
      vm.toUrl("/detail", id, typeId);
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
    toolChange(val) {
      let vm = this;
      $("html, body").animate(
        { scrollTop: $("#detail" + val).offset().top },
        200
      );
    },
    dealContent(val) {
      let p = /<[^>]*>|<\/[^>]*>/gm;
      let v = val.replace(p, "");
      v = v.replace(/&nbsp;/g, "");
      return v;
    },
    formattime(time) {
      return moment(time).format("YYYY-MM-DD HH:mm:ss");
    },
    showNext(){
      let vm = this;
      vm.loading = true;
      vm.page += 1;
      if(vm.page > Math.ceil(vm.total/vm.pageSize))
        vm.page = 1;
      commodityApi
        .getPersonalRec({
          page: vm.page,
          pageSize: vm.pageSize
        })
        .then(res => {
          if (res.code == 0) {
            vm.total = res.data.count
            vm.recommend = res.data.data;
          } else {
            vm.$message.error("个人消费信息加载失败");
          }
          vm.loading = false;
        });
    },
    spin(e) {
      console.log(e.target);
      let vm = this;
      vm.current = vm.current + 90;
      e.target.style.transform = "rotate(" + vm.current + "deg)";
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.recommend-content {
  background: #fff;
  border: 1px solid #e9e9e9;
  margin-left: 20px;
  margin-top: 10px;
  width: 88%;
}
.recommend {
  margin: 10px 20px;
  border: 1px solid #e4eaee;
  margin-bottom: 23px;
  font-size: 12px;
  color: #4b4b4b;
  border: 1px solid #e4eaee;
  .title {
    padding: 10px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f5f8fa;
    .t1 {
      display: flex;
      align-items: center;
      font-size: 16px;
      font-weight: 600;
    }
    .more {
      a {
        display: flex;
        align-items: center;
      }
      img {
        transition: 1s;
        width: 14px;
        margin-right: 3px;
      }
    }
  }
  .n-detail {
    height: 250px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }
  .detail {
    display: flex;
    padding: 0 10px 10px 10px ;
    .item {
      margin: 10px 6.8px 0 6.8px;
      padding: 10px 12px;
      background: #fff;
      border: 1px solid #e9e9e9;
      width: 130px;

      &:hover {
        //border-color: #fc4768;
        box-shadow: 0 0 8px 1px #e9e9e9;
      }

      img {
        width: 100%;
        height: 120px;
      }

      .info {
        .price {
          .sell {
            color: #e4393c;
            font-weight: 600;
            font-size: 18px;
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
        .time {
          color: #999;
        }
        .sells {
          margin-top: 5px;
          height: 15px;
          word-break: break-all;
          display: flex;
          justify-content: space-between;

          p {
            height: 15px;
            max-width: 120px;
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
.purchased {
  margin: 10px 20px;
  border: 1px solid #e4eaee;
  margin-bottom: 23px;
  font-size: 12px;
  color: #4b4b4b;
  border: 1px solid #e4eaee;
  .title {
    padding: 10px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f5f8fa;
    .t1 {
      display: flex;
      align-items: center;
      font-size: 16px;
      font-weight: 600;
      .change {
        margin-left: 10px;
        font-size: 12px;
        font-weight: 500;
        color: rgb(82, 81, 81);
        i {
          margin-right: 3px;
        }
      }
    }
    .detail {
      cursor: pointer;
      i {
        margin-left: 2px;
        font-size: 14px;
      }
    }
  }
  .n-detail {
    height: 250px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }
  .p-content {
    display: flex;
    margin: 0 10px 10px 10px;
    .item {
      margin: 10px 6.8px 0 6.8px;
      padding: 10px 12px;
      background: #fff;
      border: 1px solid #e9e9e9;
      width: 130px;

      &:hover {
        //border-color: #fc4768;
        box-shadow: 0 0 8px 1px #e9e9e9;
      }

      img {
        width: 100%;
        height: 120px;
      }

      .info {
        .price {
          .sell {
            color: #e4393c;
            font-weight: 600;
            font-size: 18px;
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
        .time {
          color: #999;
        }
        .sells {
          margin-top: 5px;
          height: 15px;
          word-break: break-all;
          display: flex;
          justify-content: space-between;

          p {
            height: 15px;
            max-width: 120px;
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
    .mail {
      align-self: center;
      width: 200px;
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
</style>
