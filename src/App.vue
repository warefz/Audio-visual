<template>
  <router-view v-if="isAlive"/>
</template>

<script>

export default {
  provide(){
    return {
      reload:this.reload
    }
  },
  data(){
    return{
      isAlive:true
    }
  },
  methods:{
    reload(){
      let vm = this;
      vm.isAlive = false;
      vm.$nextTick(()=>{
        vm.isAlive = true;
      })
    }
  }
}
</script>

<style lang="scss">
@import '~@/assets/scss/common/main.scss';
*{
  margin:0;
  padding: 0;
}
a:hover{
  cursor: pointer;
}
input{
  outline:none;
}
html{
  height: 100%;
}
body{
  height: 100%;
}
ul{
  list-style-type: none;
  li{
    float: left;
  }
}
.el-cascader-menu__item{
    float: initial;
}
.el-select-dropdown__item{
  float: initial;
}
</style>
