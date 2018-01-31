<template>
    <el-main class="white">
        <el-row type="flex" justify="center">
          <el-col :span="24" class="tct"><h1>一个奇怪的系统</h1></el-col>
        </el-row>
        <el-row type="flex" justify="center">
            <el-col :span="6" class="tct loginform">
                <el-form ref="form" label-width="80px">
                    <el-input v-model="name" placeholder="用户名" class="loginput"></el-input>
                    <el-input type="password" v-model="pwd" placeholder="密码" class="loginput" @keyup.enter.native="isLogin"></el-input>
                    <el-button type="primary" round @click="isLogin" class="loginbtn">登录一下⊙∀⊙</el-button>
                </el-form>
            </el-col>
        </el-row>
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
            //this.axios.get('http://localhost:3000/users?username='+this.name+'&password='+this.pwd)
            this.axios.get('http://10.1.167.174:8080/CRExpress/login/checkLogin.htm?username='+this.name+'&password='+this.pwd)
            .then((response) => { 
                //这里在isLogin方法中先判断一下后台返回的是否为空值，如果不是然后提交后台返回的值。
                //注意这里是个难点，Vuex与Vue-Resource结合使用。 
                if(response.data != null & response.data.success == true){ 
                    this.$store.commit('isLogin',response.data.object.username);
                    sessionStorage.setItem('userName' , response.data.object.username);
                    sessionStorage.setItem('userId' , response.data.object.userId);
                    sessionStorage.setItem('userRoleStr' , response.data.object.userRoleStr);
                    sessionStorage.setItem('orgName' , response.data.object.orgName);
                    sessionStorage.setItem('realName' , response.data.object.realName);
                    //console.log(response.data.object);
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
.white{
    background-color: #fff;
}
.tct{
    text-align: center;
}
.loginform .loginput{
    margin: 10px 0;
}
.loginbtn{
    padding: 12px 43px;
    margin-top: 20px;
}
</style>
