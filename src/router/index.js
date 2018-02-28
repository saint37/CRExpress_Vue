import Vue from 'vue'
import Router from 'vue-router'
import Login from'@/components/Login'
import index from'@/components/index'
import test from'@/components/test'
import topBar from '@/components/topBar'
import leftMenu from'@/components/leftMenu'
import Admin from'@/components/User/Admin'
import TopAdmin from'@/components/User/TopAdmin'
import Common from'@/components/User/Common'
import Eur_Out from'@/components/DataInput/Eur_Out'
import Eur_In from'@/components/DataInput/Eur_In'
import Asia_Out from'@/components/DataInput/Asia_Out'
import Asia_In from'@/components/DataInput/Asia_In'
import EurCount_Out from'@/components/DataCount/EurCount_Out'
import AsiaCount_Out from'@/components/DataCount/AsiaCount_Out'
import EurCount_In from'@/components/DataCount/EurCount_In'
import AsiaCount_In from'@/components/DataCount/AsiaCount_In'

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
          path: '/User/TopAdmin',
          name: 'TopAdmin',
          // meta: {
          //    requireAuth: true,  
          //   }, 
          component: TopAdmin
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
          path: '/DataInput/Eur_In',
          name: 'Eur_In',
          // meta: {
          //    requireAuth: true,  
          //   }, 
          component: Eur_In
        },
        {
          path: '/DataInput/Asia_Out',
          name: 'Asia_Out',
          // meta: {
          //    requireAuth: true,  
          //   }, 
          component: Asia_Out
        },
        {
          path: '/DataInput/Asia_In',
          name: 'Asia_In',
          // meta: {
          //    requireAuth: true,  
          //   }, 
          component: Asia_In
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
        },
        {
          path: '/DataCount/EurCount_In',
          name: 'EurCount_In',
          // meta: {
          //    requireAuth: true,  
          //   }, 
          component: EurCount_In
        },
        {
          path: '/DataCount/AsiaCount_In',
          name: 'AsiaCount_In',
          // meta: {
          //    requireAuth: true,  
          //   }, 
          component: AsiaCount_In
        }
      ]
    },
  ]
})
