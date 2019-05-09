<template>
	<div class="security flex">
		<header class="flex flex-item">
	  		<span>密钥对管理</span>
	  		<section class="btns">
	  			<el-button type="info" plain @click="getList"> <i class="el-icon-refresh"></i></el-button>
	  			<router-link tag="el-button"  to="createKeys">创建密钥对</router-link>
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
			      label="密钥对名称"
			      width="320">
			      <template slot-scope="scope">
			      	<p>{{ scope.row.SecurityGroupId }}</p>
			      	<p>{{ scope.row.KeyPairName }}</p>
			      </template>
			    </el-table-column>
			    <el-table-column
			      prop="name"
			      label="密钥对指纹"
			      filter-placement="bottom-end"
			      :filter-multiple = "false"
			      width="240">
			      <template slot-scope="scope">
			      	<p>{{ scope.row.KeyPairFingerPrint }}</p>
			      </template>
			    </el-table-column>
			    <el-table-column label="操作">
			      <template slot-scope="scope">
					<el-button size="mini" @click="exportKey(scope.row)">导出密钥</el-button>
			        <el-button size="mini" @click="bindKeysHandle(scope.row)">绑定密钥对</el-button>
			        <el-button size="mini" @click="untyingHandle(scope.row)">解绑密钥对</el-button>
			      </template>
			    </el-table-column>
			</el-table>
			<div class="bottom flex flex-item">
			  	<section>
				  	<el-button size="mini" :disabled="!status.start" @click="deleteKeyHandle">删除</el-button>
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
			<el-button style="opacity: 0;z-index: 10000"	type="primary" v-loading.fullscreen.lock="loadingShow"> </el-button>
			<el-dialog class="dialog_create" title="绑定密钥对" :visible.sync="bindKeyShow" @closed="closedBindHandle">
			  	<el-transfer v-model="bindKey"
				    filter-placeholder="请选择ECS实例"
					@left-check-change="handleChange"
					:titles="['选择ECS', '已选择']"
				    :data="keyData">
				</el-transfer>
				<div slot="footer" class="dialog-footer">
				    <el-button @click="cancelBindHandle">取 消</el-button>
				    <el-button type="primary" @click="confirmBindHandle">确 定</el-button>
				</div>
			</el-dialog>
			<el-dialog class="dialog_create" title="解绑密钥对" :visible.sync="unBindKeyShow" @closed="closedBindHandle">
			  	<el-transfer v-model="unbind.unbindKey"
				    filter-placeholder="请选择ECS实例"
					@left-check-change="handleChange"
					:titles="['选择ECS', '已选择']"
				    :data="keyData">
				</el-transfer>
				<div slot="footer" class="dialog-footer">
				    <el-button @click="cancelUnbindHandle">取 消</el-button>
				    <el-button type="primary" @click="confirmunBindHandle">确 定</el-button>
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
		bindKeyShow: false,
		unBindKeyShow: false,
	    status: {
	    	start: false
	    },
	    selection: [],
	    itemGroupInfo: {},
        bindKey: [],
	    keyData: [],
	    keyItem: null,
	    nameItem: null,
	    unbind: {
		   unbindKey: [],
		   nameItem: null,
	    },
	    loadingShow: false
    }
  },
  methods:  {
  	async getList (noreset) {
  	  if(!noreset) this.data = []
  	  const data = await this.$http.getKeysList({
  	  	PageNumber: this.pagination.PageNumber,
  	  	PageSize: this.pagination.PageSize
  	  })
  	  this.data = data.KeyPairs.KeyPair
  	  this.pagination.TotalCount = data.TotalCount
  	},
    resetStatus () {
    	this.status = {
	    	start: false
	    }
    },
  	handleSelectionChange (item) {
  		const { length } = item
  		this.selection = item
  		this.resetStatus()
		if (length) this.status.start = true
  	},
	  deleteKeyHandle() {  // 删除密钥
	  	this.loadingShow = true
  		let arr = []
    	this.selection.map((v, i) => {
    		arr.push(this.$http.deleteKey({
    			KeyPairNames: v.KeyPairName
    		}))
    	})
    	Promise.all(arr).then(res => {
			this.loadingShow = false
			this.success('删除成功！')
    		this.getList()
    		this.resetStatus()
    	})
	},
	getKeyData(val, btrue, bfalse) {  
		this.loadingShow = true
		this.keyData = []
		this.$http.instance_list().then((res) => {
			this.loadingShow = false
			res.Instances.Instance.forEach((v, i) => {
				if(v.OSType != 'windows') {
					this.keyData.push(v)
				}
			})
			this.keyData.forEach((item, index) => {
				item.key = item.InstanceId;
				item.label = item.InstanceId;
				if(item.KeyPairName == val.KeyPairName) {
					item.disabled = btrue
				} else {
					item.disabled = bfalse
				}
			});
		})
		
	},
	bindKeysHandle(value) {  // 绑定密钥对
		this.nameItem = value.KeyPairName
		this.bindKeyShow = true
		this.getKeyData(value, true, false)
	},
	handleChange(key) {
		this.keyItem = key
    },
	confirmBindHandle() {
		this.loadingShow = true
		this.$http.bindKeys({
			InstanceIds: this.keyItem.join(','),
			KeyPairName: this.nameItem
		}).then((res) => {
			this.loadingShow = false
			this.bindKeyShow = false
			this.bindKey = []
		})
	},
	cancelBindHandle() {
		this.bindKeyShow = false
		this.bindKey = []
	},
	closedBindHandle() {
		this.bindKey = []
		this.unbind.unbindKey = []
	},
	untyingHandle(item) {
		this.unBindKeyShow = true
		this.unbind.nameItem = item.KeyPairName
		this.getKeyData(item, false, true)
  	},
	cancelUnbindHandle() {  // 取消解绑
		this.unBindKeyShow = false
		this.unbind.unbindKey = []
	},
	confirmunBindHandle() {  // 确定解绑
		this.loadingShow = true
		this.$http.unbindKey({
			InstanceIds: this.keyItem.join(','),
			KeyPairName: this.unbind.nameItem
		}).then((res)=> {
			this.loadingShow = false
			this.unBindKeyShow = false
			this.unbind.unbindKey = []
		})
	},
	exportKey(item) {
		this.$http.exportKey({
			name: item.KeyPairName
		}).then((res)=> {
			const keyName = res.content
			const blob = new Blob([keyName], {type: "text/pem,charset=UTF-8"});
			const a = document.createElement('a')
			a.download = 'ssh.pem'
			a.href = window.URL.createObjectURL(blob);
		    document.body.appendChild(a)
			a.click()
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
  	}
 },
  created () {
  	this.getList()
  },
  mounted() {
  	if(this.$route.query.brash) {
  		this.getList()
  	}
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