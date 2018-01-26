<template>
    <el-main>
        <h1>login page</h1>
        <el-form ref="form" :model="userform" label-width="80px">
          <el-form-item label="用户名">
            <el-input v-model="userform.name"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="userform.pwd"></el-input>
          </el-form-item>
          <el-button type="primary">登录</el-button>
        </el-form>
    </el-main>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
        userform: {
            name:'',
            pwd:'',
            error:''
        },
    }
  },
    methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
