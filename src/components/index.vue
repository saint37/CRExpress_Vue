<template>
    <el-container>
      <el-header><topBar></topBar></el-header>
      <el-container id="layout" style="border: 1px solid #eee">
          <vue-scrollbar classes="my-scrollbar" ref="Scrollbar">
              <leftMenu></leftMenu>
          </vue-scrollbar>
          <vue-scrollbar classes="my-scrollbar" ref="Scrollbar" style="width: calc(100% - 200px);">
              <router-view></router-view>
          </vue-scrollbar>
      </el-container>
    </el-container>
</template>

<script>
import VueScrollbar from 'vue2-scrollbar'
import topBar from './topBar'
import leftMenu from'./leftMenu'
export default {
    name: 'index',
    components: {
        topBar,
        leftMenu,
        VueScrollbar
    },
    data () {
        return {
            screenHeight: document.body.clientHeight-60,
        }
    },
    mounted () {
        document.getElementById('layout').style.height=this.screenHeight+"px";//页面初始化
        window.onresize = () => {
            return (() => {
            this.screenHeight = document.body.clientHeight
            })()
        }
    },
    methods: {
        
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.el-header{
    background-color: #1385c5;
    color: #fff;
}
  
.el-aside {
    background-color: #D3DCE6;
    color: #333;
}

.el-main {
    background-color: #E9EEF3;
    color: #333;
}
</style>
