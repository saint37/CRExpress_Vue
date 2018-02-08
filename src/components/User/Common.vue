<template>
    <el-main>
        <!--用户信息部分-->
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>你好，{{ CurrentUser.username }}</span>
                <el-button style="float: right; padding: 3px 0 3px 10px;" type="text" @click="changePass('pwdForm')">修改密码</el-button>
                <el-button style="float: right; padding: 3px 0" type="text" @click="editClick">修改个人信息</el-button>
            </div>
            <el-row :gutter="20">
                <el-col :span="6">用户名：{{ CurrentUser.username }}</el-col>
                <el-col :span="6">
                    <div v-if="CurrentUser.roleId == 1">用户类别：管理员</div>
                    <div v-else-if="CurrentUser.roleId == 2">用户类别：路局管理员</div>
                    <div v-else>用户类别：路局用户</div>
                </el-col>
                <el-col :span="6">单位：{{ CurrentUser.orgName }}</el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="6">真实姓名：{{ CurrentUser.realName }}</el-col>
                <el-col :span="6">性别：{{ CurrentUser.mygender }}</el-col>
                <el-col :span="6">电话：{{ CurrentUser.mobile }}</el-col>
            </el-row>
        </el-card>
        <!--修改密码-->  
        <el-dialog title="修改密码" :visible.sync="pwdFormVisible" :close-on-click-modal="false">  
            <el-form :model="pwdForm" label-width="80px" :rules="pwdFormRules" ref="pwdForm" size="small">  
                <el-form-item label="原始密码" prop="password">  
                    <el-input v-model="pwdForm.password" auto-complete="off" type="password"></el-input>  
                </el-form-item>   
                <el-form-item label="新密码" prop="newPassword">  
                    <el-input v-model="pwdForm.newPassword" type="password"></el-input>  
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass">  
                    <el-input v-model="pwdForm.checkPass" type="password"></el-input>
                </el-form-item> 
            </el-form>  
            <div slot="footer" class="dialog-footer">  
                <el-button @click.native="pwdFormVisible = false">取消</el-button>  
                <el-button type="primary" @click.native="pwdSubmit('pwdForm')" :loading="pwdLoading">提交</el-button>  
            </div>  
        </el-dialog>  
        <!--编辑界面-->  
        <el-dialog title="用户信息" :visible.sync="editFormVisible" :close-on-click-modal="false">  
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm" size="small">  
                <el-form-item label="用户名" prop="username">  
                    <el-input v-model="editForm.username" auto-complete="off"></el-input>  
                </el-form-item>   
                <el-form-item label="真实姓名" prop="realName">  
                    <el-input v-model="editForm.realName"></el-input>  
                </el-form-item>
                <el-form-item label="性别" prop="gender">  
                    <el-radio-group v-model="editForm.gender">
                      <el-radio label="1">男</el-radio>
                      <el-radio label="2">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">  
                    <el-input v-model="editForm.mobile"></el-input>  
                </el-form-item> 
            </el-form>  
            <div slot="footer" class="dialog-footer">  
                <el-button @click.native="editFormVisible = false">取消</el-button>  
                <el-button type="primary" @click.native="editSubmit('editForm')" :loading="editLoading">提交</el-button>  
            </div>  
        </el-dialog>  
    </el-main>
</template>

<script>
export default {
  name: 'User',
  data () {
    let validatePass = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('请输入密码'));
        } else if((value == this.pwdForm.password)){
            callback(new Error('新密码不能与原密码相同'));
        } else {
          if (this.pwdForm.checkPass != '') {
            this.$refs.pwdForm.validateField('checkPass');
          }
          callback();
        }
    };
    let validatePass2 = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('请再次输入密码'));
        } else if (value != this.pwdForm.newPassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
    };
    let validategender = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('请选择性别'));
        } else if(value != 1 && value != 2){
            callback(new Error('请选择性别'));
        } else {
          callback();
        }
    };
    return {
        CurrentUser : {
            userId: 0,
            username: '',
            roleId: 0,
            userRoleStr: '',
            orgId: 0,
            orgName: '',
            realName: '',
            gender: 0,
            mygender: '',
            mobile: ''
        },
        ShowUserList: true,
        //请求的URL
        // url:'http://localhost:3000/list',
        updateurl: 'http://10.1.167.174:8080/CRExpress/user/update.htm',
        updatePassurl: 'http://10.1.167.174:8080/CRExpress/user/updatePassword.htm',
        //删除的弹出框  
        deleteVisible:false,  
        //编辑界面是否显示  
        editFormVisible: false,  
        editLoading: false,  
        editFormRules: {  
            realName: [  
                { required: true, message: '请输入真实姓名', trigger: 'blur' }  
            ],
            gender: [  
                { required: true, validator: validategender, trigger: 'blur' }
            ],
            mobile: [
                { required: true, message: '请输入联系电话', trigger: 'blur' }
            ]
        },
        //编辑界面数据  
        editForm: {  
            id: 0,  
            username: '',
            password: '',
            checkPass: '',
            roleId: 0,
            userRoleStr: '',
            orgId: 0,
            orgName: '',
            realName: '',
            gender: '',
            mobile: ''
        },  
        pwdFormVisible: false,  
        pwdLoading: false,  
        pwdFormRules: {  
            password: [  
                { required: true, message: '请输入原密码', trigger: 'blur' }  
            ],
            newPassword: [  
                { required: true, validator: validatePass, trigger: 'blur' }  
            ],
            checkPass: [
                { required: true, validator: validatePass2, trigger: 'blur' }
            ]
        },
        //修改密码
        pwdForm: {  
            password: '',
            newPassword: '',
            checkPass: ''
        } 
    }
  },
    mounted () {
        this.loadingUser();
    },
    methods: {
        loadingUser: function(){
            let _self = this;
            _self.CurrentUser.roleId = sessionStorage.roleId;
            _self.CurrentUser.username = sessionStorage.username;
            _self.CurrentUser.orgName = sessionStorage.orgName;
            _self.CurrentUser.realName = sessionStorage.realName;
            _self.CurrentUser.mygender = (sessionStorage.gender == 1)?"男":"女";
            _self.CurrentUser.mobile = sessionStorage.mobile;
        },
        reloadingUser: function(){
            let _self = this;
            _self.CurrentUser.username = _self.editForm.username;
            _self.CurrentUser.realName = _self.editForm.realName;
            _self.CurrentUser.mygender = (_self.editForm.gender == 1)?"男":"女";
            _self.CurrentUser.mobile = _self.editForm.mobile;
        },
        //表格编辑事件  
        editClick:function() {  
            let _self = this;
            _self.editFormVisible = true;  
            _self.editForm.username = _self.CurrentUser.username;
            _self.editForm.realName = _self.CurrentUser.realName;
            _self.editForm.gender = _self.CurrentUser.gender;
            _self.editForm.mobile = _self.CurrentUser.mobile;
        },  
        editSubmit:function(formName){  
            let _self = this;
            _self.$refs[formName].validate((valid) => {
              if (valid) {
                let qs = require('qs');
                let postData = qs.stringify(_self.editForm);
                console.info(postData);
                _self.axios.post(_self.updateurl, postData)
                  .then((response) =>{
                    console.log(response);
                    if (response.data.success) {
                        _self.$message({  
                            message: '修改个人信息成功',  
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        }); 
                        _self.reloadingUser();
                    }
                  })
                  .catch((error)=> {
                    console.log(error);
                  }); 
                _self.editFormVisible = false;
              } else {
                console.log('error submit!!');
                return false;
              }
            });
        },
        //修改密码
        changePass:function(formName){
            let _self = this;
            if (_self.$refs[formName] != undefined) {
                _self.$refs[formName].resetFields();
            }
            _self.pwdFormVisible = true;  
        },
        pwdSubmit:function(formName){
            let _self = this;
            _self.$refs[formName].validate((valid) => {
              if (valid) {
                let qs = require('qs');
                let postData = qs.stringify({
                    password:_self.pwdForm.password,
                    newPassword:_self.pwdForm.newPassword
                });
                console.info(postData);
                _self.axios.post(_self.updatePassurl, postData)
                  .then((response) =>{
                    console.log(response);
                    if(response.data.success){
                        _self.$message({  
                            message: '修改密码成功',  
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        });                         
                    }
                  })
                  .catch((error)=> {
                    console.log(error);
                  }); 
                _self.pwdFormVisible = false;
              } else {
                console.log('error submit!!');
                return false;
              }
            });
        }
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.box-card{
    color: #5a5e66;
    font-size: 14px;
}
.mybtn{
    padding: 4px;
    margin: 0;
}
</style>
