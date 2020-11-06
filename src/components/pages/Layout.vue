<template>
    <el-container class="outer">
        <el-aside width="151px">
            <v-side-bar></v-side-bar>
        </el-aside>
        <el-container>
            <el-header style="text-align: right; font-size: 12px">
                <span>{{ $store.state.userinfo.username }}</span>
                <el-dropdown>
                    <i class="el-icon-setting" style="margin-right: 15px"></i>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                            <el-link @click="logout">退出</el-link>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-header>
            <el-main>
                <router-view />
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
import vSideBar from '../common/SideBar'
export default {
    components:{
        vSideBar
    },
    methods:{
        logout(){
            sessionStorage.clear();
            this.$router.replace('/login');
        }
    }
};
</script>
<style scoped>
    .outer{
        width:100%;
        height:100%;
    }
    .el-header {
        background-color: #B3C0D1;
        color: #333;
        line-height: 60px;
    }
  
    .el-aside {
        color: #333;
        background-color:#20222A;
    }
    .el-main{
        background-color: #E5E5E5;
    }
</style>