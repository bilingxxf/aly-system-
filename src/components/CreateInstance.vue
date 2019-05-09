<template>
  <div class="m-create-instance flex">
  	<section class="flex flex-item">
  		<div class="flex-left">
  			<p>计费方式</p>
  		</div>
  		<div class="flex-right">
  			<el-button v-for="(item, index) in InstanceChargeType"
  			:key='index'
  			:type="instance.InstanceChargeType === item.val ? 'primary': ''"
  			@click="setInstanceChargeType(item.val)">
  			{{ item.text }}
  		</el-button>
  		</div>
  	</section>

  	<section class="flex flex-item">
  		<div class="flex-left">
  			<p>地域</p>
  		</div>
  		<div class="flex-right">
  			<el-select v-model="instance.ZoneId" @change="ecsPrize" placeholder="请选择">
			    <el-option
			      v-for="item in area"
			      :key="item.RegionId"
			      :label="item.LocalName"
			      :value="item.RegionId">
			    </el-option>
			  </el-select>
  		</div>
  	</section>

  	<section class="flex flex-item">
  		<div class="flex-left">
  			<p>实例</p>
  		</div>
  		<div class="flex-right">
  			<div class="IO flex flex-item">
  				<span>I/O 优化实例</span>
  				<span class="io-item">vCPU：</span>
  				<el-select v-model="instance.vCPU" placeholder="请选择vCPU" @change="itemsFilter">
				    <el-option
				      v-for="item in vCPU"
				      :key="item.val"
				      :label="item.text"
				      :value="item.val">
				    </el-option>
			  </el-select>
			  <span class="io-item">内存：</span>
  				<el-select v-model="instance.MemorySize" placeholder="请选择内存"  @change="itemsFilter">
				    <el-option
				      v-for="item in MemorySize"
				      :key="item.val"
				      :label="item.text"
				      :value="item.val">
				    </el-option>
			  </el-select>
			   <span class="io-item">实例规格：</span>
			   <el-input v-model="instance.InstanceType" @input="itemsFilter" placeholder="如：ecs.sn1ne.large"></el-input>
  			</div>

  			<div class="IO flex flex-item">
  				<span>架构：</span>
  				<el-button v-for="(item, index) in Architecture"
  					:key='index'
		  			:type="instance.ArchitectureType === item.id ? 'primary': ''"
		  			@click="setInstanceArchitectureType(item.id)">
		  			{{ item.name }}
		  		</el-button>
  			</div>

  			<div class="IO flex flex-item">
  				<span>分类：</span>
  				<el-button v-for="(item, index) in Architecture[instance.ArchitectureType].children"
  					:key='index'
		  			:type="instance.Categery === item.id ? 'primary': ''"
		  			@click="setInstanceCategery(item.id)">
		  			{{ item.name }}
		  		</el-button>
  			</div>

  			<el-table
		    :data="selectCategery"
		    style="width: 100%"
		    height="276">
		    <el-table-column
		      width="30">
		      <template slot-scope="scope">
		        <el-radio v-model="radio" :label="scope.$index">&nbsp;</el-radio>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="规格族"
		      width="160">
		      <template slot-scope="scope">
		        <el-tag disable-transitions>{{currentTypes[scope.row.InstanceTypeFamily.split('.')[1]]}}</el-tag>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="实例规格"
		      width="200">
		      <template slot-scope="scope">
		        <el-tag disable-transitions>{{scope.row.InstanceTypeId}}</el-tag>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="vCPU"
		      width="150">
		      <template slot-scope="scope">
		        <el-tag disable-transitions>{{scope.row.CpuCoreCount}} vCPU</el-tag>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="内存">
		      <template slot-scope="scope">
		        <el-tag disable-transitions>{{scope.row.MemorySize}} GiB</el-tag>
		      </template>
		    </el-table-column>
		  </el-table>

		  <section class="IO current-instance" v-if="selectCategery.length">
		  	<div class="current-line">
		  		<span>当前选择实例：</span>
		  		<span style="margin-right: 2rem;">{{ selectCategery[radio].InstanceTypeId }}</span>
		  		<span>({{ selectCategery[radio].CpuCoreCount }} vCPU {{ selectCategery[radio].MemorySize }} GiB,
		  		{{currentTypes[selectCategery[radio].InstanceTypeFamily.split('.')[1]]}})</span>
		  	</div>
		  	<div class="current-line">
		  		<span>购买实例数量：</span>
		  		<el-input v-model="instance.InstanceCount" type="number" @input="ecsPrize"></el-input>
		  		台
		  	</div>
		  </section>
  		</div>
  	</section>

  	<section class="flex flex-item">
  		<div class="flex-left">
  			<p>镜像（必选）</p>
  		</div>
  		<div class="flex-right">
  			<el-button v-for="(item, index) in imagesBlock"
  			:key='index'
  			:type="instance.imagesBlock === item.id ? 'primary': ''"
  			>
  			{{ item.name }}
  			</el-button>
  			<div class="image-line">
  				<el-select v-model="instance.image" placeholder="请选择">
			    <el-option
			      v-for="item in images"
			      :key="item.ImageId"
			      :label="item.OSName"
			      :value="item.ImageId">
			    </el-option>
			  </el-select>
  			</div>
  		</div>
  	</section>

  	<section class="flex flex-item">
  		<div class="flex-left">
  			<p>安全组</p>
  		</div>
  		<div class="flex-right">
  			<div>
  				<el-select v-model="instance.SecurityGroupId" placeholder="请选择">
			    <el-option
			      v-for="item in SecurityGroup"
			      :key="item.SecurityGroupId"
			      :label="item.SecurityGroupName"
			      :value="item.SecurityGroupId">
			    </el-option>
			  </el-select>
  			</div>
  		</div>
  	</section>

  	<section class="flex flex-item">
  		<div class="flex-left">
  			<p>存储</p>
  		</div>
  		<div class="flex-right">
  			<p>系统盘</p>
  			<div class="memory-line">
  				<el-select v-model="instance.memory" @change="ecsPrize" placeholder="请选择">
			    <el-option
			      v-for="item in memories"
			      :key="item.category"
			      :label="item.name"
			      :value="item.category">
			    </el-option>
			  </el-select>
			  <el-input type="number" v-model="instance.memorySize" @change="minSize"></el-input>
			  <span>GiB 2128 IOPS</span>
  			</div>
  			<p>数据盘  {{ 16 - availPanNum}}/16</p>
  			<div class="memory-line" v-for="(items, index) in dataPanList" :key="index">
  				<i class="el-icon-remove" @click='deletePan(index)'></i>
  				<el-select v-model="items.category" placeholder="请选择">
			    <el-option
			      v-for="item in memories"
			      :key="item.category"
			      :label="item.name"
			      :value="item.category">
			    </el-option>
			  </el-select>
			  <el-input type="number" v-model="items.size"></el-input>
			  <span>GiB 1960 IOPS</span>
			  <!-- <span style="margin-left: 2rem">数量：</span>
			  <el-input type="number" v-model="items.num" @input="changePanNum(items.num, index)" @focus="getmax(items.num)"></el-input> -->
			  <span>自动分配设备名</span>
			  <el-checkbox v-model="items.deleteWithInstance">随实例释放</el-checkbox>
			  <el-checkbox v-model="items.encrypted">加密</el-checkbox>
  			</div>
  			<div class="memory-line">
  				<i class="el-icon-circle-plus" @click="addPan"></i>
  				<span>增加一块数据盘</span>
  			</div>
  		</div>
  	</section>
  	<section class="m-prize flex flex-item">
  		<div v-if="!instance.InstanceChargeType">
	  		<span>购买时长：</span>
	  		<el-select v-model="dateId" @change="ecsPrize" placeholder="请选择">
		    <el-option
		      v-for="item in timeList"
		      :key="item.num"
		      :label="item.name"
		      :value="item.id">
		    </el-option>
		  </el-select>
		 </div>
	   <span>配置费用：</span>
	   <div v-if="!computing && !instance.InstanceChargeType">
		  <span class="money">￥{{this.Amount.tradeAmount.toFixed(2)}}</span>
		  <span class="green">省 ￥{{this.Amount.discountAmount.toFixed(2)}}</span>
	  </div>
	  <div v-if="!computing && instance.InstanceChargeType === 1">
		  <span class="money">￥{{this.Amount.tradeAmount.toFixed(2)}}/时</span>
	  </div>
	  <div v-if="computing" class="money">正在计算中...</div>
	  <el-button type="success" :disabled="!instance.image" @click="dialogVisible=true">确认购买</el-button>
  	</section>

  	<el-dialog
	  title="提示"
	  :visible.sync="dialogVisible"
	  width="30%"
	  >
	  <span>是否确认购买？</span>
	  <span slot="footer" class="dialog-footer">
	    <el-button @click="dialogVisible = false">取 消</el-button>
	    <el-button type="primary" @click="doBuy">确 定</el-button>
	  </span>
	</el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Json from '../../static/json/instance.json'

export default {
  name: 'home',
  data () {
    return {
    	data: [],
    	currentTypes: {},
    	dialogVisible: false,
    	InstanceChargeType: Json.InstanceChargeType,
    	vCPU: Json.vCPU,
    	MemorySize: Json.MemorySize,
    	Architecture: Json.Architecture,
    	selectCategery: [],
    	imagesBlock: Json.images,
    	radio: 0,
    	images: [],
    	memories: Json.memories,
    	timeList: Json.timeList,
    	availPanNum: 16,
    	dateId: 2,
    	SecurityGroup: [],
    	dataPan: {
    		size: 20,
    		snapshotId: null,
    		category: 'cloud_efficiency',
    		deleteWithInstance: true,
    		encrypted: false,
    		name: '高效云盘',
    		num: 1
    	},
    	dataPanList: [],
    	instance: {
    		InstanceChargeType: 0,
    		ZoneId: localStorage.area_id || '',
    		vCPU: '',
    		MemorySize: '',
    		InstanceType: '',
    		ArchitectureType: 0,
    		Categery: 0,
    		InstanceCount: 1,
    		imagesBlock: 0,
    		image: '',
    		memorySize: 40,
    		memory: 'cloud_efficiency',
    		SecurityGroupId: ''
    	},
    	Amount: {
    		tradeAmount: 0,
    		discountAmount: 0
    	},
    	computing: true
    }
  },
  computed: {
    ...mapGetters([
      'area'
    ])
  },
  watch: {
  	radio () {
  		this.ecsPrize()
  	}
  },
  methods: {
  	...mapActions([
      'getArea'
    ]),
    minSize () {
    	let i
    	if (this.instance.memorySize < 20) {
    		i = 20
    	} else if (this.instance.memorySize > 500) {
    		i = 500
    	}
    	if (i) {
	    	setTimeout(() => {
	    		this.instance.memorySize = i
	    	})
	    }
	    this.ecsPrize()
    },
    getmax (val) {
    	this.panInputMax = val + this.availPanNum
    },
    changePanNum(val, index) {
    	let n = 16
    	if (val > this.panInputMax) {
    		setTimeout(() => {
    			this.dataPanList[index].num = this.panInputMax
    			this.availPanNum = 0
    			this.ecsPrize()
    		})
    		return
    	}
    	this.dataPanList.map((v, i) => {
    		n-=v.num
    	})
    	this.availPanNum = n
    	this.ecsPrize()
    },
    async doBuy () {
    	const { InstanceChargeType } = this.instance
    	const parmas = {
    		RegionId: this.instance.ZoneId,
    		ImageId: this.instance.image,
    		InstanceType: this.selectCategery[this.radio].InstanceTypeId,
    		SecurityGroupId: this.instance.SecurityGroupId,
    		SystemDiskCategory: this.instance.memory,
    		SystemDiskSize: this.instance.memorySize,
    		DataDisks: JSON.stringify(this.dataPanList),
    		PeriodUnit: InstanceChargeType === 1 ? 'Hour' : this.timeList[this.dateId].type,
    		Period: InstanceChargeType === 1 ? 1 : this.timeList[this.dateId].num
    	}

    	this.$http.instance_create(parmas).then(res => {
    		this.dialogVisible = false
    		this.$message({
	          message: '购买成功',
	          type: 'success'
	        });
    	}).catch((e) => {
    		this.dialogVisible = false
    		this.$message({
	          message: '购买失败',
	          type: 'error'
	        });
    	})
    },
    addPan() {
    	if (!this.availPanNum) return
    	this.dataPanList.push(JSON.parse(JSON.stringify(this.dataPan)))
    	this.changePanNum()
    },
    deletePan (i) {
    	this.dataPanList.splice(i, true)
    	this.changePanNum()
    },
  	setInstanceChargeType(val) {
  		this.instance.InstanceChargeType = val
  		this.ecsPrize()
  	},
  	setInstanceCategery (id) {
  		this.resetRadio()
  		this.instance.Categery = id
  		this.selectCategery = this.Architecture[this.instance.ArchitectureType].children[id].type
  		this.itemsFilter()
  	},
  	setInstanceArchitectureType (id) {
  		this.instance.ArchitectureType = id
  		this.setInstanceCategery(0)
  	},
  	async getSecuritylist () {
  		const data = await this.$http.security_list()
  		this.SecurityGroup = data.SecurityGroups.SecurityGroup
  		this.instance.SecurityGroupId = this.SecurityGroup[0].SecurityGroupId
  	},
  	async ecsPrize() {
  		if (!this.instance.InstanceCount) return
  		this.computing = true
  		const { InstanceChargeType } = this.instance
  		const data = await this.$http.ecsprize({
  			orderType: 'instance-buy',
			zoneId: 'random',
			instanceType: this.selectCategery[this.radio].InstanceTypeId,
			ioOptimized: 1,
			imageType:'public',
			category: this.instance.memory,
			size: this.instance.memorySize,
			regionId: this.instance.ZoneId,
			dataDisks: JSON.stringify(this.dataPanList),
			amount: this.instance.InstanceCount,
			priceUnit: InstanceChargeType === 1 ? 'Hour' : this.timeList[this.dateId].type,
			period: InstanceChargeType === 1 ? 1 : this.timeList[this.dateId].num
  		})
  		this.Amount = data.data.order.children[0].data.order
  		this.computing = false
  	},
  	resetRadio() {
  		this.radio = 0
  		this.ecsPrize()
  	},
  	async getAllTypes() {
  		const data = await this.$http.typesinfo()
  		this.data = data.InstanceTypes.InstanceType
  		this.itemsFilter()
  		this.ecsPrize()
  	},
  	itemsFilter() {
  		this.currentTypes = this.Architecture[this.instance.ArchitectureType].children[this.instance.Categery].type
  		const keys = Object.keys(this.currentTypes)
  		this.selectCategery = this.data.filter(item => {
  			const cpu = item.CpuCoreCount == this.instance.vCPU || !this.instance.vCPU
  			const memory = item.MemorySize == this.instance.MemorySize || !this.instance.MemorySize
  			const gg = item.InstanceTypeId.includes(this.instance.InstanceType) || !this.instance.InstanceType
  			return keys.includes(item.InstanceTypeFamily.split('.')[1]) && cpu && memory && gg
  		})
  		this.ecsPrize()
  	},
  	async getImages() {
  		const data = await this.$http.images({PageSize: 100})
  		this.images = data.Images.Image
  	}
  },
  created () {
  	this.getAllTypes()
  	this.getArea()
  	this.getImages()
  	this.getSecuritylist()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.m-create-instance {
	position: relative;
	background: #f5f5f6;
	flex: 1;
	padding: .3rem 1rem 6rem;
	flex-direction: column;
	font-size: .7rem;
	overflow-y: auto;
	.current-instance {
		margin-top: 1rem;
	}
	.image-line {
		margin-top: 1rem;
	}
	.memory-line {
		margin: 1rem 0;
		.el-input {
			width: 4rem;
		}
		i,span {
			vertical-align: middle;
		}
	}
	.el-icon-circle-plus,.el-icon-remove {
		font-size: 1rem;
		color: #00c1de;
	}
	.current-line {
		height: 2rem;
		line-height: 2rem;
		margin-bottom: .5rem;
		.el-input {
			width: 3rem;
		}
		span:first-child {
			background: #f7f8fa;
			display: inline-block;
			line-height: 2rem;
			padding-left: 2rem;
		}
	}
	.el-button {
		padding: .4rem .5rem;
	}
	section.flex-item {
		flex: 0 0 auto;
		padding: 1rem .5rem;
		box-shadow: 0 1px 2px #ebecec;
		border-radius: .3rem;
		background: #fff;
		margin-top: .4rem;
	}
	.IO {
		margin-bottom: 1rem;
	}
	.io-item {
		margin: 0 .5rem 0 .8rem;
	}
	.flex-left {
		flex: 0 0 7rem;
		padding-left: 1rem;
	}

	.flex-right {
		flex: 1
	}

	.green {
		margin-left: .5rem!important;
		color: $green;
		font-size: .6rem;
	}
	.money {
		margin-left: .5rem!important;
		color: $money;
		font-size: 1.2rem;
	}
}
</style>
