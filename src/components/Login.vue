<template>
    <el-main>
        <h1>login page</h1>
        <el-form ref="form" label-width="80px">
          <el-form-item label="用户名">
            <el-input v-model="name"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input type="password" v-model="pwd"></el-input>
          </el-form-item>
          <el-button type="primary" @click="isLogin">登录</el-button>
        </el-form>
    </el-main>
</template>

<script>
export default {
    name: 'Login',
    data () {
        return {
            name:'',
            pwd:'',
            error:''
        }
    },
    computed: {
        user() {
            return this.$store.state.user
        }
    },
    methods: {
        isLogin:function() {
            this.axios.get('http://localhost:3000/users?username='+this.name+'&password='+this.pwd).then((response) => { 
                console.log(response.data);
                //这里在isLogin方法中先判断一下后台返回的是否为空值，如果不是然后提交后台返回的值。
                //注意这里是个难点，Vuex与Vue-Resource结合使用。 
                if(response.data != null & response.data.length > 0){ 
                    this.$store.commit('isLogin',response.data[0]);
                    sessionStorage.setItem('accessToken' , 'abcde');
                    this.name=''
                    this.pwd= ''
                    this.$router.push({ path: '/index' }) 
                }else{
                    this.$alert('请输入正确的用户名和密码！');
                    this.name=''
                    this.pwd= ''
                }
            }).then((error)=> this.error = error)
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
