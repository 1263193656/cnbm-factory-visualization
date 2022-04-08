import Vue from 'vue'
import App from './App.vue'
import 'vue-orgchart/dist/style.min.css'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import axiosHWL from 'axios'
// import axiosCXQ from 'axios'
import axios from 'axios'

import Vue2OrgTree from 'vue2-org-tree'

Vue.use(Vue2OrgTree)
Vue.prototype.$axios=axios

// Vue.prototype.$axiosHWL=axiosHWL
// Vue.prototype.$axiosCXQ=axiosCXQ
// axiosCXQ.defaults.baseURL = 'http://192.168.1.143:38890'
// axiosHWL.defaults.baseURL = 'http://10.10.23.141:8890'

Vue.config.productionTip = false
Vue.use(ElementUI);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
