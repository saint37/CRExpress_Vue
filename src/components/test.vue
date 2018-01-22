<template>
    <el-main>
        <h1>test page</h1>
        <el-button type="text" @click="dialogVisible = true">点击打开 Dialog</el-button>
        
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
            <span>这是一段信息</span>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>

        <el-table 
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center">
            </el-table-column>
            <el-table-column prop="date" label="日期" width="140">
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="120">
            </el-table-column>
            <el-table-column prop="address" label="地址">
            </el-table-column>
        </el-table>
    </el-main>
</template>

<script>
export default {
  name: 'User',
  data () {
    const item = {
        date: '2018-01-16',
        name: 'ST',
        address: '北京市海淀区大柳树路2号'
    };
    return {
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
        multipleSelection: [],
        dialogVisible: false
    }
  },
    methods: {
        handleClose(done) {
            this.$confirm('确认关闭？')
              .then(_ => {
                done();
              })
              .catch(_ => {});
        },
       toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
