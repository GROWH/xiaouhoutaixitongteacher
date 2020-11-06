<template>
	<div>
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>
				<a href="javascript:;">管理员列表</a>
			</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="app-container">
			<el-button
				type="primary"
				@click="handleAdd"
			>添加</el-button>
			<!-- 管理员列表 -->
			<el-table
				:data="users"
				border
				style="width: 100%"
			>
				<el-table-column
					label="用户编号"
					width="180"
				>
					<template slot-scope="scope">{{ scope.row.uid }}</template>
				</el-table-column>
				<el-table-column
					label="角色"
					width="180"
				>
					<template slot-scope="scope">{{ scope.row.rolename }}</template>
				</el-table-column>
				<el-table-column
					label="用户名"
					width="180"
				>
					<template slot-scope="scope">{{ scope.row.username }}</template>
				</el-table-column>
				<el-table-column
					label="状态"
					width="100"
				>
					<template slot-scope="scope">
						<el-tag
							effect="dark"
							type="success"
							v-if="scope.row.status===1"
						>启用</el-tag>
						<el-tag
							effect="dark"
							type="danger"
							v-else
						>禁用</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button
							size="mini"
							@click="handleEdit(scope.row)"
						>编辑</el-button>
						<el-button
							size="mini"
							type="danger"
							@click="handleDelete(scope.row)"
						>删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				background
				layout="prev, pager, next"
				:page-size="pagesize"
				:total="pagecount"
                @current-change="handleCurrentChange"
			>
			</el-pagination>
		</div>
		<!-- 管理员添加/修改 -->
		<el-dialog
			:title="'管理员'+tip"
			:visible.sync="infoVisible"
			@close="handleReset"
		>
			<el-form
				:model="form"
				:rules="rules"
				ref="form"
				label-width="100px"
				class="demo-form"
			>
				<el-form-item
					label="角色"
					prop="roleid"
				>
					<el-select
						v-model="form.roleid"
						placeholder="请选择角色"
					>
						<el-option
							v-for="item in roles"
							:key="item.id"
							:label="item.rolename"
							:value="item.id"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item
					label="用户名"
					prop="username"
				>
					<el-input v-model="form.username"></el-input>
				</el-form-item>
				<el-form-item
					label="密码"
					prop="password"
				>
					<el-input
						v-model="form.password"
						type="password"
					></el-input>
					<span v-show="tip==='修改'">不填写则不修改</span>
				</el-form-item>
				<el-form-item label="状态">
					<el-switch v-model="form.status"></el-switch>
				</el-form-item>
			</el-form>
			<div
				slot="footer"
				class="dialog-footer"
			>
				<el-button @click="handleReset('form')">取 消</el-button>
				<el-button
					type="primary"
					@click="handleSubmit('form')"
				>确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
export default {
	data() {
		return {
            users: [],
            pagesize:10,
            page:1,
            pagecount:0,
			roles: [],
			tip: '添加',
			infoVisible: false,
			formLabelWidth: '120px',
			form: {
				roleid: '',
				username: '',
				password: '',
				status: true
			},
			rules: {
				roleid: [
					{ required: true, message: '请选择用户角色', trigger: 'blur' }
				],
				username: [
					{ required: true, message: '请输入用户名', trigger: 'blur' },
					{ min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
				]
			}
		};
	},
	mounted() {
        this.getCount();
        this.getPage();
	},
	methods: {
        getCount(){
            this.http.get("/api/usercount").then(res=>{
                this.pagecount = res.list[0].total;
            })
        },
        getPage(){
            this.http.get('/api/userlist',{size:this.pagesize,page:this.page}).then(res => {
                this.users = res.list || [];
            })
        },
		getRole() {
			this.http.get('/api/rolelist', { status: 1 }).then(res => {
				this.roles = res.list;
			})
		},
		handleAdd() {
			this.infoVisible = true;
			this.getRole();
		},
		handleEdit(row) {
			this.getRole();
			this.infoVisible = true;
			let uid = row.uid;
			this.tip = '修改'
			this.http.get('/api/userinfo', { uid }).then(res => {
				let info = res.list;
				info.uid = uid;
				info.status = info.status == 1 ? true : false;
				info.password = '';
				this.form = info;
			})
		},
		handleSubmit(formName) {
			this.$refs[formName].validate((valid) => {
				if (!valid) {
					return false;
				}
				this.form.status = this.form.status ? 1 : 2;
				let url = this.form.uid ? '/api/useredit' : '/api/useradd';
				this.http.post(url, this.form).then(res => {
					if (res.code === 200) {
						this.$message({
							showClose: true,
							message: res.msg,
							type: 'success'
						});
						this.handleReset();
						this.getPage();
					} else {
						this.$message({
							showClose: true,
							message: res.msg,
							type: 'error'
						});
					}
				})
			});
		},
		handleReset() {
			this.infoVisible = false;
			this.tip = '添加';
			this.form = {
				roleid: '',
				username: '',
				password: '',
				status: true
			}
		},
		handleDelete(row) {
			this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.http.post('/api/userdelete', { id: row.id }).then(res => {
					if (res.code === 200) {
						this.$message({
							type: 'success',
							message: res.msg
						});
						this.roles = res.list
					} else {
						this.$message({
							type: 'error',
							message: res.msg
						});
					}
				})
			})
		},
		handleCurrentChange: function (currentPage) {
            this.page = currentPage;
            this.getPage();
		}
	}
};
</script>

<style>
</style>