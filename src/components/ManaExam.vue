<template>
	<div class="security flex">
		<header class="flex flex-item">
	  		<span>实例</span>
	  		<section class="btns">
	  			<el-button type="info" plain @click="getList"> <i class="el-icon-refresh"></i></el-button>
	  			<el-button type="primary" @click="createFormVisible = true">添加实例</el-button>
	  		</section>
	  	</header>
  		<div class="content security_tab">
	  		<el-table
			    ref="multipleTable"
			    :data="data"
			    element-loading-text="拼命加载中"
	    		element-loading-spinner="el-icon-loading"
	    		element-loading-background="rgba(0, 0, 0, 0.3)"
			    v-loading="!data.length"
			    tooltip-effect="dark"
			    style="width: 100%"
			    class="m-table"
			    @selection-change="handleSelectionChange">
			    <el-table-column
			      type="selection"
			      width="55">
			    </el-table-column>
			    <el-table-column
			      label="安全组ID/名称"
			      width="350">
			      <template slot-scope="scope">
			      	<p>{{ scope.row.InstanceId }}</p>
			      	<p>{{ scope.row.InstanceName }}</p>
			      </template>
			    </el-table-column>
			    <el-table-column
			      prop="ZoneId"
			      label="可用区"
			      width="350">
			    </el-table-column>			    
			    <el-table-column
			      label="IP地址"
			      width="390">
			      <template slot-scope="scope">
			      	<p>{{ scope.row.PublicIpAddress.IpAddress[0] }}(公用)</p>
		      		<p>{{ scope.row.VpcAttributes.PrivateIpAddress.IpAddress[0] }}(私有)</p>
			      </template>
			    </el-table-column>
			    <el-table-column
			      prop="name"
			      label="网络类型"
			      filter-placement="bottom-end"
			      :filter-method="filterNetwork"
			      :filters="[{ text: '典型网络', value: 'classic' }, { text: '专有网络', value: 'vpc' }]"
			      :filter-multiple = "false"
			      width="400">
			      <template slot-scope="scope">
			        <el-tag disable-transitions>{{scope.row.InstanceNetworkType === 'vpc' ? '专有网络' : '典型网络'}}</el-tag>
			      </template>
			    </el-table-column>
			</el-table>
			<div class="bottom flex flex-item">
			  	<section>
				  	<el-button size="mini" :disabled="!status.start" @click="removeSecurityHandle">移除安全组</el-button>
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
			<el-dialog class="dialog_create" title="添加实例" :visible.sync="createFormVisible">
			  	<el-form :model="form" :rules="formRule" ref="form">
				   	<el-form-item prop="instanceId" label="实例ID" :label-width="formLabelWidth">
				      <el-select v-model="form.instanceId" placeholder="请填写实例ID">
				        <el-option v-for="(item, index) in instanceIdList" :value="item.InstanceId" :key="index"  :label="item.InstanceId"></el-option>
				      </el-select>
				    </el-form-item>
			  	</el-form>
				<div slot="footer" class="dialog-footer">
				    <el-button @click="cancelCreateHandle">取 消</el-button>
				    <el-button type="primary" @click="createHandle('form')">确 定</el-button>
				</div>
			</el-dialog>
			
			<el-dialog class="dialog_create" title="修除安全组" :visible.sync="removeVisible">
			  	<p>确定要将执行所选实例移除安全组吗？</p>
				<div slot="footer" class="dialog-footer">
				    <el-button @click="removeVisible = false">取 消</el-button>
				    <el-button type="primary" @click="confirmRemove">确 定</el-button>
				</div>
			</el-dialog>
  		</div>
	</div>
</template>

<script>
export default {
  name: 'instance',
  data () {
  	var validInsatnceId = (rule, value, callback) => {
	    if (value === '') {
	      callback(new Error('请选择实例ID'));
	    } else {
	      callback();
	    }
	};
    return {
    	data: [],
    	securityId: null, // 安全组id
    	instanceIdList: [],
    	pagination: {
	    	PageNumber: 1,
	    	PageSize: 10,
	    	TotalCount: 0
	    },
	    createFormVisible: false,
	    removeVisible: false,
	    form: {
	    	instanceId: null
	    },
	    status: {
	    	start: false
	    },
	    selection: [],
	    itemGroupInfo: {},
	    formRule: {
          instanceId: [{  required: true, message: '请选择实例ID	', trigger: 'change'  }],
       },
    }
  },
  methods:  {
  	async getList (noreset) {
  		this.data = []
 		const data = await this.$http.instance_list({
  			PageNumber: this.pagination.PageNumber,
  			PageSize: this.pagination.PageSize
  	  	})
 		let secInfo = data.Instances.Instance
	  	secInfo.map((v, i) => {
    		secInfo[i].SecurityGroupIds.SecurityGroupId.map((item, j) => {
    			if(item == this.securityId) {
    				this.data.push(v)
    			}
    		})
    	})
	  	
	  	this.$http.status({}).then(res=> {
	  		this.instanceIdList = res.InstanceStatuses.InstanceStatus
	  	})
  	},
  	success (text) {
  		 this.$message({
          message: text,
          type: 'success'
        });
  	},
  	handleSizeChange (i) {
  		this.pagination.PageSize = i
  		this.getList()
  	},
  	handleCurrentChange (i) {
  		this.pagination.PageNumber = i
  		this.getList()
  	},
    filterNetwork(value, row) {
        return row.InstanceNetworkType === value
    },
    resetStatus () {
    	this.status = {
	    	start: false
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
    	})
    },
  	handleSelectionChange (item) {
  		const { length } = item
  		this.selection = item
  		this.resetStatus()
  		if (length) this.status.start = true
	  	
  	},
  	removeSecurityHandle() {  // 删除安全组
  		this.removeVisible = true
  	},
  	confirmRemove() {  // 确定移除安全组
  		let arr = []
    	this.selection.map((v, i) => {
    		arr.push(this.$http.instanceout({
    			SecurityGroupId: this.securityId,
    			InstanceId: v.InstanceId
    		}))
    	})
    	Promise.all(arr).then(res => {
    		this.success('移除成功！')
			this.getList(true)
			this.resetStatus()
			this.removeVisible = false
    	})
  	},
  	createHandle (formName) {
  		this.$refs[formName].validate((valid) => {
  			if(valid) {
				this.$http.joinInsatnce({
			  		InstanceId: this.form.instanceId,
			  		SecurityGroupId: this.securityId
			  	}).then((res) => {
			  		if(res.RequestId) {
			  			this.createFormVisible = false
			  			this.getList()
						this.$refs[formName].resetFields();
			  		}
			  	})
			}
  		})
	},
	cancelCreateHandle() {
		this.createFormVisible = false
		this.$refs['form'].resetFields();
	}
	},
  	created () {
  		this.getList()
  		this.securityId = localStorage.getItem('sid');
  	}
}
</script>

<style lang="scss" scoped>
.security {
	flex-direction: column;
	flex: 1;
	padding: .3rem 1rem;
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
	.cell {
		p {
			text-align: center;
		}
	}
}
</style>