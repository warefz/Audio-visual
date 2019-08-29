<template>
  <div class="newcom-content">
      <div class="container">
        <div class="header">
            <p class="title">我的店铺</p>
            <div class="op">
              <a class="save" @click="getCommodities" v-if="showInfo == 1 && shop.checked == 1">查看商品</a>
              <a class="save" @click="getSellCommodities" v-if="showInfo == 1 && shop.checked == 1">查看销售详情</a>
              <!-- <a class="save" @click="newShop" v-if="showInfo == 0 && !newShopShow">新建店铺</a> -->
            </div>
        </div>
        <div class="body" v-if="showInfo == 1 || newShopShow">
            <div class="item-name">
                <span class="name">店铺名称：</span>
                <input type="text" placeholder="请输入商品名称" v-model="shop.name"/>
            </div>
            <div class="item-state" v-if="shop.id != ''">
                <span class="name">店铺状态：</span>
                <span class="state" v-if="shop.checked == 1">正在销售</span>
                <span class="state" v-if="shop.checked == -1">正在审核</span>
                <span class="state" v-if="shop.checked == 0">审核失败</span>
            </div>
            <div class="item-banner">
                <div class="title">
                    <span class="name">横幅图片：</span>
                    <a  class="upload" @click="bannerUpload">上传图片</a>
                </div>
                <div class="images" v-if="shop.bannerImg">
                  <img :src="shop.bannerImg"/>
                </div>
            </div>
            <div class="item-thumbnail">
                <div class="title">
                    <span class="name">店铺图标：</span>
                    <a  class="upload" @click="thumbnailUpload">上传图片</a>
                </div>
                <div class="images" v-if="shop.thumbnail">
                    <img  class="image" :src="shop.thumbnail"/>
                </div>
            </div>
            <div class="item-quantity" v-if="shop.id != ''">
                <span class="name">商品数量：</span>
                <span>{{shop.commodityQuantity}}</span>
            </div>
            <div class="item-sell" v-if="shop.id != ''">
                <span class="name">商品销量：</span>
                <span>{{shop.sellQuantity}}</span>
            </div>
            <div class="item-base">
                <span class="name"><span class="label">地址信息：</span></span>
                <select  v-model="provSelected" @change="getProvSelected">                                        
                    <option :value="prov.label" v-for="(prov,i) in provinces" :key="i">{{prov.label}}</option>                                    
                </select>
                <select  v-model="citySelected" @change="getCitySelected">                                        
                    <option :value="city.label" v-for="(city,i) in cities" :key="i">{{city.label}}</option>                                    
                </select>
                <select  v-model="districtSelected">                                        
                    <option :value="district.label" v-for="(district,i) in districts" :key="i">{{district.label}}</option>                                    
                </select>
            </div>
            <div class="item-intro">
                <span class="name">店铺介绍：</span>
                <textarea rows="3" cols="46" v-model="shop.description"
                    placeholder="请输入详细地址信息，如道路、门牌号、小区、楼栋号、单元等信息">
                </textarea>
            </div>
            <div class="item-tele">
                <span class="name">联系电话：</span>
                <input type="text" placeholder="请输入联系电话" v-model="shop.telephone"/>
            </div>
            <div class="item-edit" >
                <a class="save" @click="save">保存</a>
                <a class="cancel" @click="cancel">取消</a>
            </div>
        </div>
        <div class="body" v-if="showInfo == 0 && !newShopShow">
          <div class="image">
            <img :src="['../static/shop.png']">
            <div class="tip">暂不存在商铺信息</div>
          </div>
        </div>
      </div>
      <file-wrapper @on-file-change="bannerImgChange" ref="bannerFileWrap"></file-wrapper>
      <file-wrapper @on-file-change="thumbnailImgChange" ref="thumbnailFileWrap"></file-wrapper>
  </div>
</template>

<script>
import fileUploader from "@/utils/fileUploader";
import * as components from "@/components";
import shopApi from "@/services/shop";
export default {
  components,
  data() {
    return {
      shop: {
        id: "",
        name: "",
        bannerImg: "",
        thumbnail: "",
        description: "",
        telephone: "",
        sellQuantity: "",
        commodityQuantity: "",
        checked: -1
      },
      provinces: "",
      provSelected: "",
      cities: "",
      citySelected: "",
      districts: "",
      districtSelected: "",
      showInfo: -1,
      newShopShow: false
    };
  },
  mounted: function() {
    let vm = this;
    vm.provinces = vm.regions.provinces;
    vm.load();
  },
  methods: {
    getCommodities() {
      let vm = this;
      vm.$router.push({ path: "/commodity" });
    },
    getSellCommodities() {
      let vm = this;
      vm.$router.push({ path: "/sellList" });
    },
    load() {
      let vm = this;
      shopApi.getInfo().then(res => {
        if (res.code == 0) {
          if (res.data) {
            vm.shop = res.data;
            vm.showInfo = 1;
            let ls = res.data.address.split("/");
            if (ls.length > 0) {
              vm.provSelected = ls[0];
              vm.cities = vm.regions.cities[vm.provSelected];
            }
            if (ls.length > 1) {
              vm.citySelected = ls[1];
              vm.districts = vm.regions.districts[vm.citySelected];
            }
            if (ls.length > 2) {
              vm.districtSelected = ls[2];
            }
          } else vm.showInfo = 0;
        }
      });
    },
    cancel() {
      let vm = this;
      vm.load();
    },
    newShop(){
      let vm = this;
      vm.newShopShow = true;
    },
    save() {
      let vm = this;
      let data = vm.testComInfo();
      let item = vm.shop;
      if (data.code == 0) {
        let sdMessage = {
          name: item.name,
          banner_url: item.bannerImg,
          thumbnail_url: item.thumbnail,
          telephone: item.telephone,
          id: item.id,
          description: item.description,
          address:
            vm.provSelected +
            (vm.citySelected == ""
              ? ""
              : "/" +
                vm.citySelected +
                (vm.districtSelected == "" ? "" : "/" + vm.districtSelected))
        };
        if(item.checked == 0)
          sdMessage.checked = -1;
        shopApi.edit(sdMessage).then(res => {
          if (res.code == 0) {
            vm.$message.success("店铺信息更新成功");
            vm.load();
          } else vm.$message.error(res.errMsg);
        });
      } else vm.$message.error(data.errMsg);
    },
    testComInfo() {
      let vm = this;
      let item = vm.shop;
      let code = -1;
      if (item.name.length == 0)
        return { errMsg: "店铺名称不能为空", code: code };
      if (item.description.length == 0)
        return { errMsg: "店铺描述不能为空", code: code };
      if (item.bannerImg.length == 0)
        return { errMsg: "店铺横幅图片不能为空", code: code };
      if (item.thumbnail.length == 0)
        return { errMsg: "店铺缩略图不能为空", code: code };
      if (
        vm.provSelected == "" &&
        vm.citySelected == "" &&
        districtSelected == ""
      )
        return { errMsg: "地址信息不能为空", code: code };
      if (item.telephone.length == 0)
        return { errMsg: "联系方式不能为空", code: code };
      return { code: 0 };
    },
    thumbnailUpload() {
      let vm = this;
      vm.$refs.thumbnailFileWrap.openFinder();
    },
    thumbnailImgChange(file) {
      let vm = this;
      fileUploader.normal(file).then(data => {
        if (data.code == 0) {
          vm.shop.thumbnail = data.data;
        } else vm.$message.error(data.errMsg);
      });
    },
    bannerUpload() {
      let vm = this;
      vm.$refs.bannerFileWrap.openFinder();
    },
    bannerImgChange(file) {
      let vm = this;
      fileUploader.normal(file).then(data => {
        if (data.code == 0) vm.shop.bannerImg = data.data;
        else vm.$message.error(data.errMsg);
      });
    },
    getProvSelected() {
      let vm = this;
      let provSelected = vm.provSelected;
      vm.cities = vm.regions.cities[provSelected];
      vm.districts = "";
    },
    getCitySelected() {
      let vm = this;
      let citySelected = vm.citySelected;
      vm.districts = vm.regions.districts[citySelected];
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.newcom-content {
  margin-top: 10px;
  margin-left: 20px;
  background: #fff;
  border: 1px solid #e9e9e9;
  width: 88%;
  .container {
    .header {
      border-bottom: 1px solid #e9e9e9;
      display: flex;
      justify-content: space-between;
      .op{
        display: flex;
        align-items: center;
      }
      .save {
        display: inline-block;
        background: #5584ff;
        color: #fff;
        height: 14px;
        padding: 7px 20px;
        margin-right: 10px;
        border-radius: 3px;
        font-size: 12px;
      }
      .title {
        color: #666;
        font-weight: 700;
        font-size: 16px;
        padding: 15px 20px;
      }
    }
  }
  .body {
    padding: 20px;
    div {
      .name {
        display: block;
        width: 100px;
        text-align: right;
        line-height: 16px;
        padding: 5px;
        font-size: 13px;
        font-weight: 600;
      }
    }
    input {
      box-sizing: border-box;
      margin-left: 5px;
      padding: 6px 12px;
      height: 34px;
      font-size: 14px;
      border-radius: 3px;
      border: 1px solid #dad7d7;
      &:focus {
        border-color: #409eff;
      }
    }
    .image {
      img {
        width: 400px;
      }
      .tip{
        margin-left: 120px;
      }
    }
    .tip {
      font-size: 20px;
      font-weight: 600;
      a{
        margin-left: 20px;
        border-radius: 3px;
        font-weight: normal;
        padding: 6px 10px;
        font-size: 16px;
        background: #5584ff;
        color: #fff;
      }
    }
    .item-tip {
      background: #fdf6ec;
      border: 1px solid #f5dab1;
      padding: 5px 10px;
      margin-bottom: 10px;
      i {
        color: #e6a23c;
        margin-right: 10px;
      }
    }
    .item-name {
      display: flex;
      align-items: center;
      .name:before {
        margin-right: 4px;
        content: "*";
        color: #ff3000;
      }
      input {
        width: 350px;
      }
    }
    .item-state{
      display: flex;
      align-items: center;
      .state{
        margin-left: 5px;
      }
    }
    .item-banner {
      .name:before {
        margin-right: 4px;
        content: "*";
        color: #ff3000;
      }
      .title {
        display: flex;
        align-items: center;
      }
      .upload {
        margin-left: 5px;
        padding: 7px 0;
        border-radius: 3px;
        color: #337ab7;
        font-weight: 600;
        font-size: 16px;
      }
      .images {
        margin-left: 115px;
        img {
          max-width: 400px;
          max-height: 200px;
        }
      }
    }
    .item-thumbnail {
      .name:before {
        margin-right: 4px;
        content: "*";
        color: #ff3000;
      }
      .title {
        display: flex;
        align-items: center;
      }
      .upload {
        margin-left: 5px;
        padding: 7px 0;
        border-radius: 3px;
        color: #337ab7;
        font-weight: 600;
        font-size: 16px;
      }
      .images {
        margin-top: 10px;
        margin-left: 115px;
        display: flex;
        flex-direction: column;
        .image {
          width: 80px;
          height: 80px;
        }
      }
    }
    .item-base {
      .name:before {
        margin-right: 4px;
        content: "*";
        color: #ff3000;
      }
      display: flex;
      margin-top: 10px;
      select {
        border-radius: 3px;
        margin-right: 10px;
        border: 1px solid #cecece;
      }
    }
    .item-quantity {
      margin-top: 20px;
      display: flex;
      align-items: center;
    }
    .item-sell {
      display: flex;
      align-items: center;
      .number {
        margin: 0 10px;
        span {
          margin-right: 5px;
        }
      }
    }
    .item-intro {
      margin-top: 20px;
      display: flex;
      .name:before {
        margin-right: 4px;
        content: "*";
        color: #ff3000;
      }
      textarea {
        border-radius: 3px;
        padding: 5px;
        border: 1px solid #cecece;
      }
    }
    .item-tele {
      margin-top: 10px;
      display: flex;
      .name:before {
        margin-right: 4px;
        content: "*";
        color: #ff3000;
      }
      input {
        margin-left: 0;
      }
    }
    .item-edit {
      margin: 50px 0 20px 130px;
      a {
        padding: 7px 20px;
        margin-right: 10px;
        border-radius: 3px;
        font-size: 14px;
      }
      .save {
        background: #5584ff;
        color: #fff;
      }
      .cancel {
        background: #fff;
        border: 1px solid #bdbdbd;
        &:hover {
          background: #e9e9e9;
        }
      }
    }
  }
}
</style>
