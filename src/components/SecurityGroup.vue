<template>
	<div class="security flex">
		<header class="flex flex-item">
	  		<span>安全组列表</span>
	  		<section class="btns">
	  			<el-button type="info" plain @click="getList"> <i class="el-icon-refresh"></i></el-button>
	  			<el-button type="primary" @click="createFormVisible = true">创建安全组</el-button>
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
			      width="260">
			      <template slot-scope="scope">
			      	<p>{{ scope.row.SecurityGroupId }}</p>
			      	<p>{{ scope.row.SecurityGroupName }}</p>
			      </template>
			    </el-table-column>
			    
			    <!--<el-table-column
			      prop="ZoneId"
			      label="所属专有网络"
			      width="140">
			    </el-table-column>-->
			    
			    <!--<el-table-column
			      prop="ZoneId"
			      label="相关实例"
			      width="140">
			    </el-table-column>-->
			    
			    <el-table-column
			      prop="name"
			      label="网络类型"
			      filter-placement="bottom-end"
			      :filter-method="filterNetwork"
			      :filters="[{ text: '典型网络', value: 'classic' }, { text: '专有网络', value: 'vpc-hp324towxhdgv30vfnq4j' }]"
			      :filter-multiple = "false"
			      width="180">
			      <template slot-scope="scope">
			        <el-tag disable-transitions>{{scope.row.VpcId === 'vpc-hp324towxhdgv30vfnq4j' ? '专有网络' : '典型网络'}}</el-tag>
			      </template>
			    </el-table-column>
			    
			    <el-table-column
			      label="创建时间"
			      width="240">
			      <template slot-scope="scope">
			      	<p>{{ scope.row.CreationTime }}</p>
			      </template>
			    </el-table-column>
			    
			    <el-table-column
			      prop="name"
			      label="描述"
			      filter-placement="bottom-end"
			      :filter-multiple = "false"
			      width="240">
			      <template slot-scope="scope">
			      	<p>{{ scope.row.Description }}</p>
			      </template>
			    </el-table-column>
			    
			    <el-table-column label="操作">
			      <template slot-scope="scope">
			        <el-button size="mini" @click="editClick(scope.row)">修改</el-button>
			        <el-button size="mini" @click="modifyClick(scope.row)">克隆</el-button>
			        <el-button size="mini" ><div @click="manaDateHandle(1, scope.row.SecurityGroupId)">管理实例</div></el-button>
			        <el-button size="mini" ><div @click="manaDateHandle(0, scope.row.SecurityGroupId)">配置规则</div></el-button>
			      </template>
			    </el-table-column>
			</el-table>
			<div class="bottom flex flex-item">
			  	<section>
				  	<el-button size="mini" :disabled="!status.start" @click="deleteSecurityHandle">删除</el-button>
				</section>
			  	<el-pagination
			      
			      :current-page="pagination.PageNumber"
			      :page-sizes="[10, 50, 100]"
			      :page-size="pagination.PageSize"
			      layout="total, sizes, prev, pager, next"
			      :total="pagination.TotalCount"
			      @size-change="handleSizeChange"
			      @current-change="handleCurrentChange">
			    </el-pagination>
			</div>
			<el-dialog class="dialog_create" title="创建安全组" :visible.sync="createFormVisible">
			  	<el-form :model="form" :rules="formRule" ref="form">
				    <!--<el-form-item label="模板" :label-width="formLabelWidth">
				      <el-select v-model="form.template" placeholder="请选择活动区域">
				        <el-option label="Web Server Linux" value="Web Server Linux"></el-option>
				        <el-option label="Web_Server_Windows" value="Web_Server_Windows"></el-option>
				      </el-select>
				    </el-form-item>-->
				    <el-form-item label="安全组名称" prop="name" :label-width="formLabelWidth" >
				      <el-input v-model="form.name" autocomplete="off"></el-input>
				      <span>长度为2-128个字符，不能以特殊字符及数字开头，只可包含特殊字符中的"."、"_"、"-"和":"。</span>
				    </el-form-item>
				    <!--<el-form-item label="描述" :label-width="200">
				      <el-input type="textarea" rows="7" :maxlength="256" resize="none" v-model="form.describe" autocomplete="off"></el-input>
				      <span>长度为2-256个字符，不能以http://或https://开头。</span>
				    </el-form-item>
				    <el-form-item label="网络类型" :label-width="formLabelWidth">
				      <el-select v-model="form.netstyle" placeholder="请选择活动区域">
				        <el-option label="经典网络" value="shanghai"></el-option>
				        <el-option label="专有网络" value="beijing"></el-option>
				      </el-select>
				    </el-form-item>-->
			  	</el-form>
				<div slot="footer" class="dialog-footer">
				    <el-button @click="createFormVisible = false">取 消</el-button>
				    <el-button type="primary" @click="createHandle('form')">确 定</el-button>
				</div>
			</el-dialog>
			
			<el-dialog class="dialog_create" title="修改安全组" :visible.sync="editShowVisible">
			  	<el-form :model="editForm" :rules="formRule" ref="editForm">
				    <!--<el-form-item label="模板" :label-width="formLabelWidth">
				      <el-select v-model="form.template" placeholder="请选择活动区域">
				        <el-option label="Web Server Linux" value="Web Server Linux"></el-option>
				        <el-option label="Web_Server_Windows" value="Web_Server_Windows"></el-option>
				      </el-select>
				    </el-form-item>-->
				    <el-form-item label="安全组名称" prop="editName" :label-width="formLabelWidth" >
				      <el-input v-model="editForm.editName" autocomplete="off"></el-input>
				      <span>长度为2-128个字符，不能以特殊字符及数字开头，只可包含特殊字符中的"."、"_"、"-"和":"。</span>
				    </el-form-item>
				    <el-form-item label="描述" :label-width="200">
				      <el-input type="textarea" rows="7" :maxlength="256" resize="none" v-model="editForm.editDescrip" autocomplete="off"></el-input>
				      <span>长度为2-256个字符，不能以http://或https://开头。</span>
				    </el-form-item>
				    <!--<el-form-item label="网络类型" :label-width="formLabelWidth">
				      <el-select v-model="form.netstyle" placeholder="请选择活动区域">
				        <el-option label="经典网络" value="shanghai"></el-option>
				        <el-option label="专有网络" value="beijing"></el-option>
				      </el-select>
				    </el-form-item>-->
			  	</el-form>
				<div slot="footer" class="dialog-footer">
				    <el-button @click="editShowVisible = false">取 消</el-button>
				    <el-button type="primary" @click="confirmEditHandle">确 定</el-button>
				</div>
			</el-dialog>
			<el-dialog class="dialog_create" title="克隆安全组" :visible.sync="modifyShowVisible">
			  	<el-form :model="editForm" :rules="formRule" ref="editForm">
				    <!--<el-form-item label="模板" :label-width="formLabelWidth">
				      <el-select v-model="form.template" placeholder="请选择活动区域">
				        <el-option label="Web Server Linux" value="Web Server Linux"></el-option>
				        <el-option label="Web_Server_Windows" value="Web_Server_Windows"></el-option>
				      </el-select>
				    </el-form-item>-->
				    <el-form-item label="安全组名称" prop="editName" :label-width="formLabelWidth" >
				      <el-input v-model="editForm.editName" autocomplete="off"></el-input>
				      <span>长度为2-128个字符，不能以特殊字符及数字开头，只可包含特殊字符中的"."、"_"、"-"和":"。</span>
				    </el-form-item>
				    <el-form-item label="描述" :label-width="200">
				      <el-input type="textarea" rows="7" :maxlength="256" resize="none" v-model="editForm.editDescrip" autocomplete="off"></el-input>
				      <span>长度为2-256个字符，不能以http://或https://开头。</span>
				    </el-form-item>
				    <!--<el-form-item label="网络类型" :label-width="formLabelWidth">
				      <el-select v-model="form.netstyle" placeholder="请选择活动区域">
				        <el-option label="经典网络" value="shanghai"></el-option>
				        <el-option label="专有网络" value="beijing"></el-option>
				      </el-select>
				    </el-form-item>-->
			  	</el-form>
				<div slot="footer" class="dialog-footer">
				    <el-button @click="modifyShowVisible = false">取 消</el-button>
				    <el-button type="primary" @click="confirmModifyHandle">确 定</el-button>
				</div>
			</el-dialog>
  		</div>
	</div>
</template>

<script>
export default {
  name: 'instance',
  data () {
  	var validName = (rule, value, callback) => {
	    if (value === '') {
	      callback(new Error('请输入安全组名称'));
	    } else {
	      callback();
	    }
	};
    return {
    	data: [],
    	pagination: {
	    	PageNumber: 1,
	    	PageSize: 10,
	    	TotalCount: 0
	    },
	    createFormVisible: false,
	    editShowVisible: false,
	    modifyShowVisible: false,
	    form: {
	    	template: '',
	    	name: '',
	    	describe: '',
	    	netstyle: ''
	    },
	    editForm: {
	    	editName: '',
	    	editDescrip: ''
	    },
	    status: {
	    	start: false
	    },
	    selection: [],
	    itemGroupInfo: {},
	    modifyInfo: {},
	    formRule: {
          name: [{ validator: validName, trigger: 'blur' }],
        }
    }
  },
  methods:  {
  	manaDateHandle(id, sid) {
		this.$router.push({  path:'dataManages', })
  		localStorage.setItem('id', id);
  		localStorage.setItem('sid', sid);
  	},
  	async getList (noreset) {
  	  if(!noreset) this.data = []
  	  const data = await this.$http.security_list({
  	  	PageNumber: this.pagination.PageNumber,
  	  	PageSize: this.pagination.PageSize
  	  })
  	  this.data = data.SecurityGroups.SecurityGroup
  	  this.pagination.TotalCount = data.TotalCount
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
  		console.log(i)
  		this.pagination.PageNumber = i
  		this.getList()
  	},
    filterCharge(value, row) {
        return row.InstanceChargeType === value
    },
    filterNetwork(value, row) {
        return row.VpcId === value
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
  	modifyClick(item) {
  		this.modifyShowVisible = true
  		this.modifyInfo = item
  		this.editForm.editName = item.SecurityGroupName
	    this.editForm.editDescrip = item.Description
  		console.log(this.modifyInfo)
  	},
  	confirmModifyHandle() {
  		
  		this.$http.edit_security_group({
			SecurityGroupId: this.modifyInfo.SecurityGroupId,
			SecurityGroupName: this.editForm.editName,
			Description: this.editForm.editDescrip
		}).then((res) => {
			if(res.RequestId) {
				this.modifyShowVisible = false
			  	this.getList()
			}
		})
  	},
  	deleteSecurityHandle() {  // 删除安全组
  		let arr = []
    	this.selection.map((v, i) => {
    		arr.push(this.$http.delete_security_group({
    			SecurityGroupId: v.SecurityGroupId
    		}))
    	})
    	Promise.all(arr).then(res => {
    		this.getList(true)
    		this.resetStatus()
    	})
  		
  	},
  	createHandle (formName) {
  		this.$refs[formName].validate((valid) => {
  			if(valid) {
				this.$http.create_security({
			  		setSecurityGroupName: this.form.name
			  	}).then((res) => {
			  		if(res.RequestId) {
			  			this.createFormVisible = false
			  			this.getList()
			  		}
			  	})
  			}else {
  				
  			}
  		})
	},
	editClick(item) {  
		this.editShowVisible = true
		this.itemGroupInfo = item
		this.editForm.editName = item.SecurityGroupName
		this.editForm.editDescrip = item.Description
	},
	confirmEditHandle() {
		this.$http.edit_security_group({
			SecurityGroupId: this.itemGroupInfo.SecurityGroupId,
			SecurityGroupName: this.editForm.editName,
			Description: this.editForm.editDescrip
		}).then((res) => {
			if(res.RequestId) {
				this.editShowVisible = false
			  	this.getList()
			}
		})
	}
  },
  created () {
  	this.getList()
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