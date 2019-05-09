<template>
    <div class="base-info">
        <!-- 信息列表 -->
        <div class="base-list">
            <!-- 基本信息 -->
            <el-collapse  v-loading="loading" v-model="activeNames" @change="handleChange">
                <el-collapse-item title="基本信息" name="1">
                    <table border-collapse:collapse>
                        <tr>
                            <td><span>实例ID:</span>{{ DBInstanceAttribute.DBInstanceId }}</td>
                            <td v-if ="DBInstanceAttribute.DBInstanceDescription "><span>名称:</span>{{ DBInstanceAttribute.DBInstanceDescription }} <el-button type="text" icon="el-icon-edit" class="exit-desc" @click="exitShow = !exitShow"></el-button></td>
                            <td v-else><span>名称:</span>{{ DBInstanceAttribute.DBInstanceId }} <el-button type="text" icon="el-icon-edit" class="exit-desc" @click="exitShow = !exitShow"></el-button></td>
                        </tr>
                        <tr>
                            <td><span>地域可用区:</span>{{ DBInstanceAttribute.RegionId }}</td>
                            <td><span>类型及系列:</span>{{ DBInstanceAttribute.DBInstanceType | instanceTypeFilter }}</td>
                        </tr>
                        <tr>
                            <td><span>内网地址:</span>{{ DBInstanceAttribute.ConnectionString }}</td>
                            <td><span>内网端口:</span>{{ DBInstanceAttribute.Port }}</td>
                        </tr>
                        <tr>
                            <td><span>外网地址:</span><span class="apply">申请外网地址</span></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td colspan="2"><span>存储类型:</span>{{ DBInstanceAttribute.DBInstanceStorageType | filterStorageType }}</td>
                        </tr>
                        <tr>
                            <td class="tips" colspan="2">温馨提示：请使用以上访问连接串进行实例连接，VIP在业务维护中可能会变化。</td>
                        </tr>
                    </table>
                </el-collapse-item>
                <div class="operaty">
                    <el-button>设置白名单</el-button>
                </div>
                <div class="exit-modal" v-show="exitShow">
                    <el-input maxlength="64" minlength="2" v-model="exitDesc" placeholder=""></el-input>
                    <p class="check">输入范围：长度限制为2-64个字符。</p>
                    <el-row>
                        <el-button @click="exitSub">确定</el-button>
                        <el-button @click="cancel" >取消</el-button>
                    </el-row>
                </div>
                <el-button v-show="checkModal" type="text" @click="open"></el-button>
            </el-collapse>
            <!-- 运行状况 -->
            <el-collapse v-loading="loading" v-model="activeNames" @change="handleChange">
                <el-collapse-item title="运行状态" name="2">
                    <table border-collapse:collapse>
                        <tr>
                            <td><span>运行状态:</span><span class="running">{{ DBInstanceAttribute.DBInstanceStatus | stateFilter }}</span></td>
                            <td><span>付费类型:</span>{{ DBInstanceAttribute.PayType | filterPayType }}</td>
                            <td><span>创建时间:</span>{{ DBInstanceAttribute.CreationTime | timeFilter }}</td>
                        </tr>
                    </table>
                </el-collapse-item>
                <div class="operaty">
                    <el-button>转包年包月</el-button>
                    <el-button>释放实例</el-button>
                </div>
            </el-collapse>
            <!-- 配置信息 -->
            <el-collapse v-loading="loading" v-model="activeNames" @change="handleChange">
                <el-collapse-item title="配置信息" name="3">
                    <table border-collapse:collapse>
                        <tr>
                            <td><span>规格族:</span>通用型</td>
                            <td><span>数据库类型</span>{{ DBInstanceAttribute.Engine }} {{ DBInstanceAttribute.EngineVersion }}</td>
                            <td><span>CPU:</span>{{ DBInstanceAttribute.DBInstanceCPU }} 核</td>
                        </tr>
                        <tr>
                            <td><span>数据库内存:</span>{{ DBInstanceAttribute.DBInstanceMemory }}MB</td>
                            <td><span>最大连接数:</span>{{ DBInstanceAttribute.MaxConnections }}</td>
                            <td><span>可维护时间段:</span>{{ DBInstanceAttribute.MaintainTime  | filterMainTime}}<span class="apply set">设置</span></td>
                        </tr>
                        <tr>
                            <td><span>实例规格:</span>{{ DBInstanceAttribute.DBInstanceClass }}</td>
                            <td></td>
                            <td></td>
                        </tr>
                    </table>
                </el-collapse-item>
                <div class="operaty">
                    <el-button>变更配置</el-button>
                    <el-button class="kernel">升级内核小版本</el-button>
                </div>
            </el-collapse>
            <!-- 使用统计量 -->
            <el-collapse v-loading="loading" v-model="activeNames" @change="handleChange">
                <el-collapse-item title="使用统计量" name="4">
                    <table border-collapse:collapse>
                        <tr>
                            <td><span>存储空间:</span>已使用 1.69G(共{{ DBInstanceAttribute.DBInstanceStorage }}.00G)</td>
                            <td><span>备份使用量:</span><span class="long">（基础版备份文件免费保存，最长7天）</span><span class="apply">查看详情</span></td>
                        </tr>
                    </table>
                </el-collapse-item>
                <div class="operaty">
                </div>
            </el-collapse>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'baseInfo',
    data () {
        return {
            DBInstanceId: null,
            data: null,
            DBInstanceAttribute: '',
            activeNames: ['1', '2', '3', '4'],
            exitDesc: '',
            exitShow: false,
            checkModal: false,
            loading: true
        }
    },
    computed: {
    },
    filters: {
        stateFilter: function(value) {
            if (!value) return;
            return value = value === 'Running' ? '运行中' : '恢复备份中';
        },
        timeFilter: function(value) {
            if (!value) return;
            let time = new Date(value),
                y = time.getFullYear(),
                m = time.getMonth()+1,
                d = time.getDate(),
                h = time.getHours(),
                mm = time.getMinutes(),
                s = time.getSeconds();
            m = m < 10 ? '0' + m : m;
            d = d < 10 ? '0' + d : d;
            h = h < 10 ? '0' + h : h;
            mm = mm < 10 ? '0' + mm : mm;
            s = s < 10 ? '0' + s : s;
            return y + '-' + m + '-' + d + ' ' + h + ':' + mm + ':' + s;
        },
        instanceTypeFilter(value) {
            if (!value) return;
            switch(value) {
                case 'Primary':
                    return '常规实例';
                    break;
            }
        },
        filterStorageType(value) {
                if (!value) return;
                return value = value === 'local_ssd' ? '本地SSD盘(推荐)' : 'SSD云盘';
        },
        networkFilter(value) {
            if (!value) return;
            return value = value === 'VPC' ? '专用网络': '经典网络';
        },
        filterPayType(value) {
            if (!value) return;
            return value = value === 'Postpaid' ? '按量付费' : '包年包月';
        },
        filterMainTime(value) {
            if (!value) return;
            return value.replace(/Z/g,'');
        }
    },
    methods: {
        async getRdsInfo() {
            const data = await this.$http.rdsInfo({
                DBInstanceId: this.DBInstanceId
            })
            this.data = data;
            this.DBInstanceAttribute = data.Items.DBInstanceAttribute[0];
            this.loading = false;
            this.exitDesc = this.DBInstanceAttribute.DBInstanceDescription;
        },
        refresh() {
            this.getRdsInfo();
        },
        goback() {
            this.$router.push({
                path: '/rdslist'
            });
        },
        async exitSub() {
            if (/^[a-zA-Z0-9\-]{2,64}$/.test(this.exitDesc)) { // 参数有效
                const data = await this.$http.modifyDbDesc({
                    DBInstanceId: this.DBInstanceId,
                    DBInstanceDescription: this.exitDesc
                });
                if (data.RequestId) {
                    this.exitShow = false;
                    this.DBInstanceAttribute.DBInstanceDescription = this.exitDesc;
                }

            } else{ // 参数无效
                this.exitShow = false;
                this.checkModal = true;
                this.open();
            }
        },
        cancel() {
            this.exitShow = false;
        },
        open() {
            this.$confirm('参数DBDescription无效。', '错误提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
            }).catch(() => {
            });
        }
    },
    created () {
        this.DBInstanceId = this.$route.params.id;
        this.getRdsInfo();
    }
}
</script>

<style lang="scss" scoped>
.base-info {
    margin: 0 0.75rem;
    width: 100%;
    .base-header {
        margin-bottom: 1.75rem;
        display: flex;
        width: 98%;
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
    .base-list {
        width: 98%;
        height: 100%;
    }

}
</style>
