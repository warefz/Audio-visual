<template>
  <div class="wrap" style="background: url('~@/../static/bg1.png')">
        <div class="header">
            <div class="logo">
                <h1><a @click="toHome">404 Not Found</a></h1>
            </div>
        </div>
    <div class="content">
        <img :src="['../static/error-img.png']" title="error" />
        <p><span><label>O</label>hh.....</span>You Requested the page that is no longer There.</p>
        <a @click="toHome">Back To Home</a>
        <div class="copy-right">
            <p>Copyright ©2018-2019 fz</p>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  methods: {
    toHome() {
      let vm = this;
      vm.$router.push({ path: "/" });
    }
  }
};
</script>

<style scoped lang="scss">
@import "./style";
</style>
