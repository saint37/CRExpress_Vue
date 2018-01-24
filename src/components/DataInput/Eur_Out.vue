<template>
    <el-main>
        <el-row>
            <el-form :inline="true" :model="saveForm" class="demo-form-inline">  
                <el-form-item><h1>中欧班列去程运量统计表</h1></el-form-item>
                <el-form-item label="铁路局">  
                    <el-input v-model="saveForm.orgName" :disabled="true" size="mini" placeholder="铁路局"></el-input>  
                </el-form-item> 
                <el-form-item label="填表人">  
                    <el-input v-model="saveForm.realName" :disabled="true" size="mini" placeholder="填表人"></el-input>  
                </el-form-item>  
                <el-form-item label="联系电话">  
                    <el-input v-model="saveForm.mobile" :disabled="true" size="mini" placeholder="电话"></el-input>  
                </el-form-item>  
            </el-form>
        </el-row>
        
        <!--列表顶部搜索和工具条-->
        <el-row>  
            <el-form :inline="true" :model="searchForm" class="demo-form-inline">  
                <el-form-item>
                    <el-select v-model="searchForm.org" placeholder="铁路局">
                      <el-option label="北京局" value="beijing"></el-option>
                      <el-option label="太原局" value="taiyuan"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="width: 300px">  
                    <el-col :span="11">
                      <el-date-picker type="date" placeholder="选择日期" v-model="searchForm.date1" style="width: 100%"></el-date-picker>
                    </el-col>
                    <el-col class="line" :span="2">-</el-col>
                    <el-col :span="11">
                      <el-date-picker type="date" placeholder="选择日期" v-model="searchForm.date2" style="width: 100%"></el-date-picker>
                    </el-col>
                </el-form-item> 
                <el-form-item>  
                    <el-button type="primary" icon="edit" @click="searchClick">筛选</el-button>
                    <el-button type="success" icon="edit" @click="addClick">新增</el-button>
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
                @selection-change="selectionChange">
                <el-table-column type="selection" width="55" align="center">
                </el-table-column>
                <el-table-column label="操作">  
                    <template scope="scope">  
                        <el-button type="primary" class="mybtn" size="mini" icon="edit" @click="editClick(scope.row)"><i class="el-icon-edit"></i></el-button>
                        <el-button type="danger" class="mybtn" size="mini" icon="delete" @click="deleteClick(scope.row)"><i class="el-icon-delete"></i></el-button>  
                    </template>  
                </el-table-column>  
                <el-table-column prop="id" label="序号"></el-table-column>
                <el-table-column prop="station" label="发站"></el-table-column>
                <el-table-column prop="name" label="发车车次"></el-table-column>
                <el-table-column prop="name" label="发车日期"></el-table-column>
                <el-table-column prop="name" label="出境口岸站"></el-table-column>
                <el-table-column prop="name" label="境外到站"></el-table-column>
                <el-table-column prop="name" label="境外到站所属国家"></el-table-column>
                <el-table-column prop="name" label="境外到站所属城市"></el-table-column>
                <el-table-column prop="name" label="列数"></el-table-column>
                <el-table-column prop="name" label="车数"></el-table-column>
                <el-table-column prop="name" label="箱数">
                    <el-table-column prop="name" label="20英尺（只）">
                        <el-table-column prop="name" label="重箱"></el-table-column>
                        <el-table-column prop="name" label="空箱"></el-table-column>
                    </el-table-column>
                    <el-table-column prop="name" label="40英尺（只）">
                        <el-table-column prop="name" label="重箱"></el-table-column>
                        <el-table-column prop="name" label="空箱"></el-table-column>
                    </el-table-column>
                    <el-table-column prop="name" label="45英尺（只）">
                        <el-table-column prop="name" label="重箱"></el-table-column>
                        <el-table-column prop="name" label="空箱"></el-table-column>
                    </el-table-column>
                    <el-table-column prop="name" label="折合TEU"></el-table-column>
                </el-table-column>
                <el-table-column prop="name" label="其中冷藏箱">
                    <el-table-column prop="name" label="TEU"></el-table-column>
                    <el-table-column prop="name" label="吨"></el-table-column>
                </el-table-column>
                <el-table-column prop="notes" label="备注"></el-table-column>
            </el-table>
        </el-row>     

        <!--列表底部工具条和分页符-->  
        <el-row style="margin-top: 20px" type="flex" justify="end">  
            <el-col :span="6" >  
                <el-button type="primary" size="small" icon="upload" @click="submitSelection">提交所选</el-button> 
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
        <!--编辑界面-->  
        <el-dialog title="运量统计" :visible.sync="editFormVisible" :close-on-click-modal="false" fullscreen>  
            <el-form :model="editForm" label-width="140px" :rules="editFormRules" ref="editForm" size="mini"> 
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="发站" prop="fromStation">  
                            <el-input v-model="editForm.fromStation" auto-complete="off"></el-input>  
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="发车车次" prop="trainNumber">  
                            <el-input v-model="editForm.trainNumber" auto-complete="off"></el-input>  
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="发车日期">  
                            <el-date-picker type="date" placeholder="选择日期" v-model="editForm.fromDate" style="width: 150px;"></el-date-picker>  
                        </el-form-item> 
                    </el-col>
                </el-row> 
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="出境口岸站">  
                            <el-input v-model="editForm.exitPortStation" auto-complete="off"></el-input>  
                        </el-form-item> 
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="境外到站">  
                            <el-input v-model="editForm.overseasStation" auto-complete="off"></el-input>  
                        </el-form-item> 
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="境外到站所属国">  
                            <el-input v-model="editForm.overseasCountry" auto-complete="off"></el-input>  
                        </el-form-item> 
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="境外到站所属城市">  
                            <el-input v-model="editForm.overseasCity" auto-complete="off"></el-input>  
                        </el-form-item> 
                    </el-col>
                </el-row> 
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="列数">  
                            <el-input v-model="editForm.trainQty" auto-complete="off"></el-input>  
                        </el-form-item> 
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车数">  
                            <el-input v-model="editForm.carriageQty" auto-complete="off"></el-input>  
                        </el-form-item> 
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="20尺重箱数">  
                            <el-input v-model="editForm.twHeavyQty" auto-complete="off"></el-input>  
                        </el-form-item> 
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="20尺空箱数">  
                            <el-input v-model="editForm.twEmptyQty" auto-complete="off"></el-input>  
                        </el-form-item> 
                    </el-col>
                </el-row> 
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="40尺重箱数">  
                            <el-input v-model="editForm.ftHeavyQty" auto-complete="off"></el-input>  
                        </el-form-item> 
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="40尺空箱数">  
                            <el-input v-model="editForm.ftEmptyQty" auto-complete="off"></el-input>  
                        </el-form-item> 
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="45尺重箱数">  
                            <el-input v-model="editForm.ffHeavyQty" auto-complete="off"></el-input>  
                        </el-form-item> 
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="45尺空箱数">  
                            <el-input v-model="editForm.ffEmptyQty" auto-complete="off"></el-input>  
                        </el-form-item> 
                    </el-col>
                </el-row> 
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="折合TEU">  
                            <el-input v-model="editForm.TEU" auto-complete="off"></el-input>  
                        </el-form-item> 
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="其中冷藏箱TEU">  
                            <el-input v-model="editForm.coldTEU" auto-complete="off"></el-input>  
                        </el-form-item> 
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="冷藏箱重量">  
                            <el-input v-model="editForm.coldWeight" auto-complete="off"></el-input>  
                        </el-form-item> 
                    </el-col>
                </el-row> 
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="备注">  
                            <el-input type="textarea" v-model="editForm.remark"></el-input>  
                        </el-form-item>  
                    </el-col>
                </el-row>
            </el-form>  
            <div slot="footer" class="dialog-footer">  
                <el-button @click.native="editFormVisible = false">取消</el-button>  
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存</el-button>  
            </div>  
        </el-dialog>  
    </el-main>
</template>

<script>
// import VueScrollbar from 'vue2-scrollbar'
export default {
  name: 'User',
  // components: {
  //       VueScrollbar
  //   },
  data () {
    const item = {
        date: '2018-01-16',
        name: 'ST',
        address: '北京市海淀区大柳树路2号'
    };
    return {
        Org: '**某**',
        //tableData: Array(20).fill(item),
        tableData: [{
          station: '义乌',
          name: 'ST',
          notes: '备注'
        }, {
          station: '义乌',
          name: 'ST',
          notes: '备注'
        }, {
          station: '义乌',
          name: 'ST',
          notes: '备注'
        }, {
          station: '义乌',
          name: 'ST',
          notes: '备注'
        }],
        //显示加载中样式  
        loading:false,  
        //搜索表单  
        saveForm: {  
            orgName: '',  
            realName: '',
            mobile: ''
        },  
        //搜索表单  
        searchForm: {  
            org: '',  
            date1: '',
            date2: ''
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
            fromStation: '',  
            trainNumber: '',  
            fromDate: '', 
            exitPortStation: '', 
            overseasStation: '',
            overseasCountry: '',
            overseasCity: '',
            trainQty: '',
            carriageQty: '',
            twHeavyQty: '',
            twEmptyQty: '',
            ftHeavyQty: '',
            ftEmptyQty: '',
            ffHeavyQty: '',
            ffEmptyQty: '',
            TEU: '',
            coldTEU: '',
            coldWeight: '',
            remark: ''  
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
        //表格保存事件  
        searchClick:function() {  
            alert("搜索");  
            var _self = this;  
            _self.loadingData();//重新加载数据  
        },  
        //表格提交事件  
        submitSelection:function() {  
            alert("提交");  
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
h1{margin-top: 0;}
.mybtn{
    padding: 4px;
    margin: 0;
}
.line{
    text-align: center;
}
</style>
