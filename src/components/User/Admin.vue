<template>
    <el-main>
        <!--用户信息部分-->
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>你好，{{ CurrentUser }}</span>
            </div>
            <el-row :gutter="20">
                <el-col :span="6">单位：</el-col>
                <el-col :span="6">真实姓名：</el-col>
                <el-col :span="6">性别：</el-col>
                <el-col :span="6">电话：</el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="6">用户名：</el-col>
                <el-col :span="6">密码：</el-col>
                <el-col :span="6">用户类别：</el-col>
            </el-row>
        </el-card>
        <el-row style="margin: 20px 0">
            <el-switch v-model="ShowUserList" active-text="显示用户列表"></el-switch>
        </el-row>
        <!--用户列表部分-->
        <el-row v-if="ShowUserList">
            <!--列表顶部搜索和工具条-->
            <el-row>  
                <el-form :inline="true" :model="searchForm" class="demo-form-inline">  
                    <el-form-item label="单位">  
                        <el-input v-model="searchForm.name" placeholder="单位"></el-input>  
                    </el-form-item>  
                    <el-form-item>  
                        <el-button type="primary" icon="search" @click="searchClick">查询</el-button>  
                        <el-button type="success" icon="plus" @click="addClick">新建用户</el-button>  
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
                    <el-table-column type="selection" width="55" align="center">
                    </el-table-column>
                    <el-table-column prop="date" label="日期" width="140">
                    </el-table-column>
                    <el-table-column prop="name" label="姓名" width="120">
                    </el-table-column>
                    <el-table-column prop="address" label="地址">
                    </el-table-column>
                    <el-table-column  
                        label="操作">  
                    <template scope="scope">  
                        <el-button type="primary" size="small" icon="edit" @click="editClick(scope.row)">编辑</el-button>
                        <el-button type="danger" size="small" icon="delete" @click="deleteClick(scope.row)">删除</el-button>  
                    </template>  
                </el-table-column>  
                </el-table>        
            </el-row>
            <!--列表底部工具条和分页符-->  
            <el-row style="margin-top: 20px" type="flex" justify="end">  
                <el-col :span="6" >  
                    <el-button type="danger" size="small" icon="delete" @click="removeSelection">删除所选</el-button>  
                </el-col>  
                <el-col :span="18" >  
                    <el-pagination  
                            style="float: right"  
                            @size-change="pageSizeChange"  
                            @current-change="currentPageChange"  
                            :current-page="currentPage"  
                            :page-sizes="[10, 20, 30, 50]"  
                            :page-size="pageSize"  
                            layout="total, sizes, prev, pager, next, jumper"  
                            :total="total">  
                    </el-pagination>  
                </el-col>  
            </el-row>  
        </el-row>
        <!--编辑界面-->  
        <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">  
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">  
                <el-form-item label="日期">  
                    <el-date-picker type="date" placeholder="选择日期" v-model="editForm.date"></el-date-picker>  
                </el-form-item>  
                <el-form-item label="姓名" prop="name">  
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>  
                </el-form-item>   
                <el-form-item label="地址">  
                    <el-input type="textarea" v-model="editForm.address"></el-input>  
                </el-form-item>  
            </el-form>  
            <div slot="footer" class="dialog-footer">  
                <el-button @click.native="editFormVisible = false">取消</el-button>  
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>  
            </div>  
        </el-dialog>  
    </el-main>
</template>

<script>
export default {
  name: 'Admin',
  data () {
    const item = {
        date: '2018-01-16',
        name: 'ST',
        address: '北京市海淀区大柳树路2号'
    };
    return {
        CurrentUser: "Saint",
        //是否显示用户列表开关
        ShowUserList: false,
        //tableData: Array(20).fill(item),
        tableData: [{
          date: '2016-05-03',
          name: 'ST',
          address: '北京市海淀区大柳树路2号'
        }, {
          date: '2016-05-02',
          name: 'ST',
          address: '北京市海淀区大柳树路2号'
        }, {
          date: '2016-05-04',
          name: 'ST',
          address: '北京市海淀区大柳树路2号'
        }, {
          date: '2016-05-01',
          name: 'ST',
          address: '北京市海淀区大柳树路2号'
        }, {
          date: '2016-05-08',
          name: 'ST',
          address: '北京市海淀区大柳树路2号'
        }, {
          date: '2016-05-06',
          name: 'ST',
          address: '北京市海淀区大柳树路2号'
        }, {
          date: '2016-05-07',
          name: 'ST',
          address: '北京市海淀区大柳树路2号'
        }],
        //显示加载中样式  
        loading:false,  
        //搜索表单  
        searchForm: {  
            id: '',  
            name: ''
        },  
        multipleSelection: [],
        //当前页  
        currentPage:1,  
        //分页大小  
        pageSize:10,  
        //总记录数  
        total:100,  
        //删除的弹出框  
        deleteVisible:false,  
        //编辑界面是否显示  
        editFormVisible: false,  
        editLoading: false,  
        editFormRules: {  
            name: [  
                { required: true, message: '请输入姓名', trigger: 'blur' }  
            ]  
        },  
        //编辑界面数据  
        editForm: {  
            id: 0,  
            name: '',  
            date: '',  
            address: ''  
        },  
    }
  },
    methods: {
        //表格重新加载数据  
        loadingData:function() {  
            var _self = this;  
            _self.loading = true;  
            setTimeout(function(){  
                console.info("加载数据成功");  
                _self.loading = false;  
            },300);  
        },  
        //表格编辑事件  
        editClick:function(row) {  
            this.editFormVisible = true;  
            this.editForm = Object.assign({}, row);  
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
        //新建事件  
        addClick:function() {  
            var _self = this;  
            this.editFormVisible = true;  
            //_self.loadingData();//重新加载数据  
        },  
        //表格查询事件  
        searchClick:function() {  
            alert("查询");  
            var _self = this;  
            _self.loadingData();//重新加载数据  
        },  
        //表格勾选事件  
        selectionChange:function(val) {  
            for(var i=0;i<val.length;i++) {  
                var row = val[i];  
            }  
            this.multipleSelection = val;  
            console.info(val);  
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
            _self.loadingData();//重新加载数据  
        },  
        //当前页修改事件  
        currentPageChange:function(val) {  
            this.currentPage = val;  
            console.log('当前页: ' + val);  
            var _self = this;  
            _self.loadingData();//重新加载数据  
        },  
        //保存点击事件  
        editSubmit:function(){  
            console.info(this.editForm);  
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
</style>
