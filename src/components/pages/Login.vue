<template>
    <div class="login_bg">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="login">
            <h1>登录</h1>
            <el-form-item label-width="0px" prop="username">
                <el-input v-model="ruleForm.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label-width="0px" prop="password">
                <el-input type="password" v-model="ruleForm.password" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item label-width="0px">
                <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
    data() {
        return {
            ruleForm: {
                username: '',password:''
            },
            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.http.post('/api/userlogin',this.ruleForm).then(res=>{
                        if(res.code === 200){
                            sessionStorage.setItem("user",JSON.stringify(res.list));
                            sessionStorage.setItem("token",res.list.token);
                            this.$router.push('/index');
                        }else{
                            this.$message({
                                message: res.msg,
                                type: 'error'
                            });
                        }
                    })
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    }
}
</script>
<style scoped>
.login_bg {
    width: 100%;
    height: 100%;
    /* 线型渐变 */
    background: -webkit-linear-gradient(left, #563443, #413a53, #2f3d60);
}
.login {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -150px 0 0 -150px;
    width: 300px;
    height: 300px;
}
.login h1 {
    color: #fff;
    text-align: center;
    margin: 20px 0;
}
.el-button{
    width:300px;
}
</style>