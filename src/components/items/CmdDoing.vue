<template>
    <div class="slider-wrapper" :class="showDoing ? 'active': ''">
      <div class="slider-right">
        <header>
          <h4>执行命令</h4>
          <p> 新建一条命令执行，可设定立即执行或定时执行，该执行命令创建后命令内容静态化，之后对命令的修改并不会影响该执行内容 </p>
          <i class="el-icon-circle-close-outline" @click="$parent.showDoing=false"></i>
        </header>
        <div class="detail">
          <div class="detail-line">
            <span>命令名称：</span>
            <span>{{ data.Name }}</span>
          </div>
          <div class="detail-line">
            <span>命令描述：</span>
            <span>{{ data.Description }}</span>
          </div>
          <div class="detail-line">
            <span>命令类型：</span>
            <span>{{ data.Type }}</span>
          </div>
          <div class="detail-line">
            <span>命令内容：</span>
            <span><a @click="showCommand(data.CommandContent)">查看命令内容</a></span>
          </div>
          <div class="detail-line s">
            <span>目标实例：</span>
            <div class="instance-line">
              <div v-if="selection.length">{{ selection.join(' / ') }}</div>
              <el-button type="primary" size="mini" @click="dialogVisible=true">选择实例</el-button>
            </div>
          </div>
          <div class="detail-line">
            <span>执行计划：</span>
            <el-radio v-model="radio" :label="1">立即执行</el-radio>
            <el-radio v-model="radio" :label="2">定时执行</el-radio>
          </div>
          <div class="detail-line" v-if="showTime">
            <span>执行时间：</span>
            <el-input class="doing-time" v-model="doingTime" placeholder="请输入cron表达式，例：0 10 * * ? *"></el-input>
          </div>
        </div>
        <div class="bottom">
          <el-button type="primary" :disabled="!selection.length" @click="submitCreateCommand()">执行</el-button>
          <el-button @click="$parent.showDoing=false">取消</el-button>
      </div>
      </div>
      <el-dialog
        title="选择执行命令"
        :visible.sync="dialogVisible"
        :before-close="handleClose"
        width="800px">
        <CmdTransfer :dialogVisible="dialogVisible" :closeDialog="closeDialog" />
      </el-dialog>
  </div>
</template>

<script>
import editor from './ACE'
import CmdTransfer from './CmdTransfer'
export default {
  name: 'cmd-doing',
  props: ['showDoing', 'data', 'showCommand'],
  watch: {
    showDoing(val) {
      if (!val) this.resetCreateFrom()
    }
  },
  watch: {
    radio(val) {
      if (val === 2) {
        this.showTime = true
      } else {
        this.showTime = false
      }
    }
  },
  data() {
    return {
      radio: 1,
      showTime: false,
      doingTime: null,
      dialogVisible: false,
      selection: []
    }
  },
  components: {
    editor,
    CmdTransfer
  },
  methods: {
    closeDialog () {
      this.dialogVisible = false
    },
    submitCreateCommand () {
      this.$parent.showDoing = false
      this.$http.command_invoke({
        InstanceIds:this.selection.join(','),
        CommandId:this.data.CommandId,
        Timed: this.radio === 2,
        Frequency: ''
      }).then(res => {
        this.$message.success('执行成功')
        this.selection = []
        this.$parent.getCommandHistory()
      }).catch(e=> {
        this.selection = []
        this.$message.success('执行失败')
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
    .instance-line {
      > div {
        width: 20rem;
        border: 1px solid #333;
        padding: 0 1rem;
        height: 10rem;
        word-break: break-all;
      }
      display: inline-block;
    }

    .detail {
      padding: 1rem;
      .detail-line {
        line-height: 2rem;
        &.s {
          > span  {
            float: left;
          }
        }
        a {
          color: #00c1de;
          text-decoration: underline;
          cursor: pointer;
        }
        .doing-time {
          width: 15rem;
        }
      }
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
