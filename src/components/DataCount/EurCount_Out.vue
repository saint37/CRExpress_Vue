<template>
    <el-main>
        <!--列表顶部搜索和工具条-->
        <el-row>  
            <el-form :inline="true" :model="exportForm" class="demo-form-inline">  
                <el-form-item>
                    <el-select v-model="exportForm.orgID" placeholder="铁路局">
                      <el-option v-for="item in orgs" :label="item.orgStr" :value="item.id"></el-option>
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
                <!-- <el-form-item label="铁路局">  
                    <el-input v-model="exportForm.orgName" :disabled="true" size="mini" placeholder="铁路局"></el-input>  
                </el-form-item> 
                <el-form-item label="填表人">  
                    <el-input v-model="exportForm.realName" :disabled="true" size="mini" placeholder="填表人"></el-input>  
                </el-form-item>  
                <el-form-item label="联系电话">  
                    <el-input v-model="exportForm.mobile" :disabled="true" size="mini" placeholder="电话"></el-input>  
                </el-form-item>   -->
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
                <!-- <el-table-column prop="id" label="序号"></el-table-column> -->
                <el-table-column prop="fromStation" label="发站"></el-table-column>
                <el-table-column prop="trainNumber" label="发车车次"></el-table-column>
                <el-table-column prop="departDate" label="发车日期"></el-table-column>
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
                    <el-table-column prop="teu" label="折合TEU"></el-table-column>
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
    return {
        orgs:[{"id":19,"flag":1,"upperUnitId":0,"orgStr":"中国铁路总公司"},{"id":1,"flag":2,"upperUnitId":19,"orgStr":"哈尔滨铁路局"},{"id":2,"flag":2,"upperUnitId":19,"orgStr":"沈阳铁路局"},{"id":3,"flag":2,"upperUnitId":19,"orgStr":"北京铁路局"},{"id":4,"flag":2,"upperUnitId":19,"orgStr":"太原铁路局"},{"id":5,"flag":2,"upperUnitId":19,"orgStr":"呼和浩特铁路局"},{"id":6,"flag":2,"upperUnitId":19,"orgStr":"郑州铁路局"},{"id":7,"flag":2,"upperUnitId":19,"orgStr":"武汉铁路局"},{"id":8,"flag":2,"upperUnitId":19,"orgStr":"西安铁路局"},{"id":9,"flag":2,"upperUnitId":19,"orgStr":"济南铁路局"},{"id":10,"flag":2,"upperUnitId":19,"orgStr":"上海铁路局"},{"id":11,"flag":2,"upperUnitId":19,"orgStr":"南昌铁路局"},{"id":12,"flag":2,"upperUnitId":19,"orgStr":"广州铁路（集团）公司"},{"id":13,"flag":2,"upperUnitId":19,"orgStr":"南宁铁路局"},{"id":14,"flag":2,"upperUnitId":19,"orgStr":"成都铁路局"},{"id":15,"flag":2,"upperUnitId":19,"orgStr":"昆明铁路局"},{"id":16,"flag":2,"upperUnitId":19,"orgStr":"兰州铁路局"},{"id":17,"flag":2,"upperUnitId":19,"orgStr":"乌鲁木齐铁路局"},{"id":18,"flag":2,"upperUnitId":19,"orgStr":"青藏铁路公司"}],
        tableData: [],
        //显示加载中样式  
        loading:false,  
        //搜索表单  
        exportForm: { 
            formType: 'formGo', //formBack, formGo 
            trainType: 1, //1Eur,2Asia
            orgID: 19, 
            orgName: '',  
            departDateBegin:new Date(),
            departDateEnd:new Date(),
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
        url:'http://10.1.167.174:8080/CRExpress/export/view.htm',
        exporturl:'http://10.1.167.174:8080/CRExpress/export/out.htm',
        //orgurl:'http://10.1.167.174:8080/CRExpress/common/orgList.htm'
        //getorgurl:'http://10.1.167.174:8080/CRExpress/common/getOrg.htm'
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
        this.exportForm.departDateBegin = new Date('2018','00','01');
        this.exportForm.departDateEnd = new Date('2018','00','31');
        // this.loadingData(this.exportForm.orgID, this.exportForm.departDateBegin,this.exportForm.departDateEnd, this.currentPage, this.pageSize);
    },
    methods: {
        //表格加载数据  
        loadingData:function(orgID,DateBegin,DateEnd,pageNum, pageSize) {  
            let _self = this;  
            let qs = require('qs');
            if(DateBegin & DateEnd) {
                let Date1 = DateBegin.getFullYear() + '-' + (DateBegin.getMonth() + 1) + '-' + DateBegin.getDate();  
                let Date2 = DateEnd.getFullYear() + '-' + (DateEnd.getMonth() + 1) + '-' + DateEnd.getDate();
                let postData = qs.stringify({
                    formType:_self.exportForm.formType, trainType:_self.exportForm.trainType,
                    orgID:orgID, departDateBegin:Date1,departDateEnd:Date2, page:pageNum, limit:pageSize
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
            let _self = this;
            _self.loadingData(_self.exportForm.orgID, _self.exportForm.departDateBegin,_self.exportForm.departDateEnd, _self.currentPage, _self.pageSize);//重新加载数据  
        },  
        //表格导出事件
        exportClick:function() {   
            let _self = this;  
            let d1 = _self.exportForm.departDateBegin;
            let d2 = _self.exportForm.departDateEnd;
            if(d1 & d2){
                let Date1 = d1.getFullYear() + '-' + (d1.getMonth() + 1) + '-' + d1.getDate();  
                let Date2 = d2.getFullYear() + '-' + (d2.getMonth() + 1) + '-' + d2.getDate();  
                let postData = "formType="+_self.exportForm.formType +"&trainType="+_self.exportForm.trainType+"&orgID="+_self.exportForm.orgID+"&departDateBegin="+Date1+"&departDateEnd="+Date2;
                let url = _self.exporturl + "?" + postData;
                //console.log(postData);
                //window.location.href = url;
                window.open(url);
                _self.dialogVisible = false; 
            }else{
                _self.$message({  
                    message: '请选择日期',  
                    type: 'error',
                    showClose: true,
                    duration: 2000
                });
            }
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
            _self.loadingData(this.exportForm.orgID, this.exportForm.departDateBegin,this.exportForm.departDateEnd, this.currentPage, this.pageSize);//重新加载数据  
        },  
        //当前页修改事件  
        currentPageChange:function(val) {  
            this.currentPage = val;  
            console.log('当前页: ' + val);  
            let _self = this;  
            _self.loadingData(this.exportForm.orgID, this.exportForm.departDateBegin,this.exportForm.departDateEnd, this.currentPage, this.pageSize);//重新加载数据  
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
