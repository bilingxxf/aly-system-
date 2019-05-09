<template>
    <div class="sign-list flex">
  	<header class="flex flex-item">
  		<span>签名</span>
  		<section class="btns">
  			<el-button type="info" plain @click="getList"><i class="el-icon-refresh"></i></el-button>
  			<el-button type="primary" @click='createSign'>创建签名</el-button>
  			<!-- <el-button type="primary">批量操作</el-button> -->
  		</section>
  	</header>
  	<div class="content">
  		 <el-table
		    ref="multipleTable"
		    :data="list"
		    element-loading-text="拼命加载中"
    		element-loading-spinner="el-icon-loading"
    		element-loading-background="rgba(0, 0, 0, 0.3)"
		    v-loading="!list"
		    tooltip-effect="dark"
		    style="width: 100%"
		    class="m-table"
		    >
		    <el-table-column
		      prop="ali_name"
		      label="名称"
		      >
		    </el-table-column>
		    <el-table-column
		      prop="ali_host"
		      label="代理IP"
		      >
		    </el-table-column>
		    <el-table-column
		      prop="description"
		      label="描述"
		      width="400">
		    </el-table-column>
		    <el-table-column label="操作">
		      <template slot-scope="scope">
		        <el-button
		          size="mini"
		          @click="turn(scope.row)"
		        >切换</el-button>
		        <el-button
		          size="mini"
		          type="danger"
		          @click="selectSign(scope.row, scope.$index)"
		        >删除</el-button>
		      </template>
		    </el-table-column>
		  </el-table>
		  <div class="bottom flex flex-item">
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
		  title="提示"
		  :visible.sync="dialogVisible2"
		  width="30%"
		  :before-close="handleClose">
		  <span>是否确认删除签名？</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible2 = false">取 消</el-button>
		    <el-button type="primary" @click="deleteSign">确 定</el-button>
		  </span>
		</el-dialog>

		<el-dialog
		  title="创建签名"
		  :visible.sync="dialogVisible"
		  width="540px"
		  >
		  <el-form :model="signForm" status-icon :rules="rules" ref="ruleForm" label-width="" class="demo-ruleForm">
			  <el-form-item label="名称" prop="name">
			    <el-input v-model="signForm.name" autocomplete="off"></el-input>
			  </el-form-item>
			  <el-form-item label="代理IP" prop="host">
			    <el-input v-model="signForm.host" autocomplete="off"></el-input>
			  </el-form-item>
			  <el-form-item label="KEY" prop="key">
			    <el-input v-model="signForm.key"></el-input>
			  </el-form-item>
			  <el-form-item label="SECRET" prop="secret">
			    <el-input v-model="signForm.secret"></el-input>
			  </el-form-item>
			  <el-form-item label="描述" prop="description">
			    <el-input type="textarea" v-model="signForm.description"></el-input>
			  </el-form-item>
			  <el-form-item>
			    <el-button type="primary" @click="submitForm()">提交</el-button>
			    <el-button @click="resetForm('ruleForm')">重置</el-button>
			  </el-form-item>
		  </el-form>
		</el-dialog>

  </div>

</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'sign-list',
  data () {
    return {
    	signForm: {
    		name: '',
    		host: '',
    		key: '',
    		secret: '',
    		description: ''
    	},
    	pagination:{
    		PageNumber: 1,
	    	PageSize: 10,
	    	TotalCount: 0
    	},
    	dialogVisible: false,
    	dialogVisible2: false,
    	list: null,
    	item: {},
    	rules: {
    	  name: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
          // host: [
          //   { required: true, message: '请输入IP地址', trigger: 'blur' }
          // ],
          key: [
            { required: true, message: '请输入有效的KEY', trigger: 'blur' }
          ],
          secret: [
            { required: true, message: '请输入有效的SECRET', trigger: 'blur' }
          ],
          description: [
            { required: true, message: '请输入描述内容', trigger: 'blur' }
          ]
    	}
    }
  },
  watch: {
  	dialogVisible(val) {
  		if (!val) this.resetForm('ruleForm')
  	}
  },
  methods: {
  	async getList() {
  		const data = await this.$http.selfsign({
  			PageNumber: this.pagination.PageNumber,
  	  		PageSize: this.pagination.PageSize
  		})
  		if (!data.list.length) {
  			this.$message.error('请先创建签名！')
  		}
  		this.list = data.list
  		this.pagination.TotalCount = data.TotalCount
  	},
  	createSign() {
  		this.dialogVisible = true
  	},
  	handleSizeChange (i) {
  		this.pagination.PageSize = i
  		this.getList()
  	},
  	handleCurrentChange (i) {
  		this.pagination.PageNumber = i
  		this.getList()
  	},
  	selectSign (row, index) {
  		this.item = {
  			id: row.uuid,
  			index
  		}
  		this.dialogVisible2 = true
  	},
  	deleteSign() {
  		this.$http.delete_sign({
  			id: this.item.id
  		}).then(res => {
  			this.$message.success('删除成功！')
  			this.getList()
  			this.dialogVisible2 = false
  		}).catch(e => {
  			this.$message.error('删除失败！')
  			this.dialogVisible2 = false
  		})
  	},
  	submitForm() {
  	  this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
          	this.$http.create_sign(this.signForm).then(res=>{
          		this.$message.success('创建成功！')
          		this.getList()
          		this.dialogVisible = false
          	})
          }
      })
  	},
  	resetForm (formName) {
  		this.$refs[formName].resetFields();
  	},
  	turn (item) {
  		if (item.uuid) {
  			localStorage.UserName = item.ali_name
  			localStorage.AccessId = item.uuid
  		}
  		const { area_id } = localStorage
  		if (area_id) {
  			this.$router.push('/instance')
  		}
  		setTimeout(() => {
  			location.reload()
  		}, 10)
  	}
  },
  created () {
  	this.getList()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.sign-list {
	flex-direction: column;
	flex: 1;
	padding: .3rem 1rem;
	font-size: .75rem;
	header {
		flex: 0 0 2.4rem;
		justify-content: space-between;
	}
	.bottom.flex {
		height: 3rem;
		justify-content: flex-end;
	}
}
</style>
