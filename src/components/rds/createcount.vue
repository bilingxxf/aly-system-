<template>
    <div class="account-mange modify-per create-per">
        <div class="data-header">
            <div class="header-left">
            <span class="title">账号管理</span>
            </div>
        </div>
        <!-- tab栏 -->
        <div class="mange-tab">
            <span>用户账号</span>
        </div>
        <div class="mange-tab update-date">
            <span>创建账号</span>
            <span @click="back" class="back"><<返回账号管理</span>
        </div>
        <!-- form 表单 -->
        <div class="sub-list">
            <el-form ref="formData" :rules="rules" :model="formData" label-width="100px">
                <el-form-item label="数据库账号:" prop="accountName">
                    <el-input type="text" v-model="formData.accountName"></el-input>
                </el-form-item>
                <el-form-item label="账号类型:" prop="accountType">
                    <el-radio-group @change="preChoose" v-model="formData.accountType">
                        <el-radio label="高权限账号"></el-radio>
                        <el-radio label="普通账号"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <!-- v-show="formData.whetherData && formData.data"  -->
                <el-form-item v-show="false" label="授权数据库:">
                    <el-transfer
                        :titles="['未授权数据库', '已授权数据库']"
                        style="text-align: left; display: inline-block"
                        @change="isAuthorized"
                        @right-check-change="rightCheckChange"
                        @left-check-change="leftCheckChange"
                        :left-default-checked="formData.defaltSelArr"
                        :right-default-checked="[0]"
                        :button-texts="['移除', '授权']"
                        v-model="formData.currentValue" :data="formData.data"></el-transfer>
                    <div class="radio-arr" v-show="formData.currentValue[0] != -1">
                        <el-radio-group>
                            <el-radio :label="3">读写</el-radio>
                            <el-radio :label="6">只读</el-radio>
                            <el-radio :label="9">备选项</el-radio>
                        </el-radio-group>
                    </div>
                </el-form-item>

                <el-form-item label="密码:" prop="accountPassword">
                    <el-input type="password" v-model="formData.accountPassword"></el-input>
                </el-form-item>
                <el-form-item label="确认密码:" prop="confirmPwd">
                    <el-input type="password" v-model="formData.confirmPwd"></el-input>
                </el-form-item>
                <el-form-item label="备注说明" prop="accountDesc">
                    <el-input type="textarea" v-model="formData.accountDesc"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('formData')">确定</el-button>
                    <el-button @click="resetForm('formData')">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'modify-per',
    data () {
        const checkName = (rule,value,callback)=>{
            if(value==''){
                return callback(new Error('账户名不能为空'));
            }else if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{1,16}$/.test(value)){
                return callback(new Error('由小写字母，数字、字母开头，字母或数字结尾，最长16个字符'));
            }else{
                return callback();
            }
        };
        const checkPwd = (rule,value,callback)=>{
            if(value==''){
                return callback(new Error('密码不能为空'));
            }else if (!/^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\\W_!@#$%^&*`~()-+=]+$)(?![0-9\\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\\W_!@#$%^&*`~()-+=]{8,32}$/.test(value)){
                return callback(new Error('大写、小写、数字、特殊字符占三种，长度为8－32位；特殊字符为!@#$%^&*()_+-='));
            }else{
                return callback();
            }
        };
        const checkConfirm = (rule, value, callback) => {
            if (value == '') {
                return callback(new Error('密码不能为空'));
            } else if (value !== this.formData.accountPassword) {
                callback(new Error('两次输入的密码不一致，请重新输入一致的密码。'));
            } else {
                callback()
            }
        };
        const checkDesc = (rule, value, callback) => {
            if  (value == '') {
                callback(new Error('请输入备注说明'));
            } else if (String(value).length > 256) {
                callback(new Error('备注最多256个字符'));
            } else {
                callback()
            }
        };
        return {
            formData: {
                accountName: '',
                accountType: '普通账号',
                accountPassword: '',
                confirmPwd: '',
                accountDesc: '',
                whetherData: true,
                defaltSelArr: [],
                currentSelected: '',
                data: [
                ],
                currentValue: [-1],
            },
            dataInfo: null,
            rules: {
                accountName: [
                    { required: true, validator: checkName, trigger: 'blur' }
                ],
                accountPassword: [
                    { required: true, validator: checkPwd, trigger: 'blur' }
                ],
                confirmPwd: [
                    { required: true, validator: checkConfirm, trigger: 'blur' }
                ],
                accountDesc: [
                    { required: true, validator: checkDesc, trigger: 'blur' }
                ],
                accountType: [
                    { required: true, message: '请选择账号类型', trigger: 'change' }
                ]
            }
        }
    },
    computed: {
        ...mapGetters([
            'getRdsItemInfo'
        ])
    },
    filters: {
        isReady: function(value) {
            if (!value) return;
            switch(value) {
                case 'ReadWrite':
                    return '读写';
                    break;
            }
        }
    },
    methods: {
        preChoose(value) {
            if (value == '高权限账号') {
                this.formData.whetherData = false;
            } else if (value == '普通账号') {
                this.formData.whetherData = true;
            }
        },
        leftCheckChange(key) {
            if (this.formData.currentValue[0] == null) {
                this.formData.data.forEach((item, index) => {
                    if (index != this.currentSelected) {
                        item.disabled = true;
                    }
                });
            } else {
                this.formData.defaltSelArr = [key][0];
                this.formData.defaltSelArr = [this.formData.defaltSelArr[this.formData.defaltSelArr.length - 1]];
                this.currentSelected = this.formData.defaltSelArr[0];
            }
        },
        async createDataBase() {
            this.formData.accountType = this.formData.accountType === '高权限账号' ? 'Super': 'Normal';
            const data = await this.$http.createDataBase({
                DBInstanceId: this.dataInfo,
                AccountName: this.formData.accountName,
                AccountPassword: this.formData.accountPassword,
                AccountDescription: this.formData.accountDesc,
                AccountType: this.formData.accountType
            });
            if (data) {
                this.$message({
                message: '添加成功',
                type: 'success'
                });
            } else{
                this.$message({
                    message: '添加失败',
                    type: 'warning'
                });
            }
        },
        submitForm(formData) {
            this.$refs[formData].validate((valid) => {
                if (valid) {
                    this.createDataBase();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        back() {
            this.$router.go(-1);
        },
        isAuthorized(value, direction, movedKeys) {
            if (direction === 'right') {
                this.formData.currentValue[0] = null;
            } else {
                this.formData.currentValue[0] = -1;
            }
        },
        // 获得没有授权的数据库列表
        async getDataInfo() {
            const data = await this.$http.dataInfo({
                DBInstanceId: this.dataInfo,
                PageNumber: 1,
                PageSize: 10
            });
            this.formData.data = data.Databases.Database;
            this.formData.data.forEach((item, index) => {
                item.key = index;
                item.label = item.DBName;
            });
        },
    },
    mounted () {
        this.dataInfo = localStorage.getItem('DBInstanceId');
        this.getDataInfo();
    }
}
</script>

<style lang="scss" scoped>
.account-mange {
    width: 100%;
    height: 100%;
    .data-header {
        margin: 0 0.75rem;
        padding-left: 0.75rem;
        display: flex;
        align-items: center;
        width: 100%;
        height: 1.5rem;
        border-left: 0.2rem solid #88B7E0;
        box-sizing: border-box;
        .header-left,.header-right {
        display: flex;
        align-items: center;
        height: 100%;
        }
        .header-left {
        font-size: 0.7rem;
        color: inherit;
        }
        .header-right {
        margin-left: auto;
        }
    }
    .mange-tab {
        margin: 0 0.75rem;
        display: flex;
        align-items: center;
        margin-top: 1.5rem;
        height: 2.5rem;
        // background: pink;
        border: 0.05rem solid #ddd;
        border-top: none;
        border-right: none;
        &.operaty {
            display: flex;
            justify-content: flex-end;
            margin-top: 0;
            border-left: none;
            border-bottom: none;
            .el-button {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 2rem;
                width: 3rem;
                &:nth-of-type(2) {
                    width: 5rem;
                }
            }
        }
        span {
            display: inline-block;
            padding: 0.7rem 0.5rem;
            padding-bottom: 0.8rem;
            color: #333;
            font-size: 0.6rem;
            border-top: 0.15rem solid #00A2CA;
            border-bottom: 0.15rem solid #fff;
            border-right: 0.05rem solid #ddd;
        }
        &.update-date {
            height: 1.5rem;
            border: none;
            border-left: 0.2rem solid #88B7E0;
            span {
                border: none;
                &.back {
                    padding-left: 0;
                    color: #06C;
                    cursor: pointer;
                }
            }
        }
    }
    .sub-list {
        margin: 0 0.75rem;
        margin-left: 9.5rem;
        margin-top: 2rem;
        display: flex;
        width: 60rem;
        height: 30rem;
    }
}
</style>
