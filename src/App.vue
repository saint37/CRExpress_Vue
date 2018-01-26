<template>
  <div id="app">
    <router-view></router-view>
<!--     <button v-on:click="greet">{{ message }}</button>
    <h1>Name: {{ user.name }}，Age: {{ user.age }}</h1> -->
  </div>
</template>

<script>
export default {
    name: 'app',
    components: {
        
    },
    data () {
        return {
            message: "Read Json",
            user: {
                name: '',
                age: ''
            },
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
</style>
