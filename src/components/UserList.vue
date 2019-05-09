<template>
    <div class="sign-list flex">
  	<header class="flex flex-item">
  		<span>用户管理</span>
  		<section class="btns">
  			<el-button type="info" plain @click="getList"><i class="el-icon-refresh"></i></el-button>
  			<el-button type="primary" @click='createSign'>创建用户</el-button>
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
          prop="id"
          label="ID"
          >
        </el-table-column>
		    <el-table-column
		      prop="username"
		      label="账号"
		      >
		    </el-table-column>
		    <el-table-column label="操作">
		      <template slot-scope="scope">
		        <el-button
		          size="mini"
		          type="danger"
		          @click="selectSign(scope.row, scope.$index)"
		        >删除</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="setSign(scope.row, scope.$index)"
            >修改</el-button>
		      </template>
		    </el-table-column>
		  </el-table>
		</div>

		<el-dialog
		  title="提示"
		  :visible.sync="dialogVisible2"
		  width="30%"
		  :before-close="handleClose">
		  <span>是否确认删除账号？</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible2 = false">取 消</el-button>
		    <el-button type="primary" @click="deleteSign">确 定</el-button>
		  </span>
		</el-dialog>

		<el-dialog
		  :title="`${isEdit ? '修改' : '创建'}用户`"
		  :visible.sync="dialogVisible"
		  width="540px"
		  >
		  <el-form :model="signForm" status-icon :rules="rules" ref="ruleForm" label-width="" class="demo-ruleForm">
			  <el-form-item label="账号" prop="username">
			    <el-input v-model="signForm.username" autocomplete="off"></el-input>
			  </el-form-item>
			  <el-form-item label="密码" prop="password">
			    <el-input v-model="signForm.password" autocomplete="off"></el-input>
			  </el-form-item>
        <el-form-item label="选择签名">
          <el-table
          ref="multipleTable"
          :data="signlist"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.3)"
          v-loading="!signlist"
          tooltip-effect="dark"
          style="width: 100%;max-height: 12rem;overflow-y: scroll;margin-bottom: 2rem;"
          class="m-table"
          @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="100">
            </el-table-column>
            <el-table-column
              prop="ali_name"
              label="名称">
            </el-table-column>
            <el-table-column
              align="right"
              prop="ali_host"
              label="IP地址"
            >
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <el-button :disabled="!selection.length" type="primary" @click="submitForm()">提交</el-button>
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
        username: '',
        password: ''
    	},
    	dialogVisible: false,
    	dialogVisible2: false,
      isEdit: false,
    	list: null,
      signlist: null,
      selection: [],
    	item: {},
    	rules: {
    	  username: [
            { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
    	}
    }
  },
  watch: {
  	dialogVisible(val) {
  		if (!val) {
        this.isEdit = false
        this.resetForm('ruleForm')
      }
  	}
  },
  methods: {
  	async getList() {
  		this.list = await this.$http.user_list()
  	},
    async getSignList() {
      const data = await this.$http.sign_list({
        PageNumber: 1,
        PageSize: 20
      })
      if (!data.list.length) {
        this.$message.error('请先创建签名！')
      }
      this.signlist = data.list
    },
    handleSelectionChange (item) {
      this.selection = item
    },
  	createSign() {
  		this.dialogVisible = true
  	},
  	selectSign (row, index) {
  		this.item = {
  			id: row.id
  		}
  		this.dialogVisible2 = true
  	},
    setSign (item) {
      this.dialogVisible = true
      this.isEdit = true
      setTimeout(() => {
        this.signForm = {...item}
        item.servers.split(',').map((v, i) => {
          const arr = this.signlist.filter(item => item.id === v)
          this.selection.push(arr)
          this.$refs.multipleTable.toggleRowSelection(arr[0])
        }) 
      })
    },
  	deleteSign() {
  		this.$http.user_delete(this.item)
      .then(res => {
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
            const servers = []
            this.selection.map((v,i) => {
              servers.push(v.id)
            })
            this.signForm.servers = servers.join(',')

          	const p = !this.isEdit ? this.$http.user_add(this.signForm) : this.$http.edit_user(this.signForm)
            p.then(res=>{
          		this.$message.success(`${this.isEdit ? '修改' : '创建'}成功！`)
          		this.getList()
          		this.dialogVisible = false
          	})
          }
      })
  	},
  	resetForm (formName) {
      this.$refs.multipleTable.clearSelection()
  		this.$refs[formName].resetFields();
  	}
  },
  created () {
  	this.getList()
    this.getSignList()
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
