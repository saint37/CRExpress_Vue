<template>
    <el-main>
        <el-row>
            <el-form :inline="true" :model="saveForm" class="demo-form-inline">  
                <el-form-item><h1>中欧班列去程运量统计表</h1></el-form-item>
                <el-form-item label="铁路局">  
                    <el-input v-model="searchForm.orgName" :disabled="true" size="mini" placeholder="铁路局"></el-input>  
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
                    <el-select v-model="searchForm.status" placeholder="全部">
                        <el-option v-for="item in options" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="width: 350px">  
                    <el-col :span="11">
                        <el-date-picker
                          v-model="searchForm.departDateBegin"
                          type="date"
                          placeholder="选择日期"
                          :picker-options="pickerOptions0"
                          style="width: 100%">
                        </el-date-picker>
                    </el-col>
                    <el-col class="line" :span="2">-</el-col>
                    <el-col :span="11">
                        <el-date-picker
                          v-model="searchForm.departDateEnd"
                          type="date"
                          placeholder="选择日期"
                          :picker-options="pickerOptions1"
                          style="width: 100%">
                        </el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item>  
                    <el-button type="primary" icon="edit" @click="searchClick">查询</el-button>
                    <el-button type="success" icon="edit" @click="addClick('editForm')">新增</el-button>
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
                :row-class-name="tableRowClassName"
                @selection-change="selectionChange">
                <el-table-column type="selection" width="55" align="center">
                </el-table-column>
                <el-table-column label="操作">  
                    <template scope="scope">  
                        <div v-if="scope.row.status == 1" style="width: 80px;">
                            <el-button type="primary" class="mybtn" size="mini" icon="submit" @click="submitClick(scope.row)"><i class="el-icon-upload"></i></el-button> 
                            <el-button type="success" class="mybtn" size="mini" icon="edit" @click="editClick(scope.row)"><i class="el-icon-edit"></i></el-button>
                            <el-button type="danger" class="mybtn" size="mini" icon="delete" @click="deleteClick(scope.row)"><i class="el-icon-delete"></i></el-button> 
                        </div>
                        <div v-else></div>
                    </template>  
                </el-table-column> 
                <el-table-column prop="status" label="状态">
                    <template scope="scope">
                        <div v-if="scope.row.status == 1" style="color: #5daf34">未提交</div>
                        <div v-else-if="scope.row.status == 2" style="color: #409EFF">已提交</div>
                    </template>
                </el-table-column> 
                <el-table-column prop="fromStation" label="发站"></el-table-column>
                <el-table-column prop="trainNumber" label="发车车次"></el-table-column>
                <el-table-column prop="departDate" label="发车日期">
                    <template scope="scope">
                        {{scope.row.departDate ? maxSlice(scope.row.departDate):scope.row.departDate}}
                    </template>
                </el-table-column>
                <el-table-column prop="exitportStation" label="出境口岸站"></el-table-column>
                <el-table-column prop="overseasStation" label="境外到站"></el-table-column>
                <el-table-column prop="overseasCountry" label="境外到站所属国家"></el-table-column>
                <el-table-column prop="overseasCity" label="境外到站所属城市"></el-table-column>
                <el-table-column prop="trainQty" label="列数"></el-table-column>
                <el-table-column prop="carriageQty" label="车数"></el-table-column>
                <el-table-column prop="" label="箱数">
                    <el-table-column prop="" label="20英尺（只）">
                        <el-table-column prop="heavyQtyTwenty" label="重箱"></el-table-column>
                        <el-table-column prop="emptyQtyTwenty" label="空箱"></el-table-column>
                    </el-table-column>
                    <el-table-column prop="" label="40英尺（只）">
                        <el-table-column prop="heavyQtyForty" label="重箱"></el-table-column>
                        <el-table-column prop="emptyQtyForty" label="空箱"></el-table-column>
                    </el-table-column>
                    <el-table-column prop="" label="45英尺（只）">
                        <el-table-column prop="heavyQtyFortyfive" label="重箱"></el-table-column>
                        <el-table-column prop="emptyQtyFortyfive" label="空箱"></el-table-column>
                    </el-table-column>
                    <el-table-column prop="TEU" label="折合TEU"></el-table-column>
                </el-table-column>
                <el-table-column prop="" label="其中冷藏箱">
                    <el-table-column prop="coldTEU" label="TEU"></el-table-column>
                    <el-table-column prop="coldWeight" label="吨"></el-table-column>
                </el-table-column>
                <el-table-column prop="remark" label="备注"></el-table-column>
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
                        <el-form-item label="发车日期" prop="departDate">  
                            <el-date-picker type="date" placeholder="选择日期" v-model="editForm.departDate" style="width: 150px;"></el-date-picker>  
                        </el-form-item> 
                    </el-col>
                </el-row> 
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="出境口岸站" prop="exitportStation">  
                            <el-input v-model="editForm.exitportStation" auto-complete="off"></el-input>  
                        </el-form-item> 
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="境外到站" prop="overseasStation">  
                            <el-input v-model="editForm.overseasStation" auto-complete="off"></el-input>  
                        </el-form-item> 
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="境外到站所属国" prop="overseasCountry">  
                            <el-input v-model="editForm.overseasCountry" auto-complete="off"></el-input>  
                        </el-form-item> 
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="境外到站所属城市" prop="overseasCity">  
                            <el-input v-model="editForm.overseasCity" auto-complete="off"></el-input>  
                        </el-form-item> 
                    </el-col>
                </el-row> 
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="列数" prop="trainQty">  
                            <el-input v-model="editForm.trainQty" auto-complete="off"></el-input>  
                        </el-form-item> 
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车数" prop="carriageQty">  
                            <el-input v-model="editForm.carriageQty" auto-complete="off"></el-input>  
                        </el-form-item> 
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="20尺重箱数" prop="heavyQtyTwenty">  
                            <el-input v-model="editForm.heavyQtyTwenty" auto-complete="off"></el-input>  
                        </el-form-item> 
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="20尺空箱数" prop="emptyQtyTwenty">  
                            <el-input v-model="editForm.emptyQtyTwenty" auto-complete="off"></el-input>  
                        </el-form-item> 
                    </el-col>
                </el-row> 
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="40尺重箱数" prop="heavyQtyForty">  
                            <el-input v-model="editForm.heavyQtyForty" auto-complete="off"></el-input>  
                        </el-form-item> 
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="40尺空箱数" prop="emptyQtyForty">  
                            <el-input v-model="editForm.emptyQtyForty" auto-complete="off"></el-input>  
                        </el-form-item> 
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="45尺重箱数" prop="heavyQtyFortyfive">  
                            <el-input v-model="editForm.heavyQtyFortyfive" auto-complete="off"></el-input>  
                        </el-form-item> 
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="45尺空箱数" prop="emptyQtyFortyfive">  
                            <el-input v-model="editForm.emptyQtyFortyfive" auto-complete="off"></el-input>  
                        </el-form-item> 
                    </el-col>
                </el-row> 
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="折合TEU" prop="TEU">  
                            <el-input v-model="editForm.TEU" auto-complete="off"></el-input>  
                        </el-form-item> 
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="其中冷藏箱TEU" prop="coldTEU">  
                            <el-input v-model="editForm.coldTEU" auto-complete="off"></el-input>  
                        </el-form-item> 
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="冷藏箱重量" prop="coldWeight">  
                            <el-input v-model="editForm.coldWeight" auto-complete="off"></el-input>  
                        </el-form-item> 
                    </el-col>
                </el-row> 
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="备注" prop="remark">  
                            <el-input type="textarea" v-model="editForm.remark"></el-input>  
                        </el-form-item>  
                    </el-col>
                </el-row>
            </el-form>  
            <div slot="footer" class="dialog-footer">  
                <el-button @click.native="editFormVisible = false">取消</el-button>  
                <el-button v-if="addclickflag == 1" type="primary" @click.native="addSubmit('editForm')" :loading="editLoading">新建</el-button>  
                <el-button v-else type="primary" @click.native="editSubmit('editForm')" :loading="editLoading">保存</el-button>  
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
    return {
        //tableData: Array(20).fill(item),
        addclickflag:0,
        tableData: [],
        //显示加载中样式  
        loading:false,  
        //搜索表单  
        saveForm: {  
            orgName: '',  
            realName: '',
            mobile: ''
        },  
        options: [{
          value: '',
          label: '全部'
        }, {
          value: 1,
          label: '未提交'
        }, {
          value: 2,
          label: '已提交'
        }],
        //搜索表单  
        searchForm: {  
            formType: 'formGo', //formBack, formGo 
            trainType: 1, //1Eur,2Asia
            status: '',  //默认全部
            departDateBegin: '',
            departDateEnd: '',
            orgID:19,
            orgName:'',
        },  
        multipleSelection: [],
        //当前页  
        currentPage:1,  
        //分页大小  
        pageSize:10,  
        //总记录数  
        total:100,  
        //请求的URL
        testurl:'http://10.1.167.188:3000/train',
        //url:'http://10.1.167.190:8080/CREpress/saveGo/list.htm',
        url:'http://10.1.167.174:8080/CRExpress/export/view.htm',
        addurl:'http://10.1.167.174:8080/CRExpress/saveGo/add.htm',
        editurl:'http://10.1.167.174:8080/CRExpress/saveGo/update.htm',
        delurl:'http://10.1.167.174:8080/CRExpress/saveGo/delete.htm',
        submiturl:'http://10.1.167.174:8080/CRExpress/saveGo/submit.htm',
        //删除的弹出框  
        deleteVisible:false,  
        //编辑界面是否显示  
        editFormVisible: false,  
        editLoading: false,  
        editFormRules: {  
            fromStation: [  
                { required: true, message: '请输入发站', trigger: 'blur' }  
            ]  
        },  
        //编辑界面数据  
        editForm: {  
            id: '',
            fromStation: '',  
            trainNumber: '',  
            departDate: '', 
            exitportStation: '', 
            overseasStation: '',
            overseasCountry: '',
            overseasCity: '',
            trainQty: 0,
            carriageQty: 0,
            heavyQtyTwenty: 0,
            emptyQtyTwenty: 0,
            heavyQtyForty: 0,
            emptyQtyForty: 0,
            heavyQtyFortyfive: 0,
            emptyQtyFortyfive: 0,
            TEU: 0,
            coldTEU: 0,
            coldWeight: 0,
            totalLoad:0,
            remark: '',
            status: 1 //1未提交 2已提交 3已删除
        },  
        pickerOptions0: {
          disabledDate:(time) => {
            return time.getTime() > this.searchForm.departDateEnd;
          }
        },
        pickerOptions1: {
          disabledDate:(time) => {
            return time.getTime() < this.searchForm.departDateBegin;
          }
        },
    }
  },
    mounted () {
        this.searchForm.orgID = sessionStorage.orgId;
        this.searchForm.orgName = sessionStorage.orgName;
        this.searchForm.departDateBegin = new Date();
        this.searchForm.departDateEnd = new Date();
        this.saveForm.realName = sessionStorage.realName;
        this.saveForm.mobile = sessionStorage.mobile;
        this.loadingData(this.searchForm.status, this.searchForm.departDateBegin, this.searchForm.departDateEnd, this.currentPage, this.pageSize);
    },
    methods: {
        tableRowClassName({row}) {
            if (row.status == 1) {
              return 'edit-row';
            } else if (row.status == 2) {
              return 'submit-row';
            }
            return '';
          },
        maxSlice(v){
            return v.length > 10? v.slice(0,10) : v;
        },
        //表格重新加载数据  
        loadingData:function(status, DateBegin, DateEnd, pageNum, pageSize) {
            let _self = this;  
            let qs = require('qs');

            // _self.axios.get(_self.testurl)
            //       .then((response) =>{
            //         _self.tableData = response.data.root;
            //         console.log(response.data);
            //         _self.total = parseInt(response.data.total);
            //       })
            //       .catch((error)=> {
            //         console.log(error);
            //       });

            if(DateBegin & DateEnd) {
                let Date1 = DateBegin.getFullYear() + '-' + (DateBegin.getMonth() + 1) + '-' + DateBegin.getDate();  
                let Date2 = DateEnd.getFullYear() + '-' + (DateEnd.getMonth() + 1) + '-' + DateEnd.getDate();
                let postData = qs.stringify({
                    formType:_self.searchForm.formType, trainType:_self.searchForm.trainType,
                    orgID:_self.searchForm.orgID, status: _self.searchForm.status,
                    departDateBegin:Date1,departDateEnd:Date2, page:pageNum, limit:pageSize
                });
                console.log(postData);
                _self.axios.post(_self.url, postData)
                  .then((response) =>{
                    _self.tableData = response.data.root;
                    console.log(response.data);
                    _self.total = parseInt(response.data.total);
                  })
                  .catch((error)=> {
                    console.log(error);
                  });
            }else{
                _self.$message({  
                    message: '请选择日期',  
                    type: 'error',
                    showClose: true,
                    duration: 2000
                });
            }
        },  
        //表格查询事件  
        searchClick:function() {  
            var _self = this;  
            _self.loadingData(_self.searchForm.status, _self.searchForm.departDateBegin, _self.searchForm.departDateEnd, _self.currentPage, _self.pageSize);//重新加载数据  
        },   
        //表格新建事件  
        addClick:function(formName) {  
            let _self = this;  
            if (_self.$refs[formName] != undefined) {
                _self.$refs[formName].resetFields();
            }
            _self.editFormVisible = true;  
            _self.addclickflag = 1;
        },  
        //新建点击事件  
        addSubmit:function(formName){  
            let _self = this;
            _self.$refs[formName].validate((valid) => {
              if (valid) {
                let qs = require('qs');
                //let postData = qs.stringify(_self.editForm) + "&trainType=" + _self.searchForm.trainType;
                let Date1 = _self.editForm.departDate.getFullYear() + '-' + (_self.editForm.departDate.getMonth() + 1) + '-' + _self.editForm.departDate.getDate();
                let postData1 = qs.stringify({
                    trainType:_self.searchForm.trainType,
                    id: _self.editForm.id,
                    fromStation: _self.editForm.fromStation,  
                    trainNumber: _self.editForm.trainNumber,
                    departDate: Date1,
                    exitportStation: _self.editForm.exitportStation, 
                    overseasStation: _self.editForm.overseasStation,
                    overseasCountry: _self.editForm.overseasCountry,
                    overseasCity: _self.editForm.overseasCity,
                    trainQty: _self.editForm.trainQty,
                    carriageQty: _self.editForm.carriageQty,
                    heavyQtyTwenty: _self.editForm.heavyQtyTwenty,
                    emptyQtyTwenty: _self.editForm.emptyQtyTwenty,
                    heavyQtyForty: _self.editForm.heavyQtyForty,
                    emptyQtyForty: _self.editForm.emptyQtyForty,
                    heavyQtyFortyfive: _self.editForm.heavyQtyFortyfive,
                    emptyQtyFortyfive: _self.editForm.emptyQtyFortyfive,
                    TEU: _self.editForm.TEU,
                    coldTEU: _self.editForm.coldTEU,
                    coldWeight: _self.editForm.coldWeight,
                    totalLoad: _self.editForm.totalLoad,
                    remark: _self.editForm.remark,
                    status: _self.editForm.status
                });
                console.info(postData1);
                _self.axios.post(_self.addurl, postData1)
                  .then((response) =>{
                    console.log(response);
                    if (response.data.success) {
                        _self.$message({  
                            message: response.data.msg,
                            type: 'success',
                            showClose: true,
                            duration: 3000
                        }); 
                        _self.loadingData(_self.searchForm.status, _self.searchForm.departDateBegin, _self.searchForm.departDateEnd, _self.currentPage, _self.pageSize);
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
        //表格编辑事件  
        editClick:function(row) {  
            this.addclickflag = 0;
            this.editFormVisible = true;  
            this.editForm = Object.assign({}, row);  
        },  
        //保存点击事件  
        editSubmit:function(formName){  
            let _self = this;
            _self.$refs[formName].validate((valid) => {
              if (valid) {
                let qs = require('qs');
                let Date1 = _self.editForm.departDate.getFullYear() + '-' + (_self.editForm.departDate.getMonth() + 1) + '-' + _self.editForm.departDate.getDate();
                let postData1 = qs.stringify({
                    trainType:_self.searchForm.trainType,
                    id: _self.editForm.id,
                    fromStation: _self.editForm.fromStation,  
                    trainNumber: _self.editForm.trainNumber,
                    departDate: Date1,
                    exitportStation: _self.editForm.exitportStation, 
                    overseasStation: _self.editForm.overseasStation,
                    overseasCountry: _self.editForm.overseasCountry,
                    overseasCity: _self.editForm.overseasCity,
                    trainQty: _self.editForm.trainQty,
                    carriageQty: _self.editForm.carriageQty,
                    heavyQtyTwenty: _self.editForm.heavyQtyTwenty,
                    emptyQtyTwenty: _self.editForm.emptyQtyTwenty,
                    heavyQtyForty: _self.editForm.heavyQtyForty,
                    emptyQtyForty: _self.editForm.emptyQtyForty,
                    heavyQtyFortyfive: _self.editForm.heavyQtyFortyfive,
                    emptyQtyFortyfive: _self.editForm.emptyQtyFortyfive,
                    TEU: _self.editForm.TEU,
                    coldTEU: _self.editForm.coldTEU,
                    coldWeight: _self.editForm.coldWeight,
                    totalLoad: _self.editForm.totalLoad,
                    remark: _self.editForm.remark,
                    status: _self.editForm.status
                });
                console.info(postData1);
                _self.axios.post(_self.editurl, postData1)
                  .then((response) =>{
                    console.log(response);
                    if (response.data.success) {
                        _self.$message({  
                            message: response.data.msg,
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        }); 
                        _self.loadingData(_self.searchForm.status, _self.searchForm.departDateBegin, _self.searchForm.departDateEnd, _self.currentPage, _self.pageSize);
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
        //表格删除事件  
        deleteClick:function(row) {  
            var _self = this;  
            this.$confirm('确认删除' + row.fromStation + row.trainNumber +'吗?', '提示', {  
                type: 'warning'  
            }).then(function(){  
                let qs = require('qs');
                let postData = qs.stringify({
                    id:row.id
                });
                _self.axios.post(_self.delurl, postData)
                  .then((response) =>{
                    console.log(response);
                    if (response.data.success) {
                        _self.$message({  
                            message: response.data.msg,
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        }); 
                        _self.loadingData(_self.searchForm.status, _self.searchForm.departDateBegin, _self.searchForm.departDateEnd, _self.currentPage, _self.pageSize);
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
        //表格提交事件  
        submitClick:function(row) {  
            var _self = this;  
            this.$confirm('确认提交 ' + row.fromStation + ' ' + row.trainNumber +' 吗? 提交后将无法编辑修改该数据。', '提示', {  
                type: 'warning'  
            }).then(function(){  
                let qs = require('qs');
                let postData = qs.stringify({
                    id:row.id
                });
                _self.axios.post(_self.submiturl, postData)
                  .then((response) =>{
                    console.log(response);
                    if (response.data.success) {
                        _self.$message({  
                            message: response.data.msg,
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        }); 
                        _self.loadingData(_self.searchForm.status, _self.searchForm.departDateBegin, _self.searchForm.departDateEnd, _self.currentPage, _self.pageSize);
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
                    type: 'error',
                    duration: 2000 
                });  
                return;  
            }  
            let success = 0;
            var ids = "";  
            for(var i=0;i<multipleSelection.length;i++) {  
                var row = multipleSelection[i];  
                ids += row.trainNumber + ","  
            }  
            this.$confirm('确认删除' + ids +'吗?', '提示', {  
                type: 'warning'  
            }).then(function(){  
                for(let i=0;i<multipleSelection.length;i++) {  
                    let row = multipleSelection[i];  
                    let qs = require('qs');
                    success = 0;
                    _self.axios.post(_self.delurl, qs.stringify({id:row.id}))
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
                            _self.loadingData(_self.searchForm.status, _self.searchForm.departDateBegin, _self.searchForm.departDateEnd, _self.currentPage, _self.pageSize);
                        });                        
                    }
                    _self.loading = false;  
                },300);  
            }).catch(function(e){  
                if(e != "cancel")  
                    console.log("出现错误：" + e);  
            });
        },  
        //批量提交  
        submitSelection:function() {  
            var _self = this;  
            var multipleSelection = this.multipleSelection;  
            if(multipleSelection.length < 1) {  
                _self.$message({  
                    message: '请至少选中一条记录',  
                    type: 'error',
                    duration: 2000 
                });  
                return;  
            }  
            let success = 0;
            var ids = "";  
            for(var i=0;i<multipleSelection.length;i++) {  
                var row = multipleSelection[i];  
                ids += row.trainNumber + ","  
            }  
            this.$confirm('确认提交' + ids +'吗?', '提示', {  
                type: 'warning'  
            }).then(function(){  
                for(let i=0;i<multipleSelection.length;i++) {  
                    let row = multipleSelection[i];  
                    let qs = require('qs');
                    success = 0;
                    _self.axios.post(_self.submiturl, qs.stringify({id:row.id}))
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
                            message: ids + '提交成功',
                            type: 'success',
                            showClose: true,
                            duration: 2000 
                        }); 
                        _self.$nextTick(function(){
                            _self.loadingData(_self.searchForm.status, _self.searchForm.departDateBegin, _self.searchForm.departDateEnd, _self.currentPage, _self.pageSize);
                        });                        
                    }
                    _self.loading = false;  
                },300);  
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
            _self.loadingData(_self.searchForm.status, _self.searchForm.departDateBegin, _self.searchForm.departDateEnd, _self.currentPage, _self.pageSize);//重新加载数据  
        },  
        //当前页修改事件  
        currentPageChange:function(val) {  
            this.currentPage = val;  
            console.log('当前页: ' + val);  
            var _self = this;  
            _self.loadingData(_self.searchForm.status, _self.searchForm.departDateBegin, _self.searchForm.departDateEnd, _self.currentPage, _self.pageSize);//重新加载数据  
        },  
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h1{margin-top: 0;}
.mybtn{
    padding: 4px;
    margin: 0 !important;
}
.line{
    text-align: center;
}
.el-table .edit-row {
    background: #e9f7e2;
}

.el-table .submit-row {
    background: #fff;
}
</style>
