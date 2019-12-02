import Vue from 'vue';
import http from './http';
import store from '../store';
import dayJs from 'dayjs';
import _ from 'lodash';
import NProgress from 'nprogress'
window.$http = Vue.prototype.$http = http;
window.$store = Vue.prototype.$store = store;
window.NProgress = Vue.prototype.NProgress = NProgress
window.moment = Vue.prototype.moment = dayJs;
window._ = Vue.prototype._ = _;
