// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import service from './services/service'
import config from './config'
import {Message,Select,Option,Pagination,Cascader,Input,
  Steps,Rate,Tree,Progress,Checkbox,Table,TableColumn,Button,
  Form,FormItem,Loading,MessageBox,Step} from 'element-ui'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import 'babel-polyfill'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
//import axios from 'axios'
//import VueAxios from 'vue-axios'
//import 'element-ui/lib/theme-chalk/index.css'
//import 'swiper/dist/css/swiper.css'
//import VueAwesomeSwiper from 'vue-awesome-swiper'

const regions = require('./constants/regions')
Vue.config.productionTip = false

Vue.use(Button),Vue.use(Table),Vue.use(TableColumn),Vue.use(Checkbox),Vue.use(FormItem),Vue.use(Step),
Vue.use(Form),Vue.use(Progress),Vue.use(Tree),Vue.use(Cascader),Vue.use(Input),Vue.use(Rate),
Vue.use(Steps),Vue.use(Select),Vue.use(Option),Vue.use(Pagination),Vue.use(Loading)
Vue.component(Message.name, Message)
//Vue.use(VueAxios, axios)
Vue.use(VueAwesomeSwiper)
Vue.use(VueQuillEditor)
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.regions = regions.default
Vue.prototype.config = config

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
