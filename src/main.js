import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { initMenu } from './utils/menus'
import './plugins/element.js'
import 'font-awesome/css/font-awesome.css'
import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest
} from './network/api'
Vue.config.productionTip = false
Vue.prototype.deleteRequest = deleteRequest
Vue.prototype.putRequest = putRequest
Vue.prototype.getRequest = getRequest
Vue.prototype.postRequest = postRequest
router.beforeEach((to, form, next) => {
  if (window.sessionStorage.getItem('tokenStr')) {
    initMenu(router, store)
    if (!window.sessionStorage.getItem('user')) {
      getRequest('/admin/info').then(resp => {
        if (resp) {
          window.sessionStorage.setItem('user', JSON.stringify(resp))
          next()
        }
      })
    }
    next()
  } else {
    if (to.path === '/') {
      next()
    } else {
      // next('/?redirect=' + to.path)
      next()
    }
  }
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
