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
                    <el-table-column prop="roleId" label="用户类别"><template scope="scope">
                        <div v-if="scope.row.roleId == 1">管理员</div>
                        <div v-else-if="scope.row.roleId == 2">路局管理员</div>
                        <div v-else>路局用户</div>
                    </template></el-table-column>
                    <el-table-column prop="orgName" label="单位"></el-table-column>
                    <el-table-column prop="realName" label="真实姓名"></el-table-column>
                    <el-table-column prop="gender" label="性别"><template scope="scope">
                        {{scope.row.gender===1?'男':'女'}}
                    </template></el-table-column>
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
        <!--修改密码-->  
        <el-dialog title="修改密码" :visible.sync="pwdFormVisible" :close-on-click-modal="false">  
            <el-form :model="pwdForm" label-width="80px" :rules="pwdFormRules" ref="pwdForm" size="small">  
                <el-form-item label="原始密码" prop="password">  
                    <el-input type="password" v-model="pwdForm.password" auto-complete="off"></el-input>  
                </el-form-item>   
                <el-form-item label="新密码" prop="newPassword">  
                    <el-input type="password" v-model="pwdForm.newPassword"></el-input>  
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass">  
                    <el-input type="password" v-model="pwdForm.checkPass"></el-input>
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
        <!--创建用户-->  
        <el-dialog title="新建用户" :visible.sync="createFormVisible" :close-on-click-modal="false">  
            <el-form :model="createForm" label-width="80px" :rules="editFormRules" ref="createForm" size="small">  
                <el-form-item label="用户名" prop="username">  
                    <el-input v-model="createForm.username" auto-complete="off"></el-input>  
                </el-form-item>   
                <el-form-item label="单位" prop="orgId">
                    <el-select v-model="createForm.orgId" placeholder="铁路局">
                      <el-option v-for="item in orgs" :label="item.orgStr" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="真实姓名" prop="realName">  
                    <el-input v-model="createForm.realName"></el-input>  
                </el-form-item>
                <el-form-item label="性别" prop="gender">  
                    <el-radio-group v-model="createForm.gender">
                      <el-radio label="1">男</el-radio>
                      <el-radio label="2">女</el-radio>
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
        orgs:[{"id":19,"flag":1,"upperUnitId":0,"orgStr":"中国铁路总公司"},{"id":1,"flag":2,"upperUnitId":19,"orgStr":"哈尔滨铁路局"},{"id":2,"flag":2,"upperUnitId":19,"orgStr":"沈阳铁路局"},{"id":3,"flag":2,"upperUnitId":19,"orgStr":"北京铁路局"},{"id":4,"flag":2,"upperUnitId":19,"orgStr":"太原铁路局"},{"id":5,"flag":2,"upperUnitId":19,"orgStr":"呼和浩特铁路局"},{"id":6,"flag":2,"upperUnitId":19,"orgStr":"郑州铁路局"},{"id":7,"flag":2,"upperUnitId":19,"orgStr":"武汉铁路局"},{"id":8,"flag":2,"upperUnitId":19,"orgStr":"西安铁路局"},{"id":9,"flag":2,"upperUnitId":19,"orgStr":"济南铁路局"},{"id":10,"flag":2,"upperUnitId":19,"orgStr":"上海铁路局"},{"id":11,"flag":2,"upperUnitId":19,"orgStr":"南昌铁路局"},{"id":12,"flag":2,"upperUnitId":19,"orgStr":"广州铁路（集团）公司"},{"id":13,"flag":2,"upperUnitId":19,"orgStr":"南宁铁路局"},{"id":14,"flag":2,"upperUnitId":19,"orgStr":"成都铁路局"},{"id":15,"flag":2,"upperUnitId":19,"orgStr":"昆明铁路局"},{"id":16,"flag":2,"upperUnitId":19,"orgStr":"兰州铁路局"},{"id":17,"flag":2,"upperUnitId":19,"orgStr":"乌鲁木齐铁路局"},{"id":18,"flag":2,"upperUnitId":19,"orgStr":"青藏铁路公司"}],
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
        //是否显示用户列表开关
        ShowUserList: true,
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
        //url:'http://10.1.167.188:3000/list',
        url:'http://10.1.167.174:8080/CRExpress/user/listUser.htm',
        addurl: 'http://10.1.167.174:8080/CRExpress/user/add.htm',
        updateurl: 'http://10.1.167.174:8080/CRExpress/user/update.htm',
        updatePassurl: 'http://10.1.167.174:8080/CRExpress/user/updatePassword.htm',
        delurl: 'http://10.1.167.174:8080/CRExpress/user/delete.htm',
        delurlist: 'http://10.1.167.174:8080/CRExpress/user/deleteList.htm',
        reseturl:'http://10.1.167.174:8080/CRExpress//user/resetPassword.htm',
        reseturlist:'',
        //当前页  
        currentPage:1,
        //分页大小  
        pageSize:5,
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
            username: '',
            orgId: 19,
            orgName: '',
            realName: '',
            gender: 0,
            mobile: ''
        }, 
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
        //编辑用户
        editForm: {  
            username: '',
            realName: '',
            gender: 0,
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
    computed: {

    },
    mounted () {
        this.loadingData(this.criteria, this.currentPage, this.pageSize);
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
        //表格重新加载数据  
        loadingData: function(criteria, pageNum, pageSize){
            let _self = this;
            let qs = require('qs');
            //_self.axios.get(_self.url)
            _self.axios.post(_self.url, qs.stringify({
                parameter:criteria, page:pageNum, limit:pageSize
            }))
              .then((response) =>{
                _self.tableData = response.data.root;
                console.log(response.data.root);
                _self.total = parseInt(response.data.total);
              })
              .catch((error)=> {
                console.log(error);
              }); 
        },  
        //新建事件  
        addClick:function(formName) {  
            let _self = this;  
            if (_self.$refs[formName] != undefined) {
                _self.$refs[formName].resetFields();
            }
            _self.createFormVisible = true;
            //_self.loadingData(this.criteria, this.currentPage, this.pageSize);//重新加载数据 
        },    
        addSubmit:function(formName){  
            let _self = this;
            _self.$refs[formName].validate((valid) => {
              if (valid) {
                let qs = require('qs');
                let postData = qs.stringify(_self.createForm);
                console.log(postData);
                _self.axios.post(_self.addurl, postData)
                  .then((response) =>{
                    console.log(response);
                    if(response.data.success){
                        _self.$message({  
                            message: '添加用户成功',  
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        });
                        _self.$nextTick(function(){
                            _self.loadingData(this.criteria, this.currentPage, this.pageSize);
                        });                        
                    }
                    else {
                        _self.$message({  
                            message: response.data.msg,  
                            type: 'error',
                            showClose: true,
                            duration: 3000
                        });
                    }
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
                    else {
                        _self.$message({  
                            message: response.data.msg,  
                            type: 'error',
                            showClose: true,
                            duration: 3000
                        });
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
                    else {
                        _self.$message({  
                            message: response.data.msg,  
                            type: 'error',
                            showClose: true,
                            duration: 3000
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
        },
        //表格查询事件  
        searchClick:function() {  
            let _self = this;  
            _self.criteria = _self.searchForm.orgName;
            //console.log("单位：" + _self.criteria);
            _self.loadingData(this.criteria, this.currentPage, this.pageSize);//重新加载数据  
        },  
        //表格勾选事件  
        selectionChange:function(val) {  
            for(let i=0;i<val.length;i++) {  
                let row = val[i];  
            }  
            this.multipleSelection = val;  
            console.info(val);  
        }, 
        //表格删除事件  
        deleteClick:function(row) {  
            let _self = this;  
            _self.$confirm('确认删除' + row.username +'吗?', '提示', {  
                type: 'warning'  
            }).then(function(){  
                let qs = require('qs');
                // let postData = qs.stringify(row, {indices: false});
                _self.axios.post(_self.delurl, qs.stringify({id:row.id,roleId:row.roleId}))
                  .then((response) =>{
                    console.log(response);
                    if(response.data.success){
                        _self.$message({  
                            message: row.username + '删除成功',
                            type: 'success',
                            showClose: true,
                            duration: 2000 
                        }); 
                        _self.$nextTick(function(){
                            _self.loadingData(this.criteria, this.currentPage, this.pageSize);
                        });
                    }
                    else {
                        _self.$message({  
                            message: response.data.msg,  
                            type: 'error',
                            showClose: true,
                            duration: 3000
                        });
                    }
                  })
                  .catch((error)=> {
                    console.log(error);
                  }); 
            });  
        }, 
        //删除所选，批量删除
        removeSelection:function() {  
            let _self = this;  
            let multipleSelection = this.multipleSelection;  
            if(multipleSelection.length < 1) {
                _self.$message({  
                    message: '请至少选中一条记录',  
                    type: 'error',
                    duration: 2000 
                });  
                return;  
            }  
            let success = 0;
            let ids = "";  
            for(let i=0;i<multipleSelection.length;i++) {  
                let row = multipleSelection[i];  
                ids += row.username + ","  
            }  
            this.$confirm('确认删除' + ids +'吗?', '提示', {  
                type: 'warning'  
            }).then(function(){  
                for(let i=0;i<multipleSelection.length;i++) {  
                    let row = multipleSelection[i];  
                    let qs = require('qs');
                    success = 0;
                    _self.axios.post(_self.delurl, qs.stringify({id:row.id,roleId:row.roleId}))
                      .then((response) =>{
                        console.log(response); 
                        if(response.data.success){
                            success = 1;
                        }
                        else {
                            _self.$message({  
                                message: response.data.msg,  
                                type: 'error',
                                showClose: true,
                                duration: 3000
                            });
                        }
                      })
                      .catch((error)=> {
                        console.log("error:"+error);
                      }); 
                }  
                _self.loading = true;  
                setTimeout(function(){  
                    if(success == 1){
                        _self.$message({  
                            message: ids + '删除成功',
                            type: 'success',
                            showClose: true,
                            duration: 2000 
                        }); 
                        _self.$nextTick(function(){
                            _self.loadingData(this.criteria, this.currentPage, this.pageSize);
                        });                        
                    }
                    _self.loading = false;  
                },300);  
            }).catch(function(e){  
                if(e != "cancel")  
                    console.log("出现错误：" + e);  
            });
        },    
        removeSelection2:function() {  
            let _self = this;  
            let multipleSelection = this.multipleSelection;  
            if(multipleSelection.length < 1) {
                _self.$message({  
                    message: '请至少选中一条记录',  
                    type: 'error',
                    duration: 2000 
                });  
                return;  
            }  
            let success = 0;
            let ids = "";  
            let postData = [];
            for(let i=0;i<multipleSelection.length;i++) {  
                let row = multipleSelection[i];  
                ids += row.username + ",";
                let temp = {id : row.id, roleId : row.roleId};
                postData.push(temp);
            }  
            this.$confirm('确认删除' + ids +'吗?', '提示', {  
                type: 'warning'  
            }).then(function(){  
                console.log("删除:"+JSON.stringify(postData));
                // _self.axios.post(_self.delurlist, JSON.stringify(postData))
                //   .then((response) =>{
                //     console.log(response);
                //     if(response.data.success){
                //         _self.$message({  
                //             message: ids + '删除成功',
                //             type: 'success',
                //             showClose: true,
                //             duration: 3000 
                //         }); 
                //         _self.$nextTick(function(){
                //             _self.loadingData(this.criteria, this.currentPage, this.pageSize);
                //         });
                //     }
                //     else {
                //         _self.$message({  
                //             message: response.data.msg,  
                //             type: 'error',
                //             showClose: true,
                //             duration: 3000
                //         });
                //     }
                //   })
                //   .catch((error)=> {
                //     console.log(error);
                //   });  
            });
        },   
        //重置密码事件  
        resetClick:function(row) {  
            let _self = this;  
            _self.$confirm('确认重置' + row.username +'的密码吗?', '提示', {  
                type: 'warning'  
            }).then(function(){  
                let qs = require('qs');
                _self.axios.post(_self.reseturl, qs.stringify({id:row.id,username:row.username}))
                  .then((response) =>{
                    console.log(response);
                    if(response.data.success){
                        _self.$message({  
                            message: row.username + '重置密码成功',
                            type: 'success',
                            showClose: true,
                            duration: 2000 
                        }); 
                    }
                    else {
                        _self.$message({  
                            message: response.data.msg,  
                            type: 'error',
                            showClose: true,
                            duration: 3000
                        });
                    }
                  })
                  .catch((error)=> {
                    console.log(error);
                  }); 
            });  
        },  
        //批量重置密码
        resetPassword:function(){  
            let _self = this;  
            let multipleSelection = this.multipleSelection;  
            if(multipleSelection.length < 1) {
                _self.$message({  
                    message: '请至少选中一条记录',  
                    type: 'error'  
                });  
                return;  
            }  
            let ids = "";  
            for(let i=0;i<multipleSelection.length;i++) {  
                let row = multipleSelection[i];  
                ids += row.username + ","  
            }  
            this.$confirm('确认重置' + ids +'的密码吗?', '提示', {  
                type: 'warning'  
            }).then(function(){  
                for(let i=0;i<multipleSelection.length;i++) {  
                    let row = multipleSelection[i];  
                    let qs = require('qs');
                    _self.axios.post(_self.reseturl, qs.stringify({id:row.id,username:row.username}))
                      .then((response) =>{
                        console.log(response); 
                        if(response.data.success){
                            _self.$message({  
                                message: ids + '重置密码成功',
                                type: 'success',
                                showClose: true,
                                duration: 2000 
                            }); 
                        }
                        else {
                            _self.$message({  
                                message: response.data.msg,  
                                type: 'error',
                                showClose: true,
                                duration: 3000
                            });
                        }
                      })
                      .catch((error)=> {
                        console.log("error:"+error);
                      }); 
                }  
            }).catch(function(e){  
                if(e != "cancel")  
                    console.log("出现错误：" + e);  
            }); 
        }, 
        resetPassword2:function(){  
            let _self = this;  
            let multipleSelection = this.multipleSelection;  
            if(multipleSelection.length < 1) {
                _self.$message({  
                    message: '请至少选中一条记录',  
                    type: 'error'  
                });  
                return;  
            }  
            let ids = ""; 
            let postData =[];
            for(let i=0;i<multipleSelection.length;i++) {  
                let row = multipleSelection[i];  
                ids += row.username + ",";
                let temp = {id : row.id, roleId : row.roleId};
                postData.push(temp);
            }  
            this.$confirm('确认重置' + ids +'的密码吗?', '提示', {  
                type: 'warning'  
            }).then(function(){  
                console.log("重置:"+JSON.stringify(postData));
                // _self.axios.post(_self.reseturlist, JSON.stringify(postData))
                //   .then((response) =>{
                //     console.log(response);
                //     if(response.data.success){
                //         _self.$message({  
                //             message: ids + '重置成功',
                //             type: 'success',
                //             showClose: true,
                //             duration: 3000 
                //         }); 
                //         _self.$nextTick(function(){
                //             _self.loadingData(this.criteria, this.currentPage, this.pageSize);
                //         });
                //     }
                //     else {
                //         _self.$message({  
                //             message: response.data.msg,  
                //             type: 'error',
                //             showClose: true,
                //             duration: 3000
                //         });
                //     }
                //   })
                //   .catch((error)=> {
                //     console.log(error);
                //   });  
            }); 
        }, 
        //分页大小修改事件  
        pageSizeChange:function(val) {  
            console.log('每页 ' + val +' 条');  
            this.pageSize = val;  
            let _self = this;  
            _self.loadingData(this.criteria, this.currentPage, this.pageSize);//重新加载数据  
        },  
        //当前页修改事件  
        currentPageChange:function(val) {  
            this.currentPage = val;  
            console.log('当前页: ' + val);  
            let _self = this;  
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
