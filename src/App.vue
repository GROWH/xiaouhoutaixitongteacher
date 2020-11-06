<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
*{ padding:0;margin:0; }
html,body,#app{
    width:100%;
    height:100%;
}
.app-container{
    margin-top:20px;
}
.el-pagination{
    float:right;
    margin-top:10px;
}
</style>
