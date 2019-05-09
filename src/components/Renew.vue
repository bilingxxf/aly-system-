<template>
  <div class="m-renew flex">
  	<header class="flex flex-item">
  		<span>{{ isTransform ? '按量转包年包月' : '续费' }}</span>
  	</header>
  	<el-table
	    ref="multipleTable"
	    :data="data"
	    element-loading-text="拼命加载中"
		element-loading-spinner="el-icon-loading"
		element-loading-background="rgba(0, 0, 0, 0.3)"
	    v-loading="loading"
	    tooltip-effect="dark"
	    style="width: 100%"
	    class="m-table"
	    @header-click="showContinue">
	    <el-table-column
	      label="实例名称/地区"
	      width="200">
	      <template slot-scope="scope">
	      	<p>{{ scope.row.InstanceName }}</p>
	      	<p>{{ scope.row.ZoneId }}</p>
	      </template>
	    </el-table-column>
	    <el-table-column
	      label="公网/内网IP"
	      width="200">
	      <template slot-scope="scope">
	      	<p>{{ scope.row.PublicIpAddress.IpAddress[0] }}(公用)</p>
	      	<p>{{ scope.row.VpcAttributes.PrivateIpAddress.IpAddress[0] }}(私有)</p>
	      </template>
	    </el-table-column>
	    <el-table-column
	      label="配置"
	      width="300">
	      <template slot-scope="scope">
	        {{scope.row.Cpu}} vCPU {{scope.row.Memory % 1024 === 0 ? (scope.row.Memory / 1024 + ' GB')  : scope.row.Memory % 1024 + ' MB'}} (I/O优化) {{ scope.row.InstanceType }}
	      </template>
	    </el-table-column>
	    <el-table-column
	      label="续费周期(点击修改)"
	      filter-placement="bottom-end"
	      :filter-multiple = "false"
	      :index = "true"
	      width="180">
	      <template slot-scope="scope">
	        <el-tag disable-transitions>{{ continueTime.name }}</el-tag>
	      </template>
	    </el-table-column>
	    <el-table-column
		      label="续费周期"
		      width="200">
		  <template slot-scope="scope">
	        <p disable-transitions>{{ (isTransform ? scope.row.StartTime :scope.row.ExpiredTime) | timeFilter }}至</p>
	        <p disable-transitions>{{ [(isTransform ? scope.row.StartTime :scope.row.ExpiredTime), continueTime] | continueFilter | timeFilter }}</p>
	      </template>
		</el-table-column>
		<el-table-column
		      label="费用"
		      width="140">
		   <template slot-scope="scope">
		   <div v-if="scope.row.tradeAmount">
	         <p disable-transitions class="money">￥{{ scope.row.tradeAmount || '' }}</p>
	         <p disable-transitions class="green" v-if="scope.row.discountAmount">省： ￥{{ scope.row.discountAmount || '' }}</p>
	       </div>
	       <div v-else class="money">正在计算中...</div>
	      </template>
		</el-table-column>
	    <el-table-column label="操作">
	      <template slot-scope="scope">
	      	<el-button size="mini" @click="deleteInstance(scope.$index)">移除</el-button>
	      </template>
	    </el-table-column>
	  </el-table>

	  <section class="m-prize">
	  	<div class="money">
		  	<span>应付金额：</span>
		  	<a v-if="totalMoney || !data.length">￥{{ totalMoney }}</a>
		  	<a v-else>正在计算中...</a>
	  	</div>
	  	<p class="green" v-if="totalDiscount">省： ￥{{ totalDiscount }}</p>
	  	<el-button type="success" :disabled="!data.length" @click="dialogVisible2 = true">确认下单</el-button>
	  </section>

	  <el-dialog
		  title="选择续费周期"
		  :visible.sync="dialogVisible"
		  width="360px"
		  >
		  <ul class="time-list">
		  	<li v-for="(item, index) in timeList">
		  		<el-button @click="selectTime(item)" :type="continueTime.name === item.name ? 'active': ''">{{ item.name }}</el-button>
		  	</li>
		  </ul>
	  </el-dialog>


    <el-dialog
    title="提示"
    :visible.sync="dialogVisible2"
    width="30%"
    >
    <span>是否确认购买？</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible2 = false">取 消</el-button>
      <el-button type="primary" @click="doBuy">确 定</el-button>
    </span>
  </el-dialog>
  </div>
</template>

<script>
import Json from '../../static/json/instance.json'
export default {
  name: 'home',
  data () {
    return {
    	data: null,
      dialogVisible: false,
      dialogVisible2: false,
    	isTransform: localStorage.buyMethod === 'transform',
    	dialogVisible: false,
    	timeList: Json.timeList,
    	continueTime: Json.timeList[5],
    	totalMoney: 0,
    	totalDiscount: 0,
      loading: true
    }
  },
  watch: {
  	data(val) {
  		this.totalMoney = 0
  		this.totalDiscount = 0
  		val.map((v, i) => {
  			if (v.tradeAmount) {
  				this.totalMoney+=v.tradeAmount
  				this.totalDiscount+=v.discountAmount
  			}
  		})
  	}
  },
  filters: {
  	continueFilter (arr) {
  		let timestr
  		const [time, continueTime] = arr
  		const start = new Date(time).getTime()
  		const anHour = 24 * 3600 *1000
  		switch(continueTime.type) {
  			case 'Week':
  				timestr = start + 7*anHour*continueTime.num
  				break
  			case 'Month':
  				timestr = time.replace(/(\d+)\-(\d+)\-/g, (a, b, c) => {
  					const m = Number(c) + continueTime.num
  					b = m > 12 ? Number(b) + 1 : b
  					c = m > 12 ? (m - 12) : m
  					c = c < 10 ? `0${c}` : c
  					return `${b}-${c}-`
  				})
  				break;
  		    default: 
  		    	timestr = time.replace(/^(\d+)/, (a, b) => {
  		    		return Number(a) + continueTime.num
  		    	})
  		}
  		return timestr
  	}
  },
  methods: {
  	showContinue (i, e) {
  		if (!i.index) return
  		this.dialogVisible = true
  	},
  	selectTime (item) {
  		this.continueTime = item
  		this.dialogVisible = false

  		this.data.map((val, k) => {
  			this.data[k].tradeAmount = ''
  			this.data[k].discountAmount = ''
  			setTimeout(()=> {
  				this.data = JSON.parse(JSON.stringify(this.data))
  				this.getPrize(val, k)
  			})
  		})
  	},
  	deleteInstance (i) {
  		const { InstanceIds } = localStorage
  		let arr = InstanceIds.split(',')
  		arr.map((v, k) => {
  			if (v === this.data[i].InstanceId) {
  				arr.splice(k, true)
  			}
  		})
  		this.data.splice(i, true)
  		localStorage.InstanceIds = arr.join(',')

  	},
  	async getList () {
  	  const { InstanceIds } = localStorage
  	  this.data = []
  	  const data = await this.$http.instance_list({
  	  	InstanceIds 
  	  })
      this.loading = false
  	  this.data = data.Instances.Instance
  	  this.getMemeries()
  	},
  	getMemeries () {
  		this.data.map((val, k) => {
  			this.$http.instance_disks({
  				InstanceId: val.InstanceId
  			}).then(res => {
  				res.Disks.Disk.map((v, i) => {
  					if (v.Type === 'system') {
  						val.System = v
  						res.Disks.Disk.splice(i, true)
  					} 
  				})
  				val.Disks = res.Disks.Disk
  				this.getPrize(val, k)
  			})
  		})
  	},
  	async doBuy () {
  		const data = !this.isTransform ? await this.$http.renewmany({
  			Period: this.continueTime.num,
  			InstanceIds:localStorage.InstanceIds,
  			PeriodUnit: this.continueTime.type
  		}) : await this.$http.instance_change({
  			Period: this.continueTime.num,
  			InstanceIds:localStorage.InstanceIds,
  			PeriodUnit: this.continueTime.type,
  			InstanceChargeType: 'PrePaid'
  		})
      this.dialogVisible2 = false
      if (data.status === 500) {
        this.$message.error('下单失败！')
      }
  		this.$message({
          message: '下单成功',
          type: 'success'
        });
        setTimeout(() => {
        	this.$router.push('instance')
        }, 2000)
  	},
  	async getPrize (val, k) {
  		this.$http.ecsprize({
			orderType: 'instance-buy',
			zoneId: 'random',
			instanceType: val.InstanceType,
			ioOptimized: 1,
			imageType:'public',
			category: val.System.Category,
			size: val.System.Size,
			regionId: val.RegionId,
			dataDisks: JSON.stringify(val.Disks),
			amount: 1,
			priceUnit: this.continueTime.type,
			period: this.continueTime.num
  		}).then(res => {
  			this.data[k].tradeAmount = res.data.order.tradeAmount
  			this.data[k].discountAmount = res.data.order.discountAmount
  			setTimeout(() => {
  				this.data = JSON.parse(JSON.stringify(this.data))
  			})
  		})
 
  	}
  },
  created () {
  	this.getList()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
 .m-renew {
 	padding: .3rem 1rem;
 	font-size: .75rem;
 	flex-direction: column;
	flex: 1;
 	header {
		flex: 0 0 2.4rem;
		justify-content: space-between;
	}
	.green {
		color: $green;
		font-size: .6rem;
		line-height: .7rem;
		margin-left: .2rem;
	}
	.m-prize {
		.green {
			margin-left: 1rem;
		}
	}
	.money {
		color: $money;
		font-size: 1rem;
		line-height: 1.5rem;
	}
	.time-list {
		overflow: hidden;
		li {
			width: 50%;
			float: left;
			line-height: 2.4rem;
			text-align: center;
			cursor: pointer;
			.el-button {
				width: 80%;
				&.el-button--active {
					color: #409eff;
				    border-color: #c6e2ff;
				    background-color: #ecf5ff;
				}
			}
		}
	}
 }
</style>
