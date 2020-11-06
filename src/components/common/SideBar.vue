<template>
	<el-menu
		:default-active="$route.path"
		class="el-menu-vertical-demo"
		background-color="#20222A"
		text-color="#fff"
		active-text-color="#ffd04b"
		unique-opened
	>
		<el-menu-item>
			<span>后台管理系统</span>
		</el-menu-item>
		<el-menu-item index="/index">
			<i class="el-icon-s-home"></i>
			<router-link to="/index">首页</router-link>
		</el-menu-item>
		<el-submenu
			v-for="(item,index) in menus"
			:key="index"
			:index="(index+1).toString()"
		>
			<template slot="title">
				<i :class="item.icon"></i>
				<span>{{ item.title }}</span>
			</template>
			<el-menu-item-group>
				<el-menu-item
					v-for="(sub,ind) in item.children"
					:key="ind"
					:index="sub.url"
				>
					<router-link :to="sub.url">{{ sub.title }}</router-link>
				</el-menu-item>
			</el-menu-item-group>
		</el-submenu>
	</el-menu>
</template>
<script>
export default {
	data() {
		return {
            active:''
		}
    },
    computed:{
        menus(){
            return this.$store.getters.userinfo.menus;
        }
    }
}
</script>
<style scoped>
.el-menu {
	width: 150px;
}
.el-submenu .el-menu-item {
	min-width: 149px;
}
a {
	text-decoration: none;
	color: #fff;
}
.el-menu .is-active a.router-link-active,
.is-opened .is-active a.router-link-active {
	color: #ffd04b;
}
</style>