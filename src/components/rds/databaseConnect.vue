<template>
    <div class="database-connect">
        <div class="data-header">
            <div class="header-left">
            <span class="title">数据库连接</span>
            </div>
        </div>
        <!-- tab栏 -->
        <div class="mange-tab">
            <span>实例连接</span>
        </div>
        <!-- 连接列表 -->
        <div class="connect-list" v-loading="loading">
            <div v-if="dBInstanceNetInfos.DBInstanceNetInfos" class="list-item">
                <el-collapse v-model="activeName" accordion>
                    <el-collapse-item title="数据库连接" name="1">
                        <table cellspacing="0" cellpadding="0">
                            <tr>
                                <td><span>网络类型:</span>{{ dBInstanceNetInfos.DBInstanceNetInfos.DBInstanceNetInfo[0].IPType | filterType }}  （{{  dBInstanceNetInfos.DBInstanceNetInfos.DBInstanceNetInfo[0].VPCId }}） </td>
                                <td><span>数据库代理状态（原高安全模式）:</span> {{ dBInstanceNetInfos.DBInstanceNetInfos.DBInstanceNetInfo[0].Upgradeable | UpgradeFilter }}</td>
                            </tr>
                            <tr>
                                <td><span>内网地址:</span> {{ withInInfo.ConnectionString }}</td>
                                <td><span>网端口:</span> {{ withInInfo.Port }}</td>
                            </tr>
                            <tr v-if="outsideInfo">
                                <td><span>外网地址:</span> {{ outsideInfo.ConnectionString }}</td>
                                <td><span>外网端口:</span> {{ outsideInfo.Port }}</td>
                            </tr>
                            <tr>
                                <td colspan="2" class="tips"> 温馨提示：请使用以上访问连接串进行实例连接，VIP在业务维护中可能会变化。</td>
                            </tr>
                        </table>
                        <div class="operity">
                            <a href="javascript:;">如何连接RDS</a>
                            <a class="un-connect" href="javascript:;">为什么连接不上</a>
                            <el-button :disabled="runStating == 'Creating' || runStating == 'Rebooting' || runStating == 'NET_DELETING' ||  runStating == 'NET_MODIFYING' || runStating == 'NET_DELETING'" :class="{ 'waring': runStating != 'Running' }"  @click="exitNetWork(outsideInfo)">修改连接地址</el-button>
                            <el-button :disabled="runStating == 'Creating' || runStating == 'Rebooting' || runStating == 'NET_DELETING' || runStating == 'NET_MODIFYING' || runStating == 'NET_DELETING'"  :class="{ 'waring': runStating != 'Running' }" @click="applyExternNetadd(0)" slot="reference">{{ label }}</el-button>
                        </div>
                        <el-input  @blur="apply(dBInstanceNetInfos.DBInstanceNetInfos.DBInstanceNetInfo[0].Port)" v-show="currentIndex == 0" v-model="prefix" placeholder="请输入外网地址"></el-input>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </div>
        <!-- 模态框 -->
        <el-dialog
        title="修改连接地址"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="连接类型:">
                    <el-select @change="selecteType" v-model="formInline.region" placeholder="请选择网络连接">
                        <el-option label="请选择网络连接" value="请选择网络连接"></el-option>
                        <el-option label="外网连接" value="外网连接"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item v-show="visibility" label="连接地址:">
                    <el-input v-model="formInline.address" placeholder="请输入连接前缀"></el-input>
                    <span>{{ formInline.suffix }}</span>
                </el-form-item>

                <el-form-item v-show="visibility" label="端口:">
                    <el-input v-model="formInline.port"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateNetwork">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'database-connect',
    data () {
        return {
            activeName: '1',
            accountMange: null,
            dBInstanceNetInfos: [],
            visible: false,
            currentIndex: -1,
            prefix: '',
            label: '申请外网地址',
            withInInfo: '',
            outsideInfo: '',
            dialogVisible: false,
            formInline: {
                region: '',
                address: '',
                port: '',
                suffix: ''
            },
            info: '',
            visibility: false,
            loading: true,
            runStating: true
        }
    },
    filters: {
        filterType(value) {
            return value === 'Private' ? '专有网络': '经典网络'
        },
        UpgradeFilter(value) {
             return value === 'Disabled' ? '未开通': '开通'
        }
    },
    computed: {
        ...mapGetters([
            'getRdsItemInfo'
        ])
    },
    methods: {
        async getConnectInfo() {
            let data = await this.$http.getConnectInfo({
                DBInstanceId: this.accountMange
            });
            this.dBInstanceNetInfos = data;
            this.dBInstanceNetInfos.DBInstanceNetInfos.DBInstanceNetInfo.forEach((item, index) => {
                if (item.VPCId != "") {
                    this.label = '申请外网实例';
                    this.withInInfo = item;
                } else {
                    this.label = '释放外网实例';
                    this.outsideInfo = item;
                }
            });
            this.loading = false;
        },
        apply(port) {
            this.currentIndex = -1;
            this.applyNet(port);
        },
        applyExternNetadd(index) {
            if (this.label == '释放外网实例') {
                this.releaseIns();
            } else {
                this.currentIndex = index;
            }
        },
        async applyNet(port) {
            let data = await this.$http.applyExterNetadd({
                DBInstanceId: this.accountMange,
                ConnectionStringPrefix: this.prefix,
                Port: port
            });
            if (data) {
                this.getConnectInfo();
                this.label = '释放外网实例';
            }
        },
        async releaseIns() {
            let data = await this.$http.releaseIns({
                DBInstanceId: this.accountMange,
                CurrentConnectionString: this.outsideInfo.ConnectionString
            });
            if (data) {
                this.label = '申请外网实例';
            }
        },
        selecteType(value) {
            if (value === '外网连接') {
                this.visibility = true;
            } else {
                this.visibility = false;
            }
        },
        exitNetWork(info) {
            if (info) {
                this.dialogVisible = true;
                this.info = info;
                this.formInline.address = info.ConnectionString.split('.')[0];
                this.formInline.port = info.Port;
                info.ConnectionString.split('.').forEach((item, index) => {
                    if (index > 0) {
                        this.formInline.suffix += '.' + item
                    }
                });
            } else {
                this.dialogVisible = false;
            }
        },
        // 修改
        updateNetwork() {
            this.exitInstance();
        },
        async exitInstance() {
            let data = this.$http.exitIntance({
                DBInstanceId: this.accountMange,
                ConnectionStringPrefix: this.formInline.address,
                Port: this.formInline.port,
                CurrentConnectionString: this.outsideInfo.ConnectionString
            });
            if (data) {
                this.dialogVisible = false;
            }
            this.getConnectInfo();
        }
    },
    created () {
        this.runStating = localStorage.getItem('runStating');
        this.accountMange = localStorage.getItem('DBInstanceId');
        this.getConnectInfo();
    }
}
</script>

<style lang="scss" scoped>
.database-connect {
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
            border-bottom: 0.3rem solid #fff;
            border-right: 0.05rem solid #ddd;
        }
    }
    .connect-list {
        margin: 0 0.75rem;
        margin-top: 2rem;
        .list-item {
            margin-bottom: 2rem;
            position: relative;
        }
        .operity {
            display: flex;
            position: absolute;
            right: 2.5rem;
            top: 0.6rem;
            a {
                text-decoration: none;
            }
            .un-connect {
                margin: 0 1rem;
            }
        }
        table {
            width: 100%;
            td {
                padding-left: 1rem;
                height: 2rem;
                border-right: 0.05rem solid #eeeeee;
                border-bottom: 0.05rem solid #eeeeee;
                border-left: 0.05rem solid #eeeeee;
                box-sizing: border-box;
                span {
                    color: #999;
                    font-size: 0.6rem;
                }
                &.tips {
                    color: #f00;
                    font-size: 0.6rem;
                }
            }
        }
    }
}
</style>
