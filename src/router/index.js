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
import EurCount_Out from'@/components/DataCount/EurCount_Out'
import AsiaCount_Out from'@/components/DataCount/AsiaCount_Out'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',redirect: '/Login'
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/index',
      name: 'index',
      meta: {
         requireAuth: true,  
        },    
      component: index,
      children: [  //这里就是二级路由的配置
        {
          path: '/', redirect: '/test'
        },
        {
          path: '/test',
          name: 'test',
          meta: {
             requireAuth: true,  
            }, 
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
          // meta: {
          //    requireAuth: true,  
          //   }, 
          component: Admin
        },
        {
          path: '/User/Common',
          name: 'Common',
          // meta: {
          //    requireAuth: true,  
          //   }, 
          component: Common
        },
        {
          path: '/DataInput/Eur_Out',
          name: 'Eur_Out',
          // meta: {
          //    requireAuth: true,  
          //   }, 
          component: Eur_Out
        },
        {
          path: '/DataCount/EurCount_Out',
          name: 'EurCount_Out',
          // meta: {
          //    requireAuth: true,  
          //   }, 
          component: EurCount_Out
        },
        {
          path: '/DataCount/AsiaCount_Out',
          name: 'AsiaCount_Out',
          // meta: {
          //    requireAuth: true,  
          //   }, 
          component: AsiaCount_Out
        }
      ]
    },
  ]
})
