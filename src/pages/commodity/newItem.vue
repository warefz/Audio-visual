<template>
  <div class="newcom-content">
      <div class="container">
        <div class="header">
            <p class="title">编辑商品</p>
        </div>
        <div class="body">
            <div class="item-tip">
                <i class="fa fa-warning"></i>
                *号内容不能为空；当修改商品信息时，无论图片或者文字信息均需要点击保存使之生效；
                通过点击保存提交商品信息，提交后需要等待管理员审核商品信息（若审核失败
                可以修改信息再次提交审核）。
            </div>
            <div class="item-name">
                <span class="name">商品名称：</span>
                <input type="text" placeholder="请输入商品名称" v-model="commodity.name"/>
            </div>
            <div class="item-type">
                <span class="name">商品分类：</span>
                <select  v-model="commodity.rootType" @change="getRootTypeSelected">                                        
                    <option :value="t.name" v-for="(t,i) in commodity.rootTypes" :key="i">{{t.name}}</option>                                    
                </select>
                <select  v-model="commodity.type">                                        
                    <option :value="t.name" v-for="(t,i) in commodity.types" :key="i">{{t.name}}</option>                                    
                </select>
            </div>
            <div class="item-banner">
                <div class="title">
                    <span class="name">横幅图片：</span>
                    <a  class="upload" @click="bannerUpload">上传图片</a>
                </div>
                <div class="images">
                  <img :src="commodity.bannerImg"/>
                </div>
            </div>
            <div class="item-thumbnail">
                <div class="title">
                    <span class="name">商品缩略图：</span>
                    <a  class="upload" @click="thumbnailUpload">上传图片</a>
                </div>
                <div class="images">
                    <div class="title">
                      <div class="show-img">图片</div>
                      <div class="show-operation">操作</div>
                    </div>
                    <div class="tip" v-if="commodity.thumbnails.length == 0">
                      暂无缩略图信息
                    </div>
                    <div class="image" v-else v-for="(t,i) in commodity.thumbnails" :key="i">
                        <div class="source">
                            <img :src="t.src"/>
                        </div>
                        <div class="opr">
                            <div class="dos">
                                <a class="delete" @click="delThumbnail(i)">删除</a>
                            </div>
                            <div class="sort">
                                <a @click="moveThumbnail(i,-1)" v-if="i != 0"><i class="fa fa-long-arrow-up"></i></a>
                                <a @click="moveThumbnail(i,1)" v-if="i != commodity.thumbnails.length - 1"><i class="fa fa-long-arrow-down"></i></a>
                            </div>
                        </div>
                    </div>
                    <div class="bt">
                      <i class="fa fa-warning"></i>最多可以展示4张缩略图照片
                    </div>
                </div>
            </div>
            <div class="item-cost">
                <span class="name">原价：</span>
                <input type="text" placeholder="请输入商品原价" v-model="commodity.costPrice"/>
            </div>
            <div class="item-price">
                <span class="name">现价：</span>
                <input type="text" placeholder="请输入商品售价" v-model="commodity.price"/>
            </div>
            <div class="item-quantity">
                <span class="name">数量：</span>
                <input type="text" placeholder="请输入商品数量" v-model="commodity.quantity"/>
            </div>
            <div class="item-sell" v-if="id.length != 0">
                <span class="name">销量：</span>
                <span class="number"><span>{{commodity.sellQuantity}}</span>件</span>
            </div>
            <div class="item-type">
                <span class="name">资源类型：</span>
                <select  v-model="modelType" @change="modelTypeSelected">                                        
                    <option :value="t.id" v-for="(t,i) in modelTypes" :key="i">{{t.name}}</option>                                    
                </select>
                
                <a class="source-a" @click="modelUpload" v-if="modelType != 0">上传资源</a>
                
            </div>
            <video  class="source-video" controls="" name="media" v-if="modelType == 1 && modelURL != ''">
              <source :src="modelURL" type="audio/mpeg">
            </video>
            <audio class="source-audio" style="outline:none" :src="modelURL" v-if="modelType == 2 && modelURL != ''" controls></audio>
            
            <div class="item-attribute">
                <span class="name">商品属性：</span>
                <div class="list">
                    <div class="item" v-for="d in commodity.attributeContent" :key="d.seq">
                        <div class="content-area">
                            <el-select v-model="d.name" size="small" placeholder="请选择" @change="getAttributeId(d)">
                                <el-option v-for="item in commodity.attributes" :key="item.id" 
                                 :label="item.name" :value="item.name" >
                                </el-option>
                            </el-select>
                            <input type="text" v-model="d.content" :placeholder="['请输入'+d.name+'属性内容']"/>
                        </div>
                        <div class="item-operation">
                            <a class="op"><i class="fa fa-plus " ></i></a>
                            <ul class="dropdown-menu" aria-labelledby="dLabel">
                                <li class="dropdown-item">
                                    <a @click="addAttribute(d.seq-1)">上面插入属性</a>
                                </li>
                                <li class="dropdown-item">
                                    <a  @click="removeCurrentAttr(d.seq)">删除当前节点</a>
                                </li>
                                <li class="dropdown-item">
                                    <a @click="addAttribute(d.seq)">下面插入属性</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="new-content">
                        <a class="text-btn" @click="addAttribute(commodity.attributeContent.length)">添加属性</a>
                    </div>
                </div>
            </div>
            <!--<div class="item-intro">
                <span class="name">商品介绍：</span>
                <div class="list">
                    <div class="item" v-for="d in detailContent" :key="d.seq">
                        <div class="content-area">
                            <textarea v-if="d.type === 'TEXT'" v-model="d.content"  rows="4" cols="60"></textarea>
                            <img v-if="d.type === 'IMAGE_URL'" :src="d.content" width="400px" >
                        </div>
                        <div class="item-operation">
                            <a class="op"><i class="fa fa-plus " ></i></a>
                            <ul class="dropdown-menu" aria-labelledby="dLabel">
                                <li class="dropdown-item">
                                    <a  @click="addText(d.seq-1)">上面插入文字</a>
                                </li>
                                <li class="dropdown-item">
                                    <a>
                                        <image-wrap  @on-file-change="addImage(d.seq-1,...arguments)">
                                            上面插入图片
                                        </image-wrap>
                                    </a>
                                </li>
                                <li class="dropdown-item">
                                    <a  @click="removeCurrentNode(d.seq)">删除当前节点</a>
                                </li>
                                <li class="dropdown-item">
                                    <a @click="addText(d.seq)">下面插入文字</a>
                                </li>
                                <li class="dropdown-item">
                                    <a>
                                        <image-wrap  @on-file-change="addImage(d.seq,...arguments)">
                                            下面插入图片
                                        </image-wrap>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="new-content">
                        <a  class="text-btn" @click="addText(detailContent.length)">添加文字</a>
                        <image-wrap class="addimg img-btn" @on-file-change="addImage(detailContent.length,...arguments)">
                            添加图片
                        </image-wrap>
                    </div>
                </div>
            </div>-->
            <div class="item-intro">
                <span class="name">商品介绍：</span>
                <quill-editor  ref="newEditor"  v-model="commodity.intro" 
                  :options="editorOption" style="width:774px;"
                  @change="onEditorChange($event)" 
                  ></quill-editor>
            </div>
            <div class="item-edit" >
                <a class="save" @click="save">保存</a>
                <a class="cancel" @click="cancel">取消</a>
            </div>
        </div>
      </div>
      <file-wrapper @on-file-change="contentImgChange" ref="contentFileWrap"></file-wrapper>
      <file-wrapper @on-file-change="bannerImgChange" ref="bannerFileWrap"></file-wrapper>
      <file-wrapper @on-file-change="thumbnailImgChange" ref="thumbnailFileWrap"></file-wrapper>
      <file-wrapper @on-file-change="modelChange" ref="modelFileWrap"></file-wrapper>
  </div>
</template>

<script>
import commodityApi from "@/services/commodity";
import attributeApi from "@/services/attribute";
import typeApi from "@/services/type";
import fileUploader from "@/utils/fileUploader";
import * as components from "@/components";
import { addQuillTitle } from "@/utils/quill-title.js";
import ImageResize from "quill-image-resize-module";
import * as Quill from "quill";
Quill.register("modules/imageResize", ImageResize);
export default {
  components,
  data() {
    return {
      editorOption: {
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            ["blockquote", "code-block"],
            [{ header: 1 }, { header: 2 }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ direction: "rtl" }],
            [{ size: ["small", false, "large", "huge"] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }, { background: [] }],
            [{ font: [] }],
            [{ align: [] }],
            ["clean"],
            ["image", "video"]
          ],
          imageResize: {}
        }
      },
      commodity: {
        intro: "",
        name: "", //商品名
        rootTypes: [],
        rootType: "",
        types: [],
        type: "", //分类,
        bannerImg: "", //横幅图片
        thumbnails: [], //缩略图
        costPrice: "", //原价
        price: "", //价格
        quantity: "", //数量
        sellQuantity: 0,
        //detailContent: [],
        attributeContent: [],
        attributes: [], //属性
        addImg: "", //商品内容上传图片
      },
      modelType:0,
      modelTypes:[
        {name:"无",id:0},
        {name:"视频",id:1},
        {name: "音频",id:2}
      ],
      modelURL:"",
      id:"",
      props: {
        value: "label",
        children: "children"
      }
    };
  },
  watch:{
    modelType(val){
      console.log(this.modelType)
    }
  },
  mounted: function() {
    let vm = this;
    addQuillTitle();
    attributeApi.getList().then(res=>{
      vm.commodity.attributes = res.data;
    });
    typeApi.getRootType().then(res=>{
      vm.commodity.rootTypes = res.data;
    });
    
    if(vm.$route.query.id){
      vm.id = vm.$route.query.id
      let cId = { id: vm.id }
      commodityApi.getInfo(cId).then(res => {
        if(res.code == 0){
          let ls = res.data;
          let item = vm.commodity;
          item.intro = ls.content;
          item.name = ls.name;
          item.bannerImg = ls.bannerImg;
          item.costPrice = ls.costPrice == 0 ? "":ls.costPrice;
          item.quantity = ls.quantity;
          item.price = ls.price;
          item.sellQuantity = ls.sellQuantity;
          vm.modelType = ls.modelType || 0;
          vm.modelURL = ls.modelUrl || "";
          for(let i of ls.thumbnails)
            item.thumbnails.push({src: i.thumbnail_url,seq: i.seq});
          item.attributeContent = ls.attributeContent;
          item.rootType = ls.typeRoute[0].name;
          vm.getRootTypeSelected();
          item.type = ls.typeRoute[1].name;
        }
        else
          vm.$message.error(res.errMsg)
      })
    }
    let imgHandler = async function(state) {
      if (state) vm.contentUpload();
    };
    vm.$refs.newEditor.quill
      .getModule("toolbar")
      .addHandler("image", imgHandler);
  },
  methods: {
    modelTypeSelected(){
      let vm = this;
      vm.modelURL = "";
    },
    save() {
      let vm = this;
      let data = vm.testComInfo();
      let item = vm.commodity;
      if (data.code == 0) {
        let sdMessage ={
          intro: item.intro,
          name: item.name,
          type: item.types[vm.getTypeIndex(item.type)].id, 
          bannerImg: item.bannerImg,
          thumbnails: item.thumbnails,
          costPrice: item.costPrice.length == 0 ? 0 : item.costPrice,
          price: item.price,
          quantity: item.quantity,
          attributeContent:item.attributeContent,
          modelType:vm.modelType,
          modelURL: vm.modelURL
        }
        if(vm.id.length != 0){
          sdMessage.id = parseInt(vm.id);
          commodityApi.editCommodity(sdMessage).then(res => {
            if (res.code == 0){
              vm.$message.success("商品信息更新成功");
              vm.$router.push({path:'/commodity'})
            }
            else vm.$message.error(res.errMsg);
          });
        }
        else
          commodityApi.createCommodity(sdMessage).then(res => {
            if (res.code == 0){
              vm.$message.success("商品信息更新成功");
              vm.$router.push({path:'/commodity'})
            }
            else vm.$message.error(res.errMsg);
          });
      } else vm.$message.error(data.errMsg);

    },
    cancel(){
      let vm = this;
      vm.$router.go(-1);
    },
    testComInfo() {
      let vm = this;
      let item = vm.commodity;
      let code = -1;
      if (item.name.length == 0)
        return { errMsg: "商品名称不能为空", code: code };
      if (item.type.length == 0)
        return { errMsg: "商品分类不能为空", code: code };
      if (item.bannerImg.length == 0)
        return { errMsg: "商品横幅图片不能为空", code: code };
      if (item.thumbnails.length == 0)
        return { errMsg: "商品缩略图不能为空", code: code };
      if (item.costPrice.length != 0 && vm.testPrice(item.price) != 0)
        return { errMsg: "商品原价格式为错误", code: code };
      if (item.price.length == 0)
        return { errMsg: "商品价格不能为空", code: code };
      if (vm.testPrice(item.price) != 0)
        return { errMsg: "商品价格格式错误", code: code };
      if (vm.testQuantity(item.quantity) != 0)
        return { errMsg: "商品数量格式错误", code: code };
      if (item.intro.length == 0)
        return { errMsg: "商品介绍不能为空", code: code };
      return {code:0};
    },
    testPrice(i) {
      let vm = this;
      let price = vm.commodity.price;
      let priceReg = /^\d+(\.\d+)?$/;
      if (!priceReg.test(price)) return -1;
      return 0;
    },
    testQuantity() {
      let vm = this;
      let quantity = vm.commodity.quantity;
      let quantityReg = /^\d+$/;
      if (!quantityReg.test(quantity)) return -1;
      return 0;
    },
    onEditorChange() {
      //console.log(this.intro)
    },
    typeChange() {
      let vm = this;
    },
    delThumbnail(i){
      let vm = this;
      vm.commodity.thumbnails.splice(i,1);
    },
    getAttributeId(val){
      let vm = this;
      for(let i of vm.commodity.attributes){
        if(val.name == i.name){
          val.attribute_id = i.id
        }
      }
    },
    getRootTypeIndex(val) {
      let vm = this;
      for (let i in vm.commodity.rootTypes) {
        if (vm.commodity.rootTypes[i].name == val) return i;
      }
      return -1;
    },
    getRootTypeSelected() {
      let vm = this;
      let index = vm.getRootTypeIndex(vm.commodity.rootType);
      if (index > -1) {
        vm.commodity.types.splice(0, vm.commodity.types.length);
        vm.commodity.type = "";
        let id = {
          type: vm.commodity.rootTypes[index].id
        }
        typeApi.getTypes(id).then(res=>{
          vm.commodity.types = res.data;
        })
      }
    },
    getTypeIndex(val) {
      let vm = this;
      for (let i in vm.commodity.types) {
        if (vm.commodity.types[i].name == val) return i;
      }
      return -1;
    },
    moveThumbnail(i, op) {
      let vm = this;
      let tmp = op > 0 ? 1 : -1;
      let start = vm.commodity.thumbnails[i].seq;
      vm.commodity.thumbnails[i].seq = vm.commodity.thumbnails[i + tmp].seq;
      vm.commodity.thumbnails[i + tmp].seq = start;
      vm.commodity.thumbnails.sort((a, b) => a.seq - b.seq);
    },
    getMaxThumbSeq() {
      let vm = this;
      if (vm.commodity.thumbnails.length == 0) return 0;
      let seq = 0;
      for (let i of vm.commodity.thumbnails) if (i.seq > seq) seq = i.seq;
      return seq;
    },
    thumbnailUpload() {
      let vm = this;
      if (vm.commodity.thumbnails.length >= 4) {
        vm.$message.error("超出上传数量");
        return;
      }
      vm.$refs.thumbnailFileWrap.openFinder();
    },
    thumbnailImgChange(file) {
      let vm = this;
      fileUploader.normal(file).then(data => {
        if (data.code == 0) {
          vm.commodity.thumbnails.push({
            src: data.data,
            seq: vm.getMaxThumbSeq() + 1
          });
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
        if (data.code == 0) vm.commodity.bannerImg = data.data;
        else vm.$message.error(data.errMsg);
      });
    },
    contentUpload() {
      let vm = this;
      vm.$refs.contentFileWrap.openFinder();
    },
    modelUpload(){
      let vm = this;
      vm.$refs.modelFileWrap.openFinder();
    },
    modelChange(file) {
      let vm = this;
      fileUploader.normal(file).then(data => {
        debugger
        if (data.code == 0) vm.modelURL = data.data;
        else vm.$message.error(data.errMsg);
      });
    },
    contentImgChange(file) {
      let vm = this;
      fileUploader.normal(file).then(data => {
        if (data.code == 0) {
          vm.addImg = vm.$refs.newEditor.quill.getSelection();
          vm.$refs.newEditor.quill.insertEmbed(
            vm.addImg != null ? vm.addImg.index : 0,
            "image",
            data.data,
            Quill.sources.USER
          );
        } else vm.$message.error(data.errMsg);
      });
    },
    addAttribute(pos) {
      let vm = this;
      vm.commodity.attributeContent.splice(pos,0,{
        type: "Attribute",
        attribute_id:"",
        name: "",
        content:"",
        seq: pos + 1
      });
      for (let i = pos + 1; i < vm.commodity.attributeContent.length; i++)
        vm.commodity.attributeContent[i].seq++;
    },
    removeCurrentAttr(pos) {
      let vm = this;
      vm.commodity.attributeContent.splice(pos - 1, 1);
      for (let i = pos - 1; i < vm.commodity.attributeContent.length; i++)
        vm.commodity.attributeContent[i].seq--;
    }
    /*
    addText(pos) {
      let vm = this;
      vm.detailContent.push({
        type: "TEXT",
        content: "",
        seq: pos + 1
      });
      for (let i = pos + 1; i < vm.detailContent.length; i++) {
        vm.detailContent[i].seq++;
      }
    },
    removeCurrentNode(pos) {
      let vm = this;
      vm.detailContent.splice(pos - 1, 1);
      for (let i = pos - 1; i < vm.detailContent.length; i++) {
        vm.detailContent[i].seq--;
      }
    },
    addImage(pos, file) {
      let vm = this;
      fileUploader
        .toBase64(file)
        .then(data => {
          vm.detailContent.splice(pos, 0, {
            type: "IMAGE_URL",
            content: data,
            seq: pos + 1
          });
          for (let i = pos + 1; i < vm.detailContent.length; i++) {
            vm.detailContent[i].seq++;
          }
        })
        .catch(err => {
          console.log("catch!!!", err.stack);
        });
    }*/
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.el-select-dropdown {
  ul {
    li {
      float: initial;
    }
  }
}
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
    .item-type {
      display: flex;
      align-items: center;
      .name:before {
        margin-right: 4px;
        content: "*";
        color: #ff3000;
      }
      select {
        margin: 10px 0 10px 5px;
        padding: 3px 8px;
        border-radius: 3px;
        border-color: #dad7d7;
        outline: none;
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
        padding: 7px 10px;
        border-radius: 3px;
        color: #337ab7;
        font-weight: 600;
        font-size: 16px;
      }
      .images {
        margin-left: 115px;
        img {
          max-width: 800px;
          max-height: 400px;
        }
      }
    }
    .item-thumbnail {
      margin-top: 15px;
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
        padding: 7px 10px;
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
        .title {
          text-align: center;
          border-bottom: 1px solid #ebeef5;
          border-top: 1px solid #ebeef5;
          width: 260px;
          padding: 10px 0;
          font-weight: 600;
          .show-img {
            width: 120px;
            padding: 0 5px;
            border-right: 1px solid #ebeef5;
          }
          .show-operation {
            width: 120px;
            padding: 0 5px;
          }
        }
        .tip {
          width: 260px;
          padding: 10px 0;
          text-align: center;
          border-bottom: 1px solid #ebeef5;
        }
        .image {
          display: flex;
          width: 260px;
          margin-right: 45px;
          position: relative;
          border-bottom: 1px solid #ebeef5;
          .source {
            text-align: center;
            width: 120px;
            padding: 10px 5px;
            img {
              width: 80px;
              height: 80px;
            }
          }
          label {
            display: block;
          }
          .opr {
            width: 120px;
            padding: 10px 5px;
            display: flex;
            flex-direction: column;
            text-align: center;
            justify-content: center;
            font-size: 14px;
            .dos {
              margin-bottom: 10px;
              &:hover {
                color: #e4393c;
              }
            }
            .sort {
              i {
                font-size: 16px;
                margin: 0 2px;
                &:hover {
                  color: #337ab7;
                }
              }
            }
          }
          /*
          .opr {
            z-index: 5;
            padding: 8px 5px;
            position: absolute;
            display: flex;
            flex-direction: column;
            background: #fff;
            left: 0;
            width: 30px;
            text-align: center;
            transition: all 0.2s;
            border: 1px solid #e9e9e9;
            .dos .delete {
              &:hover {
                color: #e4393c;
              }
            }
            .sort {
              margin-top: 5px;
              font-size: 16px;
              a:hover {
                color: #5c90d2;
              }
            }
          }*/
        }
        .bt {
          width: 260px;
          color: #e6a23c;
          padding-top: 5px;
          i {
            margin-right: 5px;
          }
        }
      }
    }
    .item-cost {
      margin-top: 20px;
      display: flex;
    }
    .item-price {
      margin-top: 20px;
      display: flex;
      .name:before {
        margin-right: 4px;
        content: "*";
        color: #ff3000;
      }
    }
    .item-quantity {
      margin-top: 20px;
      display: flex;
      .name:before {
        margin-right: 4px;
        content: "*";
        color: #ff3000;
      }
    }
    .item-sell {
      margin-top: 20px;
      display: flex;
      align-items: center;
      .number {
        margin: 0 10px;
        span {
          margin-right: 5px;
        }
      }
    }
    .item-attribute {
      margin-top: 20px;
      display: flex;
      .list {
        .item {
          display: flex;
          .content-area {
            margin-left: 5px;
            .el-select {
              margin-bottom: 10px;
            }
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
            margin-right: 10px;
          }
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
      .list {
        .item {
          display: flex;
          align-items: center;
          .content-area {
            margin-left: 5px;
            textarea {
              resize: vertical;
              padding: 6px 10px;
              margin-bottom: 10px;
              border-radius: 3px;
              border: 1px solid #dad7d7;
            }
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
            margin-right: 10px;
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
    }
    .item-edit {
      margin: 130px 0 20px 130px;
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
.source-a{
  padding: 5px 10px;
  background: #5584ff;
  color: #fff;
  margin: 5px;
  border-radius: 3px;
}
.source-audio{
  margin:5px 10px;
  margin-left:50px;
}
.source-video{
  display:block;
  outline:none;
  width:480px;
  height:270px;
  margin:5px 10px;
  margin-left:50px;
}
</style>
