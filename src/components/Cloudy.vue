<template>
  <div class="m-cloudy flex">
  	<header  class="flex flex-item">云助手</header>
  	<div class="content">
  		<section class="btns">
  			<el-button type="primary" @click='showShell'>新建命令</el-button>
  			<!-- <el-button @click="deleteShell" :disabled="!selection.length">删除命令</el-button> -->
  		</section>
  		<el-table
		    ref="multipleTable"
		    :data="data"
		    :height="340"
		    element-loading-text="拼命加载中"
    		element-loading-spinner="el-icon-loading"
    		element-loading-background="rgba(0, 0, 0, 0.3)"
		    v-loading="!data"
		    tooltip-effect="dark"
		    style="width: 100%"
		    class="m-table"
		    >
		    <el-table-column label="命令Id/名称">
		      <template slot-scope="scope">
		      	<p>{{ scope.row.CommandId }}</p>
		      	<p>{{ scope.row.Name }}</p>
		      </template>
		    </el-table-column>
		    <el-table-column prop="Description" label="描述" width="240"></el-table-column>
		    <el-table-column prop="Type" label="命令类型" width="120"></el-table-column>
		    <el-table-column label="命令内容" width="120" align="center">
		      <template slot-scope="scope">
		      	<i class="el-icon-tickets" @click="showCommandList(scope.row.CommandContent)"></i>
		      </template>
		    </el-table-column>
		    <!-- <el-table-column
		      prop="name"
		      label="支持操作系统"
		      width="120">
		    </el-table-column> -->
		    <el-table-column prop="WorkingDir" label="执行路径" width="200"></el-table-column>
		    <el-table-column prop="Timeout" label="超时时间（秒）" width="140"></el-table-column>
		    <el-table-column label="操作">
		      <template slot-scope="scope">
		        <el-button
		          size="mini"
		          @click="showDoingShell(scope.row, scope.$index)"
		        >执行</el-button>
		        <el-button
		          size="mini"
		          type="danger"
		          @click="showDeleteShell(scope.row.CommandId)"
		        >删除</el-button>
		      </template>
		    </el-table-column>
		  </el-table>
		  <div class="bottom flex flex-item">
		  	<el-pagination
		      @size-change="handleSizeChange"
		      @current-change="handleCurrentChange"
		      :current-page="pagination.PageNumber"
		      :page-sizes="[10, 50]"
		      :page-size="pagination.PageSize"
		      layout="total, sizes, prev, pager, next"
		      :total="pagination.TotalCount">
		    </el-pagination>
		  </div>
  	</div>
  	<div class="content">
  		<p style="margin: .6rem 0">执行记录</p>
  		<el-table
		    ref="multipleTable"
		    :data="history"
		    :height="340"
		    element-loading-text="拼命加载中"
    		element-loading-spinner="el-icon-loading"
    		element-loading-background="rgba(0, 0, 0, 0.3)"
		    v-loading="!history"
		    tooltip-effect="dark"
		    style="width: 100%"
		    class="m-table"
		    >
		    <el-table-column prop="InvokeStatus" label="执行状态" width="120"></el-table-column>
		    <el-table-column prop="InvokeId" label="命令执行ID"></el-table-column>
		    <el-table-column label="命令Id/名称">
		      <template slot-scope="scope">
		      	<p>{{ scope.row.CommandId }}</p>
		      	<p>{{ scope.row.CommandName }}</p>
		      </template>
		    </el-table-column>
		    <el-table-column prop="CommandType" label="命令类型" width="160"></el-table-column>
		    <el-table-column label="周期性执行" width="100" align="center">
		      <template slot-scope="scope">
		      	{{ scope.row.Timed ? '是' : '否'}}
		      </template>
		    </el-table-column>
		    <el-table-column prop="Frequency" label="执行频率" width="100"></el-table-column>
		    <el-table-column label="目标实例" width="120" align="center">
		      <template slot-scope="scope">
		      	<p>{{ scope.row.InvokeInstances.InvokeInstance.length }}</p>
		      </template>
		    </el-table-column>
		    <el-table-column label="操作">
		      <template slot-scope="scope">
		        <el-button
		          size="mini"
		          @click="getResult(scope.row.InvokeId, scope.$index)"
		        >查看结果</el-button>
		        <el-button
		          size="mini"
		          type="danger"
		          v-if="scope.row.InvokeStatus === 'Running'"
		          @click="stopCommand(scope.row)"
		        >停止执行</el-button>
		      </template>
		    </el-table-column>
		  </el-table>
		  <div class="bottom flex flex-item">
		  	<el-pagination
		      @size-change="historySizeChange"
		      @current-change="historyCurrentChange"
		      :current-page="pagination_history.PageNumber"
		      :page-sizes="[10, 50]"
		      :page-size="pagination_history.PageSize"
		      layout="total, sizes, prev, pager, next"
		      :total="pagination_history.TotalCount">
		    </el-pagination>
		</div>
  	</div>

  	<el-dialog
	  title="命令内容"
	  width="440px"
	  :visible.sync="dialogVisible">
	  <div ref="command">
	  	<editor :show="dialogVisible"></editor>
	  </div>
	</el-dialog>

	<el-dialog
	  title="命令执行结果"
	  width="600px"
	  @change="selectResult"
	  :visible.sync="showResult">
	  <p style="margin-bottom: 1rem">此命令进程在{{ results.length }}个实例上运行，其中:执行完成: {{ currentResult.Finished }} | 进行中: {{ currentResult.Running }} | 手动停止: {{ currentResult.Stopped }} | 执行失败: {{ currentResult.Failed }}</p>
	  <el-collapse v-model="activeNames" @change="handleChange" v-if="showResult">
		  <el-collapse-item :title="item.InvokeRecordStatus + '(' + item.InstanceId + ')'" :name="index" v-for="(item, index) in results" :key="index">
		  <editor class="result-item" v-if="item.Output" />
		  <div v-else  class="result-item">暂无任何输出</div>
		  </el-collapse-item>
	  </el-collapse>
	  <div class="bottom flex flex-item">
		  	<el-pagination
			  small
			  :page-size="10"
			  @current-change="resultCurrentChange"
      		  :current-page="resultPage"
			  layout="prev, pager, next"
			  :total="total">
			</el-pagination>
		</div>
	</el-dialog>

	<el-dialog
	  title="提示"
	  width="440px"
	  :visible.sync="dialogDelete">
	  <span>是否删除命令？</span>
	  <span slot="footer" class="dialog-footer">
	    <el-button @click="dialogDelete = false">取 消</el-button>
	    <el-button type="primary" @click="deleteShell">确 定</el-button>
	  </span>
	</el-dialog>

	<CmdCreate :showCreate="showCreate" />
	<CmdDoing :showDoing="showDoing" :data="currentItem" :showCommand="showCommandList" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import editor from './items/ACE'
import CmdCreate from './items/CmdCreate'
import CmdDoing from './items/CmdDoing'
export default {
  name: 'home',
  data () {
    return {
    	time: null,
    	data: null,
    	history: null,
    	dialogVisible: false,
    	dialogDelete: false,
    	CommandId: null,
    	currentItem: {},
    	selection: [],
    	pagination: {
    		PageNumber: 1,
	    	PageSize: 10,
	    	TotalCount: 0
    	},
    	pagination_history: {
    		PageNumber: 1,
	    	PageSize: 10,
	    	TotalCount: 0
    	},
    	resultPage: 1,
    	total: 1,
    	showCreate: false,
    	showDoing: false,
    	showResult: false,
    	results: [],
    	activeNames: [],
    	currentResult: {}
    }
  },
  watch: {
  	showResult(val) {
  		if (!val) this.activeNames = []
  	},
  	activeNames (val, old) {
  		if (old.length >= val.length) return
  		let num
  		val.map((v, i) => {
  			if (old.indexOf(v) < 0) {
  				return num = i
  			}
  		})

  		const {Output} = this.results[num]
  		if (Output) {
  			this.showCommand(Output, $('.result-item')[num])
  		}
  	}
  },
  components: {
  	editor,
  	CmdCreate,
  	CmdDoing
  },
  methods: {
  	showCommandList (code) {
  		this.showCommand(code)
  		this.dialogVisible = true
  	},
  	showCommand (code, elem) {
  		clearInterval(this.time)
  		this.time = setInterval(()=> {
  			const ele = elem || this.$refs.command
  			const iframe = $(ele).find('iframe')[0]
  			if (iframe) {
  				console.log(code)
  				iframe.contentWindow.postMessage({ code }, '*')
  				clearInterval(this.time)
  			}
  		}, 500)
  	},
  	selectResult(val) {
  		console.log(val)
  	},
  	showShell () {
  		this.showCreate = true
  	},
  	showDeleteShell (CommandId) {
  		this.CommandId = CommandId
  		this.dialogDelete = true
  	},
  	showDoingShell (item, index) {
  		this.currentItem = item
  		this.showDoing = true
  	},
  	deleteShell () {
  		this.$http.delete_command({
  			CommandId: this.CommandId
  		}).then(res => {
  			this.$message.success('删除成功！')
  			this.getCommandList()
  			this.dialogDelete = false
  		}).catch(()=>{
  			this.$message.error('删除失败！')
  			this.dialogDelete = true
  		})
  	},
  	handleSizeChange (i) {
  		this.pagination.PageSize = i
  		this.getCommandList()
  	},
  	handleCurrentChange (i) {
  		this.pagination.PageNumber = i
  		this.getCommandList()
  	},
  	historySizeChange (i) {
		this.pagination_history.PageSize = i
		this.getCommandHistory()
  	},
  	historyCurrentChange (i) {
  		this.pagination_history.PageNumber = i
  		this.getCommandHistory()
  	},
  	resultCurrentChange (i) {
  		this.resultPage = i
  		this.getResult(this.currentInvokeId)
  	},
  	stopCommand (item) {
  		const arr = []
  		item.InvokeInstances.InvokeInstance.map((v, i) => {
  			arr.push(v.InstanceId)
  		})
  		this.$http.command_stop({
			InstanceIds:arr.join(','),
			InvokeId:item.InvokeId
  		}).then(res => {
  			this.$message.success('停止执行成功！')
  			this.getCommandHistory()
  		}).catch(e =>{
  			this.$message.error('停止执行失败！')
  		})
  	},
  	getResult (InvokeId) {
  		this.currentInvokeId = InvokeId
  		this.showResult = true
  		this.$http.command_result({
  			PageNumber: this.resultPage,
  			PageSize: 10,
  			InvokeId,
  		}).then(res => {
  			this.results = res.Invocation.InvocationResults.InvocationResult
  			this.total = res.Invocation.TotalCount
  			let Finished = 0
  			let Failed = 0
  			let Stopped = 0
  			let Running = 0
  			this.results.map((v,i) => {
  				switch(v.InvokeRecordStatus) {
  					case 'Finished':
  						Finished++
  						break
  					case 'Failed':
  						Failed++
  						break
  					case 'Running':
  						Running++
  						break
  					default:
  						Stopped++
  				}
  				this.currentResult = {Finished, Failed, Stopped, Running}
  			})
  		})
  	},
  	async getCommandHistory () {
  		this.history = null
  		const data = await this.$http.command_history({
  			PageNumber: this.pagination_history.PageNumber,
  	  		PageSize: this.pagination_history.PageSize
  		})
  		if (data.Invocations) {
  			this.history = data.Invocations.Invocation
  			this.pagination_history.TotalCount = data.TotalCount
  		}
  	},
  	async getCommandList () {
  		this.data = null
  		const data = await this.$http.command_list({
  			PageNumber: this.pagination.PageNumber,
  	  		PageSize: this.pagination.PageSize
  		})
  		if (data.Commands) {
  			this.data = data.Commands.Command
  			this.pagination.TotalCount = data.TotalCount
  		}

  	},
  	submitCreateCommand () {
  		this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.$http.create_command(this.ruleForm)
            .then(res => {
            	this.showCreate = false
            	this.$message.success('创建成功')
            }).catch(()=>{
            	this.showCreate = false
            	this.$message.error('创建失败')
            })
          } else {
            return false;
          }
        })
  	}
  },
  created () {
  	this.getCommandList()
  	this.getCommandHistory()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
 .m-cloudy {
 	.el-collapse {
 		max-height: 20rem;
 		overflow-y: auto;
 	}
 	.bottom.flex {
		height: 3rem;
		justify-content: flex-end;
	}
	.el-icon-tickets {
		font-size: .9rem;
		cursor: pointer
	}
	.btns {
		.el-button {
			padding: .4rem .5rem
		}
	}
	.el-table {
		z-index: 0
	}
  }
</style>
