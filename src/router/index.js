import Vue from 'vue'
import Router from 'vue-router'
import topBar from '@/components/topBar'
import leftMenu from'@/components/leftMenu'
import Admin from'@/components/User/Admin'
import Common from'@/components/User/Common'
import test from'@/components/test'
import Eur_Out from'@/components/DataInput/Eur_Out'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/', redirect: '/User/Admin'
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
      path: '/User/Admin',
      name: 'Admin',
      component: Admin
    },
    {
      path: '/User/Common',
      name: 'Common',
      component: Common
    },
    {
      path: '/test',
      name: 'test',
      component: test
    },
    {
      path: '/DataInput/Eur_Out',
      name: 'Eur_Out',
      component: Eur_Out
    }
  ]
})
