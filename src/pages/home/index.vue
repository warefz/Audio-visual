<template>
  <div class="wrapper">
    <div class="home-content">
      <c-top :isQuit="quit" @on-result-change="toQuit"/>
      <c-header :opCart="opCart" @on-cart-change="cartChange"/>
      <div class="container">
        <div class="header">
          <div class="imgswiper">
            <swiper :options="swiperOption">
              <swiper-slide v-for="b in bannerImgsLt" :key="b.id">
                <a @click="toUrl('/detail',b.id,b.typeId)">
                  <img :src="b.bannerImg">
                </a>
                <div class="banner-intro">
                  <a class="title" @click="toUrl('/detail',b.id,b.typeId)">{{b.name}}</a>
                  <div class="line"></div>
                  <div class="content">{{dealContent(b.content)}}</div>
                </div>
              </swiper-slide>
              <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
          </div>
          <div class="rt">
            <a @click="toUrl('/detail',b.id,b.typeId)" v-for="b in bannerImgsRt" :key="b.id">
              <img :src="b.bannerImg">
            </a>
          </div>
          <div class="user">
            <div class="headimg">
              <a @click="toUrl('/baseInfo')">
                <img
                  :src="user.userId ? (user.headImg ? user.headImg :['../static/user.png']):['../static/user.png']"
                >
              </a>
            </div>
            <div class="name">Hi，{{!user.userId ? '欢迎访问':(user.nickName ? user.nickName:'匿名用户')}}</div>
            <div class="operation">
              <div class="do-user" v-if="!user.userId">
                <a class="login" @click="toUrl('/login')">登录</a>|
                <a class="register" @click="toUrl('/register')">注册</a>
              </div>
              <div class="do-user" v-if="user.userId">
                <a @click="toUrl('/collection')">我的关注</a>|
                <a @click="toUrl('/baseInfo')">个人中心</a>
              </div>
              <div class="do-goods">
                <a class="sell" @click="toUrl('/shop')">发布商品</a>
              </div>
            </div>
            <div class="hot-type">
              <div class="typename">热门分类</div>
              <ul>
                <li v-for="(type,i) in hotTypes" :key="i">
                  <div class="intro">
                    <span>{{i+1}}</span>
                    <a @click="toUrl('/list',null,type.id)">{{type.parent}}:{{type.name}}</a>
                  </div>
                  <div class="degree">{{dealDegree(type.count)}}</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="hot">
          <div class="lt" v-if="hotSellItems.length > 0">
            <p class="top">
              排行榜
              <img :src="['../static/sort.png']">
              <span>热卖单品</span>
            </p>
            <swiper :options="swiperOption2" class="swiper-no-swiping">
              <swiper-slide v-for="(l,i) in hotSellItems" :key="i">
                <ul>
                  <li v-for="(item,k) in l" :key="k">
                    <a @click="toUrl('/detail',item.id,item.typeId)">
                      <img :src="item.thumbnail_url">
                    </a>
                    <div class="content">
                      <div class="title">{{i * 3 + k + 1}}</div>
                      <div>
                        <div class="detail">
                          <a @click="toUrl('/detail',item.id,item.typeId)">{{item.name}}</a>
                        </div>
                        <div class="description">{{dealContent(item.content)}}</div>
                      </div>
                    </div>
                  </li>
                </ul>
              </swiper-slide>
              <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
          </div>
          <div class="rt" v-if="hotViewItems.length > 0">
            <img class="cor" :src="['../static/hot.png']">
            <p class="top">
              热门商品
              <span>甄选优质好物</span>
            </p>
            <swiper
              v-if="hotViewItems.length > 0"
              :options="swiperOptionThumbs"
              class="gallery-thumbs"
              ref="swiperThumbs"
            >
              <swiper-slide v-for="(item,i) in hotViewItems" :key="i">
                <img class="thumbtop" :src="item.bannerImg">
              </swiper-slide>
            </swiper>
            <swiper
              v-if="hotViewItems.length > 0"
              :options="swiperOptionTop"
              class="gallery-bottom"
              ref="swiperTop"
            >
              <swiper-slide v-for="(item,i) in hotViewItems" :key="i">
                <div class="goods-info">
                  <a class="photo" @click="toUrl('/detail',item.id,item.typeId)">
                    <img :src="item.thumbnailImg">
                  </a>
                  <div class="content">
                    <a class="name" @click="toUrl('/detail',item.id,item.typeId)">{{item.name}}</a>
                    <span class="price">
                      售价：
                      <span class="number">￥{{item.price}}</span>
                    </span>
                    <span class="detail reveal-top" v-html="dealContent(item.content)"></span>
                  </div>
                </div>
              </swiper-slide>
              <div class="swiper-button-next swiper-button-black" slot="button-next"></div>
              <div class="swiper-button-prev swiper-button-black" slot="button-prev"></div>
            </swiper>
            <!-- swiper2 Thumbs -->
          </div>
        </div>
        <div class="block" v-for="type in getTypeSelectedLeLgO(mainTypesInfo)" :key="type.id">
          <div class="header">
            <a class="title" @click="toUrl('/list',null,type.id)">
              <p>
                {{type.name}}
                <i class="fa fa-angle-right"></i>
              </p>
            </a>
            <ul>
              <li v-for="(k,i) in type.hotTypes" :key="i">
                <span v-if="i != 0">·</span>
                <a @click="toUrl('/list',null,k.id)">{{k.name}}</a>
              </li>
            </ul>
          </div>
          <div class="body">
            <div class="lt" v-if="type.selected.length > 0">
              <div
                class="top"
                @click="toUrl('/detail',type.selected[0].id,type.selected[0].typeId)"
              >
                <img :src="type.selected[0].banner_url">
              </div>
              <p class="title">
                <a
                  @click="toUrl('/detail',type.selected[0].id,type.selected[0].typeId)"
                >{{type.selected[0].name}}</a>
              </p>
              <span class="price">
                原价：
                <span class="old">￥{{type.selected[0].price}}</span>
                现价：
                <span class="new">￥{{type.selected[0].cost_price}}</span>
              </span>
            </div>
            <div class="rt">
              <div class="container">
                <div class="item" v-for="(item,l) in getTypeSelectedNeO(type.selected)" :key="l">
                  <div class="top" @click="toUrl('/detail',item.id,item.typeId)">
                    <img :src="item.banner_url">
                  </div>
                  <p class="title">
                    <a @click="toUrl('/detail',item.id,item.typeId)">{{item.name}}</a>
                  </p>
                  <span class="price">
                    原价：
                    <span class="old">￥{{item.cost_price}}</span>
                    现价：
                    <span class="new">￥{{item.price}}</span>
                  </span>
                </div>
              </div>
            </div>
            <div class="aside">
              <p class="s-title">{{type.name}}榜</p>
              <ul>
                <li v-for="(s,d) in type.hotSells" :key="d">
                  <div class="s-content">
                    <p class="rank">{{d + 1}}</p>
                    <a
                      :class="{name:1, ds: d == 0 ? 1 : 0}"
                      @click="toUrl('/detail',s.id,s.typeId)"
                    >
                      <img :src="s.thumbnailImg">
                      <div class="detail">
                        <p class="title">{{s.name}}</p>
                        <p class="single">￥{{s.price}}</p>
                        <p class="sell">销量：{{s.sellQuantity}}件</p>
                      </div>
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="c-fixed-top" v-show="isScroll">
        <div class="fixedtop">
          <div class="container">
            <a class="s-title" @click="toUrl('/')">
              <img :src="['../static/nicon.png']">
            </a>
            <div class="s-bar">
              <input
                class="s-in"
                :placeholder="searchTitle"
                v-model="searchContent"
                @click="showHistory"
              >
              <button class="s-btn" @click="searchByName(searchContent)">搜索</button>
              <div class="s-history" v-if="showFixedSearch && (searchHistory.length > 0)">
                <ul>
                  <li>
                    <span class="hit">历史搜索记录</span>
                    <a class="clear" @click="cleanSearch">
                      <i class="fa fa-trash-o"></i>清除历史记录
                    </a>
                  </li>
                  <li v-for="(s,i) in searchHistory" :key="i">
                    <a class="item" @click="searchByName(s.query_str)">{{s.query_str}}</a>
                  </li>
                </ul>
              </div>
            </div>
            <a class="s-log" v-if="!user.userId" @click="toUrl('/login')">登录/注册</a>
            <div v-else class="s-wel">
              <div class="img">
                <a>
                  <img :src="user.headImg == '' ? ['../static/user.png'] :user.headImg">
                </a>
              </div>
              <div class="fill"></div>
              <div class="about">
                <div class="hd">
                  <a class="head-img" @click="toUrl('/baseInfo')">
                    <img :src="user.headImg == '' ? ['../static/user.png'] :user.headImg">
                  </a>
                  <div class="info">
                    <p class="name">
                      <span>欢迎，{{user.nickName == "" ? "匿名用户":user.nickName}}访问</span>
                    </p>
                    <p class="quit">
                      <a @click="fQuit">退出登录</a>
                    </p>
                  </div>
                </div>
                <div class="list">
                  <p>
                    <a @click="toUrl('/purchased')">订单信息</a>
                  </p>
                  <p>
                    <a @click="toUrl('/baseInfo')">个人中心</a>
                  </p>
                  <p>
                    <a @click="toUrl('/cart')">购物车</a>
                  </p>
                  <p>
                    <a @click="toUrl('/collection')">我的收藏</a>
                  </p>
                  <p>
                    <a @click="toUrl('/address')">收货地址管理</a>
                  </p>
                  <p>
                    <a @click="toUrl('/history')">浏览记录</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <c-tool-bar :opCart="opCart1"/>
    <footer
      style="background:#fff;border-top: 1px solid #e9e9e9;margin-top:20px; min-width:1040px;"
    >
      <c-footer></c-footer>
    </footer>
  </div>
</template>
<script>
import * as components from "@/components";
import baseInfoApi from "@/services/baseInfo";
import commodityApi from "@/services/commodity";
import typeApi from "@/services/type";
import searchApi from "@/services/search";
import adminApi from "@/services/admin";
export default {
  components,
  inject: ["reload"],
  mounted: function() {
    let vm = this;
    window.addEventListener("scroll", vm.handleScroll);
    $(document).click(function() {
      vm.showFixedSearch = false;
    });
    vm.load();
  },
  data() {
    return {
      quit: false,
      opCart: false,
      opCart1: false,
      user: {},
      bannerImgsRt: [],
      bannerImgsLt: [],
      hotTypes: [],
      hotSellItems: [],
      hotViewItems: [],
      hotViewItem: "",
      mainTypesInfo: [],
      isScroll: false,
      searchTitle: "",
      searchContent: "",
      changeStr: true,
      showFixedSearch: false,
      searchHistory: [],
      swiperOption: {
        spaceBetween: 10,
        centeredSlides: true,
        loop: true,
        // autoplay: {
        //   delay: 10000,
        //   disableOnInteraction: false
        // },
        speed: 800,
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        }
      },
      swiperOption2: {
        slidesPerView: 1,
        spaceBetween: 30,
        speed: 800,
        noSwiping: true,
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        }
      },
      swiperOptionTop: {
        spaceBetween: 10,
        loopedSlides: 5,
        loop: true,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        },
        on: {
          slideChange: function() {
            /*
                var index = this;
                let image = $('.gallery-bottom .swiper-slide-active .goods-info img').attr('src');
                $('.rt .hhh').attr('src',image)*/
          }
        }
      },
      swiperOptionThumbs: {
        spaceBetween: 10,
        slidesPerView: 4,
        touchRatio: 0.2,
        loop: true,
        centeredSlides: true,
        loopedSlides: 5,
        slideToClickedSlide: true,

        effect: "coverflow",
        grabCursor: true,
        watchSlidesProgress: true,
        coverflowEffect: {
          rotate: 0,
          stretch: 1,
          depth: 75,
          modifier: 1,
          slideShadows: true
        }
      }
    };
  },
  watch: {
    hotViewItems: function() {
      let vm = this;
      vm.$nextTick(() => {
        const swiperTop = vm.$refs.swiperTop.swiper;
        const swiperThumbs = vm.$refs.swiperThumbs.swiper;
        swiperTop.controller.control = swiperThumbs;
        swiperThumbs.controller.control = swiperTop;
      });
    }
  },
  updated: function() {
    let vm = this;
    vm.$nextTick(() => {
      $(".swiper-pagination .swiper-pagination-bullet").mouseenter(function() {
        $(this).click();
      });
      $(".aside ul li .s-content").mouseenter(function() {
        $(this)
          .parent()
          .siblings("li")
          .children(".s-content")
          .each(function(index) {
            $(this)
              .children(".name")
              .removeClass("ds");
          });
        $(this)
          .children(".name")
          .addClass("ds");
      });
    });
  },
  methods: {
    load() {
      let vm = this;
      commodityApi.getHomePlainList({ type_id: 0 }).then(res => {
        if (res.code == 0) {
          let length = res.data.length;
          if (length > 3) {
            vm.bannerImgsRt = res.data.splice(length - 3, length);
            vm.bannerImgsLt = res.data;
          } else vm.bannerImgsLt = res.data;
        }
      });
      commodityApi.getHomeTypesHotList().then(res => {
        if (res.code == 0) vm.mainTypesInfo = res.data;
      });
      baseInfoApi.getSomeInfo().then(res => {
        if (res.code == 0) vm.user = res.data;
      });
      commodityApi
        .getHotView({
          page: 1,
          pageSize: 5
        })
        .then(res => {
          if (res.code == 0) vm.hotViewItems = res.data;
        });
      commodityApi
        .getHotSellTDays({
          page: 1,
          pageSize: 9
        })
        .then(res => {
          if (res.code == 0) {
            let ls = [];
            for (let i in res.data) {
              if (i % 3 == 0 && i != 0) {
                vm.hotSellItems.push(ls);
                ls = [];
              }
              ls.push(res.data[i]);
            }
            if (ls.length != 0) vm.hotSellItems.push(ls);
          }
        });
      typeApi.getHotTypes({ pageSize: 7 }).then(res => {
        if (res.code == 0) vm.hotTypes = res.data;
      });
    },
    cartChange() {
      let vm = this;
      vm.opCart1 = !vm.opCart1;
    },
    toQuit() {
      let vm = this;
      vm.opCart = !vm.opCart;
      vm.opCart1 = !vm.opCart1;
      vm.user = {};
    },
    fQuit() {
      let vm = this;
      localStorage.removeItem(vm.config.token);
      vm.quit = !vm.quit;
      vm.user = {};
      vm.searchHistory = [];
    },
    toUrl(val, id, typeId) {
      let vm = this;
      let params = {
        path: val
      };
      let toLogin = ["/shop", "/baseInfo"];
      if (toLogin.indexOf(val) != -1) {
        if (!localStorage.getItem(vm.config.token))
          return vm.$router.push({ path: "/login", query: { redirect: val } });
      }
      if (id) params.query = { id: id };
      if (typeId)
        if ("query" in params) params.query.typeId = typeId;
        else params.query = { typeId: typeId };
      vm.$router.push(params);
    },
    getTypeSelectedNeO(type) {
      return type.filter(function(value, i) {
        return i != 0;
      });
    },
    getTypeSelectedLeLgO(type) {
      return type.filter(function(value, i) {
        return value.selected.length > 0;
      });
    },
    dealContent(val) {
      let p = /<[^>]*>|<\/[^>]*>/gm;
      let v = val.replace(p, "");
      v = v.replace(/&nbsp;/g, "");
      return v;
    },
    dealDegree(val) {
      if (val < 1000) return val;
      else if (val < 10000) return (val / 1000.0).toFixed(1) + "千";
      else return (val / 10000.0).toFixed(1) + "万";
    },
    showHistory(val) {
      let vm = this;
      if (!vm.showFixedSearch) vm.showFixedSearch = true;
      let token = localStorage.getItem(vm.config.token);
      if (vm.changeStr) {
        searchApi.getList().then(res => {
          if (res.code == 0 && res.data != "") vm.searchHistory = res.data;
          else vm.searchHistory = [];
          vm.changeStr = false;
        });
      }
      val.stopPropagation();
    },
    cleanSearch() {
      let vm = this;
      searchApi.cleanSearch().then(res => {
        if (res.code == 0) vm.searchHistory = [];
      });
    },
    handleScroll() {
      let vm = this;
      if ($("#top-container").length == 0) return;
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      let topHeight = document.getElementById("top-container").offsetHeight;
      vm.isScroll = scrollTop > topHeight;
    },
    searchByName(val) {
      let vm = this;
      val = val.trim();
      vm.showSearchList = false;
      if (val == "") {
        if (vm.$route.query.id)
          vm.$router.push({ path: "/list", query: { id: vm.$route.query.id } });
        else vm.$router.push({ path: "/" });
        return;
      }
      vm.searchContent = val;
      if (vm.$route.query.id)
        vm.$router.push({
          path: "/list",
          query: { queryStr: val, id: vm.$route.query.id }
        });
      else vm.$router.push({ path: "/list", query: { queryStr: val } });
      let params = {
        queryStr: val
      };
      searchApi.searchByName(params).then(res => {
        vm.changeStr = true;
      });
    }
  },
  computed: {}
};
</script>

<style lang="scss">
@import "./style";
</style>
