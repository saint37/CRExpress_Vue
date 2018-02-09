<template>
    <el-main>
        <!--列表顶部搜索和工具条-->
        <el-row>  
            <el-form :inline="true" :model="exportForm" class="demo-form-inline">  
                <el-form-item>
                    <el-select v-model="exportForm.orgName" placeholder="铁路局">
                      <el-option label="北京局" value="beijing"></el-option>
                      <el-option label="太原局" value="taiyuan"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="width: 350px">  
                    <el-col :span="11">
                        <el-date-picker
                          v-model="exportForm.departDateBegin"
                          type="date"
                          placeholder="选择日期"
                          :picker-options="pickerOptions0"
                          style="width: 100%">
                        </el-date-picker>
                    </el-col>
                    <el-col class="line" :span="2">-</el-col>
                    <el-col :span="11">
                        <el-date-picker
                          v-model="exportForm.departDateEnd"
                          type="date"
                          placeholder="选择日期"
                          :picker-options="pickerOptions1"
                          style="width: 100%">
                        </el-date-picker>
                    </el-col>
                </el-form-item> 
                <el-form-item>  
                    <el-button type="primary" icon="edit" @click="searchClick">查询</el-button>
                </el-form-item>  
                <el-form-item>  
                    <el-button type="success" icon="edit" @click="dialogVisible = true">导出</el-button>
                </el-form-item>  
            </el-form>  
        </el-row>  
        <el-row>
            <el-form :inline="true" :model="exportForm" class="demo-form-inline">  
                <el-form-item><h1>中欧班列去程运量统计表</h1></el-form-item>
                <el-form-item label="铁路局">  
                    <el-input v-model="exportForm.orgName" :disabled="true" size="mini" placeholder="铁路局"></el-input>  
                </el-form-item> 
                <el-form-item label="填表人">  
                    <el-input v-model="exportForm.realName" :disabled="true" size="mini" placeholder="填表人"></el-input>  
                </el-form-item>  
                <el-form-item label="联系电话">  
                    <el-input v-model="exportForm.mobile" :disabled="true" size="mini" placeholder="电话"></el-input>  
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
                show-summary
                @selection-change="selectionChange">
                <el-table-column type="selection" width="55" align="center">
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
            <el-col :span="18" >  
                <el-pagination  
                        style="float: right"  
                        @size-change="pageSizeChange"  
                        @current-change="currentPageChange"  
                        :current-page="currentPage"  
                        :page-sizes="[5, 10, 20, 30, 50]"  
                        :page-size="pageSize"  
                        layout="total, sizes, prev, pager, next, jumper"  
                        :total="total">  
                </el-pagination>  
            </el-col>  
        </el-row>  
        <el-dialog
          title="提示"
          :visible.sync="dialogVisible"
          width="30%">
          <span>确定导出数据吗？</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="exportClick">确 定</el-button>
          </span>
        </el-dialog>
    </el-main>
</template>

<script>
export default {
  name: 'EurCount_Out',
  data () {
    const item = {
        date: '2018-01-16',
        name: 'ST',
        address: '北京市海淀区大柳树路2号'
    };
    return {
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
        exportForm: { 
            formType: 'formGo', //formBack, formGo 
            trainType: 1, //1Eur,2Asia
            orgId: 0, 
            orgName: '',  
            departDateBegin:'',
            departDateEnd:'',
            realName: '',
            mobile: ''
        },  
        criteria: '',
        multipleSelection: [],
        //当前页  
        currentPage:1,  
        //分页大小  
        pageSize:5,  
        //查询的页码
        start: 1, 
        //总记录数  
        total:100,  
        //请求的URL
        url:'',
        exporturl:'http://10.1.167.174:8080/CRExpress/export/out.htm?formType=formGo',
        dialogVisible: false,
        //判断日期选择框
        pickerOptions0: {
          disabledDate:(time) => {
            return time.getTime() > this.exportForm.departDateEnd;
          }
        },
        pickerOptions1: {
          disabledDate:(time) => {
            return time.getTime() < this.exportForm.departDateBegin;
          }
        },
    }
  },
    mounted () {
        //this.loadingData(this.exportForm.orgId, this.exportForm.departDateBegin,this.exportForm.departDateEnd, this.currentPage, this.pageSize);
    },
    methods: {
        //表格加载数据  
        loadingData:function(orgId,DateBegin,DateEnd,pageNum, pageSize) {  
            let _self = this;  
            let qs = require('qs');
            let postData = qs.stringify({
                orgId:orgId, departDateBegin:DateBegin,departDateEnd:DateEnd, page:pageNum, limit:pageSize
            });
            console.log(postData);
            // _self.axios.post(_self.url, postData)
            //   .then((response) =>{
            //     _self.tableData = response.data.root;
            //     //console.log(response.data.root);
            //     _self.total = parseInt(response.data.total);
            //   })
            //   .catch((error)=> {
            //     console.log(error);
            //   }); 
        },  
        //表格查询事件  
        searchClick:function() {  
            let _self = this;  

            _self.loadingData(this.exportForm.orgId, this.exportForm.departDateBegin,this.exportForm.departDateEnd, this.currentPage, this.pageSize);//重新加载数据  
        },  
        //表格导出事件
        exportClick:function() {   
            let _self = this;  
            let qs = require('qs');
            let postData = qs.stringify({
                formType:_self.exportForm.formType, 
                trainType:_self.exportForm.trainType,
                orgId: _self.exportForm.orgId,
                departDateBegin:_self.exportForm.departDateBegin,
                departDateEnd:_self.exportForm.departDateEnd
            });
            console.log(postData);
            _self.axios.post(_self.exporturl, postData)
              .then((response) =>{
                    console.log(response);
                    if(response.data.success){
                        _self.$message({  
                            message: '导出成功',  
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        });                         
                    }
              })
              .catch((error)=> {
                console.log(error);
              }); 
            _self.dialogVisible = false;
        },  
        //表格勾选事件  
        selectionChange:function(val) {  
            for(let i=0;i<val.length;i++) {  
                let row = val[i];  
            }  
            this.multipleSelection = val;  
            console.info(val);  
        },  
        //分页大小修改事件  
        pageSizeChange:function(val) {  
            console.log('每页 ' + val +' 条');  
            this.pageSize = val;  
            let _self = this;  
            _self.loadingData(this.exportForm.orgId, this.exportForm.departDateBegin,this.exportForm.departDateEnd, this.currentPage, this.pageSize);//重新加载数据  
        },  
        //当前页修改事件  
        currentPageChange:function(val) {  
            this.currentPage = val;  
            console.log('当前页: ' + val);  
            let _self = this;  
            _self.loadingData(this.exportForm.orgId, this.exportForm.departDateBegin,this.exportForm.departDateEnd, this.currentPage, this.pageSize);//重新加载数据  
        },  
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
