// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import ScrollBar from 'vue2-scrollbar'
import 'vue2-scrollbar/dist/style/vue2-scrollbar.css'

Vue.config.productionTip = false
Vue.use(VueResource)
Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  //template: '<App/>',
  //components: { App },
  render: h => h(App)
})
