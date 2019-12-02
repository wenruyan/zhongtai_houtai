import Vue from 'vue'
import App from './App.vue'
import router from './router/'
import store from './store/'
import mixins from './mixins/'
import http from './utils/http'
import './utils/index'
// plugin
import './plugins/element'
// import './plugins/bootstrap-vue'
// import './plugins/panel'
// import './plugins/vue-quill-editor'
// import './plugins/ant-design-vue'

import 'nprogress/nprogress.css'

// fa
import './assets/scss/font-awesome-4.7.0/scss/font-awesome.scss'

// customer SCSS
import './assets/scss/base.scss'
import VueCropper from 'vue-cropper'
Vue.use(VueCropper)

Vue.config.productionTip = false

Vue.mixin(mixins)

let userInfo = localStorage.getItem('userInfo')
let companyInfo = localStorage.getItem('companyInfo')
store.commit('updateUserInfo', userInfo ? JSON.parse(userInfo) : {})
// store.commit('updateCompanyInfo', companyInfo ? JSON.parse(companyInfo) : {})
if (companyInfo) {
  http
    .post("/focus.findCompany", {})
    .then(res => {
      console.log("findCompany", res);
      store.commit("updateCompanyInfo", res.data);
    })
    .catch(err => {
      console.log("err", err);
    });
}
window.NProgress.configure({
  showSpinner: false
});
// window.NProgress.start()
let vue = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
window.vue = vue
export default vue
