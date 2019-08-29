<template>
  <div class="address-content">
    <div class="container">
        <div class="header">
            <p class="title">收货地址</p>
        </div>
        <div class="address">
            <p class="title">编辑收货地址</p>
            <div class="base"><span class="name"><span class="label">地址信息：</span></span>
                <select  v-model="provSelected" @change="getProvSelected">                                        
                    <option :value="prov.label" v-for="(prov,i) in provinces" :key="i">{{prov.label}}</option>                                    
                </select>
                <select  v-model="citySelected" @change="getCitySelected">                                        
                    <option :value="city.label" v-for="(city,i) in cities" :key="i">{{city.label}}</option>                                    
                </select>
                <select  v-model="districtSelected" @change="getDistrictSelected">                                        
                    <option :value="district.label" v-for="(district,i) in districts" :key="i">{{district.label}}</option>                                    
                </select>
            </div>
            <div class="detail">
                <span class="name">
                    <span class="label">详细信息：</span>
                </span>
                <textarea :class="{err:tip.showDetailTip}" rows="3" cols="46" v-model="detail"
                    placeholder="请输入详细地址信息，如道路、门牌号、小区、楼栋号、单元等信息"  @focus="editDetail" @blur="detailChange" >
                </textarea>
            </div>
            <div class="tip" v-if="tip.showDetailTip">请填写详细地址信息</div>
            <div class="code"><span class="name"><span class="label">邮政编码：</span></span>
                <input :class="{err:tip.showCodeTip}" type="text" v-model="code"
                placeholder="请填写邮编" @focus="editCode" @blur="codeChange" maxlength="6"/>
            </div>
            <div class="tip" v-if="tip.showCodeTip">邮政编码格式错误</div>
            <div class="realname">
                <span class="name">
                    <span class="label">收货人姓名：</span>
                </span>
                <input :class="{err:tip.showNameTip}" type="text"  v-model="name"
                placeholder="请填写收货人姓名，长度不超过24个字符" @focus="editName" @blur="nameChange"/>
            </div>
            <div class="tip" v-if="tip.showNameTip">收货人姓名应为2-24个字符，一个汉字为两个字符</div>
            <div class="tele">
                <span class="name">
                    <span class="label">手机号码：</span>
                </span>
                <input :class="{err:tip.showTeleTip}" type="text" v-model="telephone"
                placeholder="请填写手机号码"  @focus="editTele" @blur="teleChange"/>
            </div>
            <div class="tip" v-if="tip.showTeleTip">联系方式应为6-20位数字</div>
            <div class="default"><el-checkbox v-model="defaultAddress"></el-checkbox><span>设为默认地址</span></div>
            <div class="op">
              <div class="save"><a class="confirm" @click="save">保存</a></div>
              <div class="cancel"><a @click="cancel">取消</a></div>
            </div>
        </div>
        <div class="existadd">
            <p class="title"><i class="fa fa-warning"></i>已有{{address.length}}个收货地址，最多保存20个收货地址</p>
            <table>
                <thead class="t-head">
                    <tr><th class="receiver"><div class="cell">收货人</div></th>
                        <th class="region"><div class="cell">所在地区</div></th>
                        <th class="detail"><div class="cell">详细地址</div></th>
                        <th class="code"><div class="cell">邮编</div></th>
                        <th class="telephone"><div class="cell">电话号码</div></th>
                        <th class="operation"><div class="cell">操作</div></th>
                    </tr>
                </thead>
                <tbody class="t-body">
                    <tr v-for="(ar,i) in address" :key="i">
                        <td><div class="cell">{{ar.receiver}}</div></td>
                        <td><div class="cell">{{ar.location}}</div></td>
                        <td><div class="cell">{{ar.detailAddress}}</div></td>
                        <td><div class="cell">{{ar.postalCode?ar.postalCode:'暂无'}}</div></td>
                        <td><div class="cell">{{ar.telephone}}</div></td>
                        <td>
                            <div class="cell op">
                                <a class="rev" @click="reviseAddress(ar.id)">修改</a>
                                <a class="del" @click="delAddress(ar.id)">删除</a>
                                <div class="setdef">
                                    <span v-if="i == 0">默认地址</span>
                                    <a v-else @click="setDefaultAddress(ar.id)">设为默认地址</a>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
  </div>
</template>

<script>
import addressApi from "@/services/address";
export default {
  data() {
    return {
      provinces: "",
      provSelected: "",
      cities: "",
      citySelected: "",
      districts: "",
      districtSelected: "",
      code: "",
      telephone: "",
      name: "",
      detail: "",
      id: "",
      defaultAddress: false,
      address: [],
      tip: {
        showCodeTip: false,
        showDetailTip: false,
        showNameTip: false,
        showTeleTip: false
      }
    };
  },
  mounted: function() {
    let vm = this;
    vm.load();
  },
  methods: {
    load(){
      let vm = this;
      vm.initial();
      vm.provinces = vm.regions.provinces;
      vm.id = vm.$route.query.id;
      if (vm.id) {
        addressApi.getInfo({id: vm.id}).then(res => {
          if(res.code == 0){
            vm.code = res.data.postalCode;
            vm.telephone = res.data.telephone;
            vm.detail = res.data.detailAddress;
            vm.name = res.data.receiver;
            let ls = res.data.location.split('/');
            if(ls.length > 0)
              vm.provSelected = ls[0];
            if(ls.length > 1){
              vm.cities = vm.regions.cities[vm.provSelected];
              vm.citySelected = ls[1];
            }
            if(ls.length > 2){
              vm.districts = vm.regions.districts[vm.citySelected];
              vm.districtSelected = ls [2];
            }
          }
          else
            vm.$message.error(res.errMsg);
        })
      }
      addressApi.getList().then(res => {
        if(res.code == 0)
          vm.address = res.data;
        else
          vm.$message.error(res.errMsg);
      })
    },
    initial(){
      let vm  = this;
      vm.provinces = "";
      vm.provSelected = "";
      vm.cities = "";
      vm.citySelected = "";
      vm.districts = "";
      vm.districtSelected = "";
      vm.code = "";
      vm.telephone = "";
      vm.name = "";
      vm.detail = "";
      vm.id = "";
      vm.defaultAddress = false;
      vm.tip = {
        showCodeTip: false,
        showDetailTip: false,
        showNameTip: false,
        showTeleTip: false
      }
    },
    reviseAddress(val){
      let vm = this;
      vm.$router.push({path:'/address',query:{id:val}})
      vm.load();
    },
    delAddress(val){
      let vm = this;
      addressApi.delAddress({id: val}).then(res => {
        if(res.code == 0){
          vm.$message.success("地址删除成功");
          vm.load();
        }
        else
          vm.$message.error(res.errMsg);
      })
    },
    cancel(){
      let vm = this;
      vm.$router.push({path:'/address'})
      vm.load();
    },
    save(){
      let vm = this;
      if(vm.provSelected == '' && vm.citySelected == '' && vm.districtSelected =='')
        return vm.$message.error('请选择地址信息');
      if(vm.code != "" && vm.codeChange() != 0)
        return vm.$message.error('邮编信息格式错误');
      if(vm.detailChange() != 0)
        return vm.$message.error('详细地址格式错误');
      if(vm.nameChange() != 0)
         return vm.$message.error('收货人姓名格式错误');
      if(vm.teleChange() != 0)
         return vm.$message.error('联系方式格式错误');
      let data = {
        code: vm.code,
        telephone: vm.telephone,
        name: vm.name,
        detail: vm.detail,
        address: vm.provSelected + '/' + vm.citySelected+'/' + vm.districtSelected,
      }
      if(vm.id)
        data.id = vm.id;
      if(vm.defaultAddress)
        data.default = true;
      addressApi.editAddress(data).then(res => {
        if(res.code == 0){
          vm.$message.success("地址信息保存成功");
          vm.$router.push({path:'/address'});
          vm.load();
        }
        else
          vm.$message.error(res.errMsg);
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
    },
    getDistrictSelected() {},
    codeChange() {
      let vm = this;
      let code = vm.code;
      let codeReg = /^\d+$/;
      vm.tip.showCodeTip = false;
      if (!codeReg.test(code) || code.length < 6){
        vm.tip.showCodeTip = true;
        return -1;
      }
      return 0;
    },
    detailChange() {
      let vm = this;
      let detail = vm.detail;
      vm.tip.showDetailTip = false;
      if (detail.length <= 0){
        vm.tip.showDetailTip = true;
        return -1;
      }
      return 0;
    },
    nameChange() {
      let vm = this;
      let name = vm.name;
      vm.tip.showNameTip = false;
      if (vm.getByteLen(name) < 2 || vm.getByteLen(name) > 24){
        vm.tip.showNameTip = true;
        return -1;
      }
      return 0;
    },
    teleChange() {
      let vm = this;
      let telephone = vm.telephone;
      let teleReg = /^\d+$/;
      vm.tip.showTeleTip = false;
      if (
        !teleReg.test(telephone) ||
        telephone.length < 6 ||
        telephone.length > 20
      ){
        vm.tip.showTeleTip = true;
        return -1;
      }
      return 0;
    },
    editDetail() {
      let vm = this;
      vm.tip.showDetailTip = false;
    },
    editCode() {
      let vm = this;
      vm.tip.showCodeTip = false;
    },
    editName() {
      let vm = this;
      vm.tip.showNameTip = false;
    },
    editTele() {
      let vm = this;
      vm.tip.showTeleTip = false;
    },
    getByteLen(val) {
      let len = 0;
      for (let i = 0; i < val.length; i++) {
        let a = val.charAt(i);
        if (a.match(/[^\x00-\xff]/gi) != null) len += 2;
        else len += 1;
      }
      return len;
    },
    setDefaultAddress(id){
      let vm = this;
      addressApi.setDefault({id:id}).then(res => {
        if(res.code == 0){
          vm.$message.success('设为默认地址成功');
          vm.load();
        }else
          vm.$message.error(res.errMsg);
      })
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.address-content {
  background: #fff;
  border: 1px solid #e9e9e9;
  margin-left: 20px;
  margin-top: 10px;
  width: 88%;
  .container {
    .header {
      border-bottom: 1px solid #e9e9e9;
      .title {
        color: #666;
        font-weight: 700;
        font-size: 16px;
        padding: 15px 20px;
      }
    }
    .address {
      color: #000;
      padding: 10px 10px;
      color: #000;
      .tip {
        margin-left: 85px;
        color: #e4393c;
      }
      .err {
        border-color: #e4393c !important;
      }
      .name {
        display: block;
        width: 85px;
        text-align: right;
      }
      div {
        display: flex;
        padding-left: 10px;
        padding-bottom: 8px;
        align-items: center;
      }
      input {
        padding: 8px;
        border: 1px solid #cecece;
        width: 310px;
        border-radius: 3px;
      }
      .title {
        font-weight: 700;
        margin-left: 10px;
        padding-bottom: 10px;
      }
      .base {
        select {
          margin-right: 5px;
          padding: 2px;
          display: flex;
          align-items: center;
          line-height: 12px;
          border-radius: 3px;
          width: 105px;
          border:1px solid #cecece;
        }
        .label:before {
          margin-right: 4px;
          content: "*";
          color: #ff3000;
        }
      }
      .detail {
        textarea {
          resize: vertical;
          outline: none;
          padding: 8px;
          border-radius: 3px;
          border:1px solid #cecece;
        }
        .label:before {
          margin-right: 4px;
          content: "*";
          color: #ff3000;
        }
      }
      .code {
        input {
          width: 100px;
        }
      }
      .realname {
        input {
          width: 250px;
        }
        .label:before {
          margin-right: 4px;
          content: "*";
          color: #ff3000;
        }
      }
      .tele {
        .label:before {
          margin-right: 4px;
          content: "*";
          color: #ff3000;
        }
      }
      .default {
        margin-top: 10px;
        margin-left: 86px;
        span {
          margin-left: 5px;
        }
      }
      .op{
        display: flex;
      }
      .save {
        margin-top: 10px;
        margin-left: 86px;
        a {
          color: #fff;
          background: #5584ff;
          padding: 5px 15px;
          border-radius: 2px;
        }
      }
      .cancel {
        margin-top: 10px;
        a {
          padding: 5px 15px;
          border-radius: 2px;
          border: 1px solid rgb(185, 182, 182);
        }
      }
    }
    .existadd {
      padding: 10px;
      margin: 0 20px;
      * {
        box-sizing: border-box;
      }
      p {
        background: #fdf6ec;
        border: 1px solid #f5dab1;
        padding: 5px 10px;
        margin-bottom: 10px;
        i {
          color: #e6a23c;
          margin-right: 10px;
        }
      }
      table {
        border-collapse: collapse;
        tr {
          transition: all 0.3s ease;
          &:hover {
            background: #f7f5f5;
          }
        }
        th .cell {
          padding: 12px 16px;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
        }
        td .cell {
          padding: 12px 16px;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
        }
        th {
          padding: 0;
          background: #ebecf0;
          text-align: left;
          font-weight: 400;
          border: 1px solid #dcdee3;
        }
        td {
          padding: 0;
          border: 1px solid #dcdee3;
        }
        .code {
          min-width: 100px;
        }
        .telephone {
          min-width: 100px;
        }
        .operation {
          min-width: 200px;
        }
        .op {
          display: flex;
          a {
            margin-right: 5px;
            &:hover {
              color: #e4393c;
            }
          }
          .setdef {
            span {
              padding: 5px 10px;
              border-radius: 3px;
              color: #fff;
              background: #e4393c;
            }
          }
        }
      }
      .cell {
        color: #000;
      }
    }
  }
}
</style>
