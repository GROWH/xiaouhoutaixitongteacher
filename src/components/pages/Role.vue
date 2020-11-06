<template>
	<div>
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>
				<a href="javascript:;">角色列表</a>
			</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="app-container">
			<el-button
				type="primary"
				@click="handleAdd"
			>添加</el-button>
            <!-- 角色列表 -->
			<el-table
				:data="roles"
				border
				style="width: 100%"
			>
				<el-table-column
					label="名称"
					width="180"
				>
					<template slot-scope="scope">{{ scope.row.rolename }}</template>
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
		</div>
		<!-- 角色添加/修改 -->
		<el-dialog
			:title="'角色'+tip"
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
					label="角色名称"
					prop="rolename"
				>
					<el-input v-model="form.rolename"></el-input>
				</el-form-item>
				<el-form-item
					label="菜单权限"
					prop="menus"
				>
					<el-tree
						:data="menus"
						show-checkbox
                        check-strictly
						node-key="id"
						ref="tree"
                        :default-checked-keys="form.menus"
						:props="defaultProps"
					>
					</el-tree>
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
			roles: [],
			tip: '添加',
			infoVisible: false,
			formLabelWidth: '120px',
			form: {
				rolename: '',
				status: true
			},
			menus: [],
			rules: {
				rolename: [
					{ required: true, message: '请输入角色标题', trigger: 'blur' },
					{ min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
				]
			},
			defaultProps: {
				children: 'children',
				label: 'title'
			}
		};
	},
	methods: {
		getMenu() {
			this.http.get('/api/menulist?istree=1').then(res => {
				this.menus = res.list;
			})
		},
		handleAdd() {
			this.infoVisible = true;
			this.getMenu();
		},
		handleEdit(row) {
			this.getMenu();
            this.infoVisible = true;
            let id = row.id;
            this.tip = '修改'
            this.http.get('/api/roleinfo',{id}).then(res=>{
                let info = res.list;
                info.id = id;
                info.menus = info.menus ? info.menus.split(',') : [];
                info.status = info.status == 1 ? true : false;
                this.form = info;
            })
		},
		handleSubmit(formName) {
			this.$refs[formName].validate((valid) => {
				if (!valid) {
					return false;
                }
                let info = {};
                info.rolename = this.form.rolename;
                if(this.form.id){
                    info.id = this.form.id;
                }
				info.menus = this.$refs.tree.getCheckedKeys() ? this.$refs.tree.getCheckedKeys().join(',') : '';
                info.status = this.form.status ? 1 : 2;
                let url = this.form.id ? '/api/roleedit' : '/api/roleadd';
				this.http.post(url, info).then(res => {
					if (res.code === 200) {
						this.$message({
							showClose: true,
							message: res.msg,
							type: 'success'
						});
                        this.handleReset();
						this.http.get('/api/rolelist').then(res => {
							this.roles = res.list;
						})
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
                rolename: '',
                menus:[],
				status: true
			}
        },
        handleDelete(row) {
			this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.http.post('/api/roledelete', { id: row.id }).then(res => {
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
		}
    },
    mounted() {
		this.http.get('/api/rolelist').then(res => {
			this.roles = res.list || [];
		})
	}
};
</script>

<style>
</style>