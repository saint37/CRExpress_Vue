<template>
    <div class="nav">
        <h1 style="width: 50%;float: left;">{{ msg }}</h1>
        <div style="float: right;">
            <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" background-color="#1385c5" text-color="#fff" active-text-color="#ffd04b">
              <el-menu-item index="1"><i class="el-icon-bell"></i></el-menu-item>
              <el-menu-item index="2"><i class="el-icon-close"></i></el-menu-item>
            </el-menu>
        </div>
    </div>
</template>

<script>
export default {
  name: 'topBar',
  data () {
    return {
      msg: '一个奇怪的系统',
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
h1{
    margin: 0;
    line-height: 60px;
}
.el-menu-item i {
    color: #fff;
}
.el-menu-item.is-active i {
    color: inherit;
}
</style>
