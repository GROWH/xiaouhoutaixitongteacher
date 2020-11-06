// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import qs from 'qs';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import { get, post } from './utils/http'
const http = { get, post }
import App from './App';
import router from './router';
import store from './store'
import axios from 'axios'
import $ from 'jquery'
Vue.use(ElementUI);
Vue.config.productionTip = false;
Vue.prototype.qs = qs;
Vue.prototype.http = http
Vue.prototype.imgdomain = 'http://localhost:3000'
Vue.prototype.$ = $;
Vue.prototype.axios = axios;
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})
