<template>
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu :default-openeds="['1']" router>
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-menu"></i>用户管理</template>
              <el-menu-item index="/user">用户管理</el-menu-item>
              <el-menu-item index="/test">test</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-document"></i>导航二</template>
            <el-menu-item-group>
              <template slot="title">分组一</template>
              <el-menu-item index="2-1">选项1</el-menu-item>
              <el-menu-item index="2-2">选项2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="分组2">
              <el-menu-item index="2-3">选项3</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title"><i class="el-icon-setting"></i>导航三</template>
            <el-menu-item-group>
              <template slot="title">分组一</template>
              <el-menu-item index="3-1">选项1</el-menu-item>
              <el-menu-item index="3-2">选项2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="分组2">
              <el-menu-item index="3-3">选项3</el-menu-item>
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
