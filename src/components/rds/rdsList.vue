<template>
  <div class="rds-list">
    <header class="title">
        <span>云数据库管理</span>
        <el-button @click="loadRds">刷新</el-button>
        <el-button @click="createRds">创建实例</el-button>
    </header>

    <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        class="data-list"
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
            <el-table-column
            type="selection"
            width="55">
            </el-table-column>

            <el-table-column
            label="实例名称"
            width="180">
                <template slot-scope="scope">
                    <router-link to="/datamanage"style="color: #06C;">{{ scope.row.DBInstanceId }}</router-link>
                    <p v-if="scope.row.DBInstanceDescription">{{ scope.row.DBInstanceDescription }}</p>
                    <p v-else>{{ scope.row.DBInstanceId }}</p>
                </template>
            </el-table-column>


            <el-table-column
            prop="DBInstanceStatus"
            label="运行状态"
            :filter-multiple = "false"
            width="120">
                <template v-show="scope" slot-scope="scope">
                    <span :class="{ 'warning': (scope.row.DBInstanceStatus == 'Creating' || scope.row.DBInstanceStatus == 'Rebooting' || scope.row.DBInstanceStatus == 'NET_MODIFYING' || scope.row.DBInstanceStatus == 'NET_DELETING'), 'success': scope.row.DBInstanceStatus == 'Running' }"  >{{ scope.row.DBInstanceStatus | stateFilter  }}</span>
                </template>
            </el-table-column>

            <el-table-column
            label="创建时间"
            show-overflow-tooltip>
                <template v-show="scope" slot-scope="scope">
                    <span>{{ scope.row.CreateTime | timeFilter  }}</span>
                </template>
            </el-table-column>

            <el-table-column
            label="实例类型(全部)"
            :filter-multiple = "false"
            filter-placement="bottom-end"
            show-overflow-tooltip>
                <template v-show="scope" slot-scope="scope">
                    <span>{{ scope.row.DBInstanceType | instanceTypeFilter }}</span>
                </template>
            </el-table-column>

            <el-table-column
            label="数据库类型（全部）"
            :filter-multiple = "false"
            filter-placement="bottom-end"
            show-overflow-tooltip>
                <template v-show="scope" slot-scope="scope">
                    <span>{{ scope.row.Engine}} {{ scope.row.EngineVersion }}</span>
                </template>
            </el-table-column>

            <el-table-column
            prop="RegionId"
            label="所在可用区"
            show-overflow-tooltip>
            </el-table-column>

            <el-table-column
            label="网络类型"
            width="180"
            :filter-multiple = "false"
            filter-placement="bottom-end"
            show-overflow-tooltip>
                <template slot-scope="scope">
                    <p style="text-align: center;">{{ scope.row.InstanceNetworkType | networkFilter }}</p>
                    <p><span v-show="scope.row.VpcId">(</span>{{ scope.row.VpcId }}<span v-show="scope.row.VpcId">)</span></p>
                </template>
            </el-table-column>

            <el-table-column
            prop="PayType"
            label="付费类型"
            width="70"
            show-overflow-tooltip>
            </el-table-column>

            <el-table-column
            prop="label"
            label="标签"
            show-overflow-tooltip>
            </el-table-column>

            <el-table-column
            label="操作"
            class="operaty"
            show-overflow-tooltip>
                <template slot-scope="scope">
                    <span @click="jump(scope.row.DBInstanceId, scope.row.DBInstanceStatus)" class="operaty-item">管理</span>
                    <span v-show="false" class="line"></span>
                    <span v-show="false" class="operaty-item">转包年包月</span>
                    <span class="line"></span>
                    <el-button @click="visibility(scope.$index)" slot="reference">更多<i class="el-icon-caret-bottom"></i></el-button>
                    <!-- <el-popover
                    placement="right"
                    class="popover"
                    width="100"
                    trigger="click">
                        <div class="item" @click="relaseInstance(scope.row.DBInstanceId)"> 释放实例</div>
                        <el-button slot="reference">更多<i class="el-icon-caret-bottom"></i></el-button>
                    </el-popover> -->
                    <div v-show="relazeIndex == scope.$index && isRealze" @click="relaseInstance(scope.row.DBInstanceId)" class="relaze-ins">释放实例</div>
                </template>
            </el-table-column>
    </el-table>

    <div class="pag-nation" v-show="totoalPages">
        <span class="statistical">共有{{ totoalPages }}条,每页显示：{{ pageSize }}条</span>
        <el-pagination
        background
        layout="prev, pager, next"
        :page-size="pageSize"
        @current-change="handleCurrentChange"
        :total="totoalPages">
        </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import store from '../../store/index.js'

export default {
    name: 'rdsList',
    data () {
        return {
            tableData: [{
                name: '王小虎', // DBInstanceId // VpcCloudInstanceId
                runState: '运行中', // DBInstanceStatus
                date: '2016-05-03', // CreateTime
                instanceType: '常规类型', // DBInstanceType
                databaseType: 'MySQL 5.7', // Engine // EngineVersion
                availableArea: '华北3（张家口）可用区A',
                networkType:'( VPC:vpc-8vb5kxecdi8yhvjqapm3f )', // VpcId
                paymentType: '按量付费', // PayType
                label: '',
                operaty: '',
            }],
            isRealze: false,
            relazeIndex: -1,
            data: null,
            pageSize: 10,
            page: 1,
            totoalPages: 0,
            loading: true
        }
    },
    computed: {
    },
    // stateFilter
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
        networkFilter(value) {
            if (!value) return;
            return value = value === 'VPC' ? 'VPC网络': '经典网络';
        }
    },
    methods: {
        handleCurrentChange(val) {
            console.log(val);
            this.page = val;
            this.getRdsList();
        },
        handleSelectionChange() {
        },
        createRds() {
            this.$router.push({
                path: '/createrds'
            });
        },
        loadRds() {
            this.loading = true;
            this.getRdsList();
        },
        async jump(dbId, runStating) {
            localStorage.setItem('DBInstanceId', dbId);
            localStorage.setItem('runStating', runStating);
            this.$router.push({
                path: '/datamanage'
            });
            // this.$router.push({
            //     path: '/datamanage',
            //     query: {
            //         id: dbId
            //     }
            // });
        },
        async getRdsList() {
            const data = await this.$http.rdsList({
                PageNumber: this.page,
                PageSize: this.pageSize
            });
            this.tableData = data.Items.DBInstance;
            this.tableData.forEach((item, index) => {
                item.PayType = item.PayType == 'Postpaid' ? '按量付费' : '包年包月'
            });
            this.totoalPages = data.TotalRecordCount;
            this.loading = false;

        },
        async delRdsItem (id) {
            let data = await this.$http.delRdsItem({
                DBInstanceId: id
            });
            if (data) {
                this.$message({
                type: 'success',
                message: '删除成功!'
                });
                this.relazeIndex = -1;
                this.getRdsList();
            }
        },
        visibility(index) {
            this.relazeIndex = index;
            this.isRealze = !this.isRealze;
        },
        relaseInstance(id) {
            this.$confirm(`您确定要释放该实例( ${id} )吗？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.delRdsItem(id);
            }).catch(() => {
                this.$message({
                type: 'info',
                message: '已取消删除'
                });
            });
        }
    },
    mounted() {
        localStorage.removeItem('runStating');
        localStorage.token = '0d67dd1db3ae5a61872ef27d8a627b3a';
        localStorage.AccessId = 'fksjdhfklsjdhf';
        this.getRdsList();
        localStorage.removeItem('currentIndex');
    }
}
</script>

<style lang="scss" scoped>
    .rds-list {
        padding: 0 0.75rem;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        .title {
            display: flex;
            align-items: center;
            height: 2.5rem;
            width: 100%;
            span {
                padding-left: 0.5rem;
                border-left: 0.1rem solid #88B7E0;
                font-size: 0.2px;
                color: inherit;
            }
        }
        .data-list {
            border: 0.05rem solid #E1E6EB;
            border-bottom: none;
        }
        .pag-nation {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            width: 99.9%;
            height: 3.5rem;
            border: 0.05rem solid #E1E6EB;
            border-top: none;
            .statistical {
                margin-right: 1.25rem;
                font-size: 0.6rem;
                color: #888;
            }
        }
    }
</style>
