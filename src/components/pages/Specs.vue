<template>
	<div>
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item><a href="javascript:;">规格列表</a></el-breadcrumb-item>
		</el-breadcrumb>
		<div class="app-container">
			<el-button
				type="primary"
				@click="handleAdd"
			>添加</el-button>
			<!-- 规格列表 -->
			<el-table
				:data="specsData"
				border
				style="width: 100%"
			>
				<el-table-column
					label="属性名称"
					width="180"
				>
					<template slot-scope="scope">
						{{ scope.row.specsname }}
					</template>
				</el-table-column>
				<el-table-column
					label="属性值"
					width="180"
				>
					<template slot-scope="scope">
						<el-tag
							v-for="(item,index) in scope.row.attrs"
							:key="index"
						>{{ item }}</el-tag>
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
		<!-- 规格添加/修改 -->
		<el-dialog
			:title="'规格'+tip"
			:visible.sync="infoVisible"
			@close="handleReset"
		>
            <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-form">
                <el-form-item label="属性名称" prop="specsname">
                    <el-input v-model="form.specsname"></el-input>
                </el-form-item>
                <el-form-item label="属性值" prop="attrs">
                    <div class="attr_item" v-for="(item,index) in form.attrs" :key="index">
                        <el-input v-model="item.value" style="width:300px;"></el-input>
                        <el-button v-if="index>0" type="danger" @click.prevent="handleRemoveAttr(item)">删除</el-button>
                        <el-button v-if="index===0" type="primary" @click="handleAddAttr">新增属性值</el-button>
                    </div>
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
			specsData: [],
			pagesize: 10,
			page: 1,
			pagecount: 0,
			tip: '添加',
			infoVisible: false,
            formLabelWidth: '120px',
            form: {
                specsname: '',
                attrs:[{value:''}],
                status: true
            },
            rules: {
                specsname: [
                    { required: true, message: '请输入规格标题', trigger: 'blur' },
                    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
                ]
            }
		}
    },
    mounted() {
        this.getCount();
        this.getPage();
	},
	methods: {
        getCount(){
            this.http.get("/api/specscount").then(res=>{
                this.pagecount = res.list ? res.list[0].total : 0;
            })
        },
        getPage(){
            this.http.get('/api/specslist',{size:this.pagesize,page:this.page}).then(res => {
                this.specsData = res.list || [];
            })
        },
		handleAdd() {
            this.infoVisible = true;
        },
		handleEdit(row) {
            this.tip = '修改';
            this.infoVisible = true;
			let id = row.id;
			this.tip = '修改'
			this.http.get('/api/specsinfo', { id }).then( res => {
				let info = res.list[0];
				info.id = id;
                info.status = info.status == 1 ? true : false;
                let attr_arr = [];
                for(let i=0;i<info.attrs.length;i++){
                    attr_arr.push({'value':info.attrs[i]})
                }
                info.attrs = attr_arr;
                this.form = info;
			})
        },
        handleSubmit(formName){
            this.$refs[formName].validate((valid) => {
                if (!valid) {
                    return false;
                }
                this.form.status = this.form.status ? 1 : 2;
                var info = {
                    specsname : this.form.specsname,
                    status : this.form.status
                }
                var attrs = [];
                if(this.form.attrs){
                    for(let i=0;i<this.form.attrs.length;i++){
                        attrs.push(this.form.attrs[i].value);
                    }
                    info.attrs = attrs.join(',');
                }
                if(this.form.id){
                    info.id = this.form.id;
                }
                let url = this.form.id ? '/api/specsedit' : '/api/specsadd';
                this.http.post(url,info).then(res=>{
                    if(res.code == 200){
                        this.$message({
                            showClose: true,
                            message: res.msg,
                            type: 'success'
                        });
                        this.infoVisible = false;
                        this.getPage();
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
			this.form = {
				specsname: '',
                attrs:[{value:''}],
                status: true
			}
		},
		handleDelete(row) {
            this.$confirm('此操作将永久删除规格, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.http.post('/api/specsdelete', { id: row.id }).then(res => {
					if (res.code === 200) {
						this.$message({
							type: 'success',
							message: res.msg
						});
						this.specsData = res.list
					} else {
						this.$message({
							type: 'error',
							message: res.msg
						});
					}
				})
			})
        },
        handleRemoveAttr(item){
            var index = this.form.attrs.indexOf(item)
            if (index !== -1) {
                this.form.attrs.splice(index, 1)
            }
        },
        handleAddAttr() {
            this.form.attrs.push({value: ''});
        },
        handleCurrentChange: function (currentPage) {
            this.page = currentPage;
            this.getUserPage();
		}
	}
}
</script>

<style>
</style>