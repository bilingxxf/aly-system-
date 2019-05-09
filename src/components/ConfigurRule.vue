<template>
	<div class="security flex">
		<header class="flex flex-item">
			<span>安全组规则</span>
			<section class="btns">
				<el-button type="info" plain @click="getList"> <i class="el-icon-refresh"></i></el-button>
				<el-button v-if="tab == '入方向'" type="primary" @click="createFormVisible = true">添加安全组规则</el-button>
				<el-button v-if="tab == '出方向'" type="primary" @click="createsFormVisible = true">添加安全组规则</el-button>
			</section>
		</header>
		<el-tabs type="border-card" class="configur"  @tab-click="tabChangeHnadle">
			<el-tab-pane label="入方向" >
				<div class="content security_tab">
					<el-table ref="multipleTable" :data="indata" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.3)" v-loading="!data.length" tooltip-effect="dark" style="width: 100%" class="m-table" @selection-change="handleSelectionChange">
						<el-table-column type="selection" width="55">
						</el-table-column>
						<el-table-column label="授权策略" width="100">
							<template slot-scope="scope">
								<p>{{ scope.row.Policy }}</p>
							</template>
						</el-table-column>
						<el-table-column label="协议类型" width="120">
							<template slot-scope="scope">
								<p>{{ scope.row.IpProtocol }}</p>
							</template>
						</el-table-column>
						<el-table-column label="端口范围" width="130">
							<template slot-scope="scope">
								<p>{{ scope.row.PortRange }}</p>
							</template>
						</el-table-column>
						
						<el-table-column label="授权类型" width="180">
							<template slot-scope="scope">
								<p>{{scope.row.NicType === 'internet' ? 'IPv4地址段访问' : '安全组访问'}}</p>
							</template>
						</el-table-column>
						<el-table-column label="授权对象" width="180">
							<template slot-scope="scope">
								<p>{{ scope.row.SourceCidrIp }}  {{ scope.row.SourceGroupId }}</p>
							</template>
						</el-table-column>
						<el-table-column label="描述" width="180">
							<template slot-scope="scope">
								<p>{{ scope.row.Description }}</p>
							</template>
						</el-table-column>
						<el-table-column label="优先级" width="150">
							<template slot-scope="scope">
								<p>{{ scope.row.Priority }}</p>
							</template>
						</el-table-column>
						<el-table-column label="创建时间" width="200">
							<template slot-scope="scope">
								<p>{{ scope.row.CreateTime }}</p>
							</template>
						</el-table-column>
						<el-table-column label="操作">
					      <template slot-scope="scope">
					        <el-button size="mini" @click="editClick(scope.row)">修改</el-button>
					        <el-button size="mini" ><div @click="clickDelHandle(scope.row)">删除</div></el-button>
					      </template>
					    </el-table-column>
					</el-table>
					<div class="bottom flex flex-item">
						<section>
							<el-button size="mini" :disabled="!status.start" @click="removeSecurityHandle">删除</el-button>
						</section>
						<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.PageNumber" :page-sizes="[10, 50, 100]" :page-size="pagination.PageSize" layout="total, sizes, prev, pager, next" :total="pagination.TotalCount">
						</el-pagination>
					</div>
					<el-dialog class="dialog_create" title="添加安全组规则" :visible.sync="createFormVisible">
						<el-form :model="form" :rules="formRule" ref="form">
							<el-form-item label="网卡类型" prop="NicType">
							    <el-input v-model="form.NicType" disabled></el-input>
							</el-form-item>
							<el-form-item prop="Direction" label="规则方向" :label-width="formLabelWidth">
								<el-select v-model="form.Direction">
									<el-option value="入方向" label="入方向"></el-option>
									<el-option value="出方向" label="出方向"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item prop="Policy" label="授权策略" :label-width="formLabelWidth">
								<el-select v-model="form.Policy">
									<el-option value="允许" label="允许"></el-option>
									<el-option value="拒绝" label="拒绝"></el-option>
								</el-select>
							</el-form-item>
							
							<el-form-item prop="protocol" label="协议类型" :label-width="formLabelWidth">
								<el-select v-model="form.protocol" @change="seletProtocl" >
									<el-option v-for="(item,index) in nicTypeList" :key="item.id" :value="item" :label="item.value" :index="index"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item prop="PortRange" label="端口范围" :label-width="formLabelWidth">
								<el-input v-model="form.PortRange" :placeholder="form.PortRanges" :disabled="disabledIs"></el-input>
							</el-form-item>
							
							<el-form-item label="优先级" prop="Priority">
							    <el-input v-model="form.Priority"></el-input>
							</el-form-item>
							<el-form-item prop="nicType" label="授权类型" :label-width="formLabelWidth">
								<el-select v-model="form.nicType">
									<el-option v-for="(item, index) in nicType" :value="item" :label="item" :key="index"></el-option>
								</el-select>
    							<el-radio v-if="form.nicType =='安全组访问'" v-model="radiod" label="1">本账号授权</el-radio>
							</el-form-item>
							<el-form-item v-if="form.nicType =='IPv4地址段访问'" label="授权对象" prop="SourceCidrIp">
							    <el-input v-model="form.SourceCidrIp" :placeholder="form.SourceCidrIpPla"></el-input>
							</el-form-item>
							<el-form-item v-if="form.nicType =='安全组访问'" label="授权对象" prop="SourceGroupId">
								<el-select v-model="form.SourceGroupId">
							        <el-option v-for="(item, index) in sourceList" :value="item.SecurityGroupId" :key="index"  :label="item.SecurityGroupId"></el-option>
							    </el-select>
							</el-form-item>
							<el-form-item label="描述" :label-width="200" prop="Description">
						      <el-input type="textarea" rows="7" :maxlength="256" resize="none" v-model="form.Description" autocomplete="off"></el-input>
						      <span>长度为2-256个字符，不能以http://或https://开头。</span>
						    </el-form-item>
						</el-form>
						<div slot="footer" class="dialog-footer">
							<el-button @click="cancelCreateHandle">取 消</el-button>
							<el-button type="primary" @click="createHandle('form')">确 定</el-button>
						</div>
					</el-dialog>

					<el-dialog class="dialog_create" title="编辑安全组规则" :visible.sync="editShowVisible">
						<el-form :model="form" :rules="formRule" ref="form">
							<el-form-item label="网卡类型" prop="NicType">
							    <el-input v-model="form.NicType" readonly="readonly"></el-input>
							</el-form-item>
							<el-form-item prop="Direction" label="规则方向" :label-width="formLabelWidth">
								<el-select v-model="form.Direction">
									<el-option value="入方向" label="入方向"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item prop="Policy" label="授权策略" :label-width="formLabelWidth">
								<el-select v-model="form.Policy">
									<el-option value="允许" label="允许"></el-option>
									<el-option value="拒绝" label="拒绝"></el-option>
								</el-select>
							</el-form-item>
							
							<el-form-item prop="protocol" label="协议类型" :label-width="formLabelWidth">
								<el-select v-model="form.protocol" @change="seletProtocl" >
									<el-option v-for="(item,index) in nicTypeList" :key="item.id" :value="item" :label="item.value" :index="index"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item prop="PortRange" label="端口范围" :label-width="formLabelWidth">
								<el-input v-model="form.PortRange" :placeholder="form.PortRanges" :disabled="disabledIs"></el-input>
							</el-form-item>
							
							<el-form-item label="优先级" prop="Priority">
							    <el-input v-model="form.Priority"></el-input>
							</el-form-item>
							<el-form-item prop="nicType" label="授权类型" :label-width="formLabelWidth">
								<el-select v-model="form.nicType">
									<el-option v-for="(item, index) in nicType" :value="item" :label="item" :key="index"></el-option>
								</el-select>
    							<el-radio v-if="form.nicType =='安全组访问'" v-model="radiod" label="1">本账号授权</el-radio>
							</el-form-item>
							
							<el-form-item v-if="form.nicType =='IPv4地址段访问'" label="授权对象" prop="SourceCidrIp">
							    <el-input v-model="form.SourceCidrIp" :placeholder="form.SourceCidrIpPla"></el-input>
							</el-form-item>
							<el-form-item v-if="form.nicType =='安全组访问'" label="授权对象" prop="SourceGroupId">
								<el-select v-model="form.SourceGroupId">
							        <el-option v-for="(item, index) in sourceList" :value="item.SecurityGroupId" :key="index"  :label="item.SecurityGroupId"></el-option>
							    </el-select>
							</el-form-item>
							<el-form-item label="描述" :label-width="200" prop="Description">
						      <el-input type="textarea" rows="7" :maxlength="256" resize="none" v-model="form.Description" autocomplete="off"></el-input>
						      <span>长度为2-256个字符，不能以http://或https://开头。</span>
						    </el-form-item>
						</el-form>
						<div slot="footer" class="dialog-footer">
							<el-button @click="editShowVisible = false">取 消</el-button>
							<el-button type="primary" @click="confirmEditHandle('form')">确 定</el-button>
						</div>
					</el-dialog>
					<el-dialog class="dialog_create" title="删除安全组规则" :visible.sync="delShowVisible">
						<span>确定要删除该条规则？</span>
						<div slot="footer" class="dialog-footer">
							<el-button @click="delShowVisible = false">取 消</el-button>
							<el-button type="primary" @click="confirmDelHandle">确 定</el-button>
						</div>
					</el-dialog>
					<el-dialog class="dialog_create" title="删除安全组" :visible.sync="removeVisible">
						<p>确定要将执行所选规则移除安全组吗？</p>
						<div slot="footer" class="dialog-footer">
							<el-button @click="removeVisible = false">取 消</el-button>
							<el-button type="primary" @click="confirmRemove">确 定</el-button>
						</div>
					</el-dialog>				
				</div>
			</el-tab-pane>
			
			<el-tab-pane label="出方向">
				<div class="content security_tab">
					<el-table ref="multipleTable" :data="outdata" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.3)" v-loading="!data.length" tooltip-effect="dark" style="width: 100%" class="m-table" @selection-change="handleSelectionChange">
						<el-table-column type="selection" width="55">
						</el-table-column>
						<el-table-column label="授权策略" width="100">
							<template slot-scope="scope">
								<p>{{ scope.row.Policy }}</p>
							</template>
						</el-table-column>
						<el-table-column label="协议类型" width="120">
							<template slot-scope="scope">
								<p>{{ scope.row.IpProtocol }}</p>
							</template>
						</el-table-column>
						<el-table-column label="端口范围" width="130">
							<template slot-scope="scope">
								<p>{{ scope.row.PortRange }}</p>
							</template>
						</el-table-column>
						
						<el-table-column prop="name" label="授权类型" width="180">
							<template slot-scope="scope">
								<p>{{scope.row.NicType === 'internet' ? 'IPv4地址段访问' : '安全组访问'}}</p>
							</template>
						</el-table-column>
						<el-table-column label="授权对象" width="180">
							<template slot-scope="scope">
								<p>{{ scope.row.DestCidrIp }}  {{ scope.row.DestGroupId }}</p>
							</template>
						</el-table-column>
						<el-table-column label="描述" width="180">
							<template slot-scope="scope">
								<p>{{ scope.row.Description }}</p>
							</template>
						</el-table-column>
						<el-table-column label="优先级" width="150">
							<template slot-scope="scope">
								<p>{{ scope.row.Priority }}</p>
							</template>
						</el-table-column>
						<el-table-column label="创建时间" width="200">
							<template slot-scope="scope">
								<p>{{ scope.row.CreateTime }}</p>
							</template>
						</el-table-column>
						<el-table-column label="操作">
					      <template slot-scope="scope">
					        <!--<el-button size="mini" @click="editClick(scope.row)">修改</el-button>-->
					        <!--<el-button size="mini" >克隆</el-button>-->
					        <el-button size="mini" ><div @click="clickDeleteOut(scope.row)">删除</div></el-button>
					      </template>
					    </el-table-column>
					</el-table>
					<div class="bottom flex flex-item">
						<section>
							<el-button size="mini" :disabled="!status.start" @click="removeoutHandle">删除</el-button>
						</section>
						<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.PageNumber" :page-sizes="[10, 50, 100]" :page-size="pagination.PageSize" layout="total, sizes, prev, pager, next" :total="pagination.TotalCount">
						</el-pagination>
					</div>
				</div>
				<el-dialog class="dialog_create" title="添加安全组规则" :visible.sync="createsFormVisible">
						<el-form :model="form" :rules="formRule" ref="form">
							<el-form-item label="网卡类型" prop="NicType">
							    <el-input v-model="form.NicType" disabled></el-input>
							</el-form-item>
							<el-form-item prop="Direction" label="规则方向" :label-width="formLabelWidth">
								<el-select v-model="form.Direction">
									<el-option value="入方向" label="入方向"></el-option>
									<el-option value="出方向" label="出方向"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item prop="Policy" label="授权策略" :label-width="formLabelWidth">
								<el-select v-model="form.Policy">
									<el-option value="允许" label="允许"></el-option>
									<el-option value="拒绝" label="拒绝"></el-option>
								</el-select>
							</el-form-item>
							
							<el-form-item prop="protocol" label="协议类型" :label-width="formLabelWidth">
								<el-select v-model="form.protocol" @change="seletProtocl" >
									<el-option v-for="(item,index) in nicTypeList" :key="item.id" :value="item" :label="item.value" :index="index"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item prop="PortRange" label="端口范围" :label-width="formLabelWidth">
								<el-input v-model="form.PortRange" :placeholder="form.PortRanges" :disabled="disabledIs"></el-input>
							</el-form-item>
							
							<el-form-item label="优先级" prop="Priority">
							    <el-input v-model="form.Priority"></el-input>
							</el-form-item>
							<el-form-item prop="nicType" label="授权类型" :label-width="formLabelWidth">
								<el-select v-model="form.nicType">
									<el-option v-for="(item, index) in nicType" :value="item" :label="item" :key="index"></el-option>
								</el-select>
    							<el-radio v-if="form.nicType =='安全组访问'" v-model="radiod" label="1">本账号授权</el-radio>
							</el-form-item>
							<el-form-item v-if="form.nicType =='IPv4地址段访问'" label="授权对象" prop="SourceCidrIp">
							    <el-input v-model="form.SourceCidrIp" :placeholder="form.SourceCidrIpPla"></el-input>
							</el-form-item>
							<el-form-item v-if="form.nicType =='安全组访问'" label="授权对象" prop="SourceGroupId">
								<el-select v-model="form.SourceGroupId">
							        <el-option v-for="(item, index) in sourceList" :value="item.SecurityGroupId" :key="index"  :label="item.SecurityGroupId"></el-option>
							    </el-select>
							</el-form-item>
							<el-form-item label="描述" :label-width="200" prop="Description">
						      <el-input type="textarea" rows="7" :maxlength="256" resize="none" v-model="form.Description" autocomplete="off"></el-input>
						      <span>长度为2-256个字符，不能以http://或https://开头。</span>
						    </el-form-item>
						</el-form>
						<div slot="footer" class="dialog-footer">
							<el-button @click="cancelCreateHandle">取 消</el-button>
							<el-button type="primary" @click="createHandles('form')">确 定</el-button>
						</div>
					</el-dialog>
					<el-dialog class="dialog_create" title="删除安全组规则" :visible.sync="deloutShowVisible">
						<span>确定要删除该条出方向规则？</span>
						<div slot="footer" class="dialog-footer">
							<el-button @click="deloutShowVisible = false">取 消</el-button>
							<el-button type="primary" @click="confirmDelOutHandle">确 定</el-button>
						</div>
					</el-dialog>
					<el-dialog class="dialog_create" title="删除安全组" :visible.sync="removeOutVisible">
						<p>确定要将执行所选规则移除安全组吗？</p>
						<div slot="footer" class="dialog-footer">
							<el-button @click="removeOutVisible = false">取 消</el-button>
							<el-button type="primary" @click="confirmOutRemove">确 定</el-button>
						</div>
					</el-dialog>	
			</el-tab-pane>
		</el-tabs>

	</div>
</template>
<script>
import Json from '../../static/json/instance.json'

export default {
	name: 'instance',
	data() {
		var validInsatnceId = (rule, value, callback) => {
			if(value === '') {
				callback(new Error('请选择实例ID'));
			} else {
				callback();
			}
		};
		return {
			tab: '入方向',
			indata: [],
			outdata: [],
			editShowVisible: false,
			delShowVisible: false,
			deloutShowVisible: false, // 删除出方向
			removeOutVisible: false, 
			securityId: null, // 安全组id
			instanceIdList: [],
			nicTypeList: Json.nicTypeList,
			nicType: ["IPv4地址段访问", "安全组访问"],
			pagination: {
				PageNumber: 1,
				PageSize: 10,
				TotalCount: 0
			},
			createFormVisible: false,
			createsFormVisible: false,
			removeVisible: false,
			form: {
				NicType: '内网',
				Direction: '入方向',
				Policy: '允许',
				protocol: '自定义TCP',
				nicType: "IPv4地址段访问",
				PortRange: '',
				PortRanges: '例如：22/22或3389/3389',
				Priority: 1,
				SourceCidrIp: '',
				SourceCidrIpPla: '例如:10.x.y.z/32，添加规则时支持多组授权对象，用","隔开，最多支持10组授权对象。',
				SourceGroupId: null,
				Description: null,
			},
			radiod: '1',
			status: {
				start: false
			},
			selection: [],
			itemGroupInfo: {},
			outItemInfo: {},
			formRule:{ 
				PortRange: [{required: true, message: '端口范围不能为空', trigger: 'blur' }],
				Priority: [{required: true, message: '优先级不能为空', trigger: 'blur' }],
				SourceCidrIp: [{required: true, message: '授权对象不能为空', trigger: 'blur' }]
			},
			sourceList: [],
			disabledIs: false,
			label: 'tcp'
		}
	},
	methods: {
		seletProtocl(item) {
			this.disabledIs = item.canFill
			this.label = item.label
//			this.form.protocol = item.label
			this.form.PortRanges = this.nicTypeList[item.id].portdata
		},
		tabChangeHnadle(value) {
			this.tab = value.label
			this.createFormVisible = false
			this.createsFormVisible = false
			if(value.label == '入方向') {
				this.form.Direction = '入方向'
			}else {
				this.form.Direction = '出方向'
			}
		},
		async getList(noreset) {
			this.data = []
			this.indata = []
			this.outdata = []
			const data = await this.$http.ruleList({
				PageNumber: this.pagination.PageNumber,
				PageSize: this.pagination.PageSize,
				SecurityGroupId: localStorage.getItem('sid')
//				SecurityGroupId: 'sg-hp30ph85fxvt0c7wgvvd'
			})
			this.data = data.Permissions.Permission
			this.data.map((item, i) => {
				if(item.Direction == 'ingress') {
					this.indata.push(item)
				}else {
					this.outdata.push(item)
				}
			})
			this.indata.map((v,i) => {
				v.CreateTime = this.timeChange(v.CreateTime)
			})
			this.$http.security_list({
			}).then( res => {
				let sourcelist = res.SecurityGroups.SecurityGroup
				sourcelist.map((v, i) => {
					if(v.SecurityGroupId != this.securityId) {
						this.sourceList .push(v)
					}
				})
			})
		},
		createHandle(formName) {
			this.$refs[formName].validate((valid) => {
				if(valid) {
					this.$http.inrule({
						SecurityGroupId: this.securityId,
						NicType: this.form.NicType == '内网'? 'intranet' : 'internet',  //  网卡类型
						Policy: this.form.Policy == '允许' ? 'Accept': 'Drop',   // 授权策略
						IpProtocol: this.label, // 协议类型
						PortRange: this.form.PortRange,  //  端口范围
						Priority: this.form.Priority,   // 优先级
						SourceCidrIp:  this.form.nicType=="IPv4地址段访问"? this.form.SourceCidrIp : '',   // 授权对象
						SourceGroupId: this.form.nicType=="安全组访问"? this.form.SourceGroupId : '', // 授权对象
						Description: this.form.Description     //  描述
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
		createHandles(formName) {
			this.$refs[formName].validate((valid) => {
				if(valid) {
					this.$http.outrule({
						SecurityGroupId: this.securityId,
						NicType: this.form.NicType == '内网'? 'intranet' : 'internet',  //  网卡类型
						Policy: this.form.Policy == '允许' ? 'Accept': 'Drop',   // 授权策略
						IpProtocol: this.label, // 协议类型
						PortRange: this.form.PortRange,  //  端口范围
						Priority: this.form.Priority,   // 优先级
						DestCidrIp:  this.form.nicType=="IPv4地址段访问"? this.form.SourceCidrIp : '',   // 授权对象
						DestGroupId: this.form.nicType=="安全组访问"? this.form.SourceGroupId : '', // 授权对象
						Description: this.form.Description     //  描述
					}).then((res) => {
						if(res.RequestId) {
							this.createsFormVisible = false
							this.getList()
							this.$refs[formName].resetFields();
						}
					})
				}
			})

		},
		cancelCreateHandle() {
			this.createsFormVisible = false
			this.$refs['form'].resetFields();
		},
		editClick(item) { //  点击编辑规则 
			this.editShowVisible = true
//			this.form = item
			this.form.NicType = (item.NicType == "intranet") ? '内网' : '公网',
			this.form.Policy = (item.Policy == "Accept") ? '允许':'拒绝'
			this.form.Direction = (item.Direction == 'ingress') ? '入方向': '出方向'
			this.nicTypeList.map((v,i) => {
				if(item.IpProtocol == (v.label).toLowerCase()) {
					this.form.protocol = v.value
				}
			})
			this.form.nicType = (item.SourceCidrIp&&item.SourceCidrIp!='') ? 'IPv4地址段访问' : '安全组访问'
			this.form.SourceCidrIp = item.SourceCidrIp
			this.form.SourceGroupId = item.SourceGroupId
			this.form.Description = item.Description
			this.form.Priority = item.Priority
			this.form.PortRange = item.PortRange
		},
		confirmEditHandle() {  // 确定编辑规则
			this.$http.edit_inrule({
				SecurityGroupId: this.securityId,
				NicType: this.form.NicType == '内网'? 'intranet' : 'internet',  //  网卡类型
				Policy: this.form.Policy == '允许' ? 'accept': '',   // 授权策略
				IpProtocol: this.label, // 协议类型
				PortRange: this.form.PortRange,  //  端口范围
				Priority: this.form.Priority,   // 优先级
				SourceCidrIp:  this.form.nicType=="IPv4地址段访问"? this.form.SourceCidrIp : '',   // 授权对象
				SourceGroupId: this.form.nicType=="安全组访问"? this.form.SourceGroupId : '', // 授权对象
				Description: this.form.Description     //  描述
			}).then((res) => {
				if(res.RequestId) {
					this.editShowVisible = false
					this.getList()
					this.success('修改成功！')
				}
			})
		},
		clickDelHandle(item) {  // 点击删除
			this.itemGroupInfo = item
			this.delShowVisible = true
		},
		clickDeleteOut(item) {  // 出方向删除
			this.outItemInfo = item
			this.deloutShowVisible = true
		},
		confirmDelHandle() {
			this.$http.del_inrule({
				SecurityGroupId: this.securityId,
				NicType: this.itemGroupInfo.NicType ,  //  网卡类型
				Policy: this.itemGroupInfo.Policy,   // 授权策略
				IpProtocol: this.itemGroupInfo.IpProtocol, // 协议类型
				PortRange: this.itemGroupInfo.PortRange,  //  端口范围
				Priority: this.itemGroupInfo.Priority,   // 优先级
				SourceCidrIp:  this.itemGroupInfo.SourceCidrIp,   // 授权对象
				SourceGroupId: this.itemGroupInfo.SourceGroupId, // 授权对象
				Description: this.itemGroupInfo.Description     //  描述
			}).then((res) => {
				if(res.RequestId) {
					this.success('删除成功！')
					this.getList(true)
					this.delShowVisible = false
				}
			})
		},
		confirmDelOutHandle() {
			this.$http.del_outrule({
				SecurityGroupId: this.securityId,
				NicType: this.outItemInfo.NicType ,  //  网卡类型
				Policy: this.outItemInfo.Policy,   // 授权策略
				IpProtocol: this.outItemInfo.IpProtocol, // 协议类型
				PortRange: this.outItemInfo.PortRange,  //  端口范围
				Priority: this.outItemInfo.Priority,   // 优先级
				DestCidrIp:  this.outItemInfo.DestCidrIp,   // 授权对象
				DestGroupId: this.outItemInfo.DestGroupId, // 授权对象
				Description: this.outItemInfo.Description     //  描述
			}).then((res) => {
				if(res.RequestId) {
					this.success('删除成功！')
					this.getList(true)
					this.deloutShowVisible = false
				}
			})
		},
		success(text) {
			this.$message({
				message: text,
				type: 'success'
			});
		},
		handleSizeChange(i) {
			this.pagination.PageSize = i
			this.getList()
		},
		handleCurrentChange(i) {
			this.pagination.PageNumber = i
			this.getList()
		},
		filterNetwork(value, row) {
			return row.InstanceNetworkType === value
		},
		resetStatus() {
			this.status = {
				start: false
			}
		},
		statusChange(status) {
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
		handleSelectionChange(item) {
			const { length } = item
			this.selection = item
			this.resetStatus()
			if(length) this.status.start = true

		},
		removeSecurityHandle() { // 删除安全组
			this.removeVisible = true
		},
		removeoutHandle() {  // 删除出方向列表
			this.removeOutVisible = true
		},
		confirmRemove() { // 确定删除安全组
			let arr = []
			this.selection.map((v, i) => {
				arr.push(this.$http.del_inrule({
					SecurityGroupId: this.securityId,
					NicType: v.NicType ,  //  网卡类型
					Policy: v.Policy,   // 授权策略
					IpProtocol: v.IpProtocol, // 协议类型
					PortRange: v.PortRange,  //  端口范围
					Priority: v.Priority,   // 优先级
					SourceCidrIp:  v.SourceCidrIp,   // 授权对象
					SourceGroupId: v.SourceGroupId, // 授权对象
					Description: v.Description     //  描述
				}))
			})
			Promise.all(arr).then(res => {
				this.success('移除成功！')
				this.resetStatus()
				this.removeVisible = false
				this.getList(true)
			})
		},
		confirmOutRemove() { // 确定删除安全组
			let arr = []
			this.selection.map((v, i) => {
				arr.push(this.$http.del_outrule({
					SecurityGroupId: this.securityId,
					NicType: v.NicType ,  //  网卡类型
					Policy: v.Policy,   // 授权策略
					IpProtocol: v.IpProtocol, // 协议类型
					PortRange: v.PortRange,  //  端口范围
					Priority: v.Priority,   // 优先级
					DestCidrIp:  v.DestCidrIp,   // 授权对象
					DestGroupId: v.DestGroupId, // 授权对象
					Description: v.Description     //  描述
				}))
			})
			Promise.all(arr).then(res => {
				this.success('删除成功！')
				this.resetStatus()
				this.removeOutVisible = false
				this.getList(true)
			})
		},
		timeChange(time) {
			let d = new Date(time);
			return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
		}
	},
	created() {
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
	}
</style>