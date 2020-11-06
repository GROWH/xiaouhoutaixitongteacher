<template>
	<div>
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item><a href="javascript:;">轮播图列表</a></el-breadcrumb-item>
		</el-breadcrumb>
		<div class="app-container">
			<el-button
				type="primary"
				@click="handleAdd"
			>添加</el-button>
			<!-- 轮播图列表 -->
			<el-table
				:data="bannerData"
				border
				row-key="id"
                style="width: 100%"
			>
				<el-table-column
					label="轮播图名称"
					width="180"
				>
					<template slot-scope="scope">
						{{ scope.row.title }}
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
		<!-- 轮播图添加/修改 -->
		<el-dialog
			:title="'轮播图'+tip"
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
					label="轮播图标题"
					prop="title"
				>
					<el-input v-model="form.title"></el-input>
				</el-form-item>
				<el-form-item label="轮播图图片">
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
			bannerData: [],
			infoVisible: false,
			formLabelWidth: '120px',
			tip: '添加',
			form: {
				title: '',
				status: true
			},
			rules: {
				title: [
					{ required: true, message: "请输入轮播图名称", trigger: "blur" },
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
			this.http.get('/api/bannerinfo', { id }).then(res => {
				let info = res.list;
				info.id = id;
				info.status = info.status == 1 ? true : false;
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
                let url = this.form.id ? '/api/banneredit' : '/api/banneradd';
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
						this.http.get('/api/bannerlist').then(res => {
							this.bannerData = res.list
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
                title: '',
				status: true
            };
            this.$(".el-upload-list--picture-card").html("")
		},
		handleDelete(row) {
			this.http.post('/api/bannerdelete', { id: row.id }).then(res => {
				if (res.code != 200) {
					this.$message({
						showClose: true,
						message: res.msg,
						type: 'error'
					});
				} else {
					this.bannerData = res.list
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
		this.http.get('/api/bannerlist').then(res => {
			this.bannerData = res.list || []
		})
	}
}
</script>

<style>
</style>