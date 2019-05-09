<template>
    <div class="data-manage">
        <div class="manage-left">
            <router-link tag="div" to="/rdslist" class="left-head">
                <i class="el-icon-arrow-left"></i>
            </router-link>
            <div class="left-list">
                <div class="list-item" :class="{ 'active': index == currentIndex }" @click="loadrouter(index)" v-for="(item, index) in selectItem" :key="index">{{ item.title }}</div>
            </div>
        </div>
        <div class="manage-right">
            <!--  数据库顶部 -->
            <div class="base-header" v-if="DBInstanceAttribute">
                <div class="left-info">
                    <img class="left-logo" src="../../../static/images/logo.png"/>
                    <span class="left-name">{{ DBInstanceAttribute.DBInstanceDescription }}</span>
                    <span :class="{ 'warning': (DBInstanceAttribute.DBInstanceStatus == 'Creating' || DBInstanceAttribute.DBInstanceStatus == 'Rebooting' || DBInstanceAttribute.DBInstanceStatus == 'NET_MODIFYING' || DBInstanceAttribute.DBInstanceStatus == 'NET_DELETING' ), 'success': DBInstanceAttribute.DBInstanceStatus == 'Running'}" class="left-status">({{ DBInstanceAttribute.DBInstanceStatus | stateFilter }})</span>
                    <el-button icon="el-icon-star-on" @click="goback">返回实例列表</el-button>
                </div>
                <div class="right-info">
                    <i class="el-icon-info"></i>
                    <span v-show="false">RDS控制台操作指南</span>
                    <el-row>
                        <el-button  v-show="false">操作指引</el-button>
                        <el-button v-show="false" >登录数据库</el-button>
                        <el-button @click="restartIns" >重启实例</el-button>
                        <el-button v-show="false" @click="createTempyInstance" >创建临时实例</el-button>
                        <el-button @click="createcreateBackUp" >创建备份</el-button>
                        <el-button @click="loadrouter(0)" icon="el-icon-refresh">刷新</el-button>
                    </el-row>
                </div>
            </div>
            <el-button type="text" @click="open"></el-button>
            <!-- 子路由管理 -->
            <router-view></router-view>
            <!-- 实例备份 -->
            <el-dialog title="备份实例" width="30%" :visible.sync="dialogTableVisible">
                <el-form ref="form" :rules="rules" :model="formData" label-width="80px">
                <el-form-item label="备份类型" prop="region">
                    <el-select v-model="formData.region" placeholder="请选择备份类型">
                    <el-option label="物理备份" value="Physical"></el-option>
                    <el-option label="逻辑备份" value="Logical"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="resource" v-show="formData.region == 'Logical'" label="特殊资源">
                    <el-radio-group v-model="formData.resource">
                    <el-radio label="实例备份"></el-radio>
                    <el-radio label="单库备份"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="数据库" prop="dataName" >
                    <el-select v-model="formData.dataName" placeholder="请选择数据库">
                        <el-option v-for="(item, index) in formData.data" :key="index" :label="item.DBName" :value="item.DBName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item  label="">
                    <p>您确定要立即备份此实例吗？（备份任务将会在1分钟左右开始启动）</p>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="submit('form')">确定</el-button>
                    <el-button @click="dialogTableVisible = false">取消</el-button>
                </el-form-item>
                </el-form>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import store from '../../store/index.js'

export default {
    name: 'dataManage',
    data () {
        const validateRegion = (rule, value, callback) => {
            if (value == '') {
                callback(new Error('请选择备份类型'));
            } else {
                callback()
            }
        };
        const validateData = (rule, value, callback) => {
            if (value == '') {
                callback(new Error('请选择数据库'));
            } else {
                this.formData.dataName = value;
                callback()
            }
        };
        return {
            selectItem: [
                {
                    title: '基本信息'
                },
                {
                    title: '账号管理'
                },
                {
                    title: '数据库管理'
                },
                {
                    title: '数据库连接'
                },
                {
                    title: '数据安全性'
                },
                {
                    title: '备份恢复'
                }
                // {
                //     title: '参数设置'
                // },
                // {
                //     title: '开放搜索'
                // }
            ],
            currentIndex: 0,
            DBInstanceId: null,
            DBInstanceAttribute: null,
            dialogTableVisible: false,
            formData: {
                region: '',
                resource: '单库备份',
                dataName: '',
                data: ''
            },
            rules: {
                region: [
                    { required: true, validator: validateRegion, trigger: 'blur' }
                ],
                dataName: [
                    { required: true, validator: validateData, trigger: 'blur' }
                ]
            }
        }
    },
    computed: {
        ...mapGetters([
            'getRdsItemInfo'
        ])
    },
    watch: {
        '$route'(to, from ) {
            if(from.path === '/rdslist') {
                this.$router.push({
                    path: `/baseinfo/${this.DBInstanceId}`
                });
            }
        }
    },
    methods: {
        // 实例备份
        createcreateBackUp() {
            this.dialogTableVisible = true;
        },
        // 获取数据库列表
        async getDataInfo() {
            const data = await this.$http.dataInfo({
                DBInstanceId: this.DBInstanceId,
                PageNumber: 1,
                PageSize: ''
            });
            this.formData.data = data.Databases.Database;
        },
        submit(item) {
            this.$refs[item].validate((valid) => {
                if (valid) {
                    this.formData.resource = this.formData.resource === '单库备份' ? 'db' : 'instance';
                    this.createBackUp();
                } else {
                    return false;
                }
            });
        },
        createBackUp() {
            const data = this.$http.createBackUp({
                DBInstanceId: this.DBInstanceId,
                BackupMethod: this.formData.region,
                BackupStrategy: this.formData.resource,
                DBName: this.formData.dataName
            });
            if (data) {
                this.$message.success('创建成功');
            } else {
                this.$message.error('创建失败！');
            }
            this.dialogTableVisible = false;
        },
        loadrouter(index) {
            this.currentIndex = index;
            localStorage.setItem('currentIndex', index);
            switch(Number(index)) {
                case 0:
                    this.$router.push({
                        path:`/baseinfo/${this.DBInstanceId}`
                    });
                    break;
                case 1:
                    this.$router.push({
                        path:'/mdsaccountmange'
                    });
                    break;
                case 2:
                    this.$router.push({
                        path:'/datainfo'
                    });
                    break;
                case 3:
                    this.$router.push({
                        path:'/databaseconnect'
                    });
                    break;
                case 4:
                    this.$router.push({
                        path:'/datasecurity'
                    });
                    break;
                case 5:
                    this.$router.push({
                        path:'/backup'
                    });
                    break;
            }
        },
        async getRdsInfo() {
            const data = await this.$http.rdsInfo({
                DBInstanceId: this.DBInstanceId
            })
            this.data = data;
            store.dispatch('setRdsItemInfo', data);
            this.DBInstanceAttribute = data.Items.DBInstanceAttribute[0];
        },
        goback() {
            this.$router.push({
                path: '/rdslist'
            });
        },
        open() {
            this.$confirm('您确定要立即重启此实例吗？', '重启实例', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                this.submitResetIns();
            }).catch(() => {
            });
        },
        restartIns() {
            this.open();
        },
        async submitResetIns() {
            let data = await this.$http.restartInstance({
                DBInstanceId: this.DBInstanceId
            });
            if (data) {
                this.$message({
                    type: 'success',
                    message: '实例重启'
                });
            }
        },
        async createTempyInstance() {
            let data = await this.$http.createTemptyIns({
                DBInstanceId: this.DBInstanceId,
                BackupId: '100054239'
            });
            if (data) {
                this.$message.success('创建成功');
            }
        }
    },
    mounted() {
        this.DBInstanceId = localStorage.getItem('DBInstanceId');
        this.getDataInfo();
        this.getRdsInfo();
        if (localStorage.getItem('currentIndex')) {
            this.currentIndex = localStorage.getItem('currentIndex');
            switch(Number( localStorage.getItem('currentIndex'))) {
                case 0:
                    this.$router.push({
                        path:`/baseinfo/${this.DBInstanceId}`
                    });
                    break;
                case 1:
                    this.$router.push({
                        path:'/mdsaccountmange'
                    });
                    break;
                case 2:
                    this.$router.push({
                        path:'/datainfo'
                    });
                    break;
                case 3:
                    this.$router.push({
                        path:'/databaseconnect'
                    });
                    break;
                case 4:
                    this.$router.push({
                        path:'/datasecurity'
                    });
                    break;
            }
        } else {
            this.$router.push({
                path: `/baseinfo/${this.DBInstanceId}`
            });
        }

    },
    filters: {
        stateFilter: function(value) {
            if (!value) return;
            if (value == 'Running') {
                value = '运行中'
            } else if (value == 'Creating') {
                value = '创建中';
            } else if (value == 'NET_MODIFYING') {
                value = '修改网络连接中';
            } else if (value == 'NET_DELETING') {
                value = '释放网络连接中';
            } else if (value == 'Rebooting') {
               value = '重启中';
            } else if (value == 'NET_CREATING') {
                value = '恢复备份中'
            }
            return value;
        }
    },
    created () {
    }
}
</script>

<style lang="scss" scoped>
.data-manage {
    display: flex;
    width: 100%;
    height: 100%;
    background: #fff;
    overflow: hidden;
    .manage-left {
        height: 130%;
        width: 9rem;
        background-color: #EAEDF1;
        .left-head{
            display: flex;
            align-items: center;
            justify-content: center;
            height: 3.5rem;
            background-color: #D9DEE4;
            .el-icon-arrow-left {
                font-size: 2rem;
                font-weight: 700;
            }
        }
        .left-list {
            display: flex;
            flex-direction: column;
            width: 100%;
            background-color: #EAEDF1;
            .active {
                background-color: #fff;
            }
            .list-item {
                padding-left: 1.5rem;
                display: flex;
                align-items: center;
                width: 100%;
                height: 2rem;
                box-sizing: border-box;
                color: #333;
                font-size: 0.6rem;
                &:hover {
                    background-color: #fff;
                }
            }
        }
    }
    .manage-right {
        width: 90.5%;
        height: 100%;
        .base-header {
            width: 97.5%;
            margin-left: 0.75rem;
            margin-bottom: 1.75rem;
            display: flex;
            // width: 100%;
            height: 3.45rem;
            border-bottom: 1px solid #DDDDDD;
            .left-info,.right-info {
                display: flex;
                align-items: center;
            }
            .left-info {
                .left-logo {
                    vertical-align: middle;
                }
                .left-name {
                    margin: 0 0.45rem;
                    font-size: 1.2rem;
                    color: inherit;
                }
                .left-status {
                    margin-top: 1rem;
                    font-size: 0.6rem;
                    color: #090;
                    align-self: flex-start;
                    &.warning {
                        color: red;
                    }
                    &.success {
                        color: #109C10!important;
                    }
                }
            }
            .right-info {
                display: flex;
                align-items: center;
                margin-left: auto;
                span {
                    margin-left: 0.2rem;
                    font-size: 0.6rem;
                    color: #333;
                    font-weight: normal;
                }
            }
        }
    }
}
</style>
