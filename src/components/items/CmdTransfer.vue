<template>
  <div class="m-transfer">
  	<el-transfer v-model="selection"
    :titles="['实例ID', '实例ID']"
    :props="{
      key: 'InstanceId',
      label: 'CloudName'
    }"
    :data="data">
     <p slot="left-footer">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.PageNumber"
          :page-sizes="[20, 50]"
          :page-size="pagination.PageSize"
          layout="total, sizes, prev, pager, next"
          :total="pagination.TotalCount">
        </el-pagination>
    </p> 
    </el-transfer>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="setSelection" :disabled="!selection.length">确 定</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'cmd-transfer',
  props: ['closeDialog', 'dialogVisible'],
  data() {
    return {
      data: [],
      selection: [],
      pagination: {
        PageNumber: 1,
        PageSize: 20,
        TotalCount: 0
      },
    }
  },
  watch: {
    dialogVisible(val) {
      if (!val) { 
        this.selection = []
        const copy = JSON.parse(JSON.stringify(this.data))
        this.data = []
        setTimeout(()=> {
          this.data = copy
        }, 500)
      }
    }
  },
  methods: {
    setSelection (){
      this.$parent.$parent.selection = this.selection
      this.closeDialog()
      console.log(this.$parent.$parent.selection)
      console.log(this.selection)
    },
    async getList () {
      const data = await this.$http.instance_list({
        PageNumber: this.pagination.PageNumber,
        PageSize: this.pagination.PageSize
      })
      let res = data.Instances.Instance
      res = res.sort((a,b) => a.InstanceId.localeCompare(b.InstanceId))
      if (res.length) {
        const InstanceIds = []
        for (let key of res) {
          InstanceIds.push(key.InstanceId)
        }

        let status = await this.$http.instance_install({
          InstanceIds: InstanceIds.join(',')
        })
        status = status.InstanceCloudAssistantStatusSet.InstanceCloudAssistantStatus
        status = status.sort((a,b) => a.InstanceId.localeCompare(b.InstanceId))

        res.map((v, i) => {
          v.CloudAssistantStatus = status[i].CloudAssistantStatus
          v.CloudName = `${v.InstanceId}(${v.CloudAssistantStatus === 'true' ? '已' : '未'}安装)`
        })
      }
      this.data = res
      this.pagination.TotalCount = data.TotalCount
    },
  },
  created() {
    this.getList()
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.m-transfer {
  .el-pagination {
    padding: 7px 5px;
  }

  .dialog-footer {
    text-align: right;
    padding: 1.5rem 1rem 0;
  }
}
</style>
