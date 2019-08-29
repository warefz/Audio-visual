
<template>
    <div class="c-footer">
        <slot>
        </slot>
        <div class="container">
            <div class="f-item" v-for="(item,i) in footerNav" :key="i">
                <p class="title"><i :class="item.icon"></i>{{item.name}}</p>
                <p class="list-item" v-for="t in item.children" :key="t.id"><a @click="toUrl('/tip',t.id)">{{t.name}}</a></p>
            </div>
        </div>
        <div class="bottom">
            Copyright ©2018-2019 fz
        </div>
    </div>
</template>

<script>
import tipApi from '@/services/tip'
export default {
  name: "c-footer",
  ready() {},
  props: {
  },
  mounted() {
    let vm = this;
    vm.load();
  },
  methods: {
    load(){
      let vm = this;
      tipApi.getList().then(res => {
        if(res.code == 0)
          vm.footerNav = res.data;
      })
    },
    toUrl(val,id){
      let vm = this;
      let params = {
        path: val
      }
      if(id)
        params.query = {id: id}
      vm.$router.push(params);
    }
  },
  data() {
    return {
      footerNav: []
    };
  },
  computed: {}
};
</script>

<style lang="scss" scoped>
@import "./style";
</style>