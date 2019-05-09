<template>
  <div class="instance flex">
  	<header class="flex flex-item">
  		<span>创建密钥对</span>
  		<section class="btns">
  			<el-button type="info" plain @click="getList"><i class="el-icon-refresh"></i></el-button>
  		</section>
  	</header>
  	<div class="content">
  		<el-form :model="form" :rules="formRule" ref="form" label-width="100px">
		    <el-form-item label="密钥对名称" prop="name">
		      <el-input v-model="form.name" autocomplete="off" @blur="nameCheckHandle"></el-input>
		      <span class="red" v-if="nameErroeShow">密钥对名称重复，请重新填写</span>
				
		    </el-form-item>
		    <el-form-item label="创建类型" prop="style" >
		      	<el-radio-group v-model="form.style" @change="radioChange">
							<el-radio label="自动新建密钥对">自动新建密钥对</el-radio>
							<el-radio label="导入已有密钥对">导入已有密钥对</el-radio>
						</el-radio-group>
		    </el-form-item>
		    
				<el-form-item v-show="conentShow" label="公钥内容" prop="pubContent" >
					<el-input v-model="form.pubContent" placeholder="请输入公钥内容"></el-input>
				</el-form-item>
		    <el-form-item v-show="conentShow" label="私钥内容" prop="priContent" >
					<el-input v-model="form.priContent" placeholder="请输入私钥内容"></el-input>
				</el-form-item>
	  	</el-form>
			<el-button style="opacity: 0"	type="primary" v-loading.fullscreen.lock="fullscreenLoading"> </el-button>
			<div slot="footer" class="dialog-footer">
					<el-button>取 消</el-button>
					<el-button type="primary" @click="autoConfirm" :disabled="disabled">确 定</el-button>
			</div>
  	</div>
  </div>
</template>

<script>

export default {
  name: 'instance',
  data () {
		 const validateName = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('密钥对不能为空'));
        }  else {
          callback()
        }
		 }

    return {
    	data: null,
    	pwdError: false,
	    form: {
				name: null,
				style: '自动新建密钥对',
				pubContent: '',
				priContent: ''
	    },
	    formRule: {
				name: [{ required: true, validator: validateName, trigger: 'blur' 	}],
				pubContent:  [{ required: true, message: '请输入公钥内容', trigger: 'blur' 	}],
				priContent:  [{ required: true, message: '请输入私钥内容', trigger: 'blur' 	}]
      },
			conentShow: false,
			nameErroeShow: false,
			fullscreenLoading: false,
			disabled: true
    }
  },
  watch: { },
  methods:  {
		radioChange(val) {
			if(val == '导入已有密钥对') {
				this.conentShow = true
			}else {
				this.conentShow = false
			}
		},  
		nameCheckHandle() {
			if(this.form.name!=null) {
				this.fullscreenLoading = true
			}
			this.$http.checkName({
				KeyPairName: this.form.name
			}).then((res) => {
				if(res.message == false) {
					this.fullscreenLoading = false
					this.nameErroeShow = true
					this.disabled = true
				}else {
					this.fullscreenLoading = false
					this.nameErroeShow = false
					this.disabled = false
				}
			})
		},
		autoConfirm() {
			if(this.form.pubContent=="") {
				this.fullscreenLoading = true
				this.$http.createKey({
					KeyPairName: this.form.name
				}).then((res) => {
					if(res) {
						this.fullscreenLoading = false
						const keyName = res.content
						const blob = new Blob([keyName], {type: "text/pem,charset=UTF-8"});
						const a = document.createElement('a')
						a.download = 'ssh.pem'
						a.href = window.URL.createObjectURL(blob);
					    document.body.appendChild(a)
						a.click()
						this.$refs['form'].resetFields();
						this.$router.push({path: 'KeysManage', query: {brash: true}});
					}
				})
			}else {
				this.fullscreenLoading = true
				this.$http.portExistKey({
					KeyPairName: this.form.name,
					PublicKeyBody: this.form.pubContent,
					PrivateKeyBody: this.form.priContent
				}).then((res)=> {
					if(res) {
						this.fullscreenLoading = false
						const keyName = res.content
						const blob = new Blob([keyName], {type: "text/pem,charset=UTF-8"});
						const a = document.createElement('a')
						a.download = 'ssh.pem'
						a.href = window.URL.createObjectURL(blob);
					  document.body.appendChild(a)
						a.click()
						this.$refs['form'].resetFields();
						this.radioChange()
						this.$router.push({path: 'KeysManage', query: {brash: true}});
					}
				})
			}
		},
  	success (text) {
  		 this.$message({
          message: text,
          type: 'success'
        });
  	},
  },
  created () {
  },
  beforeDestroy () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.instance {
	flex-direction: column;
	flex: 1;
	padding: .3rem 1rem;
	.red {
		color: red
	}
	header {
		flex: 0 0 2.4rem;
		justify-content: space-between;
		border-bottom: 1px solid #d9d9d9;
		padding: 0 0 .5rem 0;
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
	.content {
		margin: 2rem 3rem;
		.dialog-footer {
			margin: 0 0 0 6.3rem;
		}
	}
}
</style>
