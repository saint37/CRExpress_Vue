// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './vuex/store'
import App from './App'
import router from './router'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import axios from 'axios'
import qs from 'qs'
import Login from'@/components/Login'
import ScrollBar from 'vue2-scrollbar'
import 'vue2-scrollbar/dist/style/vue2-scrollbar.css'

Vue.config.productionTip = false
axios.defaults.withCredentials = true
Vue.use(VueResource)
Vue.use(VueRouter)
Vue.use(ElementUI)
Vue.prototype.axios = axios

// 全局导航钩子
router.beforeEach((to, from, next) => {
	// 判断该路由是否需要登录权限
	if (to.meta.requireAuth && !sessionStorage.getItem('userName')) {
	    // 通过vuex state获取当前的token是否存在
	    //console.log(isEmptyObject(store.state.user)) 
	    if(!isEmptyObject(store.state.user)) {   
	        next();
	    }
	    else { 
	        next({
	            path: '/Login',
	        })
	    }
	}
	else {
		//console.log(sessionStorage.getItem('accessToken'));
	    next();
	}
})

function isEmptyObject(obj) {
	for (var key in obj) {
	    return false;
	}
	return true;
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  //template: '<App/>',
  //components: { App },
  store, 
  router, 
  render: h => h(App)
}).$mount('#app')
