<template>
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu :default-openeds="['1','2']" router>
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-menu"></i>用户管理</template>
              <el-menu-item index="/User/Admin">管理员</el-menu-item>
              <el-menu-item index="/User/Common">普通用户</el-menu-item>
              <el-menu-item index="/test">test</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-edit-outline"></i>数据录入</template>
            <el-menu-item-group title="中欧班列">
              <el-menu-item index="/DataInput/Eur_Out">去程运量统计</el-menu-item>
              <el-menu-item >回程运量统计</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="中亚班列">
              <el-menu-item >去程运量统计</el-menu-item>
              <el-menu-item >回程运量统计</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title"><i class="el-icon-document"></i>数据统计</template>
            <el-menu-item-group title="中欧班列">
              <el-menu-item index="/DataCount/EurCount">运量统计</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="中亚班列">
              <el-menu-item index="/DataCount/AsiaCount">运量统计</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
    </el-aside>
</template>

<script>
export default {
  name: 'leftMenu',
  data () {
    return {
      activeIndex: '1'
    }
  },
  methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
