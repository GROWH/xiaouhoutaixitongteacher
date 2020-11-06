<template>
	<div>
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item><a href="javascript:;">限时秒杀列表</a></el-breadcrumb-item>
		</el-breadcrumb>
		<div class="app-container">
			<el-button
				type="primary"
				@click="handleAdd"
			>添加</el-button>
			<!-- 限时秒杀列表 -->
			<el-table
				:data="seckillData"
				border
				row-key="id"
				style="width: 100%"
			>
				<el-table-column
					label="活动名称"
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
		<!-- 限时秒杀添加/修改 -->
		<el-dialog
			:title="'限时秒杀'+tip"
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
					label="活动名称"
					prop="title"
				>
					<el-input v-model="form.title"></el-input>
				</el-form-item>
				<el-form-item label="活动期限">
					<el-date-picker
						v-model="dateVal"
                        value-format="timestamp"
						type="datetimerange"
						:picker-options="pickerOptions"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						align="right"
                        @change="handleTimeChange"
					>
					</el-date-picker>
				</el-form-item>
                <el-form-item label="一级分类" prop="first_cateid">
                    <el-select 
                        v-model="form.first_cateid" 
                        placeholder="请选择分类"
                        @change="handleCateChange($event)"
                    >
                        <el-option
                            v-for="item in firstarr"
                            :key="item.id"
                            :label="item.catename"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="二级分类" prop="second_cateid">
                    <el-select 
                        v-model="form.second_cateid" 
                        placeholder="请选择分类"
                        @change="handleGetGoods()"
                    >
                        <el-option
                            v-for="item in secondarr"
                            :key="item.id"
                            :label="item.catename"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品">
                    <el-select v-model="form.goodsid" placeholder="请选择商品">
                        <el-option
                            v-for="item in goodsarr"
                            :key="item.id"
                            :label="item.goodsname"
                            :value="item.id">
                        </el-option>
                    </el-select>
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
			seckillData: [],
			infoVisible: false,
			formLabelWidth: '120px',
			tip: '添加',
			form: {
                title: '',
                begintime:'',
                endtime:'',
                first_cateid:'',
                second_cateid:'',
                goodsid:'',
				status: true
			},
			rules: {
				title: [
					{ required: true, message: "请输入限时秒杀名称", trigger: "blur" },
					{ min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
				]
			},
			pickerOptions: {
				shortcuts: [{
					text: '最近一周',
					onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
						picker.$emit('pick', [start, end]);
					}
				}, {
					text: '最近一个月',
					onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
						picker.$emit('pick', [start, end]);
					}
				}, {
					text: '最近三个月',
					onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
						picker.$emit('pick', [start, end]);
					}
				}]
			},
            dateVal: [],
            firstarr: [],
            secondarr:[],
            goodsarr:[]
		}
	},
	methods: {
        getData(){
            this.http.get('/api/secklist').then(res => {
                this.seckillData = res.list || []
            })
        },
        getCategory(pid=0){
            this.http.get('/api/catelist', { pid:pid }).then(res => {
                if(pid === 0){
                    this.firstarr = res.list;
                }else{
                    this.secondarr = res.list;
                }
			})
        },
        handleCateChange(e){
            this.secondarr = [];
            this.getCategory(e)
        },
        handleGetGoods(){
            this.http.get('/api/goodslist',{fid:this.form.first_cateid,sid:this.form.second_cateid}).then(res=>{
                this.goodsarr = res.list || []
            })
        },
		handleAdd() {
            this.infoVisible = true;
            this.getCategory();
		},
		handleEdit(row) {
			this.infoVisible = true;
			let id = row.id;
            this.tip = '修改'
            this.getCategory();
			this.http.get('/api/seckinfo', { id }).then(res => {
                let info = res.list;
                this.getCategory(info.first_cateid)
				info.id = id;
                info.status = info.status == 1 ? true : false;
                this.dateVal = [info.begintime,info.endtime]
                this.first_cateid = info;
                this.http.get('/api/goodslist',{fid:info.first_cateid,sid:info.second_cateid}).then(res=>{
                    this.goodsarr = res.list || [];
                });
                this.form = info;
                console.log(this.form)
            });
		},
		handleSubmit(formName) {
			this.$refs[formName].validate(valid => {
				if (!valid) {
					return;
				}
                this.form.status = this.form.status ? 1 : 2;
                let url = this.form.id ? '/api/seckedit' : '/api/seckadd';
                this.http.post(url, this.form).then(res => {
					if (res.code === 200) {
						this.$message({
							showClose: true,
							message: res.msg,
							type: 'success'
						});
                        this.handleReset();
                        this.getData();
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
                begintime:'',
                endtime:'',
                first_cateid:'',
                second_cateid:'',
                goods:[],
				status: true
            };
            this.dateVal = [];
            this.goodsarr = [];
            this.secondarr = [];
		},
		handleDelete(row) {
			this.http.post('/api/seckdelete', { id: row.id }).then(res => {
				if (res.code != 200) {
					this.$message({
						showClose: true,
						message: res.msg,
						type: 'error'
					});
				} else {
					this.seckillData = res.list
				}
			})
        },
        handleTimeChange(e){
            this.form.begintime = e[0];
            this.form.endtime = e[1];
        }
	},
	mounted() {
		this.getData();
	}
}
</script>

<style>
</style>