import Vue from 'vue'
import Router from 'vue-router'
import Login from'@/components/Login'
import index from'@/components/index'
import test from'@/components/test'
import topBar from '@/components/topBar'
import leftMenu from'@/components/leftMenu'
import Admin from'@/components/User/Admin'
import Common from'@/components/User/Common'
import Eur_Out from'@/components/DataInput/Eur_Out'
import EurCount from'@/components/DataCount/EurCount'
import AsiaCount from'@/components/DataCount/AsiaCount'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/index',
      name: 'index',
      component: index,
      children: [  //这里就是二级路由的配置
        {
          path: '/', redirect: '/test'
        },
        {
          path: '/test',
          name: 'test',
          component: test
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
          path: '/DataInput/Eur_Out',
          name: 'Eur_Out',
          component: Eur_Out
        },
        {
          path: '/DataCount/EurCount',
          name: 'EurCount',
          component: EurCount
        },
        {
          path: '/DataCount/AsiaCount',
          name: 'AsiaCount',
          component: AsiaCount
        }
      ]
    },
  ]
})
