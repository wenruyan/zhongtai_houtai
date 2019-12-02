import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: {
      username: 'zht',
      company_no: '',
      id: '',
      pageTopData: []
    },
    isFirstLogin: '2',
    updateParaval: "",
    companyInfo: {
      auditFreeStatus: "10",
      id: '',
      company: ''
    },
    activeIndex: '1'
  },
  mutations: {
    updateActiveIndex(state, change) {
      console.log(change, 'state');
      state.activeIndex = change || {};
      sessionStorage.setItem('activeIndex', state.activeIndex)
    },
    updateUserInfo(state, change) {
      console.log(change, 'state');
      state.userInfo = change || {};
      localStorage.setItem('userInfo', JSON.stringify(state.userInfo))
    },
    updateIsFirstLogin(state, change) {
      console.log(change, 'state');
      state.isFirstLogin = change || "";
    },
    updateCompanyInfo(state, change) {
      console.log(change, 'state');
      state.companyInfo = change || {};
      localStorage.setItem('companyInfo', JSON.stringify(state.companyInfo))
    },
    updatepageTopData(state, change) {
      state.pageTopData = change || [];
    },
    updateParaval(state, change) {
      state.updateParaval = change || "";
      localStorage.setItem('updateParaval', state.updateParaval)
    }
  },
  actions: {

  }
})
