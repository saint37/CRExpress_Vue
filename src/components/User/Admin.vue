<template>
    <el-main>
        <!--用户信息部分-->
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span v-show="user">你好，{{ user }}</span>
                <el-button style="float: right; padding: 3px 0 3px 10px;" type="text" @click="">修改密码</el-button>
                <el-button style="float: right; padding: 3px 0" type="text" @click="editClick">修改个人信息</el-button>
            </div>
            <el-row :gutter="20">
                <el-col :span="6">用户名：{{ CurrentUser.username }}</el-col>
                <el-col :span="6">用户类别：{{ CurrentUser.userRoleStr }}</el-col>
                <el-col :span="6">单位：{{ CurrentUser.orgName }}</el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="6">真实姓名：{{ CurrentUser.realName }}</el-col>
                <el-col :span="6">性别：{{ CurrentUser.gender }}</el-col>
                <el-col :span="6">电话：{{ CurrentUser.mobile }}</el-col>
            </el-row>
        </el-card>
        <el-row style="margin: 20px 0">
            <el-switch v-model="ShowUserList" active-text="显示用户列表" @change="loadingData(criteria, currentPage, pageSize)"></el-switch>
        </el-row>
        <!--用户列表部分-->
        <el-row v-if="ShowUserList">
            <!--列表顶部搜索和工具条-->
            <el-row>  
                <el-form :inline="true" :model="searchForm" class="demo-form-inline">  
                    <el-form-item label="单位">  
                        <el-input v-model="searchForm.orgName" placeholder="单位"></el-input>  
                    </el-form-item>
                    <el-form-item>  
                        <el-button type="primary" icon="search" @click="searchClick">查询</el-button>  
                        <el-button type="success" icon="plus" @click="addClick('createForm')">新建用户</el-button>  
                    </el-form-item>  
                </el-form>  
            </el-row>  
            <!--列表-->  
            <el-row>
                <el-table 
                    ref="multipleTable"
                    :data="tableData"
                    v-loading.body="loading" 
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="selectionChange">
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column prop="username" label="用户名" width="120"></el-table-column>
                    <!-- <el-table-column prop="password" label="密码" width="120"></el-table-column> -->
                    <el-table-column prop="userRoleStr" label="用户类别"></el-table-column>
                    <el-table-column prop="orgName" label="单位"></el-table-column>
                    <el-table-column prop="realName" label="真实姓名"></el-table-column>
                    <el-table-column prop="gender" label="性别"></el-table-column>
                    <el-table-column prop="mobile" label="电话"></el-table-column>
                    <el-table-column  
                        label="操作">  
                        <template scope="scope">  
                            <el-button type="danger" class="mybtn" size="mini" icon="delete" @click="deleteClick(scope.row)"><i class="el-icon-delete"></i></el-button>  
                            <el-button type="primary" class="mybtn" size="mini" icon="edit" @click="resetClick(scope.row)"><i class="el-icon-edit"></i></el-button>
                        </template>  
                    </el-table-column>  
                </el-table>        
            </el-row>
            <!--列表底部工具条和分页符-->  
            <el-row style="margin-top: 20px" type="flex" justify="end">  
                <el-col :span="6" >  
                    <el-button type="danger" size="small" icon="delete" @click="removeSelection">删除所选</el-button><el-button type="primary" size="small" icon="edit" @click="resetPassword">重置密码</el-button>
                </el-col>  
                <el-col :span="18" >  
                    <el-pagination  
                            style="float: right"  
                            @size-change="pageSizeChange"  
                            @current-change="currentPageChange"  
                            :current-page="currentPage"  
                            :page-sizes="[3, 5, 7, 10, 30, 50]"  
                            :page-size="pageSize"  
                            layout="total, sizes, prev, pager, next, jumper"  
                            :total="total">  
                    </el-pagination>  
                </el-col>  
            </el-row>  
        </el-row>
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
                      <el-radio label="男"></el-radio>
                      <el-radio label="女"></el-radio>
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
        <!--创建用户-->  
        <el-dialog title="新建用户" :visible.sync="createFormVisible" :close-on-click-modal="false">  
            <el-form :model="createForm" label-width="80px" :rules="editFormRules" ref="createForm" size="small">  
                <el-form-item label="用户名" prop="username">  
                    <el-input v-model="createForm.username" auto-complete="off"></el-input>  
                </el-form-item>   
                <el-form-item label="密码" prop="password">  
                    <el-input v-model="createForm.password"></el-input>  
                </el-form-item>  
                <el-form-item label="确认密码" prop="checkPass">  
                    <el-input v-model="createForm.checkPass"></el-input>  
                </el-form-item> 
                <el-form-item label="用户类别" prop="userRoleStr">  
                    <el-input v-model="createForm.userRoleStr"></el-input>  
                </el-form-item>  
                <el-form-item label="单位" prop="orgName">  
                    <el-input v-model="createForm.orgName"></el-input>  
                </el-form-item> 
                <el-form-item label="真实姓名" prop="realName">  
                    <el-input v-model="createForm.realName"></el-input>  
                </el-form-item>
                <el-form-item label="性别" prop="gender">  
                    <el-radio-group v-model="createForm.gender">
                      <el-radio label="男"></el-radio>
                      <el-radio label="女"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">  
                    <el-input v-model="createForm.mobile"></el-input>  
                </el-form-item> 
            </el-form>  
            <div slot="footer" class="dialog-footer">  
                <el-button @click.native="createFormVisible = false">取消</el-button>  
                <el-button type="primary" @click.native="addSubmit('createForm')" :loading="createLoading">新建</el-button>  
            </div>  
        </el-dialog>  
    </el-main>
</template>

<script>
export default {
  name: 'Admin',
  data () {
    return {
        //CurrentUser: "Saint",
        CurrentUser : {
            userId: '',
            username: '',
            password: '',
            roleId: '',
            userRoleStr: '',
            orgId: '',
            orgName: '',
            realName: '',
            gender: '',
            mobile: ''
        },
        //是否显示用户列表开关
        ShowUserList: false,
        //tableData: Array(20).fill(item),
        tableData:[],
        //多选数组
        multipleSelection: [],
        //显示加载中样式  
        loading:false,
        //搜索表单  
        searchForm: {  
            orgId: '',  
            orgName: ''
        },  
        //搜索条件
        criteria: '',
        //请求的URL
        //url:'http://localhost:3000/list',
        url:'http://10.1.167.174:8080/CRExpress/user/listUser.htm',
        addurl: 'http://10.1.167.174:8080/CRExpress/user/add.htm',
        updateurl: 'http://10.1.167.174:8080/CRExpress/user/update.htm',
        //当前页  
        currentPage:1,
        //分页大小  
        pageSize:10,
        //查询的页码
        start: 1,  
        //总记录数  
        total:0,
        //删除的弹出框  
        deleteVisible:false,  
        //编辑界面是否显示
        createFormVisible: false,  
        createLoading: false,  
        createFormRules: {  
            realName: [  
                { required: true, message: '请输入真实姓名', trigger: 'blur' }  
            ],
            gender: [  
                { required: true, message: '请选择性别', trigger: 'blur' }  
            ],
            mobile: [
                { required: true, message: '请输入联系电话', trigger: 'blur' }
            ]
        },
        //创建用户
        createForm: {  
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
        editFormVisible: false,  
        editLoading: false,  
        editFormRules: {  
            realName: [  
                { required: true, message: '请输入真实姓名', trigger: 'blur' }  
            ],
            gender: [  
                { required: true, message: '请选择性别', trigger: 'blur' }  
            ],
            mobile: [
                { required: true, message: '请输入联系电话', trigger: 'blur' }
            ]
        },
        //编辑用户
        editForm: {  
            username: '',
            realName: '',
            gender: '',
            mobile: ''
        } 
    }
  },
    computed: {
        user(){
            //因为在main.js中已经全局注册了store，所以这里直接用this.$直接使用。
            //return this.$store.state.user
            //发现store刷新就木有了还是用session吧
            return sessionStorage.username
        }
    },
    mounted () {
        //this.loadingData(this.criteria, this.currentPage, this.pageSize);
        this.loadingUser();
    },
    methods: {
        loadingUser: function(){
            var _self = this;
            _self.CurrentUser.username = sessionStorage.username;
            _self.CurrentUser.userRoleStr = sessionStorage.userRoleStr;
            _self.CurrentUser.orgName = sessionStorage.orgName;
            _self.CurrentUser.realName = sessionStorage.realName;
        },
        //表格重新加载数据  
        loadingData: function(criteria, pageNum, pageSize){
            var _self = this;
            var qs = require('qs');
            _self.axios.post(_self.url, qs.stringify({
                parameter:criteria, page:pageNum, limit:pageSize
            }))
              .then((response) =>{
                _self.tableData = response.data.root;
                _self.total = parseInt(response.data.total);
              })
              .catch((error)=> {
                console.log(error);
              }); 
        },  
        //新建事件  
        addClick:function(formName) {  
            var _self = this;  
            if (_self.$refs[formName] != undefined) {
                _self.$refs[formName].resetFields();
            }
            _self.createFormVisible = true;
            //_self.loadingData(this.criteria, this.currentPage, this.pageSize);//重新加载数据 
        },    
        addSubmit:function(formName){  
            var _self = this;
            _self.$refs[formName].validate((valid) => {
              if (valid) {
                var qs = require('qs');
                let postData = qs.stringify(_self.createForm);
                console.info(postData);
                _self.axios.get(_self.addurl, {params:{postData}})
                  .then((response) =>{
                    console.log(response);
                  })
                  .catch((error)=> {
                    console.log(error);
                  }); 
                _self.createFormVisible = false;
              } else {
                console.log('error submit!!');
                return false;
              }
            });
            _self.loadingData(this.criteria, this.currentPage, this.pageSize);
        },
        //表格编辑事件  
        editClick:function() {  
            var _self = this;
            _self.editFormVisible = true;  
            _self.editForm = Object.assign({}, _self.CurrentUser);  
        },  
        editSubmit:function(formName){  
            var _self = this;
             _self.$refs[formName].validate((valid) => {
              if (valid) {
                var qs = require('qs');
                let postData = qs.stringify(_self.editForm);
                console.info(postData);
                _self.axios.post(_self.updateurl, postData)
                  .then((response) =>{
                    console.log(response);
                  })
                  .catch((error)=> {
                    console.log(error);
                  }); 
                _self.createFormVisible = false;
              } else {
                console.log('error submit!!');
                return false;
              }
            });
        },
        //表格查询事件  
        searchClick:function() {  
            alert("查询");  
            var _self = this;  
            _self.loadingData(this.criteria, this.currentPage, this.pageSize);//重新加载数据  
        },  
        //表格勾选事件  
        selectionChange:function(val) {  
            for(var i=0;i<val.length;i++) {  
                var row = val[i];  
            }  
            this.multipleSelection = val;  
            console.info(val);  
        }, 
        //表格删除事件  
        deleteClick:function(row) {  
            var _self = this;  
            this.$confirm('确认删除' + row.name +'吗?', '提示', {  
                type: 'warning'  
            }).then(function(){  
                _self.$message({  
                    message: row.name + '删除成功',  
                    type: 'success'  
                });  
                _self.loadingData();//重新加载数据  
            }).catch(function(e){  
                if(e != "cancel")  
                    console.log("出现错误：" + e);  
            });  
        },  
        //重置密码事件  
        resetClick:function(row) {  
            console.info("resetRowPassword"); 
        },  
        //批量重置密码
        resetPassword:function(){  
            console.info("resetPassword");  
        }, 
        //删除所选，批量删除  
        removeSelection:function() {  
            var _self = this;  
            var multipleSelection = this.multipleSelection;  
            if(multipleSelection.length < 1) {  
                _self.$message({  
                    message: '请至少选中一条记录',  
                    type: 'error'  
                });  
                return;  
            }  
            var ids = "";  
            for(var i=0;i<multipleSelection.length;i++) {  
                var row = multipleSelection[i];  
                ids += row.name + ","  
            }  
            this.$confirm('确认删除' + ids +'吗?', '提示', {  
                type: 'warning'  
            }).then(function(){  
                _self.$message({  
                    message: ids + '删除成功',  
                    type: 'success'  
                });  
                _self.loadingData();//重新加载数据  
            }).catch(function(e){  
                if(e != "cancel")  
                    console.log("出现错误：" + e);  
            });  
        },  
        //分页大小修改事件  
        pageSizeChange:function(val) {  
            console.log('每页 ' + val +' 条');  
            this.pageSize = val;  
            var _self = this;  
            _self.loadingData(this.criteria, this.currentPage, this.pageSize);//重新加载数据  
        },  
        //当前页修改事件  
        currentPageChange:function(val) {  
            this.currentPage = val;  
            console.log('当前页: ' + val);  
            var _self = this;  
            _self.loadingData(this.criteria, this.currentPage, this.pageSize);//重新加载数据  
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
