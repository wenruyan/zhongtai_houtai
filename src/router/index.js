import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/'
import Leye from './leye'
// import vue2 from '../main'
Vue.use(Router)
let routeList = [{
  path: '/',
  name: 'index',
  component: () =>
    import('../views/main.vue'),
  meta: {
    title: '首页'
  },
  redirect: {
    name: 'main-leye-myWork'
  }
}, {
  path: '/login',
  name: 'login',
  component: () =>
    import('../views/login.vue'),
  meta: {
    title: '登录'
  }
}, {
  path: '/error',
  name: 'error',
  component: () =>
    import('../views/404.vue'),
  meta: {
    title: '404'
  }
}, {
  path: '/main',
  name: 'main',
  component: () =>
    import('../views/main.vue'),
  meta: {
    title: '首页'
  },
  redirect: {
    name: 'main-leye-myWork'
  },
  children: [...Leye]
}]
let isAddMain = true
// let mainRoute = [{
//   path: '/main',
//   name: 'main',
//   component: () =>
//     import('../views/main.vue'),
//   meta: {
//     title: '首页'
//   },
//   children: [...Leye]
// }]
let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routeList
})
// 钩子
router.beforeEach((to, from, next) => {
  console.log('beforeEach', to, from)
  let noAuthPage = ['login']
  let userInfo = JSON.parse(localStorage.getItem('userInfo')) || {}
  if (noAuthPage.indexOf(to.name) == -1) {
    if (!userInfo.id || !userInfo.type) {
      next({
        name: 'login',
        replace: true
      })
      return false
    }
  }
  if (to.matched.length == 0) {
    // if ((from.name == 'login' && to.path == '/') || (from.name == null && to.name == null)) {
    // 这里控制动态添加路由
    if (isAddMain) {
      next({
        path: '/error',
        replace: true
      });
    } else {
      console.log('accountType', store.state.userInfo.type)
      // if (store.state.userInfo.type == '10') { // 账号类型为10时全部显示
      //   mainRoute[0].children = [
      //     ...Leye
      //   ]
      // } else if (store.state.userInfo.type == '20') { // 外部公司用户，只显示乐业卡
      //   mainRoute[0].children = [
      //     ...Leye
      //   ]
      // } else { // 没有账号类型时全部隐藏

      // }
      // console.log('mainRoute', mainRoute)
      // router.addRoutes(mainRoute)
      // setTimeout(() => {
      //   let obj = {}
      //   if (to.name) {
      //     obj.name = to.name
      //   } else if (to.path) {
      //     obj.path = to.path
      //   }
      //   obj.query = to.query
      //   next(obj);
      // }, 200)
      // isAddMain = true
    }
  } else {
    next();
  }
});

export default router
