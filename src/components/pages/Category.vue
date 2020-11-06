<template>
	<div>
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item><a href="javascript:;">分类列表</a></el-breadcrumb-item>
		</el-breadcrumb>
		<div class="app-container">
			<el-button
				type="primary"
				@click="handleAdd"
			>添加</el-button>
			<!-- 分类列表 -->
			<el-table
				:data="categorys"
				border
				row-key="id"
				:tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                style="width: 100%"
			>
				<el-table-column
					label="分类名称"
					width="180"
				>
					<template slot-scope="scope">
						{{ scope.row.catename }}
					</template>
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
		<!-- 分类添加/修改 -->
		<el-dialog
			:title="'分类'+tip"
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
					label="上级分类"
					prop="pid"
				>
					<el-select
						v-model="form.pid"
						placeholder="请选择上级分类"
					>
						<el-option
							value="0"
							label="顶级分类"
						></el-option>
						<el-option
							v-for="item in categorys"
							:key="item.id"
							:label="item.catename"
							:value="item.id"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item
					label="分类名称"
					prop="catename"
				>
					<el-input v-model="form.catename"></el-input>
				</el-form-item>
				<el-form-item label="分类图片">
					<el-upload
						action="#"
						list-type="picture-card"
						:on-change="handleChangeFile"
						:file-list="fileList"
						:multiple="false"
						:auto-upload="false"
						ref="prodimg"
					>
						<i
							slot="default"
							class="el-icon-plus"
						></i>
						<div
							slot="file"
							slot-scope="{file}"
						>
							<img
								class="el-upload-list__item-thumbnail"
								:src="file.url"
								alt=""
							>
							<span class="el-upload-list__item-actions">
								<span
									class="el-upload-list__item-preview"
									@click="handlePictureCardPreview(file)"
								>
									<i class="el-icon-zoom-in"></i>
								</span>
								<span
									v-if="!disabled"
									class="el-upload-list__item-delete"
									@click="handleRemove(file)"
								>
									<i class="el-icon-delete"></i>
								</span>
							</span>
						</div>
					</el-upload>
					<el-dialog :visible.sync="dialogVisible">
						<img
							width="100%"
							:src="dialogImageUrl"
							alt=""
						>
					</el-dialog>
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
			categorys: [],
			infoVisible: false,
			formLabelWidth: '120px',
			tip: '添加',
			form: {
				pid: '',
				catename: '',
				status: true
			},
			rules: {
				pid: {
					required: true, message: "请选择上级分类", trigger: "blur"
				},
				catename: [
					{ required: true, message: "请输入分类名称", trigger: "blur" },
					{ min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
				]
			},
			dialogImageUrl: '',
			dialogVisible: false,
			disabled: false,
			fileList: []
		}
	},
	methods: {
		handleAdd() {
            this.$(".el-upload-list--picture-card").html("")
			this.infoVisible = true;
		},
		handleEdit(row) {
			this.infoVisible = true;
			let id = row.id;
			this.tip = '修改'
			this.http.get('/api/cateinfo', { id }).then(res => {
				let info = res.list;
				info.id = id;
				info.status = info.status == 1 ? true : false;
				info.pid = info.pid === 0 ? '0' : info.pid;
                this.form = info;
                if(info.img){
                    this.fileList = [{name:'',url:this.imgdomain+info.img}]
                }
			})
		},
		handleSubmit(formName) {
			this.$refs[formName].validate(valid => {
				if (!valid) {
					return;
				}
				this.form.status = this.form.status ? 1 : 2;
                let url = this.form.id ? '/api/cateedit' : '/api/cateadd';
                var data = new FormData();
                for(let i in this.form){
                    data.append(i,this.form[i]);
                }
                this.axios({
                    method:'post',
                    url,
                    data,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': sessionStorage.getItem('token')
                    }
                }).then(res=>{
                    res = res.data;
                    if (res.code == 200) {
						this.$message({
							showClose: true,
							message: res.msg,
							type: 'success'
						});
						this.infoVisible = false;
						this.http.get('/api/catelist?istree=1').then(res => {
							this.categorys = res.list
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
				pid: '',
                catename: '',
				status: true
            };
            this.$(".el-upload-list--picture-card").html("")
		},
		handleDelete(row) {
			this.http.post('/api/catedelete', { id: row.id }).then(res => {
				if (res.code != 200) {
					this.$message({
						showClose: true,
						message: res.msg,
						type: 'error'
					});
				} else {
					this.categorys = res.list
				}
			})
		},
		handleRemove() {
			this.$(".el-upload-list--picture-card").html("")
		},
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
		},
		handleChangeFile(file) {
			this.form.img = file.raw
		}
	},
	mounted() {
		this.http.get('/api/catelist?istree=1').then(res => {
			this.categorys = res.list || []
		})
	}
}
</script>

<style>
</style>