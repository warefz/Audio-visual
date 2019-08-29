import Vue from 'vue'
import config from '../config'
import router from '../router'
import { ServerResponse } from 'http';
var ERRORCODE = require('../constants/code')
// Vue.prototype.$http = axios;
axios.defaults.baseURL = config.serviceDomain;
ERRORCODE = ERRORCODE.ERRORCODE;
axios.interceptors.request.use(function (req) {
  let token = localStorage.getItem(config.token)
  if(token){
    if(typeof req.data == "undefined")
      req.data={
        token:token
      }
    else
      req.data.token=token
  }
  // Do something before request is sent
  return req;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (resp) {
  let ls = resp.config.url.split('/');
  let path = ls[ls.length - 1];
  let s = ['isLogin','getSomeInfo','getBrowseHistory','addToCart','getCartCount','getPurPlainList']
  if(resp.data.code == ERRORCODE.AUTHENTICATION_FAILED ){
    localStorage.removeItem(config.token);
    if(s.indexOf(path) == -1)
      router.replace ({path: '/login',query:{redirect: router.currentRoute.fullPath}});
  }
  return resp;
}, function (error) {
  // Do something with response error
  return Promise.reject(error);
});

export default axios