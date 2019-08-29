<template>
    <div class="wrapper">
        <div class="detail-content">
            <c-top :isQuit="quit" @on-result-change="toQuit"/>
            <c-header :opCart="isAdd" @on-cart-change="cartChange"/>
            <div class="path">
                <i class="fa fa-home"></i>
                <span>
                    <a @click="changeQuery(0)">主页</a>
                </span>
                <span v-for="(p,i) in item.typeRoute" :key="i">
                    <span><i class="fa fa-angle-right"></i></span>
                    <a @click="changeQuery(p.id)">{{p.name}}</a>
                </span>
                <span>
                    <span><i class="fa fa-angle-right"></i></span>
                    <span>{{item.name}}</span>
                </span>
            </div>
            <div class="container">
                <div class="intro">
                    <div class="preview">
                    <div class="lg">
                        <img :src="showImg"/>
                        <div class="show-imp">
                        </div>
                        <div class="show-lg">
                            <img :src="showImg"/>
                        </div>
                    </div>
                    <div class="list">
                        <img class="fs"  v-if="item.thumbnails.length > 0" :src="item.thumbnails[0].thumbnail_url"/>
                        <img v-for="(t,i) in getItemNeO(item.thumbnails)" :key="i" :src="t.thumbnail_url"/>
                    </div>
                    </div>
                    <div class="info">
                        <p class="name">{{item.name}}</p>
                        <ul>
                            <li><div class="label">原价：</div><span class="cost-price">￥{{item.costPrice}}</span></li>
                            <li><div class="label">售价：</div><span class="sell-price">￥{{item.price}}</span><span class="cut-price">省￥{{item.costPrice - item.price}}</span></li>
                            <li><div class="label">销量：</div><span class="sell-quantity">{{item.sellQuantity}}件</span></li>
                            <li><div class="label">评价：</div>
                                <span class="goods-evaluate">
                                    <el-rate v-model="item.scoreInfo.score" disabled show-score text-color="#ff9900" score-template="{value}"></el-rate>
                                    <span>共{{item.scoreInfo.num}}人评价</span>
                                </span>
                            </li>
                            <li><div class="label">资源：</div>
                                <a class="resource" v-if="item.modelType == 1"  @click="videoChange"><img class="icon-av" :src="['../static/video-a.png']" title="播放视频"/></a>
                                <a class="resource" v-if="item.modelType != 1" ><img class="icon-av" :src="['../static/video-d.png']" title="暂无视频资源"/></a>
                                <a class="resource as" v-if="item.modelType == 2" @click="audioChange"><img class="icon-av icon-as" :src="['../static/audio-a.png']" title="播放音频"/></a>
                                <a class="resource as" v-if="item.modelType != 2"><img class="icon-av icon-as"  :src="['../static/audio-d.png']" title="暂无音频资源"/></a>
                            </li>
                            <li><div class="label">服务：</div><span class="goods-service">由{{item.shop.name}}发货，并提供售后服务。</span></li>
                            <li><div class="label">数量：</div>
                                <div class="buy-quantity">
                                    <input v-model="quantity" autocomplete="off" type="text"  value="1"  minnum="1" @change="testSum()" @focus="saveSum()">
                                    <div class="operation">
                                        <span :class="{add:1,disable:quantity >= item.quantity}" @click="doOp(1)">+</span>
                                        <span :class="{minus:1,disable:quantity <= 1}" @click="doOp(-1)">-</span> 
                                    </div>
                                </div>
                                <span class="rest-quantity">(余量：{{item.quantity}})</span>
                            </li>
                            <li v-if="!item.isSelf">
                                <a class="to-cart" v-if="item.quantity > 0" @click="addToCart">加入购物车</a>
                                <a class="no-cart" v-if="item.quantity == 0" >暂无商品</a>
                                <a class="follow" v-if="item.like == 0" @click="changeFollow"><i class="fa fa-heart"></i>收藏</a>
                                <a class="disfollow" v-if="item.like == 1" @click="changeFollow"><i class="fa fa-heart"></i>取消收藏</a></li>
                            <li v-if="item.isSelf"><a class="to-cart" @click="toUrl('/newProduct',item.id)">查看商品详情</a></li>
                        </ul>
                    </div>
                    <div class="av-container" v-if="showVideo||showAudio">
                      <a class="close" @click="closePrev"><i class="fa fa-close"></i></a>
                      <div class="au-vi">
                        <video  class="source-video" controls="" autoplay="false" name="media" v-if="item.modelType == 1 && showVideo">
                          <source :src="item.modelUrl" type="audio/mpeg">
                        </video>
                        <audio class="source-audio" style="outline:none" autoplay="false" :src="item.modelUrl" v-if="item.modelType == 2 && showAudio" controls></audio>
                      </div>
                    </div>
                    <div class="aside">
                        <div class="similar">
                            <h3 class="title">相似产品</h3>
                        </div>
                        <div class="n-exist" v-if="similarItems.length == 0">暂无商品信息</div>
                        <div class="body" >
                            <swiper :options="detailSwiper">
                                <swiper-slide v-for="(s,ki) in similarItems" :key="ki">
                                    <div class="rec">
                                        <a @click="toUrl('/detail',s.id,s.type_id)"><img :src="s.thumbnail_url"/></a>
                                        <div class="name"><a @click="toUrl('/detail',s.id,s.type_id)">{{s.name}}</a></div>
                                        <div class="price">￥{{s.price}}</div>
                                    </div>
                                </swiper-slide>
                                <div class="swap swiper-button-prev" slot="button-prev"><i class="fa fa-angle-up"></i></div>
                                <div class="swap swiper-button-next" slot="button-next"><i class="fa fa-angle-down"></i></div>
                            </swiper>
                        </div>
                    </div>
                </div>
                <div class="details">
                    <div class="container">
                        <div class="c-top">
                            <div class="lt">
                                <ul>
                                    <li><a :class="{sel: loc == 0 ? 1:0}" @click="changeSel(0)">产品详情</a></li>
                                    <li><a :class="{sel: loc == 1 ? 1:0}" @click="changeSel(1)">用户评价({{item.scoreInfo.num}})</a></li>
                                </ul>
                            </div>
                            <div class="rt">
                                <span class="price">￥{{item.price}}</span>
                                <a class="tocart" v-if="!item.isSelf && item.quantity > 0"  @click="addToCart">加入购物车</a>
                                <a class="nocart" v-if="!item.isSelf && item.quantity == 0" >暂无现货</a>
                                <a class="tocart" v-if="item.isSelf" @click="toUrl('/newProduct',item.id)">查看商品详情</a>
                            </div>
                        </div>
                        <div class="c-body">
                            <div class="d-content" v-if=" loc == 0">
                                <div class="list" v-if="item.attributeContent.length > 0">
                                    <div class="name">产品名称：{{item.name}}</div>
                                    <div class="attr">
                                        <div class="title">商品属性：</div>
                                        <span v-for="at in item.attributeContent" :key="at.id">{{at.name+'：'+at.content}}</span>
                                    </div>
                                </div>
                                <div class="des ql-snow" >
                                    <div class="ql-editor" v-html="item.content"></div>
                                </div>
                            </div>
                            <div class="p-content">
                                <p class="title">用户评价</p>
                                <div class="t-show">
                                    <div class="score">
                                        <p>与描述相符</p>
                                        <div class="num">{{item.scoreInfo.score}}</div>
                                        <el-rate v-model="item.scoreInfo.score" disabled text-color="#ff9900"></el-rate>
                                    </div>
                                    <div class="full">
                                        <div class="pro-label"><p>好评</p><p>中评</p><p>差评</p></div>
                                        <div class="pro-bar">
                                            <el-progress :percentage="commentQ.total == 0 ? 0:Math.round(commentQ.high/commentQ.total*100*10)/10" color="#ff9900"></el-progress>
                                            <el-progress :percentage="commentQ.total == 0 ? 0:Math.round(commentQ.mid/commentQ.total*100*10)/10" color="#ff9900"></el-progress>
                                            <el-progress :percentage="commentQ.total == 0 ? 0:Math.round(commentQ.low/commentQ.total*100*10)/10" color="#ff9900"></el-progress>
                                        </div>
                                    </div>
                                    <div class="write">
                                        <div class="write-score">
                                            <div class="num" :style="{left: item.scoreInfo.score * 54.66 + 3.35 + 'px'}">{{item.scoreInfo.score}}
                                            </div>
                                        </div>
                                        <div class="write-bar">
                                            <span>0</span>
                                            <span>1</span>
                                            <span>2</span>
                                            <span>3</span>
                                            <span>4</span>
                                            <span>5</span>
                                        </div>
                                        <div class="write-list">
                                            <span>不满意</span>
                                            <span>一般</span>
                                            <span>比较满意</span>
                                            <span>满意</span>
                                            <span>非常满意</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="p-list">
                                    <div class="sels">
                                        <ul>
                                            <li><a :class="{sel: scRate == 0? 1:0}" @click="changeScRate(0)">全部评价({{commentQ.total}})</a></li>
                                            <li><a :class="{sel: scRate == 1? 1:0}" @click="changeScRate(1)">好评({{commentQ.high}})</a></li>
                                            <li><a :class="{sel: scRate == 2? 1:0}" @click="changeScRate(2)">中评({{commentQ.mid}})</a></li>
                                            <li><a :class="{sel: scRate == 3? 1:0}" @click="changeScRate(3)">差评({{commentQ.low}})</a></li>
                                        </ul>
                                    </div>
                                    <div class="p-item">
                                        <div class="user" v-for="(comment,i) in comments" :key="i">
                                            <div class="u-lt">
                                                <div class="image"><img  :src="comment.head_img_url ? comment.head_img_url :['../static/user.png']"/></div>
                                                <div class="name">{{comment.nick_name}}</div>
                                            </div>
                                            <div class="u-rt">
                                                <div class="u-hd">
                                                    <el-rate v-model="comment.score" disabled text-color="#ff9900"></el-rate>
                                                </div>
                                                <div class="u-tip">
                                                    <div class="t-item"></div>
                                                </div>
                                                <div class="u-body">
                                                    <div class="t-item">{{comment.content}}</div>
                                                    <div class="t-images" v-if="comment.images">
                                                        <div class="image" v-for="(image,k) in comment.images" :key="k"><img :src="image.content"/></div>
                                                    </div>
                                                    <div class="lg" v-if="showCommImgs[i] != ''">
                                                        <img :src="showCommImgs[i]"/>
                                                        <div class="rotate">
                                                            <div class="toleft" @click="rotateImg(-1,$event)"><i class="fa fa-rotate-left"></i>左转</div>
                                                            <div class="toright" @click="rotateImg(1,$event)"><i class="fa fa-rotate-right"></i>右转</div>
                                                        </div>
                                                        <div class="op"><i @click="hideCommImg(i,$event)" class="fa fa-search-minus"></i></div>
                                                    </div>
                                                </div>
                                                <div class="time">{{formattime(comment.createdAt)}}</div>
                                            </div>
                                        </div>
                                        <div class="pag" v-if="comments.length > 0">
                                            <el-pagination
                                                @current-change="handleCommentCurrentChange"
                                                :current-page.sync="commentQueryP.page"
                                                :page-size="commentQueryP.pageSize"
                                                layout="total,prev, pager, next"
                                                :total="commentQueryP.totalCount">
                                            </el-pagination>
                                        </div>
                                        <div class="n-exist" v-if="comments.length == 0">
                                            暂时还没有用户评价
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="aside">
                        <div class="type-block">
                            <p class="title">商品分类</p>
                            <div class="typelist">
                                <el-tree :props="typeProps" :data="typeList"  @node-click="handleNodeClick"></el-tree>
                            </div>
                        </div>
                        <div class="lastest-view" v-if="viewGoods.length > 0">
                            <p class="title">最近浏览<a @click="toUrl('/history')">查看更多<i class="fa fa-angle-right"></i></a></p>
                            <div class="goods">
                                <a  @click="toUrl('/detail',item.id,item.typeId)" class="single" v-for="(item,i) in viewGoods" :key="i">
                                    <img :src="item.thumbnail_url">
                                    <div class="about">
                                        <p class="des">{{item.name}}</p>
                                        <p class="price">￥{{item.price}}</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <!--
                <div class="footer">
                    <p class="title">用户评价</p>
                    <div class="evaluate">
                        <div class="rate">
                            <p>好评度</p>
                            <span>99%</span>
                        </div>
                        <div class="list">
                            <div>5星<div class="process"></div></div>
                            <div>4星<div class="process"></div></div>
                            <div>3星<div class="process"></div></div>
                            <div>2星<div class="process"></div></div>
                            <div>1星<div class="process"></div></div>
                        </div>

                    </div>
                </div>
                -->
                <div class="cartfixed">
                    <div class="lt">
                        <ul>
                            <li><a :class="{sel: loc == 0 ? 1:0}" @click="changeSel(0)">产品详情</a></li>
                            <li><a :class="{sel: loc == 1 ? 1:0}" @click="changeSel(1)">用户评价({{item.scoreInfo.num}})</a></li>
                        </ul>
                    </div>
                    <div class="rt">
                        <span class="price">￥{{item.price}}</span>
                        <a class="tocart" v-if="!item.isSelf && item.quantity > 0"  @click="addToCart">加入购物车</a>
                        <a class="nocart" v-if="!item.isSelf && item.quantity == 0" >暂无现货</a>
                        <a class="tocart" v-if="item.isSelf" @click="toUrl('/newProduct',item.id)">查看商品详情</a>
                    </div>
                </div>
            </div>
            <c-tool-bar :opCart="isAdd"/>
        </div>
        <footer style="border-top: 1px solid #e9e9e9;background:#fff;margin-top:20px;min-width:1040px;">
            <c-footer ></c-footer>
        </footer>
    </div>
</template>

<script>
import * as components from "@/components";
import commodityApi from "@/services/commodity";
import typeApi from "@/services/type";
import historyApi from "@/services/history";
import followApi from "@/services/follow";
import purchaseApi from "@/services/purchase";
import moment from 'moment'
export default {
  components,
  data() {
    return {
      item: {
        attributeContent: [],
        scoreInfo: {
          score: 0,
          num: 0
        },
        shop: {
          name: ""
        },
        costPrice: 0,
        price: 0,
        thumbnails:[]
      },
      commodityId: "",
      typeList: [],
      typeProps: {
        label: "name",
        value: "id",
        children: "children"
      },
      showVideo:false,
      showAudio:false,
      viewGoods: [],
      quantity: 1,
      lastModNum: 1,
      showImg: "",
      isAdd: false,
      quit: false,
      isSent: false,
      loc: 0,
      scRate: 0,
      comments: [],
      showCommImgs: [],
      similarItems:[],
      commentQ: {
        low: 0,
        mid: 0,
        high: 0,
        total: 0
      },
      commentQueryP: {
        page: 1,
        pageSize: 5,
        totalCount: 0
      },
      showCommImg: "",
      detailSwiper: {
        height: 370,
        spaceBetween: 10,
        slidesPerView: 3,
        slidesPerGroup: 3,
        direction: "vertical",
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        }
      }
    };
  },
  watch: {
    item: function() {
      let vm = this;
      vm.$nextTick(function() {
        $(".intro .preview .list img").mouseenter(function() {
          $(".intro .preview .list img").each(function() {
            $(this).removeClass("fs");
          });
          $(this).addClass("fs");
          vm.showImg = $(this).attr("src");
        });
      });
    },
    $route: "load"
  },
  mounted: function() {
    let vm = this;
    $(".intro .preview .lg").hover(
      function() {
        $(".intro .preview .lg .show-lg").css("display", "block");
      },
      function() {
        $(".intro .preview .lg .show-lg").css("display", "none");
      }
    );
    $(".intro .preview .lg").mousemove(function(e) {
      let offset = $(this).offset();
      let relativeX = e.pageX - offset.left;
      let relativeY = e.pageY - offset.top;
      let showImp = $(".intro .preview .lg .show-imp");
      let impW = showImp.css("width").split("px")[0];
      let impH = showImp.css("height").split("px")[0];
      let thisW = $(this)
        .css("width")
        .split("px")[0];
      let thisH = $(this)
        .css("height")
        .split("px")[0];
      let left =
        relativeX - impW / 2 > 0
          ? relativeX + impW / 2 > thisW ? thisW - impW : relativeX - impW / 2
          : 0;
      let top =
        relativeY - impH / 2 > 0
          ? relativeY + impH / 2 > thisH ? thisH - impH : relativeY - impH / 2
          : 0;
      showImp.css({ left: left, top: top });
      let showLg = $(".intro .preview .lg .show-lg img");
      let lgW = thisW / impW;
      let lgH = thisH / impH;
      showLg.css({ left: -left * lgW, top: -top * lgH });
    });
    window.addEventListener("scroll", vm.doScroll);
    typeApi.getList().then(res => {
      if (res.code == 0) vm.typeList = res.data;
    });
    
    vm.load();
  },
  methods: {
    formattime(time) {
      return moment(time).format("YYYY-MM-DD HH:mm:ss");
    },
    videoChange(){
      let vm = this;
      vm.showVideo = true;
    },
    audioChange(){
      let vm = this;
      vm.showAudio = true;
    },
    closePrev(){
      let vm = this;
      vm.showVideo = false;
      vm.showAudio = false;
    },
    load() {
      let vm = this;
      vm.commodityId = vm.$route.query.id;
      vm.showCommImg = "";
      commodityApi.getInfo({ id: vm.commodityId }).then(res => {
        if (res.code == 0) {
          vm.item = res.data;
          vm.showImg = vm.item.thumbnails[0].thumbnail_url;
          let cdn = {
              id:vm.item.id,
              page: 1,
              pageSize: 6,
              checked: 1
            }
            commodityApi.getSimilarCom(cdn).then( res => {
                if(res.code == 0)
                    vm.similarItems = res.data;
                else
                    vm.$message.error(res.errMsg);
            });
          if (vm.isSent) vm.isSent = !vm.isSent;
        } else vm.$message.error(res.errMsg);
      });
      commodityApi.getComments({
          id: vm.commodityId,
          page: vm.commentQueryP.page,
          pageSize: vm.commentQueryP.pageSize
        })
        .then(res => {
          if (res.code == 0) {
            vm.comments = res.data.list;
            
            for(let i of vm.comments)
                vm.showCommImgs.push("")
            vm.commentQueryP.totalCount = res.data.total;
            vm.commentQ = {
              low: res.data.low,
              mid: res.data.mid,
              high: res.data.high,
              total: res.data.total
            };
          } else vm.$message.error(res.errMsg);
        });
      let token = localStorage.getItem(vm.config.token);
      if (token) {
        historyApi
          .getList({
            page: 1,
            pageSize: 5
          })
          .then(res => {
            if (res.code == 0) vm.viewGoods = res.data.data;
          });
      }
    },
    cartChange() {
      let vm = this;
      vm.isAdd = !vm.isAdd;
    },
    toQuit() {
      let vm = this;
      vm.isAdd = !vm.isAdd;
    },
    getItemNeO(item){
      return item.filter(function(value,i){
        return i != 0;
      })
    },
    handleCommentCurrentChange(val) {
      let vm = this;
      let params = {
        id: vm.commodityId,
        page: val,
        pageSize: vm.commentQueryP.pageSize
      };
      if (vm.scRate != 0) {
        params.state = vm.scRate;
      }
      commodityApi.getComments(params).then(res => {
        if (res.code == 0) {
          vm.showCommImg = "";
          vm.comments = res.data.list;
          for(let i of vm.comments)
            i.showCommImg = ""
          if (vm.scRate == 1) vm.commentQueryP.totalCount = res.data.high;
          else if (vm.scRate == 2) vm.commentQueryP.totalCount = res.data.mid;
          else if (vm.scRate == 3) vm.commentQueryP.totalCount = res.data.low;
          else vm.commentQueryP.totalCount = res.data.total;
          vm.commentQ = {
            low: res.data.low,
            mid: res.data.mid,
            high: res.data.high,
            total: res.data.total
          };
        } else vm.$message.error(res.errMsg);
      });
    },
    changeFollow() {
      let vm = this;
      if (!vm.isSent) {
        vm.isSent = !vm.isSent;
        followApi.changeFollow({ commodityId: vm.item.id }).then(res => {
          if (res.code == 0) {
            vm.$message.success(res.data);
            vm.load();
          }
        });
      }
    },
    addToCart() {
      let vm = this;
      let params = {
        id: vm.item.id,
        count: vm.quantity
      };
      purchaseApi.addToCart(params).then(res => {
        if (res.code == 0) {
          vm.$message.success("商品加入购物车成功");
          vm.isAdd = !vm.isAdd;
        } else {
          let cart = localStorage.getItem(vm.config.cart);
          if (cart) {
            cart = JSON.parse(cart);
            let flag = false;
            for (let i of cart) {
              if (i.id == vm.item.id) {
                i.count += vm.quantity;
                flag = true;
              }
            }
            if (!flag)
              cart.splice(0, 0, {
                id: vm.item.id,
                count: vm.quantity
              });
            if (cart.length > 5) cart.slice(5);
            localStorage.setItem(vm.config.cart, JSON.stringify(cart));
          } else {
            let item = [
              {
                id: vm.item.id,
                count: vm.quantity
              }
            ];
            localStorage.setItem(vm.config.cart, JSON.stringify(item));
          }
          vm.$message.success("商品加入购物车成功");
          vm.isAdd = !vm.isAdd;
        }
      });
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
      if (val == "/detail") {
        $("html,body").animate({ scrollTop: "0px" }, 300);
      }
    },
    handleNodeClick(val) {
      let vm = this;
      vm.$router.push({ path: "/list", query: { typeId: val.id } });
    },
    doOp(op) {
      let vm = this;
      if (vm.quantity > 1 && op < 0) {
        vm.quantity = vm.quantity - 1;
        return;
      }
      if (op > 0 && vm.quantity < vm.item.quantity) {
        vm.quantity = vm.quantity + 1;
        return;
      }
    },
    changeSel(val) {
      let vm = this;
      vm.loc = val;
      if ($(".details .container .c-top").length == 0) return;
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      let topHeight = $(".details .container .c-top").offset().top;
      $("html,body").animate({ scrollTop: topHeight }, 200);
    },
    changeScRate(val) {
      let vm = this;
      if (vm.scRate != val) {
        vm.scRate = val;
        vm.handleCommentCurrentChange(1);
      } else vm.scRate = val;
    },
    testSum() {
      let vm = this;
      let numReg = /^\+?[1-9][0-9]*$/;
      if (!numReg.test(vm.quantity) || vm.quantity > vm.item.quantity) {
        vm.quantity = vm.lastModNum;
      }
      vm.quantity = parseInt(vm.quantity);
    },
    saveSum() {
      let vm = this;
      vm.lastModNum = vm.quantity;
    },
    hideCommImg(val,e) {
      let vm = this;
      vm.showCommImgs[val] = "";
      vm.showCommImgs.push("0000");
      vm.showCommImgs.slice(vm.showCommImgs.length - 1,vm.showCommImgs.length)
      $(e.currentTarget).parent().parent().siblings(".t-images").children(".image").removeClass("ds");
    },
    resolveMatrix(e) {
      let tr =  e.css("transform");
      if(tr == "none") return 0;
      let values = tr.split("(")[1].split(")")[0].split(",");
      let a = values[0];
      let b = values[1];
      let c = values[2];
      let d = values[3];
      let scale = Math.sqrt(a * a + b * b);
      let sin = b / scale;
      let angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
      return angle;
    },
    rotateImg(op,e) {
      let vm = this;
      let angle = vm.resolveMatrix($(e.currentTarget).parent().siblings("img"));
      if (op < 0) $(e.currentTarget).parent().siblings("img").css("transform", "rotate(" + (angle - 90)%360 + "deg)");
      else $(e.currentTarget).parent().siblings("img").css("transform", "rotate(" + (angle + 90)%360 + "deg)");
    },
    doScroll() {
      let vm = this;
      if ($(".details .container .c-top").length == 0) return;
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop ||
        document.body.scrollTop;
      let topHeight = $(".details .container .c-top").offset().top;
      if (scrollTop > topHeight) $(".cartfixed").css("display", "flex");
      else $(".cartfixed").css("display", "none");
    },
    changeQuery(i) {
      let vm = this;
      if (i == 0) vm.$router.push({ path: "/" });
      else vm.$router.push({ path: "/list", query: { typeId: i } });
    }
  },
  updated() {
    let vm = this;
    $(".ql-editor img").css("max-width", "100%");

    $(".t-images .image").on("click", function(e) {
        let image = this;
      $(image).siblings(".t-images .image").removeClass("ds");
      $(image).addClass("ds");
      let parent = $(image).parent()
      $(".t-images").each(function(index){
        if( parent[0] == $(this)[0]) {
            $(this).siblings(".lg").children("img").css("transform","rotate(0deg)");
            vm.showCommImgs[index] = $(image).children("img").eq(0).attr("src");
            vm.showCommImgs.push("0000");
            vm.showCommImgs.slice(vm.showCommImgs.length - 1,vm.showCommImgs.length)
        }
      })
    });
  }
};
</script>
<style scoped lang="scss">
@import "./style";
</style>
