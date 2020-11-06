<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="javascript:;">会员列表</a></el-breadcrumb-item>
        </el-breadcrumb>
        <div class="app-container">
            <el-table
                :data="memberData"
                border
                style="width: 100%">
                <el-table-column label="昵称" width="180">
                    <template slot-scope="scope">
                        {{ scope.row.nickname }}
                    </template>
                </el-table-column>
                <el-table-column label="手机号" width="180">
                    <template slot-scope="scope">
                        {{ scope.row.phone }}
                    </template>
                </el-table-column>
                <el-table-column label="注册日期" width="180">
                    <template slot-scope="scope">
                        <span>{{ scope.row.addtime | formatTime }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
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
        <el-dialog
		    title="会员修改"
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
				<el-form-item label="昵称">
					<el-input v-model="form.nickname" disabled></el-input>
				</el-form-item>
                <el-form-item label="手机号">
					<el-input v-model="form.phone"></el-input>
				</el-form-item>
				<el-form-item label="密码" >
					<el-input v-model="form.password" type="password"></el-input>
					<span>不填写则不修改密码</span>
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
            memberData: [],
            pagesize:10,
            page:1,
            pagecount:0,
            infoVisible: false,
            formLabelWidth: '120px',
            rules: {
				phone: [
					{ required: true, message: '请输入手机号', trigger: 'blur' },
					{ min: 11, max: 11, message: '请输入正确格式的手机号', trigger: 'blur' }
                ]
            },
            form:{
                uid:'',
                nickname:'',
                phone:'',
                password:'',
                status: true
            }
        }
    },
    filters:{
        formatTime(time){
            // 返回日期格式为：2020-03-19 11:05:09
            var d = new Date(parseInt(time));
            var year = d.getFullYear();//获取年份
            var month = (d.getMonth() + 1) > 9 ? (d.getMonth() + 1) : '0' + (d.getMonth() + 1);//获取月份
            var date = d.getDate() > 9 ? d.getDate() : '0' + d.getDate();//获取日期
            var hours = d.getHours() > 9 ? d.getHours() : '0' + d.getHours();//获取小时
            var minutes = d.getMinutes() > 9 ? d.getMinutes() :'0' + d.getMinutes();//获取分钟
            var seconds = d.getSeconds() > 9 ? d.getSeconds() :'0' + d.getSeconds();//获取秒
            return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
        }
    },
    methods: {
        getCount(){
            this.http.get("/api/membercount").then(res=>{
                this.pagecount = res.list[0].total;
            })
        },
        getPage(){
            this.http.get('/api/memberlist',{size:this.pagesize,page:this.page}).then(res => {
                this.memberData = res.list || [];
            })
        },
        handleEdit(row) {
            this.infoVisible = true;
            this.http.get('/api/memberinfo',{uid:row.uid}).then(res=>{
                this.form = {
                    nickname:res.list.nickname,
                    phone:res.list.phone,
                    uid:res.list.uid,
                    status:res.list.status
                };
                this.form.password = '';
                this.form.status = this.form.status == 1 ? true : false;
                console.log(this.form)
            })
        },
        handleSubmit(formName) {
			this.$refs[formName].validate((valid) => {
				if (!valid) {
					return false;
				}
				this.form.status = this.form.status ? 1 : 2;
				let url = '/api/memberedit';
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
			this.form = {
				id:'',
                nickname:'',
                phone:'',
                password:'',
                status: true
			}
		},
        handleCurrentChange: function (currentPage) {
            this.page = currentPage;
            this.getPage();
		}
    },
    mounted(){
        this.getCount();
        this.getPage();
    }
}
</script>

<style>

</style>