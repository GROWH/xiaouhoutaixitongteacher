<template>
	<div>
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item><a href="javascript:;">菜单列表</a></el-breadcrumb-item>
		</el-breadcrumb>
		<div class="app-container">
			<el-button
				type="primary"
				@click="handleAdd"
			>添加</el-button>
            <!-- 菜单列表 -->
			<el-table
				:data="menuArr"
				row-key="id"
				border
				:tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                style="width: 100%"
			>
				<el-table-column
					label="名称"
					width="180"
				>
					<template slot-scope="scope">
						{{ scope.row.title }}
					</template>
				</el-table-column>
				<el-table-column
					label="图标"
					width="150"
				>
					<template slot-scope="scope">
						<i :class="scope.row.icon"></i>
					</template>
				</el-table-column>
				<el-table-column
					label="类型"
					width="150"
				>
					<template slot-scope="scope">
						<el-tag
							v-if="scope.row.type === 1"
							size="small"
						>目录</el-tag>
						<el-tag
							v-else-if="scope.row.type === 2"
							size="small"
							type="success"
						>菜单</el-tag>
					</template>
				</el-table-column>
				<el-table-column
					label="菜单URL"
					width="150"
				>
					<template slot-scope="scope">
						<span>{{ scope.row.url }}</span>
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
        <!-- 菜单添加/修改 -->
		<el-dialog
			:title="'菜单'+tip"
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
					label="菜单名称"
					prop="pid"
				>
					<el-select
						v-model="form.pid"
						@change="menuchange($event)"
						placeholder="请选择上级菜单"
					>
						<el-option
							value="0"
							label="顶级菜单"
						></el-option>
						<el-option
							v-for="item in menus"
							:key="item.id"
							:label="item.title"
							:value="item.id"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item
					label="菜单名称"
					prop="title"
				>
					<el-input v-model="form.title"></el-input>
				</el-form-item>
				<el-form-item v-show="form.pid==='0'" label="菜单图标">
					<el-input v-model="form.icon"></el-input>
				</el-form-item>
				<el-form-item label="类型">
					<el-radio
						v-model="form.type"
						label="1"
						:disabled="form.pid !=='0'"
					>目录</el-radio>
					<el-radio
						v-model="form.type"
						label="2"
						:disabled="form.pid ==='0'"
					>菜单</el-radio>
				</el-form-item>
				<el-form-item
					v-show="form.type==2"
					label="菜单地址"
				>
					<el-input v-model="form.url"></el-input>
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
            menuArr: [],
            menus:[],
			infoVisible: false,
			tip: '添加',
			form: {
				pid: '0',
				title: '',
				icon: '',
				type: '1',
				url: '',
				status: true
			},
			formLabelWidth: '120px',
			rules: {
				pid: {
					required: true, message: "请选择上级菜单", trigger: "blur"
				},
				title: [
					{ required: true, message: "请输入菜单标题", trigger: "blur" },
					{ min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
				]
			}
		}
	},
	methods: {
        getMenu(){
            this.http.get('/api/menulist?pid=0').then(res=>{
                this.menus = res.list
            });
        },
        menuchange(e){
			this.form.type = e!=0 ? "2" : "1";
        },
        handleAdd(){
            this.infoVisible = true;
            this.getMenu();
        },
		handleEdit(row) {
            this.getMenu();
            this.infoVisible = true;
            let id = row.id;
            this.tip = '修改'
            this.http.get('/api/menuinfo',{id}).then(res=>{
                let info = res.list;
                info.id = id;
                info.type = info.type.toString();
                info.status = info.status == 1 ? true : false;
                info.pid = info.pid === 0 ? '0' : info.pid;
                this.form = info;
            })
		},
        handleSubmit(formName) {
			this.$refs[formName].validate(valid => {
                if(!valid){
                    return;
                }
                this.form.status = this.form.status ? 1 : 2;
                let url = this.form.id ? '/api/menuedit' : '/api/menuadd';
                this.http.post(url,this.form).then(res=>{
                    if(res.code == 200){
                        this.$message({
                            showClose: true,
                            message: res.msg,
                            type: 'success'
                        });
                        this.infoVisible = false;
                        this.http.get('/api/menulist?istree=1').then(res => {
                            this.menuArr = res.list
                        })
                    }else{
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
            this.form= {
				pid: '0',
				title: '',
				icon: '',
				type: '1',
				url: '',
				status: true
			}
		},
        handleDelete(row) {
            this.http.post('/api/menudelete', { id: row.id }).then(res => {
                if (res.code != 200) {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'error'
                    });
                } else {
                    this.menuArr = res.list
                }
            })
        }
	},
	mounted(){
		this.http.get('/api/menulist?istree=1').then(res => {
            this.menuArr = res.list || []
        })
    }
}
</script>

<style>
</style>