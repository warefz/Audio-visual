import Vue from 'vue'
import Router from 'vue-router'
const NotFoundComponent = () => import('@/pages/notFound/index')
const Login = () => import('@/pages/login/index')
const Reset = () => import('@/pages/resetPwd/index')
const Register = () => import('@/pages/register/index')
const Home = () => import('@/pages/home/index')
const Cart = () => import('@/pages/cart/index')
const Detail = () => import('@/pages/detail/index')
const List = () => import('@/pages/list/index')
const Personal = () => import('@/pages/personal/index')
const Own = () => import('@/pages/personal/own')
const Recommend = () => import('@/pages/personal/recommend')
const Address = () => import('@/pages/personal/address')
const Purchased = () => import('@/pages/personal/purchased')
const PurDetail = () => import('@/pages/personal/item')
const ResetPwd = () => import('@/pages/personal/resetPwd')
const Collection = () => import('@/pages/personal/collection')
const Record = () => import('@/pages/personal/history')
const Commodity = () => import('@/pages/commodity/index')
const NewProduct = () => import('@/pages/commodity/newItem')
const Shop = () => import('@/pages/shop/index')
const Order = () => import('@/pages/order/index')
const Tip = () => import('@/pages/tip/index')
const SellList = () => import('@/pages/sell/index')
const SellDetail = () => import('@/pages/sell/detail')
const orderDetail = () => import('@/pages/sell/orderDetail')
Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
      {path: '*', component: NotFoundComponent },
      {path: '/login',component: Login},
      {path: '/register',component: Register},
      {path: '/reset',component: Reset},
      {path:'/',component:Home},
      {path:'/cart',component:Cart},
      {path:'/order',component:Order},
      {path:'/list',component:List},
      {path:'/detail',component:Detail},
      {path:'/tip',component:Tip},
      {path:'/personal',component:Personal,
        children:[
          {path:'/recommend',component:Recommend},
          {path:'/baseInfo',component:Own},
          {path:'/address',component:Address},
          {path:'/purchased',component:Purchased},
          {path:'/resetPwd',component:ResetPwd},
          {path:'/purDetail',component:PurDetail},
          {path:'/collection',component:Collection},
          {path:'/history',component:Record},
          {path:'/commodity',component:Commodity},
          {path:'/newProduct',component:NewProduct},
          {path:'/shop',component:Shop},
          {path:'/sellList',component:SellList},
          {path:'/sellDetail',component:SellDetail},
          {path:'/sellOrderDetail',component:orderDetail}
        ]
      }
    ]
})

