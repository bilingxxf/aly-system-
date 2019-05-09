<template>
    <div class="account-mange manags">
        <div class="data-header">
            <div class="header-left">
            <span class="title">账号管理</span>
            </div>
        </div>
        <!-- tab栏 -->
        <div class="mange-tab">
            <span>用户账号</span>
        </div>
        <!-- 按钮 -->
        <div class="mange-tab operaty">
            <el-button @click="refresh">刷新</el-button>
            <el-button @click="createAccount">创建账号</el-button>
        </div>
        <!-- 账号管理列表 -->
        <div class="data-list"  v-loading="loading" >
            <table>
                <tr class="tabale-thead">
                    <th>账号</th>
                    <th>类型</th>
                    <th>状态</th>
                    <th>所属数据库</th>
                    <th>账号描述</th>
                    <th>操作</th>
                </tr>
                <div v-if="accountList">
                    <tr class="table-tbody" v-for="(item, index) in accountList.Accounts.DBInstanceAccount" :key="index">
                        <td>{{ item.AccountName }}</td>
                        <td>{{ item.AccountType | filterAccountType }}</td>
                        <td>{{ item.AccountStatus | filterType }}</td>
                        <td>
                            <span v-for="(v, i) in item.DatabasePrivileges.DatabasePrivilege" :key="i">{{ v.DBName }} {{ v.AccountPrivilege | isReady }}&nbsp;&nbsp;</span>
                            <i @click="hostDataBase(item.DatabasePrivileges.DatabasePrivilege)" class="el-icon-caret-bottom"></i>
                            <el-button type="text" showConfirmButton="false" v-show="modalShow" @click="modalShows"></el-button>
                        </td>
                        <td class="desc">{{ item.AccountDescription == '' ? '暂无' : item.AccountDescription }} <el-button type="text" icon="el-icon-edit" @click="exitShows(index)" class="exit-desc"></el-button>
                        <div class="exit-modal" v-show="index == currentIndex">
                            <el-input maxlength="64" minlength="2" v-model="exitDesc" placeholder=""></el-input>
                            <p class="check">输入范围：长度限制为2-64个字符。</p>
                            <el-row>
                                <el-button @click="exitSub">确定</el-button>
                                <el-button @click="cancel" >取消</el-button>
                            </el-row>
                        </div>
                        <el-button v-show="checkModal" type="text" @click="open"></el-button>
                        </td>
                        <td>
                            <span @click="resetPwd(item)">重置密码</span>
                            <router-link v-if="item.AccountType == 'Normal'" :to="{ path:'/modifyper', query: {item: item} }" tag="span">修改权限</router-link>
                            <span v-else style="margin-right: 0.4rem;">重置账号权限</span>
                            <span @click="delAccountItem(item, index)">删除</span>
                        </td>
                    </tr>
                    <tr class="no-data" v-if="accountList.Accounts.DBInstanceAccount.length <= 0">
                        <td colspan="6">暂无数据</td>
                    </tr>
                </div>
            </table>
        </div>
        <!-- 修改密码弹出modal -->
        <div class="modal" v-show="pwdShow">
            <div class="modal-center">
                <div class="modal-header">
                    <span class="reset-title">重置账户密码</span>
                    <span class="icon-close" @click="pwdShow = false">x</span>
                </div>
                <div class="modal-middle">
                    <el-form :inline="true" :rules="rules" ref="pwdData" :model="pwdData" class="demo-form-inline">
                        <el-form-item label="同时重置账号:">
                            <el-checkbox v-model="pwdData.isResetAccount"></el-checkbox>
                        </el-form-item>
                        <el-form-item label=" 新密码:" prop="pwd">
                            <el-input type="password" v-model="pwdData.pwd"></el-input>
                        </el-form-item>
                        <el-form-item label="确认密码:" prop="confirmPwd">
                            <el-input type="password" v-model="pwdData.confirmPwd"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="resetPwdSubmit('pwdData')">确定</el-button>
                            <el-button @click="pwdShow = false">取消</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'account-mange',
    data () {
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
            } else if (value !== this.pwdData.pwd) {
                callback(new Error('两次输入的密码不一致，请重新输入一致的密码。'));
            } else {
                callback()
            }
        };
        return {
            accountMange: null,
            accountList: null,
            exitShow: false,
            currentIndex: -1,
            pwdShow: false,
            exitDesc: '',
            checkModal: false,
            modalShow: false,
            loading: true,
            CurrentDBName: '',
            currentReadState: '',
            runStating: '',
            pwdData: {
                isResetAccount: 0,
                pwd: '',
                confirmPwd: '',
                accountName: ''
            },
            rules: {
                pwd: [
                    { required: true, validator: checkPwd, trigger: 'blur' }
                ],
                confirmPwd: [
                    { required: true, validator: checkConfirm, trigger: 'blur' }
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
                case 'ReadOnly':
                    return '只读';
                    break;
                case 'DDLOnly':
                    return '仅仅DDL';
                case 'DMLOnly':
                    return '只DML';
            }
        },
        filterType: function(value) {
            if (!value) return;
                return value == 'Available' ? '激活' : '暂未激活' ;
        },
        filterAccountType: function(value) {
            if (!value) return;
            return value == 'Normal' ? '普通账号' : '高权限账号';
        }
    },
    methods: {
        async getAccountList() {
            if (this.runStating != 'Running') {
            } else {
                const data = await this.$http.accountList({
                    DBInstanceId: this.accountMange,
                });
                this.accountList = data;
                this.loading = false;
            }
        },
        exitShows(index) {
            this.exitShow = !this.exitShow;
            this.currentIndex = index;
        },
        exitSub() {
            if (/^[a-zA-Z0-9\-]{2,64}$/.test(this.exitDesc)) { // 参数有效
                // console.log(true);

            } else{ // 参数无效
                this.exitShow = false;
                this.checkModal = true;
                this.open();
            }
        },
        cancel() {
            this.currentIndex = -1;
        },
        modalShows() {
                this.currentReadState = this.currentReadState.replace(/ReadWrite/g, '读写').replace(/ReadOnly/g, '只读').replace(/DDLOnly/g, '仅DDL').replace(/DMLOnly/g, '只DML')
                this.$alert(`${this.currentReadState}`, '所属数据库', {
                    confirmButtonText: '确定'
                });
        },
        hostDataBase(item) {
            this.currentReadState = '';
            if (item.length > 0) {
                item.forEach((item, index) => {
                    this.currentReadState += item.DBName + ' ' + item.AccountPrivilege + ', ';
                });
                this.modalShows();
                this.modalShow = true;
                // this.modalShows();
            } else {
                this.$alert(`暂无`, '所属数据库', {
                    confirmButtonText: '确定'
                });
            }
        },
        open() {
            this.$confirm('参数DBDescription无效。', '错误提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
            }).catch(() => {
            });
        },
        refresh() {
            if (this.runStating == 'Running') {
                this.$alert('实例状态不支持该操作。只有实例状态是运行中才可以进行操作。', '错误提示', {
                confirmButtonText: '确定',
                type: 'warning',
                callback: action => {
                }
                });
            } else {
                this.loading = true;
                this.getAccountList();
            }
        },
        createAccount() {
            this.$router.push({
                path: '/createaccount'
            });
        },
        resetPwd(item) {
            this.pwdData.accountName = item.AccountName;
            this.pwdShow = true;
        },
        async subPwdData() {
            let data = await this.$http.resetAccountPwd({
                DBInstanceId: this.accountMange,
                AccountPassword: this.pwdData.confirmPwd,
                AccountName: this.pwdData.accountName
            });
            if (data) {
                this.pwdShow = false;
                this.$message({
                    type: 'success',
                    message: '账户密码重置成功'
                });
            } else {
                this.$message({
                    type: 'success',
                    message: '账户密码重置失败'
                });
            }

        },
        resetPwdSubmit(pwdData) {
            this.$refs[pwdData].validate((valid) => {
                if (valid) {
                    this.subPwdData();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        delAccountItem(item, index) {
            this.$confirm(`您确定要删除( ${item.AccountName} )数据库吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                this.del(item, index);
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        async del(item, index) {
            let data = await this.$http.delAccountItem({
                DBInstanceId: this.accountMange,
                AccountName: item.AccountName
            });
            if (data) {
                this.accountList.Accounts.DBInstanceAccount.splice(index, 1);
                this.getAccountList();
            }
        }
    },
    created () {
        this.runStating = localStorage.getItem('runStating'); // Creating
        if (this.runStating != 'Running') {
            this.$alert('实例状态不支持该操作。只有实例状态是运行中才可以进行操作。', '错误提示', {
            confirmButtonText: '确定',
            type: 'warning',
            callback: action => {
            }
            });
        } else {
        }
        this.accountMange = localStorage.getItem('DBInstanceId');
        this.getAccountList();
    }
}
</script>

<style lang="scss" scoped>
.account-mange {
    width: 100%;
    .data-header {
        margin: 0 0.75rem;
        padding-left: 0.75rem;
        display: flex;
        align-items: center;
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
    }
    .data-list {
        margin: 0 0.75rem;
        // width: 100%;
        margin-top: 0.5rem;
        border-left: 0.05rem solid #E1E6EB;
        // border-right: 0.05rem solid #E1E6EB;
        table {
            width: 100%;
        }
        tr {
        display: flex;
        align-items: center;
        border-right: 0.05rem solid #E1E6EB;
        &.tabale-thead {
            height: 1.75rem;
            background-color: #F5F6FA;
            border-top: 0.05rem solid #E1E6EB;
            border-bottom: 0.05rem solid #E1E6EB;
        }
        &.table-tbody {
            height: 2.85rem;
            background-color: #fff;
            border-bottom: 0.05rem solid #E1E6EB;
            &:hover {
                background-color: #F9F9FA;
            }
            td {
                padding-left: 0.5rem;
                font-size: 0.6rem;
                color: #333333;
                box-sizing: border-box;
                flex: 1;
                &:nth-of-type(6) {
                    padding-right: 2.5rem;
                    text-align: right;
                    color: #06c;
                    &:hover {
                        cursor: pointer;
                    }
                    span {
                        margin-right: 2rem;
                    }
                }
            }
        }
        th {
            padding-left: 0.5rem;
            color: #999;
            font-size: 0.6rem;
            text-align: left;
            box-sizing: border-box;
            flex: 1;
            &:nth-last-of-type(1) {
                text-align: right;
                margin-right: 0.4rem;
            }
        }
        }
    }
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, .5);
        .modal-center {
            margin-left: 35%;
            margin-top: 1%;
            width: 30rem;
            height: 16rem;
            background-color: #fff;
            box-shadow: 0px 0.25rem 0.5rem rgba(0,0,0,0.5);
            .modal-header {
                padding: 0 0.75rem;
                display: flex;
                height: 2.5rem;
                align-items: center;
                border-bottom: 0.05rem solid #e5e5e5;
                box-sizing: border-box;
                .icon-close {
                    margin-left: auto;
                    padding: 0.5rem;
                    cursor: pointer;
                }
                .reset-title {
                    font-size: 0.7rem;
                    color: #333;
                }
            }
        }
    }
}
</style>
