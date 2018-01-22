import Vue from 'vue'
import Router from 'vue-router'
import topBar from '@/components/topBar'
import leftMenu from'@/components/leftMenu'
import User from'@/components/User'
import test from'@/components/test'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/', redirect: 'User'
    },
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
      path: '/user',
      name: 'User',
      component: User
    },
    {
      path: '/test',
      name: 'test',
      component: test
    }
  ]
})
