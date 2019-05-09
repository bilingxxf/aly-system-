<template>
  <div class="instance flex">
  	<header class="flex flex-item">
  		<span>实例</span>
  		<section class="btns">
  			<el-button type="info" plain @click="getList"><i class="el-icon-refresh"></i></el-button>
  			<el-button type="primary" @click='gotoCreateinstance'>创建实例</el-button>
  			<!-- <el-button type="primary">批量操作</el-button> -->
  		</section>
  	</header>
  	<div class="content">
  		 <el-table
		    ref="multipleTable"
		    :data="data"
		    element-loading-text="拼命加载中"
    		element-loading-spinner="el-icon-loading"
    		element-loading-background="rgba(0, 0, 0, 0.3)"
		    v-loading="!data"
		    tooltip-effect="dark"
		    style="width: 100%"
		    class="m-table"
		    @selection-change="handleSelectionChange">
		    <el-table-column
		      type="selection"
		      width="55">
		    </el-table-column>
		    <el-table-column
		      label="实例Id/名称"
		      width="180">
		      <template slot-scope="scope">
		      	<p>{{ scope.row.InstanceId }}</p>
		      	<p>{{ scope.row.InstanceName }}</p>
		      </template>
		    </el-table-column>

		    <el-table-column
		      prop="ZoneId"
		      label="可用区"
		      width="140">
		    </el-table-column>

		    <el-table-column
		      label="IP地址"
		      width="180">
		      <template slot-scope="scope">
		      	<p>{{ scope.row.PublicIpAddress.IpAddress[0] }}(公用)</p>
		      	<p>{{ scope.row.VpcAttributes.PrivateIpAddress.IpAddress[0] }}(私有)</p>
		      </template>
		    </el-table-column>

		    <el-table-column
		      label="系统信息"
		      width="180">
		      <template slot-scope="scope">
						<el-tooltip class="item" effect="dark" :content="scope.row.OSName" placement="top">
							<img class="img" v-if="scope.row.OSType == 'windows'" src="../../static/images/win.png"/>
							<img class="img" v-else src="../../static/images/linux.png"/>
						</el-tooltip>
		      </template>
		    </el-table-column>

		    <el-table-column
		      prop="name"
		      label="状态"
		      filter-placement="bottom-end"
		      :filter-method="filterStatus"
		      :filters="[{ text: 'Stopped', value: 'Stopped' }, { text: 'Running', value: 'Running' }]"
		      :filter-multiple = "false"
		      width="120">
		      <template slot-scope="scope">
		        <el-tag disable-transitions>{{scope.row.Status}}</el-tag>
		      </template>
		    </el-table-column>
		    <el-table-column
		      prop="name"
		      label="网络类型"
		      filter-placement="bottom-end"
		      :filter-method="filterNetwork"
		      :filters="[{ text: '典型网络', value: 'classic' }, { text: '专有网络', value: 'vpc' }]"
		      :filter-multiple = "false"
		      width="120">
		      <template slot-scope="scope">
		        <el-tag disable-transitions>{{scope.row.InstanceNetworkType === 'vpc' ? '专有网络' : '典型网络'}}</el-tag>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="配置"
		      width="160">
		      <template slot-scope="scope">
		        {{scope.row.Cpu}} vCPU {{scope.row.Memory % 1024 === 0 ? (scope.row.Memory / 1024 + ' GB')  : scope.row.Memory % 1024 + ' MB'}} (I/O优化) {{ scope.row.InstanceType }}
		      </template>
		    </el-table-column>
		    <el-table-column
		      prop="name"
		      label="付费方式"
		      filter-placement="bottom-end"
		      :filter-method="filterCharge"
		      :filters="[{ text: '包年包月', value: 'PrePaid' }, { text: '按量', value: 'PostPaid' }]"
		      :filter-multiple = "false"
		      width="200">
		      <template slot-scope="scope">
		        <p>{{scope.row.InstanceChargeType === 'PrePaid' ? '包年包月' : '按量'}}</p>
		        <p v-if="!scope.row.OutTime">
		        	{{ scope.row.InstanceChargeType === 'PrePaid' ? scope.row.ExpiredTime : scope.row.StartTime | timeFilter }}
		        	{{ scope.row.InstanceChargeType === 'PrePaid' ? '到期' : '创建' }}
		        </p>
		        <p class="red" v-else>已过期</p>
		      </template>
		    </el-table-column>
		    <el-table-column label="操作">
		      <template slot-scope="scope">
		        <el-button
		          size="mini"
		          type="danger"
		          v-if="scope.row.InstanceChargeType === 'PostPaid'"
		          @click="instanceDelete(scope.row, scope.$index)"
		        >释放</el-button>
		        <el-button
		          v-else
		          size="mini"
		          @click="gotoRenew(scope.row)"
		        >续费</el-button>
		        <el-button
		          size="mini"
		          type="danger"
		          v-if="!scope.row.CloudAssistantStatus && !scope.row.OutTime"
		          @click="installCloudy(scope.row, scope.$index)"
		        >安装云助手</el-button>
		      </template>
		    </el-table-column>
		  </el-table>
		  <div class="bottom flex flex-item">
		  	<section>
			  	<el-button size="mini" :disabled="!status.start" @click="statusChange('start')">启动</el-button>
			  	<el-button size="mini" :disabled="!status.stop" @click="statusChange('stop')">停止</el-button>
			  	<el-button size="mini" :disabled="!status.restart" @click="statusChange('restart')">重启</el-button>
			  	<el-button size="mini" :disabled="!status.reset" @click="dialogVisible = true">重置实例密码</el-button>
			  	<el-button size="mini" :disabled="!status.continue" @click="gotoContinue">续费</el-button>
			  	<el-button size="mini" :disabled="!status.transform" @click="gotoContinue">按量付费转包年包月</el-button>
			</section>
		  	<el-pagination
		      @size-change="handleSizeChange"
		      @current-change="handleCurrentChange"
		      :current-page="pagination.PageNumber"
		      :page-sizes="[10, 50, 100]"
		      :page-size="pagination.PageSize"
		      layout="total, sizes, prev, pager, next"
		      :total="pagination.TotalCount">
		    </el-pagination>
		  </div>
  	</div>

  	<el-dialog
	  title="修改密码"
	  :visible.sync="dialogVisible"
	  width="500px">
	  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
		  <el-form-item label="登录密码" prop="pwd">
		    <el-input v-model="ruleForm.pwd" :maxlength='30'></el-input>
		    <section class="reg" :class="pwdError ? 'red': ''">8-30个字符，必须同时包含下面四项中的三项：大写字母、小写字母、数字、和特殊字符（仅支持下列特殊字符： ( ) ` ~ ! @ # $ % ^ & * - _ + = | { } [ ] : ; ' < > , . ? / ）。其中，Windows 实例不能以斜线号（/）为密码首字符。</section>
		  </el-form-item>
		  <el-form-item label="确认密码" prop="spwd">
		    <el-input v-model="ruleForm.spwd"></el-input>
		  </el-form-item>
	  </el-form>
	  <div class="reg red">你所选择的实例将执行重置密码操作，您是否确认操作？</div>
	  <ul class="instance-list">
	  	<li v-for="item in selection">{{ item.InstanceId }} {{ item.InstanceName }}</li>
	  </ul>
	  <span slot="footer" class="dialog-footer">
	    <el-button @click="dialogVisible = false">取 消</el-button>
	    <el-button type="primary" @click="submitForm">确 定</el-button>
	  </span>
	</el-dialog>
  </div>
</template>

<script>

export default {
  name: 'instance',
  data () {
  	const validatePass = (rule, value, callback) => {
  		const reg = /^[a-zA-Z\d-_&:;'<>,=%`~!@#\(\)\$\^\*\+\|\{\}\[\]\.\?\/]+$/
        if (!value || !reg.test(value) || value.length < 8) {
          this.pwdError = true
          callback(new Error(' '));
        } else {
          this.pwdError = false
          callback()
        }
     }

     const validatePassSecond = (rule, value, callback) => {
     	console.log(value, this.ruleForm.pwd)
        if (value !== this.ruleForm.pwd) {
          callback(new Error('两次输入的密码不一致，请重新输入一致的密码。'));
        } else {
          callback()
        }
     }

    return {
    	data: null,
    	pwdError: false,
    	pagination: {
	    	PageNumber: 1,
	    	PageSize: 10,
	    	TotalCount: 0
	    },
	    ruleForm: {

	    },
	    rules: {
          pwd: [
            { required: true, validator: validatePass, trigger: 'blur' }
          ],
          spwd: [
            { required: true, validator: validatePassSecond, trigger: 'blur' }
          ]
        },
	    status: {
	    	start: false,
	    	stop: false,
	    	restart: false,
	    	continue: false,
	    	reset: false,
	    	transform: false
	    },
	    selection: [],
	    dialogVisible: false
    }
  },
  watch: {
  	$route(to) {
  		this.$refs.multipleTable.clearSelection()
  	}
  },
  methods:  {
  	// async getList (noreset) {
  	//   if(!noreset) this.data = []
  	//   const data = await this.$http.instance_list({
  	//   	PageNumber: this.pagination.PageNumber,
  	//   	PageSize: this.pagination.PageSize
  	//   })
  	//   this.data = data.Instances.Instance
  	//   this.pagination.TotalCount = data.TotalCount
  	// },
  	async getList (noreset) {
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
	        v.CloudAssistantStatus = status[i].CloudAssistantStatus === 'true'
	        v.OutTime = new Date(v.ExpiredTime).getTime() < new Date().getTime()
	      })
	  }
      this.data = res
      this.pagination.TotalCount = data.TotalCount
  	},
  	installCloudy (item) {
  		this.$http.cloudy_install({
  			InstanceIds: item.InstanceId
  		}).then(res => {
  			this.$message.success('安装成功')
  		}).catch(e => {
  			this.$message.error('安装失败')
  		})
  	},
  	submitForm() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {

          } else {
            return false;
          }
        });
      },
  	success (text) {
  		 this.$message({
          message: text,
          type: 'success'
        });
  	},
  	gotoRenew (item) {
  		localStorage.InstanceIds = item.InstanceId
  		localStorage.buyMethod = 'continue'
  		this.$router.push('renew')
  	},
  	instanceDelete (item, i) {
  		this.$http.instance_delete({
  			InstanceId: item.InstanceId
  		}).then(res => {
  			this.data.splice(i, true)
  			this.success('释放成功')
  		})
  	},
  	handleSizeChange (i) {
  		this.pagination.PageSize = i
  		this.getList()
  	},
  	handleCurrentChange (i) {
  		this.pagination.PageNumber = i
  		this.getList()
  	},
  	filterStatus(value, row) {
        return row.Status === value
    },
    filterCharge(value, row) {
        return row.InstanceChargeType === value
    },
    filterNetwork(value, row) {
        return row.InstanceNetworkType === value
    },
    resetStatus () {
    	this.status = {
	    	start: false,
	    	stop: false,
	    	restart: false,
	    	continue: false,
	    	reset: false
	    }
    },
    statusChange (status) {
    	let arr = []
    	this.selection.map((v, i) => {
    		arr.push(this.$http[status]({
    			InstanceId: v.InstanceId
    		}))
    	})
    	Promise.all(arr).then(res => {
    		this.getList(true)
    		this.time = setInterval( async () => {
    			const data = await this.$http.instances_status()
    			const InstanceStatus = data.InstanceStatuses.InstanceStatus
    			let arr = []
    			for (let val of InstanceStatus) {
    				arr.push(val.Status)
    			}

    			if (!arr.includes('Starting') && !arr.includes('Stopping')) {
    				clearInterval(this.time)
    				this.getList(true)
    			}
    		}, 5000)
    	})
    },
    gotoContinue () {

    	let arr = ''
    	for (let val of this.selection) {
    		arr+=`${val.InstanceId},`
    	}
    	localStorage.InstanceIds = arr.replace(/\,$/, '')
    	localStorage.buyMethod = this.status.transform ? 'transform' : 'continue'
    	this.$router.push('renew')
    },
    gotoCreateinstance() {
    	this.$router.push('createinstance')
    },
  	handleSelectionChange (item) {
  		const { length } = item
  		this.selection = item
  		this.resetStatus()
  		if (length) {
  			let start = 0
  			let stop = 0
  			let InstanceChargeType = []
	  		for (let val of item) {
	  			if (val.Status === 'Running') {
	  				stop++
	  			} else if (val.Status === 'Stopped'){
	  				start++
	  			}
	  			InstanceChargeType.push(val.InstanceChargeType)
	  		}

	  		if (length === start) {
	  			this.status.start = true
	  		}
	  		if (length === stop) {
	  			this.status.stop = true
	  			this.status.restart = true
	  		}

	  		if (InstanceChargeType.includes('PostPaid')) {
	  			this.status.continue = false
	  		} else {
	  			this.status.continue = true
	  		}

	  		if (InstanceChargeType.includes('PrePaid')) {
	  			this.status.transform = false
	  		} else {
	  			this.status.transform = true
	  		}
	  		this.status.reset = true
	  	}
  	}
  },
  created () {
  	this.getList()
  },
  beforeDestroy () {
  	clearInterval(this.time)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.instance {
	flex-direction: column;
	flex: 1;
	padding: .3rem 1rem;
	font-size: .75rem;
	.red {
		color: red
	}
	header {
		flex: 0 0 2.4rem;
		justify-content: space-between;
	}
	.el-button {
		padding: .4rem .5rem;
	}
	.bottom.flex {
		height: 3rem;
		justify-content: space-between;
	}
	.reg {
		line-height: 1.5;
		font-size: .6rem;
		margin-top: .3rem;
		&.red {
			color: #f56c6c
		}
	}
	.el-dialog__body {
		padding: 1.5rem 2rem;
	}
	.instance-list {
		list-style: none;
	    margin: .4rem 0;
	    border: 1px solid #DDD;
	    background-color: #FAFAFA;
	    max-height: 4rem;
	    overflow-y: auto;
	    li {
		    height: 1.6rem;
		    line-height: 1.6rem;
		    border-bottom: 1px solid #EEE;
		    text-indent: .6rem;
		}
	}
}
</style>
