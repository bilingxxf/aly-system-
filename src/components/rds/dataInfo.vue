<template>
  <div class="data-info">
      <div class="data-header">
        <div class="header-left">
          <span class="title">数据库管理</span>
          <i class="el-icon-question"></i>
        </div>
        <div class="header-right">
          <el-button @click="refresh" icon="el-icon-sort">刷新</el-button>
          <el-button  @click="createAccount" class="create">创建数据库</el-button>
        </div>
      </div>
      <!-- 数据库列表 -->
      <div class="data-list" v-loading="loading">
        <table>
          <tr class="tabale-thead">
            <th>数据库名</th>
            <th>数据库状态</th>
            <th>字符集</th>
            <th>绑定账号</th>
            <th>描述</th>
            <th>操作</th>
          </tr>
          <div v-if="dataInfo">
            <tr class="table-tbody" v-for="(item, index) in dataInfo.Databases.Database" :key="index">
              <td>{{ item.DBName }}</td>
              <td>{{ item.DBStatus | stateFilter }}</td>
              <td>{{ item.CharacterSetName }}</td>
              <td>{{ item.Accounts.AccountPrivilegeInfo.length <= 0 ? '暂无' : item.Accounts.AccountPrivilegeInfo[0].Account  }}</td>
              <td>{{ item.DBDescription === '' ? '暂无': item.DBDescription }} <el-button type="text"  icon="el-icon-edit" @click="exitShows(index)" class="exit-desc"></el-button>
                  <div class="exit-modal" v-show="index == currentIndex">
                      <el-input maxlength="64" minlength="2" v-model="exitDesc" placeholder=""></el-input>
                      <p class="check">输入范围：长度限制为2-64个字符。</p>
                      <el-row>
                          <el-button @click="exitSub(item.DBName)">确定</el-button>
                          <el-button @click="cancel" >取消</el-button>
                      </el-row>
                  </div>            </td>
              <td @click="delBaseInfo(item.DBName, index)">删除</td>
            </tr>
            <tr class="no-data" v-if="dataInfo.Databases.Database.length <= 0">
                <td colspan="6">暂无数据</td>
            </tr>
          </div>
        </table>
      </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'area',
  data () {
    return {
      dataInfoId: '',
      dataInfo: null,
      pageNumber: 1,
      pageSize: 10,
      DBInstanceId: '',
      loading: true,
      currentIndex: -1,
      exitShow: false,
      exitDesc: '',
      runStating: ''
    }
  },
  computed: {
      ...mapGetters([
          'getRdsItemInfo'
      ])
  },
  filters: {
    stateFilter: function(value) {
        if (!value) return;
        return value = value === 'Running' ? '运行中' : '恢复备份中';
    },
  },
  methods: {
    async getDataInfo() {
        if (this.runStating != 'Running') {
        } else {
          const data = await this.$http.dataInfo({
            DBInstanceId: this.dataInfoId,
            PageNumber: this.pageNumber,
            PageSize: this.pageSize
          });
          this.dataInfo = data;
          this.loading = false;
        }
    },
    createAccount() {
        this.$router.push({
            path: '/createdatabase'
        });
    },
    delBaseInfo(name, index) {
      this.$confirm(`您确定要删除( ${name} )数据库吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
      }).then(() => {
          this.del(name, index);
      }).catch(() => {
          this.$message({
              type: 'info',
              message: '已取消删除'
          });
      });
    },
    async del(name, index) {
      let data = await this.$http.delBaseInfo({
        DBInstanceId: this.DBInstanceId,
        DBName: name
      });
      if (data) {
        this.dataInfo.Databases.Database.splice(index, 1);
      }
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
          this.dataInfo.DBInstanceId = this.DBInstanceId;
          this.getDataInfo();
      }
    },
    exitShows(index) {
        this.currentIndex = index;
    },
    cancel() {
       this.currentIndex = -1;
    },
    async exitSub(name) {
        if (/^[a-zA-Z0-9\-]{2,64}$/.test(this.exitDesc)) { // 参数有效
          let data = await this.$http.baseIndoExitDesc({
            DBInstanceId: this.dataInfoId,
            DBName: name,
            DBDescription: this.exitDesc
          });
          if (data) {
            this.getDataInfo();
            this.currentIndex = -1;
          }
        } else{ // 参数无效
            this.exitShow = false;
            this.checkModal = true;
            this.open();
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
    }
    this.dataInfoId = localStorage.getItem('DBInstanceId');
    this.getDataInfo();
    this.DBInstanceId = this.dataInfoId;
  }
}
</script>

<style lang="scss" scoped>
.data-info {
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
  .data-list {
    margin: 0 0.75rem;
    margin-top: 1.5rem;
    border-left: 0.05rem solid #E1E6EB;
    border-right: 0.05rem solid #E1E6EB;
    table {
      width: 100%;
    }
    tr {
      display: flex;
      align-items: center;
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
          padding-left: 1rem;
          font-size: 0.6rem;
          color: #333333;
          box-sizing: border-box;
          flex: 1;
          &:nth-last-of-type(1):hover {
            cursor: pointer;
          }
          &:nth-of-type(6) {
            padding-right: 2.5rem;
            text-align: right;
            color: #06c;
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
          // width: 14.4rem;
        }
      }
    }
  }

}
</style>
