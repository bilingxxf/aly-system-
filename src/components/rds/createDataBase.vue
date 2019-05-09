<template>
    <div class="account-mange modify-per create-per">
        <div class="data-header">
            <div class="header-left">
            <span class="title">账号管理</span>
            </div>
        </div>
        <!-- tab栏 -->
        <div class="mange-tab">
            <span>数据库</span>
        </div>
        <div class="mange-tab update-date">
            <span>创建数据库</span>
            <span @click="back" class="back"><<返回数据库管理</span>
        </div>
        <!-- form 表单 -->
        <div class="sub-list">
            <el-form ref="formData" :rules="rules" :model="formData" label-width="100px">
                <el-form-item label="数据库名称:" prop="accountName">
                    <el-input type="text" v-model="formData.accountName"></el-input>
                </el-form-item>

                <el-form-item label="支持字符集:" prop="supportChartSet">
                    <el-radio-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                        <el-radio v-for="chat in charts" :label="chat" :key="chat">{{ chat }}</el-radio>
                    </el-radio-group>
                    <!-- 全部的字符集 -->
                    <el-select v-model="value" v-show="allShow" @change="allCharts" placeholder="请选择">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="授权账号:" prop="">
                    <table class="auth-account">
                        <tr>
                            <td>未授权账号 {{ formData.authAccount }} {{ formData.accountType | filterAccountType }}</td>
                        </tr>
                        <tr v-if="isCreateVisable">
                            <td style="color: #06C">创建账号</td>
                        </tr>
                        <tr v-else @click="getAccount(item, index)" v-for="(item, index) in account.Accounts.DBInstanceAccount" :key="index">
                            <td :class="{ 'active': index == currentIndex }">{{ item.AccountName }}   [ {{ item.AccountType | filterAccountType}} ]</td>
                        </tr>
                    </table>
                </el-form-item>

                <el-form-item v-if="formData.accountType" label="账号类型:" prop="">
                    <el-radio-group v-model="checkedType" @change="handleCheckedCitiesChange1">
                        <el-radio v-for="(type, index) in types" :label="index" :key="index">{{ type }}</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="活动形式" prop="desc">
                    <el-input type="textarea" v-model="formData.desc"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="submitForm('formData')">确定</el-button>
                    <el-button >取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
    const cityOptions = ['utf8', 'gbk', 'latin1', 'utf8mb4', '全部'];
    const types = ['读写', '只读', '仅DDL', '只DML'];
export default {
    name: 'modify-per',
    data () {
        const checkName = (rule,value,callback)=>{
            if(value==''){
                return callback(new Error('账户名不能为空'));
            }else if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{1,16}$/.test(value)){
                return callback(new Error('由字母,或者数字开头，字母或数字结尾，最长16个字符'));
            }else{
                return callback();
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
        const checkCharts = (rule, value, callback) => {
            if  (value == '') {
                callback(new Error('请选择字符集'));
            } else {
                this.formData.supportChartSet = value;
                callback()
            }
        }
        return {
            formData: {
                accountName: '',
                supportChartSet: '',
                desc: '',
                dataType: '',
                authAccount: '(默认)',
                accountType: '',
                ReadOnly: ''
            },
            isCreateVisable: true,
            runStating: '',
            currentIndex: -1,
            checkAll: false,
            checkedCities: [],
            checkedType: [],
            charts: cityOptions,
            types: types,
            isIndeterminate: true,
            dataInfo: null,
            options: [
                {
                    value: 'utf8',
                    label: 'utf8'
                },
                {
                    value: 'gbk',
                    label: 'gbk'
                },
                {
                    value: 'utf8mb4',
                    label: 'utf8mb4'
                },
                {
                    value: 'latin1',
                    label: 'latin1'
                },
                {
                    value: 'euckr',
                    label: 'euckr'
                },
                {
                    value: 'armscii8',
                    label: 'armscii8'
                },
                {
                    value: 'ascii',
                    label: 'ascii'
                },
                {
                    value: 'big5',
                    label: 'big5'
                },
                {
                    value: 'binary',
                    label: 'binary'
                },
                {
                    value: 'cp1250',
                    label: 'cp1250'
                },
                {
                    value: 'cp1251',
                    label: 'cp1251'
                },
                {
                    value: 'cp1256',
                    label: 'cp1256'
                },
                {
                    value: 'cp1257',
                    label: 'cp1257'
                },
                {
                    value: 'cp850',
                    label: 'cp850'
                },
                {
                    value: 'cp852',
                    label: 'cp852'
                },
                {
                    value: 'cp866',
                    label: 'cp866'
                },
                {
                    value: 'cp932',
                    label: 'cp932'
                },
                {
                    value: 'dec8',
                    label: 'dec8'
                },
                {
                    value: 'eucjpms',
                    label: 'eucjpms'
                },
                {
                    value: 'gb2312',
                    label: 'gb2312'
                },
                {
                    value: 'geostd8',
                    label: 'geostd8'
                },
                {
                    value: 'greek',
                    label: 'greek'
                },
                {
                    value: 'hebrew',
                    label: 'hebrew'
                },
                {
                    value: 'hp8',
                    label: 'hp8'
                },
                {
                    value: 'keybcs2',
                    label: 'keybcs2'
                },
                {
                    value: 'koi8r',
                    label: 'koi8r'
                },
                {
                    value: 'koi8u',
                    label: 'koi8u'
                },
                {
                    value: 'latin2',
                    label: 'latin2'
                },
                {
                    value: 'latin5',
                    label: 'latin5'
                },
                {
                    value: 'latin7',
                    label: 'latin7'
                },
                {
                    value: 'macce',
                    label: 'macce'
                },
                {
                    value: 'macroman',
                    label: 'macroman'
                },
                {
                    value: 'sjis',
                    label: 'sjis'
                },
                {
                    value: 'swe7',
                    label: 'swe7'
                },
                {
                    value: 'tis620',
                    label: 'tis620'
                },
                {
                    value: 'ucs2',
                    label: 'ucs2'
                },
                {
                    value: 'ujis',
                    label: 'ujis'
                },
                {
                    value: 'utf16',
                    label: 'utf16'
                },
                {
                    value: 'utf16le',
                    label: 'utf16le'
                },
                {
                    value: 'utf32',
                    label: 'utf32'
                }
            ],
            value: 'utf8',
            allShow: false,
            rules: {
                accountName: [
                    { required: true, validator: checkName, trigger: 'blur' }
                ],
                desc: [
                    { required: true, validator: checkDesc, trigger: 'blur' }
                ],
                supportChartSet: [
                    { required: true, validator: checkCharts, trigger: 'blur' }
                ]
            },
            account: []
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
        },
        filterAccountType(value) {
            if (!value) return;
            return value = value === 'Normal' ? '普通账号' : '高权限账号';
        }
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        allCharts(value) {
            this.formData.supportChartSet = value;
        },
        handleCheckAllChange(val) {
            this.checkedCities = val ? cityOptions : [];
            this.isIndeterminate = false;
        },
        handleCheckedCitiesChange(value) {
            if (value == '全部') {
                this.allShow = true;
            } else {
                this.allShow = false;
                this.formData.supportChartSet = value;
            }
        },
        handleCheckedCitiesChange1(value) {
            this.formData.dataType = value;
        },
        submitForm(formData) {
            this.$refs[formData].validate((valid) => {
                if (valid) {
                    this.createDataInfo();
                } else {
                // console.log(this.formData.authAccount  == '(默认)');
                }
            });
        },
        async createDataInfo() {
            let data = await this.$http.createBaseInfo({
                DBInstanceId: this.dataInfo,
                DBName: this.formData.accountName,
                CharacterSetName:  this.formData.supportChartSet,
                DBDescription: this.formData.desc
            });
            if (data) {
                if (this.formData.authAccount  == '(默认)') { // 表示没有授权账号
                } else { // 授权账号
                    this.authorAccount();
                }
                this.$message.success('创建成功');
            } else {
                this.$message.error('创建失败');
            }
        },
        async authorAccount() {
            switch(this.checkedType) {
                case 0:
                    this.formData.ReadOnly = 'ReadWrite';
                    break;
                case 1:
                    this.formData.ReadOnly = 'ReadOnly';
                case 2:
                    this.formData.ReadOnly = 'DDLOnly';
                case 3:
                    this.formData.ReadOnly = 'DMLOnly';
            }
            let data = this.$http.dataauth({
                DBInstanceId: this.dataInfo,
                AccountName: this.formData.authAccount,
                DBName: this.formData.accountName,
                AccountPrivilege: this.formData.ReadOnly
            });
        },
        getAccount(item, index) {
            this.currentIndex = index;
            this.formData.authAccount = item.AccountName;
            this.formData.accountType = item.AccountType;
            switch(item.DatabasePrivileges.DatabasePrivilege[0].AccountPrivilege) {
                case 'ReadWrite':
                    this.checkedType = 0;
                    break;
                case 'Read':
                    this.checkedType = 1;
                    break;
            }
        },
        async getAccountList() {
            if (this.runStating == 'Creating') {
            } else {
                const data = await this.$http.accountList({
                    DBInstanceId: this.dataInfo
                });
                this.account = data;
                var higOrderIndex = '';
                this.account.Accounts.DBInstanceAccount.forEach((item, index) => {
                    if (item.AccountType == 'Normal') {
                    } else {
                        higOrderIndex = index;
                    }
                });
                this.account.Accounts.DBInstanceAccount.splice(higOrderIndex, 1);
                if (this.account.Accounts.DBInstanceAccount.length > 0) {
                    this.isCreateVisable = false;
                } else {
                    this.isCreateVisable = true;
                }
            }
        }
    },
    mounted () {
        this.runStating = localStorage.getItem('runStating');
        this.dataInfo = localStorage.getItem('DBInstanceId');
        this.getAccountList();
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
        table {
            border: 0.05rem solid #333;
            width: 20rem;
            tr {
                .active {
                    background-color: #3377CC;
                    color: #fff;
                }
                td {
                    padding-left: 1rem;
                    color: #666;
                    font-size: 0.6rem;
                    box-sizing: border-box;
                }
                &:nth-of-type(1) {
                    background-color: #F3F3F3;
                }
            }
        }
    }
}
</style>
