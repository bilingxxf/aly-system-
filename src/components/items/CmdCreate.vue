<template>
    <div class="slider-wrapper" :class="showCreate ? 'active': ''">
      <div class="slider-right">
        <header>
          <h4>新建命令</h4>
          <p> 新建一条需要在ECS实例中执行的具体命令操作，如具体的Shell，Power Shell或bat脚本，您可以通过云助手执行该命令 </p>
          <i class="el-icon-circle-close-outline" @click="$parent.showCreate=false"></i>
        </header>
        <div class="form">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="90px" class="demo-ruleForm">
        <el-form-item label="命令名称" prop="Name">
          <el-input v-model="ruleForm.Name" placehold="请输入命令名称，1-64个字符" :maxlength="64"></el-input>
        </el-form-item>
        <el-form-item label="命令描述" prop="Description">
          <el-input type="textarea" v-model="ruleForm.Description" placeholder="请输入命令描述信息，1-100个字符" :maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="命令类型" prop="Type">
          <el-select v-model="ruleForm.Type" placeholder="请选择类型">
            <el-option label="Shell" value="RunShellScript"></el-option>
            <el-option label="Power Shell" value="RunPowerShellScript"></el-option>
            <el-option label="Bat" value="RunBatScript"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="命令内容" prop="CommandContent">
          <editor :callback="getCode" :show="showCreate"></editor>
          <el-input v-model="ruleForm.CommandContent" type="hidden"></el-input>
        </el-form-item>
        <el-form-item label="执行路径" prop="WorkingDir">
          <el-input v-model="ruleForm.WorkingDir" placeholder="1-200个字符" :maxlength="200"></el-input>
        </el-form-item>
        <el-form-item label="执行时间" prop="TimeOut">
          <el-input v-model="ruleForm.TimeOut" placeholder="3600" type="number"></el-input>
          <span>秒</span>
          <p>可设定超时范围为0～86400秒（24小时），超时命令将会强行终止!</p>
        </el-form-item>
        <el-form-item class="bottom">
          <el-button type="primary"  @click="submitCreateCommand()">创建</el-button>
          <el-button @click="$parent.showCreate=false">取消</el-button>
        </el-form-item>
      </el-form>
        </div>
      </div>
  </div>
</template>

<script>
import editor from './ACE'
export default {
  name: 'cmd-create',
  props: ['showCreate'],
  watch: {
    showCreate(val) {
      if (!val) this.resetCreateFrom()
    }
  },
  data() {
    return {
      ruleForm: {
        Name: '',
        Type: 'RunShellScript',
        Description: '',
        CommandContent: '',
        WorkingDir: '',
        TimeOut: ''
      },
      rules: {
        Name: [{ required: true, message: '请输入命令名称', trigger: 'blur' }],
        CommandContent: [{ required: true, message: '请输入命令内容', trigger: 'blur'}]
      }
    }
  },
  components: {
    editor
  },
  methods: {
    getCode(data) {
      this.ruleForm.CommandContent = data.code
    },
    resetCreateFrom () {
      this.$refs['ruleForm'].resetFields()
    },
    submitCreateCommand () {
      this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.$http.create_command(this.ruleForm)
            .then(res => {
              this.$parent.showCreate = false
              this.$message.success('创建成功')
              this.$parent.getCommandList()
            }).catch(()=>{
              this.$parent.showCreate = false
              this.$message.error('创建失败')
            })
          } else {
            return false;
          }
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
 .slider-wrapper {
  position: absolute;
  background: rgba(55,55,55,.3);
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 6;
  visibility: hidden;
  &.active {
    visibility: visible;
    .slider-right {
      transform: translateX(0);
    }
  }
  .slider-right {
    position: absolute;
    right: 0;
    width: 35rem;
    height: 100%;
    top: 0;
    background: red;
    z-index: 9;
    transform: translateX(100%);
    transition: transform .5s;
    background: #fff;
    header {
      position: relative;
      border-bottom: 1px solid rgba(0,0,0,.2);
      h4 {
        line-height: 2rem;
        padding-left: 1rem
      }
      p {
        padding: 0 0 .4rem 1rem;
          font-size: .6rem;
      }
      i {
        position: absolute;
        right: .5rem;
        top: .5rem;
        font-size: .9rem;
        cursor: pointer;
      }
    }
    .el-input,.el-textarea, .el-select{
      width: 20rem;
    }
    .bottom {
      position: absolute;
      bottom: 0;
      left: 0;
      background: #e0e0e0;
      margin: 0;
      padding: 1rem 2rem;
      box-sizing: border-box;
      width: 100%;
      text-align: right;
    }
    .form {
      padding: 1rem 0;
    }
  }
}
</style>
