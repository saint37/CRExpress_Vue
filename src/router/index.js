import Vue from 'vue'
import Router from 'vue-router'
import topBar from '@/components/topBar'
import leftMenu from'@/components/leftMenu'
import User from'@/components/User'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'topBar',
      component: topBar
    },
    {
      path: '/',
      name: 'leftMenu',
      component: leftMenu
    },
    {
      path: '/',
      name: 'User',
      component: User
    }
  ]
})
