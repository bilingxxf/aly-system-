<template>
  <div class="back-up">
        <div class="data-header">
            <div class="header-left">
            <span class="title">备份恢复</span>
            </div>
        </div>
        <!-- tab栏 -->
        <div class="mange-tab">
            <span>备份列表</span>
        </div>
        <!-- 日期 -->
        <div class="block">
            <span class="demonstration">选择时间范围</span>
            <el-date-picker
            v-model="startTime"
            type="date"
            placeholder="选择日期">
            </el-date-picker>
            <span class="demonstration">至</span>
            <el-date-picker
            v-model="endTime"
            type="date"
            placeholder="选择日期">
            </el-date-picker>
            <span @click="search" class="search">查询</span>
        </div>
        <!-- 数据列表 -->
        <div class="back-list">
            <el-table
            v-loading="loading"
            element-loading-text="拼命加载中"
            v-if="backUpList.Items"
            :data="backUpList.Items.Backup"
            >
                <el-table-column
                    prop="BackupStartTime"
                    label="备份开始/结束时间"
                    width="300">
                </el-table-column>
                <el-table-column
                    prop="BackupScale"
                    label="备份策略"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="BackupSize"
                    label="备份大小"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="recovertime"
                    label="备份恢复时间点"
                    width="230">
                </el-table-column>
                <el-table-column
                    prop="BackupMethod"
                    label="备份方法"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="BackupType"
                    label="备份类型"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="BackupStatus"
                    label="备份状态"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="HostInstanceID"
                    label="备份所在实例编号"
                    width="140">
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="222">
                <template slot-scope="scope" style="text-align: right;">
                    <!-- <el-button  type="text" size="small">下载</el-button> -->
                    <a :href="scope.row.BackupIntranetDownloadURL">下载</a>
                    <el-button v-show="false" type="text" size="small">恢复</el-button>
                </template>
                </el-table-column>
            </el-table>
        </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'backUp',
  data () {
    return {
        runStating: '',
        accountMange: '',
        backUpList: {},
        loading: true,
        listCount: 0,
        startTime: '2019-01-11T15:00Z',
        endTime: '2019-02-24T19:00Z'
    }
  },
  computed: {
  },
  methods: {
      search() {
        if (this.startTime || this.endTime) {
            this.startTime = new Date(this.startTime).toISOString().replace(/00:00.000/g, '00');
            this.endTime = new Date(this.endTime).toISOString().replace(/00:00.000/g, '00');
        } else {
            this.startTime = '2019-01-11T15:00Z';
            this.endTime = '2019-02-24T19:00Z';
        }
        this.getBackUpList();
      },
      async getBackUpList() {
          this.loading = true;;
          let data = await this.$http.getBackUpList({
              DBInstanceId: this.accountMange,
              StartTime: this.startTime,
              EndTime: this.endTime,
              PageSize: ''
          });
            if(data.Items.Backup) {
                data.Items.Backup.forEach((item, index) => {
                    let startTime = this.timerFilter(item.BackupStartTime);
                    let endTime = this.timerFilter(item.BackupEndTime);
                    item.BackupStartTime = startTime + '~' + endTime;
                    item.BackupScale = item.BackupScale === 'Database' ? '单库备份' : '全实例备份';
                    if (Number(item.BackupSize) >= 1024) {
                        if (Number(item.BackupSize / 1024 / 1024).toFixed(2) >= 1) {
                            item.BackupSize = Number(item.BackupSize / 1024 / 1024).toFixed(2) + 'M';
                        } else {
                            item.BackupSize = Number(item.BackupSize / 1024).toFixed(2) + 'K';
                        }
                    } else {
                        item.BackupSize = Number(item.BackupSize / 1024).toFied(2) + 'K'
                    }
                    item.BackupMethod = item.BackupMethod === 'Physical' ? '物理备份' : '逻辑备份';
                    item.BackupType = item.BackupType === 'FullBackup' ? '全量' : '非全量';
                    item.BackupStatus = item.BackupStatus === 'Success' ? '完成备份' : '正在备份';
                });
                this.backUpList = data;
                this.loading = false;
                this.listCount = data.TotalRecordCount;
            } else {}
      },
      timerFilter(time) {
            time = new Date(time);
            var y = time.getFullYear(),
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
      }
  },
  created () {
  },
  mounted() {
    this.runStating = localStorage.getItem('runStating');
    this.accountMange = localStorage.getItem('DBInstanceId');
    this.getBackUpList();
  },
}
</script>

<style lang="scss" scoped>
.back-up {
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
    .block {
        margin-top: 1rem;
        padding: 0 0.75rem;
        box-sizing: border-box;
        span {
            color: #333;
            font-size: 0.6rem;
            &.search {
                padding: 0.5rem 0.8rem;
                background-color: #09c;
                color: #fff;
                border-radius: 0.2rem;
            }
        }
    }
    .back-list {
        margin-top: 2rem;
        padding: 0 0.75rem;
        box-sizing: border-box;
        table {
            width: 100%;
        }
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
