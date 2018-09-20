import Vue from 'vue'
import App from './App'
import routes from 'router'
import VueRouter from 'vue-router'
import Toast from 'base/toast'
import 'common/js/https'
import 'common/scss/index.scss'
import store from 'store'
import { setWechatTitle } from 'utils'
import FastClick from 'fastclick'
import { tap, swipeleft, swiperight, press } from './lib/touchvue.js'
import 'vue-ydui/dist/ydui.rem.css'
import 'vue-ydui/dist/ydui.base.css'
import { wxShare } from 'utils/wx'
import 'mint-ui/lib/style.css'
import $ from 'jquery'
import global_ from 'common/js/global'
import VueDraggable from 'vue-draggable'
import Store from '@/views/wenkong/store'
import 'common/iconfont/iconfont.css'

FastClick.attach(document.body)
Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(Toast)
Vue.use(VueDraggable)
Vue.prototype.GLOBAL = global_

const router = new VueRouter({
  routes,
  mode: 'history',
  base: 'xf'
})

router.beforeEach((to, from, next) => {
  // 路由发生变化修改页面title
  if (to.meta && to.meta.title) {
    setWechatTitle(to.meta.title, '')
    let url = global_.shareUrl
    wxShare(
      '我分享了一个设备给你，赶紧看看吧',
      Store.fetch('name'),
      Store.fetch('icon'),
      url
    )
  }
  next()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
