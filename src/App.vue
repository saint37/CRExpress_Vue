<template>
  <div id="app">
    <el-container>
        <el-header><topBar></topBar></el-header>
        <el-container id="layout" style="border: 1px solid #eee">
            <vue-scrollbar classes="my-scrollbar" ref="Scrollbar">
                <leftMenu></leftMenu>
            </vue-scrollbar>
            <vue-scrollbar classes="my-scrollbar" ref="Scrollbar" style="width: calc(100% - 200px);">
                <!-- <User></User> -->
                <router-view></router-view>
            </vue-scrollbar>
        </el-container>
    </el-container>
<!--     <button v-on:click="greet">{{ message }}</button>
    <h1>Name: {{ user.name }}，Age: {{ user.age }}</h1> -->
  </div>
</template>

<script>
import VueScrollbar from 'vue2-scrollbar'
import topBar from './components/topBar'
import leftMenu from'./components/leftMenu'
export default {
    name: 'app',
    components: {
        topBar,
        leftMenu,
        VueScrollbar
    },
    data () {
        return {
            screenHeight: document.body.clientHeight-60,
            message: "Read Json",
            user: {
                name: '',
                age: ''
            },
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
        greet: function (event) {
          // `this` 在方法里指向当前 Vue 实例
          // GET /someUrl
          this.$http({
            method: 'GET',
            url: 'http://localhost:8080/CRExpress/json.htm',
            //url: 'a.txt'
          })
          //.get('http://localhost:8080/CRExpress/json.htm')
          .then(response => {
             console.log(response.data);
            // get body data
            this.user = response.body;
            // this.someData = response.body;
          }, response => {
              console.log("error");
          });
        }
    }
}
</script>

<style>
    body, html {
        margin: 0;
        padding: 0;
        height: 100%;
        font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;
        -webkit-font-smoothing: antialiased;
    }
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
