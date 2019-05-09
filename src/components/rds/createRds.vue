<template>
    <div class="account-mange manags create-rds">
        <div class="data-header">
            <div class="header-left">
                <span class="title">云数据库 RDS</span>
            </div>
        </div>
        <!-- tab栏 -->
        <div class="mange-tab">
            <span :class="{ 'active': currentIndex == 0 }" @click="selectItem(0)">包年包月</span>
            <span :class="{ 'active': currentIndex == 1 }" @click="selectItem(1)">按量付费</span>
            <i class="tips">购买须知推荐使用<a href="javascript:;">云数据库POLARDB</a>，100%MySQL兼容，更快更弹，自带只读节点，数据自适应扩展，存储三副本，更可靠</i>
            <a href="javasctipt:;" class="tips pur-info">购买须知</a>
        </div>
        <!-- 属性 -->
        <div class="rds-attribute">
            <!-- 基本配置 -->
            <div class="attribute-item">
                <div class="item-left">基本配置</div>
                <div class="item-right">
                    <div class="item">
                        <div class="title">地域 :</div>
                        <el-row>
                            <el-button :class="{'active': index == areaIndex}" @click="getArea(item, index)" v-for="(item, index) in createRdsInfo.baseInfo.area" :key="index">{{ item }}</el-button>
                        </el-row>
                        <span class="area-tips">不同地域之间的产品内网不互通；订购后不支持更换地域，请谨慎选择 <a href="javascript:;">教我选择>></a></span>
                    </div>
                    <div class="item">
                        <div class="title">数据库类型 :</div>
                        <el-row>
                            <el-button :class="{'active': index == dataTypeIndex}" @click="getDataType(item, index)" v-for="(item, index) in createRdsInfo.baseInfo.dataType" :key="index">{{ item }}</el-button>
                        </el-row>
                    </div>
                    <div class="item">
                        <div class="title">版本 :</div>
                        <el-row>
                            <el-button :class="{'active': index == versionIndex}" @click="geVersion(item, index)" v-for="(item, index) in createRdsInfo.baseInfo.version" :key="index">{{ item }}</el-button>
                        </el-row>
                    </div>
                    <div class="item series">
                        <div class="title">系列 :</div>
                        <el-row>
                            <el-button :class="{'active': index == seriesIndex }" @click="getseries(item, index)" v-for="(item, index) in createRdsInfo.baseInfo.series" :key="index">{{ item }}</el-button>
                        </el-row>
                        <span class="area-tips"><a href="javascript:;">上云评估工具>></a></span>
                        <a class="select" href="javascript:;">教我选择>></a>
                        <i class="el-icon-question"></i>
                    </div>
                    <div class="item">
                        <div class="title">存储类型 :</div>
                        <el-row>
                            <el-button :class="{'active': index == storageIndex }" @click="getStorage(item, index)" v-for="(item, index) in createRdsInfo.baseInfo.storageType" :key="index">{{ item }}</el-button>
                        </el-row>
                        <a class="select" href="javascript:;">教我选择>></a>
                    </div>
                    <div class="item">
                        <div class="title">可用区 :</div>
                            <el-select v-model="userArea" @change="selectArea" placeholder="华东1 可用区H">
                                <el-option
                                    v-for="item in createRdsInfo.baseInfo.options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <a class="select" href="javascript:;">资源不足？请反馈>></a>
                    </div>
                </div>
            </div>
            <!-- 网络 -->
            <div class="attribute-item">
                <div class="item-left">网络</div>
                <div class="item-right">
                    <div class="item">
                        <div class="title">网络类型 :</div>
                        <el-row>
                            <el-button :class="{'active': index == netWorkIndex }" @click="getNetwork(item, index)" v-for="(item, index) in createRdsInfo.baseInfo.networkType" :key="index">{{ item }}</el-button>
                        </el-row>
                        <a class="select" href="javascript:;">教我选择>></a>
                        <i class="el-icon-question"></i>
                        <div class="network-select">
                            <el-button :class="{ 'active': index == netIndex }" v-for="(item, index) in createRdsInfo.baseInfo.netType" @click="getNet(item, index)" :key="index">{{ item }}</el-button>
                        </div>
                        <span class="network-info">如需其他专有网络或者虚拟交换机，可以<a href="javascript:;">到控制台创建</a>。如果你找不到新加入的专有网络请<a href="javascript:;">点击刷新</a></span>
                    </div>
                </div>
            </div>
            <!-- 实例规格 -->
            <div class="attribute-item">
                <div class="item-left">实例规格</div>
                <div class="item-right">
                    <div class="item">
                        <div class="title">规格 :</div>
                            <el-select  v-model="specifications" @change="getSepec" placeholder="华东1 可用区H">
                                <el-option
                                    v-for="item in createRdsInfo.baseInfo.specifications"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        <a class="select" href="javascript:;">规格代码: ({{ specCodeArr.specCode }})</a>
                        <i class="el-icon-question"></i>
                        <span class="specifications-info">最大连接数：{{ specCodeArr.maxConnectNum }} ; IOPS：{{ specCodeArr.iops }}</span>
                    </div>
                </div>
            </div>
            <!-- 存储 -->
            <div class="attribute-item">
                <div class="item-left">存储</div>
                <div class="item-right">
                    <div class="item">
                        <div class="title">存储空间 :</div>
                        <slider1 @increase="getIncrease" :value="per" min=0 max=100 v-model="per"></slider1>
                        <input class="number" step="5" min="0" max="6000" type="number" v-model="buyInfo.storageRoom" placeholder=""/>
                        <i class="unit">GB</i>
                        <span class="per-info">步长为5GB。本地SSD盘的独享套餐等规格由于资源独享的原因，存储空间大小和实例规格绑定。SSD云盘版不受此限制。<a href="javascript:;">详细</a></span>
                    </div>
                </div>
            </div>
            <!-- 购买量 -->
            <div class="attribute-item">
                <div class="item-left">购买量</div>
                <div class="item-right">
                    <div class="item" v-if="this.buyInfo.payType == 'Prepaid'">
                        <div class="title">购买时长 :</div>
                        <month-slider @currentMonth="getBuyMonth" :value="per" :min=0 :max=100 v-model="per"></month-slider>
                    </div>
                    <div class="item">
                        <div class="title">数量 :</div>
                        <input class="number" step="1" min="0" max="100" type="number" v-model="buynum" placeholder=""/>
                    </div>
                </div>
            </div>
        </div>
        <!-- 购买-->
        <div class="buy">
            <div class="buy-top">
                当前配置
            </div>
            <div class="buy-content">
                <div class="content-item">
                    <span class="title">地域 : </span>
                    <span class="name">{{ buyInfo.area }}</span>
                </div>
                <div class="content-item">
                    <span class="title">网络 : </span>
                    <span class="name">{{ buyInfo.networkType }}</span>
                </div>
                <div class="content-item">
                    <span class="title">数据库类型 : </span>
                    <span class="name">{{ buyInfo.dataType }} {{ buyInfo.dataVersion }}</span>
                </div>
                <div class="content-item">
                    <span class="title">存储空间 :</span>
                    <span class="name">{{ buyInfo.storageRoom }}GB {{ buyInfo.per }}</span>
                </div>
                <div class="content-item">
                    <span class="title">规格 :</span>
                    <span class="name">{{ buyInfo.specifications }}</span>
                </div>
                <div v-show="buyInfo.payType == 'Prepaid'" class="content-item">
                    <span class="title">购买时长 :</span>
                    <span class="name">{{ buyInfo.buyMonth }}个{{ timeType }}</span>
                </div>
                <div class="content-item">
                    <span class="title">购买量 :</span>
                    <span class="name">{{ buynum + '个' }}</span>
                </div>
                <div class="content-item">
                    <span class="title">配置费用</span>
                    <span v-if="buyInfo.configCoast == 0" class="name">正在计算中...</span>
                    <div v-else style="display: flex; flex-direction: column;">
                        <span class="name" v-if="buyInfo.payType == 'Prepaid' ">￥ {{ buyInfo.configCoast  }} </span>
                        <span class="name" v-else>￥ {{ buyInfo.configCoast }} /小时 </span>
                        <span class="pre-price">优惠￥ {{ buyInfo.preferentialCoast }}</span>
                    </div>
                </div>
                <div class="content-item">
                    <i class="el-icon-goods"></i>
                    <span class="name">1年付立享85折优惠价</span>
                </div>
                <div class="content-item">
                    <button @click="goBuy" :class="{ 'disabled': buyInfo.configCoast == 0 }" :disabled="buyInfo.configCoast == 0" class="buy-now">立即购买</button>
                    <button class="add-cart">加入购物车</button>
                </div>
                <div class="content-item">
                    <span>数据库备份空间超出免费空间后会产生费用</span>
                    <span>阿里云产品价格说明</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import slider from './slider.vue'
import monthSlider from './monthSlider.vue'

export default {
    name: 'create-rds',
    data () {
        return {
            currentIndex: 0,
            areaIndex : 0,
            dataTypeIndex: 0,
            versionIndex: 0,
            seriesIndex: 0,
            storageIndex: 0,
            netWorkIndex: 0,
            netIndex: 0,
            timeType: '月',
            createRdsInfo: {
                baseInfo: {
                    area: ['华东 1（杭州）', '华东 2（上海）',  '华北 1（青岛）', '华北 2（北京）', '华北 3（张家口）', '华北 5（呼和浩特）', '香港', ' 新加坡 ', ' 美西 1（硅谷）', ' 美东 1（弗吉尼亚）', ' 日本 ', '欧洲中部 1 (法兰克福)', '中东东部 1 (迪拜)', '亚太东南 2 (悉尼)', '亚太东南 3 (吉隆坡)', '亚太南部 1 (孟买) ', '亚太东南 5 (雅加达)', '英国(伦敦)'],
                    dataType: ['MySQL', 'SQLServer', 'PostgreSQL', 'PPAS', 'MariaDB'],
                    version: ['5.7', '5.6', '5.5' ],
                    series: ['高可用版', '基础版'],
                    storageType: ['SSD云盘', '本地SSD盘'],
                    options: [
                        {
                            value: '华东1 可用区H',
                            label: '华东1 可用区H'
                        },
                        {
                            value: '多可用区（可用区H+可用区I）',
                            label: '多可用区（可用区H+可用区I）'
                        },
                        {
                            value: '多可用区8（可用区F+可用区G)',
                            label: '多可用区8（可用区F+可用区G)）'
                        },
                        {
                            value: '多可用区9（可用区G+可用区H)',
                            label: '多可用区9（可用区G+可用区H)'
                        },
                        {
                            value: '华东 1 可用区 F',
                            label: '华东 1 可用区 F'
                        },
                        {
                            value: '华东 1 可用区 G',
                            label: '华东 1 可用区 G'
                        }
                    ],
                    networkType: ['经典网络', '专有网络'],
                    netType: ['公网连接', '内网连接'],
                    networkSelInfospec: [
                        {
                            value: '默认专有网络',
                            label: '默认专有网络'
                        }
                    ],
                    networkSelInfo: [
                        {
                            value: '默认虚拟交换机',
                            label: '默认虚拟交换机'
                        }
                    ],
                    specifications:[
                        {
                            value: '1核 2GB',
                            label: '1核 2GB',
                            maxConNun: 	2000,
                            specCode: 'mysql.n2.small.2c'
                        },
                        {
                            value: '2核 4GB',
                            label: '2核 4GB',
                            maxConNun: 	4000,
                            specCode: 'mysql.n2.medium.2c'
                        },
                        {
                            value: '4 核 8G（独享套餐）',
                            label: '4 核 8G（独享套餐）',
                            maxConNun: 	6000,
                            specCode: 'mysql.x2.large.2c'
                        },
                        {
                            value: '4 核 16G（独享套餐）',
                            label: '4 核 16G（独享套餐）',
                            maxConNun: 	8000,
                            specCode: 'mysql.x4.large.2c'
                        },
                        {
                            value: '8 核 16G（独享套餐）',
                            label: '8 核 16G（独享套餐）',
                            maxConNun: 	8000,
                            specCode: 'mysql.x2.xlarge.2c'
                        },
                        {
                            value: '8 核 32G（独享套餐）',
                            label: '8 核 32G（独享套餐）',
                            maxConNun: 	10000,
                            specCode: 'mysql.x4.xlarge.2c'
                        },
                        {
                            value: '16 核 32G（独享套餐）',
                            label: '16 核 32G（独享套餐）',
                            maxConNun: 	10000,
                            specCode: 'mysql.x2.2xlarge.2c'
                        },
                        {
                            value: '16 核 64G（独享套餐）',
                            label: '16 核 64G（独享套餐）',
                            maxConNun: 	15000,
                            specCode: 'mysql.x4.2xlarge.2c'
                        },
                        {
                            value: '16 核 128G（独享套餐）',
                            label: '16 核 128G（独享套餐）',
                            maxConNun: 	20000,
                            specCode: 'mysql.x8.2xlarge.2c'
                        },
                        {
                            value: '32 核 128G（独享套餐）',
                            label: '32 核 128G（独享套餐）',
                            maxConNun: 	20000,
                            specCode: 'mysql.x4.4xlarge.2c'
                        },
                        {
                            value: '32 核 256G（独享套餐）',
                            label: '32 核 256G（独享套餐）',
                            maxConNun: 	64000,
                            specCode: 'mysql.x8.4xlarge.2c'
                        },
                        {
                            value: '56 核 224G（独享套餐）',
                            label: '56 核 224G（独享套餐）',
                            maxConNun: 	64000,
                            specCode: 'mysql.x4.8xlarge.2c'
                        },
                        {
                            value: '56 核 480G（独享套餐）',
                            label: '56 核 480G（独享套餐）',
                            maxConNun: 	100000,
                            specCode: 'mysql.x8.8xlarge.2c'
                        },
                    ]
                }
            },
            userArea: '华东1 可用区H',
            networkInfo: '默认虚拟交换机',
            networkInfpspec: '默认专有网络',
            specifications: '1 核 2G',
            per: '0.5',
            Currentmonth: 0,
            buynum: 1,
            isStorageSpec: true,
            buyInfo: {
                city: '华东 1（杭州）',
                area: '华东1 可用区H',
                networkType: '经典网络',
                dataType: 'MySQL',
                dataVersion: '5.7',
                per: 'SSD云盘',
                storageRoom: '30',
                passValue: '',
                specifications: '1 核 2G',
                buyMonth: '1',
                configCoast: 0,
                preferentialCoast: 0,
                currentSeries: '高可用版',
                buyNum: 1,
                specCode: 'mysql.n2.small.2c',
                payType: 'Prepaid',
                netType: '公网连接'
            },
            isPurQuality: false,
            specCodeArr: {
                specCode: 'mysql.n2.small.2c',
                maxConnectNum: 0,
                iops: '0',
                storage: '20GB-1000GB'
            },
            timer: null
        }
    },
    computed: {
        currentPer(val) {
            return this.buyInfo.storageRoom;
        }
    },
    watch: {
        currentPer(val) {
            this.buyInfo.passValue = val / 60;
        }
    },
    filters: {
    },
    methods: {
        getNet(item, index) {
            this.netIndex = index;
            this.buyInfo.netType = item;
        },
        // 付费类型
        selectItem(index) {
            this.buyInfo.configCoast = 0;
            this.currentIndex = index;
            this.buyInfo.payType =  index == 0 ? 'Prepaid' : 'Postpaid';
            if (this.buyInfo.payType  == 'Prepaid') { // 表示包年包月
                this.getDefaultPrice();
            } else { // 按量付费
                this.payOfAmount();
            }
        },
        // 按量付费计算价格
        async payOfAmount() {
                this.specCodeArr.storage = this.specCodeArr.storage.replace(/GB/g, '');
                // 存储量限制
                if (this.specCodeArr.storage.indexOf('-') != -1) { // 表示存储量是区间值
                    let currentValue = this.specCodeArr.storage.split('-');
                    if ((Number(currentValue[0]) <= Number(this.buyInfo.storageRoom)) && (Number(this.buyInfo.storageRoom) <= Number(currentValue[1]))) {
                        this.isPurQuality = true;
                    } else {
                        this.isPurQuality = false;
                    }
                } else if (this.specCodeArr.storage.indexOf('/') != -1) { // 表示存储量选择值
                    let currentValue = this.specCodeArr.storage.split('/');
                        currentValue.forEach((item, index) => {
                            if (Number(this.buyInfo.storageRoom) != Number(item)) {
                                this.isPurQuality = false;
                            } else {
                                this.isPurQuality = true;
                            }
                        });
                } else { // 表示存储量是固定值
                    if(Number(this.buyInfo.storageRoom) != Number(this.specCodeArr.storage)) {
                        this.isPurQuality = false;
                    } else  {
                        this.isPurQuality =true;
                    }
                }
                if (this.isPurQuality) {
                    this.buyInfo.configCoast = 0;
                    let data = await this.$http.createRdsPrice({
                        Engine: this.buyInfo.dataType,
                        EngineVersion: this.buyInfo.dataVersion,
                        CommodityCode: 'bards',
                        DBInstanceClass: this.buyInfo.specCode,
                        DBInstanceStorage: this.buyInfo.storageRoom,
                        PayType: 'Postpaid',
                        UsedTime: 1,
                        TimeType: 'Hour',
                        Quantity: this.buynum
                    });
                    if (data) {
                        this.buyInfo.configCoast = data.PriceInfo.OriginalPrice.toFixed(2)
                        this.buyInfo.preferentialCoast = data.PriceInfo.DiscountPrice.toFixed(2);
                    }
                } else {
                    this.$message.error(`该类型存储空间范围为${ this.specCodeArr.storage }`);
                    this.isStorageSpec = false;
                }
        },
        getArea(item, index) {
            this.areaIndex = index;
            this.buyInfo.city = item;
        },
        // 数据库类型以及数据库型号
        getDataType(item, index) {
            this.dataTypeIndex = index;
            this.buyInfo.dataType = item;
            switch(item) {
                case 'MySQL':
                    this.createRdsInfo.baseInfo.version = ['5.7', '5.6', '5.5'];
                    this.versionIndex = 0;
                    break;
                case 'SQLServer':
                    this.createRdsInfo.baseInfo.version = ['2008r2', '2012', '2016', '2017', '2012标准', '2012_web', '2016标准', '2016_web'];
                    this.buyInfo.dataVersion = '2008r2'
                    this.versionIndex = 0;
                    break;
                case 'PostgreSQL':
                    this.createRdsInfo.baseInfo.version = ['9.4', '10.0'];
                    this.buyInfo.dataVersion = '9.4'
                    this.versionIndex = 0;
                    break;
                case 'PPAS':
                    this.createRdsInfo.baseInfo.version = ['9.3', '10.0'];
                    this.buyInfo.dataVersion = '9.3'
                    this.versionIndex = 0;
                    break;
                case 'MariaDB':
                    this.createRdsInfo.baseInfo.version = ['10.3'];
                    this.buyInfo.dataVersion = '10.3'
                    this.versionIndex = 0;
                    break;
            }
            this.getseriazedArr();
        },
        //根据数据库类型与数据库
        getseriazedArr() {
            if (this.buyInfo.dataType == 'MySQL' && (this.buyInfo.dataVersion == '5.7' || this.buyInfo.dataVersion == '5.6' || this.buyInfo.dataVersion == '5.5' )) {
                if (this.buyInfo.per == 'SSD云盘' ) {
                    this.createRdsInfo.baseInfo.series = ['高可用版', '基础版'];
                } else if (this.buyInfo.per == '本地SSD盘') {
                    this.createRdsInfo.baseInfo.series = ['高可用版', '金融版'];
                }
            } else if (this.buyInfo.dataType == 'SQLServer') {
                if (this.buyInfo.dataVersion == '2017') {
                    this.createRdsInfo.baseInfo.series = ['集群版'];
                } else if(this.buyInfo.dataVersion == '2012_web' || this.buyInfo.dataVersion == '2016_web') {
                    this.createRdsInfo.baseInfo.series = ['基础版'];
                } else if (this.buyInfo.dataVersion == '2008r2' || this.buyInfo.dataVersion == '2012' || this.buyInfo.dataVersion == '2016' || this.buyInfo.dataVersion == '2012标准' || this.buyInfo.dataVersion == '2016标准') {
                    this.createRdsInfo.baseInfo.series = ['高可用版'];
                }
            } else if(this.buyInfo.dataType == 'PostgreSQL') {
                if (this.buyInfo.dataVersion == '9.4' ) {
                    this.createRdsInfo.baseInfo.series = ['高可用版'];
                } else {
                    this.createRdsInfo.baseInfo.series = ['高可用版', '基础版'];
                }
            } else if(this.buyInfo.dataType == 'PPAS' || this.buyInfo.dataType == 'MariaDB') {
                this.createRdsInfo.baseInfo.series = ['高可用版'];
            }
            this.specList();
        },
        // 获取数据库版本
        geVersion(item, index) {
            this.versionIndex = index;
            this.buyInfo.dataVersion = item;
            this.getseriazedArr();
        },
        // 规格列表
        getseries(item, index) {
            this.seriesIndex = index;
            this.buyInfo.currentSeries = item;
            this.specList();
        },
        // 规格列表
        specList() {
            if (this.buyInfo.currentSeries == '基础版' && this.buyInfo.dataType == 'MySQL' && this.buyInfo.dataVersion == '5.7' && this.buyInfo.per =='SSD云盘') { // MySQL 5.7 SSD云盘 基础版
                this.createRdsInfo.baseInfo.specifications = [
                        {
                            value: '1 核 1G',
                            label: '1 核 1G',
                            maxConNun: 2000,
                            specCode: 'mysql.n1.micro.1'
                        },
                        {
                            value: '1 核 2G',
                            label: '1 核 2G',
                            maxConNun: 2000,
                            specCode: 'mysql.n2.small.1'
                        },
                        {
                            value: '2 核 4G',
                            label: '2 核 4G',
                            maxConNun: 6000,
                            specCode: 'mysql.n4.medium.1'
                        },
                        {
                            value: '2 核 8G',
                            label: '2 核 8G',
                            maxConNun: 6000,
                            specCode: 'mysql.n4.medium.1'
                        },
                        {
                            value: '4 核 8G',
                            label: '4 核 8G',
                            maxConNun: 6000,
                            specCode: 'mysql.n2.large.1'
                        },
                        {
                            value: '4 核 16G',
                            label: '4 核 16G',
                            maxConNun: 8000,
                            specCode: 'mysql.n4.large.1'
                        },
                        {
                            value: '8 核 16G',
                            label: '8 核 16G',
                            maxConNun: 8000,
                            specCode: 'mysql.n2.xlarge.1'
                        },
                        {
                            value: '8 核 32G',
                            label: '8 核 32G',
                            maxConNun: 10000,
                            specCode: 'mysql.n4.xlarge.1'
                        },
                        {
                            value: '16 核 32G',
                            label: '16 核 32G',
                            maxConNun: 	10000,
                            specCode: 'mysql.n2.2xlarge.1'
                        },
                        {
                            value: '16 核 64G',
                            label: '16 核 64G',
                            maxConNun: 	15000,
                            specCode: 'mysql.n4.2xlarge.1'
                        },
                        {
                            value: '16 核 128G',
                            label: '16 核 128G',
                            maxConNun: 	20000,
                            specCode: 'mysql.n8.2xlarge.1'
                        },
                        {
                            value: '32 核 128G',
                            label: '32 核 128G',
                            maxConNun: 	20000,
                            specCode: 'mysql.n4.4xlarge.1'
                        },
                        {
                            value: '32 核 256G',
                            label: '32 核 256G',
                            maxConNun: 	64000,
                            specCode: 'mysql.n8.4xlarge.1'
                        },
                        {
                            value: '56 核 224G',
                            label: '56 核 224G',
                            maxConNun: 	64000,
                            specCode: 'mysql.n4.8xlarge.1'
                        },
                        {
                            value: '56 核 480G',
                            label: '56 核 480G',
                            maxConNun: 	64000,
                            specCode: 'mysql.n8.8xlarge.1'
                        }
                ]
            } else if (this.buyInfo.currentSeries == '高可用版' && this.buyInfo.dataType == 'MySQL' && this.buyInfo.dataVersion == '5.7' && this.buyInfo.per =='SSD云盘' ){
                this.createRdsInfo.baseInfo.specifications = [
                        {
                            value: '1核 2GB',
                            label: '1核 2GB',
                            maxConNun: 	2000,
                            specCode: 'mysql.n2.small.2c'
                        },
                        {
                            value: '2核 4GB',
                            label: '2核 4GB',
                            maxConNun: 	4000,
                            specCode: 'mysql.n2.medium.2c'
                        },
                        {
                            value: '4 核 8G（独享套餐）',
                            label: '4 核 8G（独享套餐）',
                            maxConNun: 	6000,
                            specCode: 'mysql.x2.large.2c'
                        },
                        {
                            value: '4 核 16G（独享套餐）',
                            label: '4 核 16G（独享套餐）',
                            maxConNun: 	8000,
                            specCode: 'mysql.x4.large.2c'
                        },
                        {
                            value: '8 核 16G（独享套餐）',
                            label: '8 核 16G（独享套餐）',
                            maxConNun: 	8000,
                            specCode: 'mysql.x2.xlarge.2c'
                        },
                        {
                            value: '8 核 32G（独享套餐）',
                            label: '8 核 32G（独享套餐）',
                            maxConNun: 	10000,
                            specCode: 'mysql.x4.xlarge.2c'
                        },
                        {
                            value: '16 核 32G（独享套餐）',
                            label: '16 核 32G（独享套餐）',
                            maxConNun: 	10000,
                            specCode: 'mysql.x2.2xlarge.2c'
                        },
                        {
                            value: '16 核 64G（独享套餐）',
                            label: '16 核 64G（独享套餐）',
                            maxConNun: 	15000,
                            specCode: 'mysql.x4.2xlarge.2c'
                        },
                        {
                            value: '16 核 128G（独享套餐）',
                            label: '16 核 128G（独享套餐）',
                            maxConNun: 	20000,
                            specCode: 'mysql.x8.2xlarge.2c'
                        },
                        {
                            value: '32 核 128G（独享套餐）',
                            label: '32 核 128G（独享套餐）',
                            maxConNun: 	20000,
                            specCode: 'mysql.x4.4xlarge.2c'
                        },
                        {
                            value: '32 核 256G（独享套餐）',
                            label: '32 核 256G（独享套餐）',
                            maxConNun: 	64000,
                            specCode: 'mysql.x8.4xlarge.2c'
                        },
                        {
                            value: '56 核 224G（独享套餐）',
                            label: '56 核 224G（独享套餐）',
                            maxConNun: 	64000,
                            specCode: 'mysql.x4.8xlarge.2c'
                        },
                        {
                            value: '56 核 480G（独享套餐）',
                            label: '56 核 480G（独享套餐）',
                            maxConNun: 	100000,
                            specCode: 'mysql.x8.8xlarge.2c'
                        },
                ]
            } else if (this.buyInfo.currentSeries == '高可用版' && this.buyInfo.per =='本地SSD盘' && this.buyInfo.dataType == 'MySQL') {
                if (this.buyInfo.dataVersion == '5.7' || this.buyInfo.dataVersion == '5.6' || this.buyInfo.dataVersion == '5.5') {
                    this.createRdsInfo.baseInfo.specifications = [
                        {
                            value: '1核 1GB',
                            label: '1核 1GB',
                        },
                        {
                            value: '1核 2GB',
                            label: '1核 2GB',
                        },
                        {
                            value: '2核 4GB',
                            label: '2核 4GB',
                        },
                        {
                            value: '2核 8GB',
                            label: '2核 8GB',
                        },
                        {
                            value: '4核 8GB',
                            label: '4核 8GB',
                        },
                        {
                            value: '4核 16GB',
                            label: '4核 16GB',
                        },
                        {
                            value: '8核 16GB',
                            label: '8核 16GB',
                        },
                        {
                            value: '8核 32GB',
                            label: '8核 32GB',
                        },
                        {
                            value: '16核 64GB',
                            label: '16核 54GB',
                        },
                        {
                            value: '16核 96GB',
                            label: '16核 96GB',
                        },
                        { // 独享性
                            value: '4核 16GB（独享套餐）',
                            label: '4核 16GB（独享套餐）',
                        },
                        {
                            value: '8核 32GB（独享套餐）',
                            label: '8核 32GB（独享套餐）',
                        },
                        {
                            value: '16核 64GB（独享套餐）',
                            label: '16核 64GB（独享套餐）',
                        },
                        {
                            value: '32核 128GB（独享套餐）',
                            label: '32核 128GB（独享套餐）',
                        },
                        {
                            value: '2核 16GB（独享套餐）',
                            label: '2核 16GB（独享套餐）',
                        },
                        {
                            value: '4核 32GB（独享套餐）',
                            label: '4核 32GB（独享套餐）',
                        },
                        {
                            value: '8核 64GB（独享套餐）',
                            label: '8核 64GB（独享套餐）',
                        },
                        {
                            value: '16核 128GB（独享套餐）',
                            label: '16核 128GB（独享套餐）',
                        },
                        {
                            value: '30核 220GB（独占物理机型）',
                            label: '30核 220GB（独占物理机型）',
                        },
                        {
                            value: '60核 470GB（独占物理机型）',
                            label: '60核 470GB（独占物理机型）',
                        }
                    ]
                }
            } else if (this.buyInfo.currentSeries == '金融版' && this.buyInfo.per =='本地SSD盘' && this.buyInfo.dataType == 'MySQL') {
                if (this.buyInfo.dataVersion == '5.7' || this.buyInfo.dataVersion == '5.6' || this.buyInfo.dataVersion == '5.5') {
                    this.createRdsInfo.baseInfo.specifications = [
                        {
                            value: '4核 16GB（独享型（高CPU））',
                            label: '4核 16GB（独享型（高CPU））',
                        },
                        {
                            value: '8核 32GB（独享型（高CPU））',
                            label: '8核 32GB（独享型（高CPU））',
                        },
                        {
                            value: '16核 64GB（独享型（高CPU））',
                            label: '16核 64GB（独享型（高CPU））',
                        },
                        {
                            value: '32核 128GB（独享型（高CPU））',
                            label: '32核 128GB（独享型（高CPU））',
                        },
                        {
                            value: '2核 16GB（独享型（高内存））',
                            label: '2核 16GB（独享型（高内存））',
                        },
                        {
                            value: '4核 32GB（独享型（高内存））',
                            label: '4核 32GB（独享型（高内存））',
                        },
                        {
                            value: '8核 64GB（独享型（高内存））',
                            label: '8核 64GB（独享型（高内存））',
                        },
                        {
                            value: '16核 128GB（独享型（高内存））',
                            label: '16核 128GB（独享型（高内存））',
                        },
                        {
                            value: '32核 256GB（独享型（高内存））',
                            label: '32核 256GB（独享型（高内存））',
                        },
                        {
                            value: '60核 470GB（独占物理机型）',
                            label: '60核 470GB（独占物理机型）',
                        }
                    ]
                }
            } else if (this.buyInfo.currentSeries == '基础版' && this.buyInfo.dataType == 'SQLServer') {
                if (this.buyInfo.dataVersion == '2012') {
                    this.createRdsInfo.baseInfo.specifications = [
                        {
                            value: '2核 4GB',
                            label: '2核 4GB',
                        },
                        {
                            value: '2核 8GB',
                            label: '2核 8GB',
                        },
                        {
                            value: '4核 8GB',
                            label: '4核 8GB',
                        },
                        {
                            value: '4核 16GB',
                            label: '4核 16GB',
                        },
                        {
                            value: '8核 16GB',
                            label: '8核 16GB',
                        },
                        {
                            value: '8核 32GB',
                            label: '8核 32GB',
                        },
                        {
                            value: '16核 64GB',
                            label: '16核 64GB',
                        },
                    ]
                } else if (this.buyInfo.dataVersion == '2012_web' || this.buyInfo.dataVersion == '2016_web') {
                    this.createRdsInfo.baseInfo.specifications = [
                        {
                            value: '2核 4GB（独享套餐）',
                            label: '2 核 4G（独享套餐）',
                        },
                        {
                            value: '2核 8GB（独享套餐）',
                            label: '2 核 8G（独享套餐）',
                        },
                        {
                            value: '4核 8GB（独享套餐）',
                            label: '4 核 8GB（独享套餐）',
                        },
                        {
                            value: '4核 16GB（独享套餐）',
                            label: '4 核 16GB（独享套餐）',
                        },
                        {
                            value: '8核 16GB（独享套餐）',
                            label: '8核 16GB（独享套餐）',
                        },
                        {
                            value: '8核 32GB（独享套餐）',
                            label: '8核 32GB（独享套餐）',
                        },
                        {
                            value: '16核 32GB（独享套餐）',
                            label: '16核 32GB（独享套餐）'
                        },
                        {
                            value: '16核 64GB（独享套餐）',
                            label: '16核 64GB（独享套餐）'
                        }
                    ]
                }
            } else if (this.buyInfo.currentSeries == '高可用版' && this.buyInfo.dataType == 'SQLServer') {
                if(this.buyInfo.dataVersion == '2008r2') {
                    this.createRdsInfo.baseInfo.specifications = [
                        {
                            value: '2核 4GB',
                            label: '2 核 4GB'
                        },
                        {
                            value: '2核 8GB',
                            label: '2 核 8GB'
                        },
                        {
                            value: '4核 8GB',
                            label: '4核 8GB'
                        },
                        {
                            value: '4核 16GB',
                            label: '4核 16GB'
                        },
                        {
                            value: '8核 16GB',
                            label: '8核 16GB'
                        },
                        {
                            value: '8核 32GB',
                            label: '8核 32GB'
                        },
                        {
                            value: '16核 64GB',
                            label: '16核 64GB'
                        },
                        {
                            value: '16核 96GB',
                            label: '16核 96GB'
                        },
                        {
                            value: '2核 16GB（独享套餐）',
                            label: '2核 16GB（独享套餐）'
                        },
                        {
                            value: '4核 32GB（独享套餐）',
                            label: '4核 32GB（独享套餐）'
                        },
                        {
                            value: '8核 64GB（独享套餐）',
                            label: '8核 64GB（独享套餐）'
                        },
                        {
                            value: '16核 128GB（独享套餐）',
                            label: '16核 128GB（独享套餐）'
                        },
                        {
                            value: '30核 220GB（独占物理机型）',
                            label: '30核 220GB（独占物理机型）'
                        },
                        {
                            value: '60核 470GB（独占物理机型）',
                            label: '60核 470GB（独占物理机型）'
                        },
                    ]
                } else if (this.buyInfo.dataVersion == '2012' || this.buyInfo.dataVersion == '2016') { // 企业版
                    this.createRdsInfo.baseInfo.specifications = [
                        {
                            value: '2核 8GB（独享套餐）',
                            label: '2核 8GB（独享套餐）'
                        },
                        {
                            value: '2核 16GB（独享套餐）',
                            label: '2核 16GB（独享套餐）'
                        },
                        {
                            value: '4核 16GB（独享套餐）',
                            label: '4核 16GB（独享套餐）'
                        },
                        {
                            value: '4核 32GB（独享套餐）',
                            label: '4核 32GB（独享套餐）'
                        },
                        {
                            value: '8核 32GB（独享套餐）',
                            label: '8核 32GB（独享套餐）'
                        },
                        {
                            value: '8核 64GB（独享套餐）',
                            label: '8核 64GB（独享套餐）'
                        },
                        {
                            value: '16核 64GB（独享套餐）',
                            label: '16核 64GB（独享套餐）'
                        },
                        {
                            value: '16核 128GB（独享套餐）',
                            label: '16核 128GB（独享套餐）'
                        },
                        {
                            value: '24核 96GB（独享套餐）',
                            label: '24核 96GB（独享套餐）'
                        },
                        {
                            value: '32核 128GB（独享套餐）',
                            label: '32核 128GB（独享套餐）'
                        },
                        {
                            value: '32核 256GB（独享套餐）',
                            label: '32核 256GB（独享套餐）'
                        },
                        {
                            value: '56核 480GB（独享套餐）',
                            label: '56核 480GB（独享套餐）'
                        },
                        {
                            value: '64核 256GB（独享套餐）',
                            label: '64核 256GB（独享套餐）'
                        },
                        {
                            value: '64核 512GB（独享套餐）',
                            label: '64核 512GB（独享套餐）'
                        },
                    ]
                } else if ( this.buyInfo.dataVersion = '2012标准' || this.buyInfo.dataVersion == '2016标准') {
                    this.createRdsInfo.baseInfo.specifications = [
                        {
                            value: '2核 4GB',
                            label: '2核 4GB'
                        },
                        {
                            value: '4核 8GB',
                            label: '4核 8GB'
                        },
                        {
                            value: '8核 16GB',
                            label: '8核 16GB'
                        },
                        {
                            value: '16核 32GB',
                            label: '16核 32GB'
                        },
                        {
                            value: '2核 8GB（独享套餐）',
                            label: '2核 8GB（独享套餐）'
                        },
                        {
                            value: '2核 16GB（独享套餐）',
                            label: '2核 16GB（独享套餐）'
                        },
                        {
                            value: '4核 16GB（独享套餐）',
                            label: '4核 16GB（独享套餐）'
                        },
                        {
                            value: '4核 32GB（独享套餐）',
                            label: '4核 32GB（独享套餐）'
                        },
                        {
                            value: '8核 32GB（独享套餐）',
                            label: '8核 32GB（独享套餐）'
                        },
                        {
                            value: '8核 64GB（独享套餐）',
                            label: '8核 64GB（独享套餐）'
                        },
                        {
                            value: '16核 64GB（独享套餐）',
                            label: '16核 64GB（独享套餐）'
                        },
                        {
                            value: '16核 128GB（独享套餐）',
                            label: '16核 128GB（独享套餐）'
                        },
                        {
                            value: '24核 96GB（独享套餐）',
                            label: '24核 96GB（独享套餐）'
                        },
                    ]
                }
            } else if (this.buyInfo.currentSeries == '集群版' && this.buyInfo.dataType == 'SQLServer') {
                if(this.buyInfo.dataVersion == '2017' ) {
                    this.createRdsInfo.baseInfo.specifications = [
                        {
                            value: '2核 8GB（独享套餐）',
                            label: '2核 8GB（独享套餐）'
                        },
                        {
                            value: '4核 16GB（独享套餐）',
                            label: '4核 16GB（独享套餐）'
                        },
                        {
                            value: '8核 32GB（独享套餐）',
                            label: '8核 32GB（独享套餐）'
                        },
                        {
                            value: '8核 64GB（独享套餐）',
                            label: '8核 64GB（独享套餐）'
                        },
                        {
                            value: '16核 64GB（独享套餐）',
                            label: '16核 64GB（独享套餐）'
                        },
                        {
                            value: '32核 128GB（独享套餐）',
                            label: '32核 128GB（独享套餐）'
                        },
                        {
                            value: '64核 256GB（独享套餐）',
                            label: '64核 256GB（独享套餐）'
                        },
                        {
                            value: '2核 16GB',
                            label: '2核 16GB'
                        },
                        {
                            value: '4核 32GB',
                            label: '4核 32GB'
                        },
                        {
                            value: '8核 64GB',
                            label: '8核 64GB'
                        },
                        {
                            value: '16核 128GB',
                            label: '16核 128GB'
                        },
                        {
                            value: '32核 256GB',
                            label: '32核 256GB'
                        },
                        {
                            value: '64核 512GB',
                            label: '64核 512GB'
                        },
                    ]
                }
            } else if (this.buyInfo.currentSeries == '基础版' && this.buyInfo.dataType == 'PostgreSQL') {
                if (this.buyInfo.dataVersion == '10.0') {
                    this.createRdsInfo.baseInfo.specifications = [
                        {
                            value: '1核 1GB',
                            label: '1核 1GB',
                        },
                        {
                            value: '1核 2GB',
                            label: '1核 2GB',
                        },
                        {
                            value: '2核 4GB',
                            label: '2核 4GB',
                        },
                        {
                            value: '2核 8GB',
                            label: '2核 8GB',
                        },
                        {
                            value: '4核 8GB',
                            label: '4核 8GB',
                        },
                        {
                            value: '4核 16GB',
                            label: '4核 16GB',
                        },
                        {
                            value: '8核 16GB',
                            label: '8核 16GB',
                        },
                        {
                            value: '8核 32GB',
                            label: '8核 32GB',
                        },
                        {
                            value: '16核 32GB',
                            label: '16核 32GB',
                        },
                        {
                            value: '16核 64GB',
                            label: '16核 64GB',
                        },
                        {
                            value: '16核 128GB',
                            label: '16核 128GB',
                        },
                        {
                            value: '32核 128GB',
                            label: '32核 128GB',
                        },
                        {
                            value: '32核 256GB',
                            label: '32核 256GB',
                        },
                        {
                            value: '56核 224GB',
                            label: '56核 224GB',
                        },
                        {
                            value: '56核 480GB',
                            label: '56核 480GB',
                        },
                    ]
                }
            } else if (this.buyInfo.currentSeries == '高可用版' && this.buyInfo.dataType == 'PostgreSQL') {
                if (this.buyInfo.dataVersion == '10.0' || this.buyInfo.dataVersion == '9.4' ) {
                   this.createRdsInfo.baseInfo.specifications = [
                        {
                            value: '1核 1GB',
                            label: '1核 1GB',
                        },
                        {
                            value: '1核 2GB',
                            label: '1核 2GB',
                        },
                        {
                            value: '2核 4GB',
                            label: '2核 4GB',
                        },
                        {
                            value: '4核 8GB',
                            label: '4核 8GB',
                        },
                        {
                            value: '8核 16GB',
                            label: '8核 16GB',
                        },
                        {
                            value: '8核 32GB',
                            label: '8核 32GB',
                        },
                        {
                            value: '16核 64GB',
                            label: '16核 64GB',
                        },
                        {
                            value: '2核 16GB（独享型（高内存））',
                            label: '2核 16GB（独享型（高内存））',
                        },
                        {
                            value: '4核 32GB（独享型（高内存））',
                            label: '4核 32GB（独享型（高内存））',
                        },
                        {
                            value: '8核 64GB（独享型（高内存））',
                            label: '8核 64GB（独享型（高内存））',
                        },
                        {
                            value: '16核 128GB（独享型（高内存））',
                            label: '16核 128GB（独享型（高内存））',
                        },
                        {
                            value: '4核 16GB（独享型（高CPU））',
                            label: '4核 16GB（独享型（高CPU））',
                        },
                        {
                            value: '8核 32GB（独享型（高CPU））',
                            label: '8核 32GB（独享型（高CPU））',
                        },
                        {
                            value: '16核 64GB（独享型（高CPU））',
                            label: '16核 64GB（独享型（高CPU））',
                        },
                        {
                            value: '32核 128GB（独享型（高CPU））',
                            label: '32核 128GB（独享型（高CPU））',
                        },
                        {
                            value: '30核 220GB（独占物理机型）',
                            label: '30核 220GB（独占物理机型）',
                        },
                        {
                            value: '60核 470GB（独占物理机型）',
                            label: '60核 470GB（独占物理机型）',
                        }
                    ]
                }
            } else if (this.buyInfo.currentSeries == '高可用版' && this.buyInfo.dataType == 'PPAS'){
                if (this.buyInfo.dataVersion == '10.0' || this.buyInfo.dataVersion == '9.3' ) {
                    this.createRdsInfo.baseInfo.specifications = [
                        {
                            value: '1核 1GB（兼容性测试用）',
                            label: '1核 1GB（兼容性测试用）',
                        },
                        {
                            value: '1核 4GB（独享套餐）',
                            label: '1核 4GB（独享套餐）'
                        },
                        {
                            value: '2核 8GB（独享套餐）',
                            label: '2核 8GB（独享套餐）'
                        },
                        {
                            value: '2核 16GB（独享套餐）',
                            label: '2核 16GB（独享套餐）'
                        },
                        {
                            value: '4核 16GB（独享套餐）',
                            label: '4核 16GB（独享套餐）'
                        },
                        {
                            value: '4核 32GB（独享套餐）',
                            label: '4核 32GB（独享套餐）'
                        },
                        {
                            value: '8核 32GB（独享套餐）',
                            label: '8核 32GB（独享套餐）'
                        },
                        {
                            value: '8核 64GB（独享套餐）',
                            label: '8核 64GB（独享套餐）'
                        },
                        {
                            value: '16核 64GB（独享套餐）',
                            label: '16核 64GB（独享套餐）'
                        },
                        {
                            value: '16核 128GB（独享套餐）',
                            label: '16核 128GB（独享套餐）'
                        },
                        {
                            value: '32核 128GB（独享套餐）',
                            label: '32核 128GB（独享套餐）'
                        },
                        {
                            value: '32核 256GB（独享套餐）',
                            label: '32核 256GB（独享套餐）'
                        },
                        {
                            value: '60核 470GB（独占物理机型）',
                            label: '60核 470GB（独占物理机型）'
                        },
                    ]
                }
            } else if (this.buyInfo.currentSeries == '高可用版' && this.buyInfo.dataType == 'MariaDB') {
                    this.createRdsInfo.baseInfo.specifications = [
                        {
                            value: '1核 2GB',
                            label: '1核 2GB',
                        },
                        {
                            value: '2核 4GB',
                            label: '2核 4GB',
                        },
                        {
                            value: '4核 8GB（独享套餐）',
                            label: '4核 8GB（独享套餐）'
                        },
                        {
                            value: '4核 16GB（独享套餐）',
                            label: '4核 16GB（独享套餐）'
                        },
                        {
                            value: '8核 16GB（独享套餐）',
                            label: '8核 16GB（独享套餐）'
                        },
                        {
                            value: '8核 32GB（独享套餐）',
                            label: '8核 32GB（独享套餐）'
                        },
                        {
                            value: '16核 32GB（独享套餐）',
                            label: '16核 32GB（独享套餐）'
                        },
                        {
                            value: '16核 64GB（独享套餐）',
                            label: '16核 64GB（独享套餐）'
                        },
                        {
                            value: '16核 128GB（独享套餐）',
                            label: '16核 128GB（独享套餐）'
                        },
                        {
                            value: '32核 128GB（独享套餐）',
                            label: '32核 128GB（独享套餐）'
                        },
                        {
                            value: '32核 256GB（独享套餐）',
                            label: '32核 256GB（独享套餐）'
                        },
                        {
                            value: '56核 224GB（独占物理机型）',
                            label: '56核 224GB（独占物理机型）'
                        },
                        {
                            value: '56核 480GB（独占物理机型）',
                            label: '56核 480GB（独占物理机型）'
                        },
                    ]
            }
        },
        // 获取存储类型
        getStorage(item, index) {
            this.storageIndex= index;
            this.buyInfo.per = item;
            this.getseriazedArr();
        },
        getNetwork(item, index) {
            this.netWorkIndex= index;
            this.buyInfo.networkType = item;
        },
        async getIncrease(data) {
            this.per = data * 3;
            this.buyInfo.storageRoom = this.per;
            if(this.buyInfo.payType  == 'Postpaid') {
                this.payOfAmount();
            }
        },
        // 选取可用区
        selectArea(item) {
            this.buyInfo.area = item;
        },
        // 规格判定
        getSepec(item) {
            this.buyInfo.specifications = item;
            if (this.buyInfo.currentSeries == '基础版' && this.buyInfo.dataType == 'MySQL' && this.buyInfo.dataVersion == '5.7' && this.buyInfo.per =='SSD云盘') {
                switch(item) {
                    case '1 核 1G':
                        this.specCodeArr.specCode = 'mysql.n1.micro.1';
                        this.specCodeArr.maxConnectNum = '2000';
                        this.specCodeArr.storage = '20GB-1000GB';
                        this.specCodeArr.iops = 'min{1200 + 30 x 存储空间, 20000}';
                    break;
                    case '1 核 2G':
                        this.specCodeArr.specCode = 'mysql.n2.small.1';
                        this.specCodeArr.maxConnectNum = '2000';
                        this.specCodeArr.storage = '20GB-1000GB';
                        this.specCodeArr.iops = 'min{1200 + 30 x 存储空间, 20000}';
                    break;
                    case '2 核 4G':
                        this.specCodeArr.specCode = 'mysql.n2.medium.1';
                        this.specCodeArr.maxConnectNum = '4000';
                        this.specCodeArr.storage = '20GB-1000GB';
                        this.specCodeArr.iops = 'min{1200 + 30 x 存储空间, 20000}';
                    break;
                    case '2 核 8G':
                        this.specCodeArr.specCode = 'mysql.n4.medium.1';
                        this.specCodeArr.maxConnectNum = '6000';
                        this.specCodeArr.storage = '20GB-6000GB';
                        this.specCodeArr.iops = 'min{1200 + 30 x 存储空间, 20000}';
                    break;
                    case '4 核 8G':
                        this.specCodeArr.specCode = 'mysql.n2.large.1';
                        this.specCodeArr.maxConnectNum = '6000';
                        this.specCodeArr.storage = '20GB-6000GB';
                        this.specCodeArr.iops = 'min{1200 + 30 x 存储空间, 20000}';
                    break;
                    case '4 核 16G':
                        this.specCodeArr.specCode = 'mysql.n4.large.1';
                        this.specCodeArr.maxConnectNum = '8000';
                        this.specCodeArr.storage = '20GB-6000GB';
                        this.specCodeArr.iops = 'min{1200 + 30 x 存储空间, 20000}';
                    break;
                    case '8 核 16G':
                        this.specCodeArr.specCode = 'mysql.n2.xlarge.1';
                        this.specCodeArr.maxConnectNum = '8000';
                        this.specCodeArr.storage = '20GB-6000GB';
                        this.specCodeArr.iops = 'min{1200 + 30 x 存储空间, 20000}';
                    break;
                    case '8 核 32G':
                        this.specCodeArr.specCode = 'mysql.n4.xlarge.1';
                        this.specCodeArr.maxConnectNum = '10000';
                        this.specCodeArr.storage = '20GB-6000GB';
                        this.specCodeArr.iops = 'min{1200 + 30 x 存储空间, 20000}';
                    break;
                    case '16 核 32G':
                        this.specCodeArr.specCode = 'mysql.n2.2xlarge.1';
                        this.specCodeArr.maxConnectNum = '10000';
                        this.specCodeArr.storage = '20GB-6000GB';
                        this.specCodeArr.iops = 'min{1200 + 30 x 存储空间, 20000}';
                    break;
                    case '16 核 64G':
                        this.specCodeArr.specCode = 'mysql.n4.2xlarge.1';
                        this.specCodeArr.maxConnectNum = '15000';
                        this.specCodeArr.storage = '20GB-6000GB';
                        this.specCodeArr.iops = 'min{1200 + 30 x 存储空间, 20000}';
                    break;
                    case '16 核 128G':
                        this.specCodeArr.specCode = 'mysql.n8.2xlarge.1';
                        this.specCodeArr.maxConnectNum = '20000';
                        this.specCodeArr.storage = '20GB-6000GB';
                        this.specCodeArr.iops = 'min{1200 + 30 x 存储空间, 20000}';
                    break;
                    case '32 核 128G':
                        this.specCodeArr.specCode = 'mysql.n4.4xlarge.1';
                        this.specCodeArr.maxConnectNum = '20000';
                        this.specCodeArr.storage = '20GB-6000GB';
                        this.specCodeArr.iops = 'min{1200 + 30 x 存储空间, 20000}';
                    break;
                    case '32 核 256G':
                        this.specCodeArr.specCode = 'mysql.n8.4xlarge.1';
                        this.specCodeArr.maxConnectNum = '64000';
                        this.specCodeArr.storage = '20GB-6000GB';
                        this.specCodeArr.iops = 'min{1200 + 30 x 存储空间, 20000}';
                    break;
                    case '56 核 224G':
                        this.specCodeArr.specCode = 'mysql.n4.8xlarge.1';
                        this.specCodeArr.maxConnectNum = '64000';
                        this.specCodeArr.storage = '20GB-6000GB';
                        this.specCodeArr.iops = 'min{1200 + 30 x 存储空间, 20000}';
                    break;
                    case '56 核 480G':
                        this.specCodeArr.specCode = 'mysql.n8.8xlarge.1';
                        this.specCodeArr.maxConnectNum = '64000';
                        this.specCodeArr.storage = '20GB-6000GB';
                        this.specCodeArr.iops = 'min{1200 + 30 x 存储空间, 20000}';
                    break;

                }
            } else if (this.buyInfo.currentSeries == '高可用版' && this.buyInfo.dataType == 'MySQL' && this.buyInfo.dataVersion == '5.7' && this.buyInfo.per =='SSD云盘' ) {
                switch(item) {
                    case '1核 2GB':
                        this.specCodeArr.specCode = 'mysql.n2.small.2c';
                        this.specCodeArr.maxConnectNum = '2000';
                        this.specCodeArr.storage = '20GB-1000GB';
                        this.specCodeArr.iops = 'min{1200 + 30 x 存储空间, 20000}';
                    break;
                    case '2核 4GB':
                    case '16 核 128G（独享套餐）':
                        this.specCodeArr.specCode = 'mysql.x8.2xlarge.2c';
                        this.specCodeArr.maxConnectNum = '20000';
                        this.specCodeArr.storage = '20GB-6000GB';
                        this.specCodeArr.iops = 'min{1200 + 30 x 存储空间, 20000}';
                    break;                        this.specCodeArr.specCode = 'mysql.n2.medium.2c';
                        this.specCodeArr.maxConnectNum = '4000';
                        this.specCodeArr.storage = '20GB-1000GB';
                        this.specCodeArr.iops = 'min{1200 + 30 x 存储空间, 20000}';
                    break;
                    case '4 核 8G（独享套餐）':
                        this.specCodeArr.specCode = 'mysql.x2.large.2c';
                        this.specCodeArr.maxConnectNum = '6000';
                        this.specCodeArr.storage = '20GB-6000GB';
                        this.specCodeArr.iops = 'min{1200 + 30 x 存储空间, 20000}';
                    break;
                    case '4 核 16G（独享套餐）':
                        this.specCodeArr.specCode = 'mysql.x4.large.2c';
                        this.specCodeArr.maxConnectNum = '8000';
                        this.specCodeArr.storage = '20GB-6000GB';
                        this.specCodeArr.iops = 'min{1200 + 30 x 存储空间, 20000}';
                    break;
                    case '8 核 16G（独享套餐）':
                        this.specCodeArr.specCode = 'mysql.x2.xlarge.2c';
                        this.specCodeArr.maxConnectNum = '8000';
                        this.specCodeArr.storage = '20GB-6000GB';
                        this.specCodeArr.iops = 'min{1200 + 30 x 存储空间, 20000}';
                    break;
                    case '8 核 32G（独享套餐）':
                        this.specCodeArr.specCode = 'mysql.x4.xlarge.2c';
                        this.specCodeArr.maxConnectNum = '10000';
                        this.specCodeArr.storage = '20GB-6000GB';
                        this.specCodeArr.iops = 'min{1200 + 30 x 存储空间, 20000}';
                    break;
                    case '16 核 32G（独享套餐）':
                        this.specCodeArr.specCode = 'mysql.x2.2xlarge.2c';
                        this.specCodeArr.maxConnectNum = '10000';
                        this.specCodeArr.storage = '20GB-6000GB';
                        this.specCodeArr.iops = 'min{1200 + 30 x 存储空间, 20000}';
                    break;
                    case '16 核 64G（独享套餐）':
                        this.specCodeArr.specCode = 'mysql.x4.2xlarge.2c';
                        this.specCodeArr.maxConnectNum = '15000';
                        this.specCodeArr.storage = '20GB-6000GB';
                        this.specCodeArr.iops = 'min{1200 + 30 x 存储空间, 20000}';
                    break;
                    case '32 核 128G（独享套餐）':
                        this.specCodeArr.specCode = 'mysql.x4.4xlarge.2c';
                        this.specCodeArr.maxConnectNum = '20000';
                        this.specCodeArr.storage = '20GB-6000GB';
                        this.specCodeArr.iops = 'min{1200 + 30 x 存储空间, 20000}';
                    break;
                    case '32 核 256G（独享套餐）':
                        this.specCodeArr.specCode = 'mysql.x8.4xlarge.2c';
                        this.specCodeArr.maxConnectNum = '64000';
                        this.specCodeArr.storage = '20GB-6000GB';
                        this.specCodeArr.iops = 'min{1200 + 30 x 存储空间, 20000}';
                    break;
                    case '56 核 224G（独享套餐）':
                        this.specCodeArr.specCode = 'mysql.x4.8xlarge.2c';
                        this.specCodeArr.maxConnectNum = '64000';
                        this.specCodeArr.storage = '20GB-6000GB';
                        this.specCodeArr.iops = 'min{1200 + 30 x 存储空间, 20000}';
                    break;
                    case '56 核 480G（独享套餐）':
                        this.specCodeArr.specCode = 'mysql.x8.8xlarge.2c';
                        this.specCodeArr.maxConnectNum = '100000';
                        this.specCodeArr.storage = '20GB-6000GB';
                        this.specCodeArr.iops = 'min{1200 + 30 x 存储空间, 20000}';
                    break;

                }
            } else if (this.buyInfo.currentSeries == '高可用版' && this.buyInfo.per =='本地SSD盘' && this.buyInfo.dataType == 'MySQL') {
                if (this.buyInfo.dataVersion == '5.7' || this.buyInfo.dataVersion == '5.6' || this.buyInfo.dataVersion == '5.5') {
                    switch(item) {
                        case '1核 1GB':
                            this.specCodeArr.specCode = 'rds.mysql.t1.small';
                            this.specCodeArr.maxConnectNum = '300';
                            this.specCodeArr.storage = '5GB-2000GB';
                            this.specCodeArr.iops = '600';
                        break;
                        case '1核 2GB':
                            this.specCodeArr.specCode = 'rds.mysql.s1.small';
                            this.specCodeArr.maxConnectNum = '600';
                            this.specCodeArr.storage = '5GB-2000GB';
                            this.specCodeArr.iops = '1000';
                        break;
                        case '2核 4GB':
                            this.specCodeArr.specCode = 'rds.mysql.s2.large';
                            this.specCodeArr.maxConnectNum = '1200';
                            this.specCodeArr.storage = '5GB-2000GB';
                            this.specCodeArr.iops = '2000';
                        break;
                        case '2核 8GB':
                            this.specCodeArr.specCode = 'rds.mysql.s2.xlarge';
                            this.specCodeArr.maxConnectNum = '2000';
                            this.specCodeArr.storage = '5GB-2000GB';
                            this.specCodeArr.iops = '4000';
                        break;
                        case '4核 8GB':
                            this.specCodeArr.specCode = 'rds.mysql.s3.large';
                            this.specCodeArr.maxConnectNum = '2000';
                            this.specCodeArr.storage = '5GB-2000GB';
                            this.specCodeArr.iops = '5000';
                        break;
                        case '4核 16GB':
                            this.specCodeArr.specCode = 'rds.mysql.s3.large';
                            this.specCodeArr.maxConnectNum = '4000';
                            this.specCodeArr.storage = '5GB-2000GB';
                            this.specCodeArr.iops = '7000';
                        break;
                        case '8核 16GB':
                            this.specCodeArr.specCode = 'rds.mysql.c1.large';
                            this.specCodeArr.maxConnectNum = '4000';
                            this.specCodeArr.storage = '5GB-2000GB';
                            this.specCodeArr.iops = '8000';
                        break;
                        case '8核 32GB':
                            this.specCodeArr.specCode = 'rds.mysql.c1.xlarge';
                            this.specCodeArr.maxConnectNum = '8000';
                            this.specCodeArr.storage = '5GB-2000GB';
                            this.specCodeArr.iops = '12000';
                        break;
                        case '16核 64GB':
                            this.specCodeArr.specCode = 'rds.mysql.c2.xlarge';
                            this.specCodeArr.maxConnectNum = '16000';
                            this.specCodeArr.storage = '5GB-3000GB';
                            this.specCodeArr.iops = '14000';
                        break;
                        case '16核 96GB':
                            this.specCodeArr.specCode = 'rds.mysql.c2.xlp2';
                            this.specCodeArr.maxConnectNum = '24000';
                            this.specCodeArr.storage = '5GB-3000GB';
                            this.specCodeArr.iops = '16000';
                        break;
                        case '4核 16GB（独享套餐）':
                            this.specCodeArr.specCode = 'rds.mysql.c2.xlp2';
                            this.specCodeArr.maxConnectNum = '2500';
                            this.specCodeArr.storage = '250GB/500GB';
                            this.specCodeArr.iops = '4500';
                        break;
                        case '8核 32GB（独享套餐）':
                            this.specCodeArr.specCode = 'mysql.x4.xlarge.2';
                            this.specCodeArr.maxConnectNum = '5000';
                            this.specCodeArr.storage = '500GB/1000GB/2000GB';
                            this.specCodeArr.iops = '9000';
                        break;
                        case '16核 64GB（独享套餐）':
                            this.specCodeArr.specCode = 'mysql.x4.2xlarge.2';
                            this.specCodeArr.maxConnectNum = '10000';
                            this.specCodeArr.storage = '1000GB/2000GB/3000GB';
                            this.specCodeArr.iops = '18000';
                        break;
                        case '32核 128GB（独享套餐）':
                            this.specCodeArr.specCode = 'mysql.x4.4xlarge.2';
                            this.specCodeArr.maxConnectNum = '20000';
                            this.specCodeArr.storage = '2000GB/3000GB';
                            this.specCodeArr.iops = '36000';
                        break;
                        case '2核 16GB（独享套餐）':
                            this.specCodeArr.specCode = 'mysql.x8.medium.2';
                            this.specCodeArr.maxConnectNum = '2500';
                            this.specCodeArr.storage = '250GB';
                            this.specCodeArr.iops = '4500';
                        break;
                        case '4核 32GB（独享套餐）':
                            this.specCodeArr.specCode = 'mysql.x8.medium.2';
                            this.specCodeArr.maxConnectNum = '5000';
                            this.specCodeArr.storage = '500GB';
                            this.specCodeArr.iops = '9000';
                        break;
                        case '8核 64GB（独享套餐）':
                            this.specCodeArr.specCode = 'mysql.x8.medium.2';
                            this.specCodeArr.maxConnectNum = '10000';
                            this.specCodeArr.storage = '1000GB/2000GB';
                            this.specCodeArr.iops = '18000';
                        break;
                        case '16核 128GB（独享套餐）':
                            this.specCodeArr.specCode = 'mysql.x8.medium.2';
                            this.specCodeArr.maxConnectNum = '20000';
                            this.specCodeArr.storage = '2000GB/3000GB';
                            this.specCodeArr.iops = '36000';
                        break;
                        case '30核 220GB（独占物理机型）':
                            this.specCodeArr.specCode = 'mysql.x8.medium.2';
                            this.specCodeArr.maxConnectNum = '64000';
                            this.specCodeArr.storage = '3000GB';
                            this.specCodeArr.iops = '20000';
                        break;
                        case '60核 470GB（独占物理机型）':
                            this.specCodeArr.specCode = 'mysql.x8.medium.2';
                            this.specCodeArr.maxConnectNum = '100000';
                            this.specCodeArr.storage = '3000GB';
                            this.specCodeArr.iops = '120000';
                        break;
                    }
                }
            } else if (this.buyInfo.currentSeries == '金融版' && this.buyInfo.per =='本地SSD盘' && this.buyInfo.dataType == 'MySQL') {
                if (this.buyInfo.dataVersion == '5.7' || this.buyInfo.dataVersion == '5.6' || this.buyInfo.dataVersion == '5.5') {
                    switch(item) {
                        case '4核 16GB（独享型（高CPU））':
                            this.specCodeArr.specCode = 'mysql.x4.large.3';
                            this.specCodeArr.maxConnectNum = '2500';
                            this.specCodeArr.storage = '250GB/500GB';
                            this.specCodeArr.iops = '4500';
                        break;
                        case '8核 32GB（独享型（高CPU））':
                            this.specCodeArr.specCode = 'mysql.x4.xlarge.3';
                            this.specCodeArr.maxConnectNum = '5000';
                            this.specCodeArr.storage = '500GB/1000GB';
                            this.specCodeArr.iops = '9000';
                        break;
                        case '16核 64GB（独享型（高CPU））':
                            this.specCodeArr.specCode = 'mysql.x4.2xlarge.3';
                            this.specCodeArr.maxConnectNum = '10000';
                            this.specCodeArr.storage = '1000GB/2000GB/3000GB';
                            this.specCodeArr.iops = '18000';
                        break;
                        case '32核 128GB（独享型（高CPU））':
                            this.specCodeArr.specCode = 'mysql.x4.4xlarge.3';
                            this.specCodeArr.maxConnectNum = '20000';
                            this.specCodeArr.storage = '2000GB/3000GB';
                            this.specCodeArr.iops = '36000';
                        break;
                        case '2核 16GB（独享型（高内存））':
                            this.specCodeArr.specCode = 'mysql.x8.medium.3';
                            this.specCodeArr.maxConnectNum = '2500';
                            this.specCodeArr.storage = '250GB';
                            this.specCodeArr.iops = '4500';
                        break;
                        case '4核 32GB（独享型（高内存））':
                            this.specCodeArr.specCode = 'mysql.x8.large.3';
                            this.specCodeArr.maxConnectNum = '5000';
                            this.specCodeArr.storage = '500GB';
                            this.specCodeArr.iops = '9000';
                        break;
                        case '8核 64GB（独享型（高内存））':
                            this.specCodeArr.specCode = 'mysql.x8.xlarge.3';
                            this.specCodeArr.maxConnectNum = '10000';
                            this.specCodeArr.storage = '1000GB';
                            this.specCodeArr.iops = '18000';
                        break;
                        case '16核 128GB（独享型（高内存））':
                            this.specCodeArr.specCode = 'mysql.x8.2xlarge.3';
                            this.specCodeArr.maxConnectNum = '20000';
                            this.specCodeArr.storage = '2000GB/3000GB';
                            this.specCodeArr.iops = '36000';
                        break;
                        case '32核 256GB（独享型（高内存））':
                            this.specCodeArr.specCode = 'mysql.x8.4xlarge.3';
                            this.specCodeArr.maxConnectNum = '40000';
                            this.specCodeArr.storage = '3000GB';
                            this.specCodeArr.iops = '72000';
                        break;
                        case '60核 470GB（独占物理机型）':
                            this.specCodeArr.specCode = 'mysql.st.8xlarge.3';
                            this.specCodeArr.maxConnectNum = '100000';
                            this.specCodeArr.storage = '3000GB';
                            this.specCodeArr.iops = '120000';
                        break;
                    }
                }
            } else if (this.buyInfo.currentSeries == '基础版' && this.buyInfo.dataType == 'SQLServer') {
                if (this.buyInfo.dataVersion == '2012') {
                    switch(item) {
                        case '2核 4GB':
                            this.specCodeArr.specCode = 'rds.mssql.s2.large';
                            this.specCodeArr.maxConnectNum = '不限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = 'min{30 x 存储空间, 20000}';
                        break;
                        case '2核 8GB':
                            this.specCodeArr.specCode = 'rds.mssql.s2.xlarge';
                            this.specCodeArr.maxConnectNum = '不限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = 'min{30 x 存储空间, 20000}';
                        break;
                        case '4核 8GB':
                            this.specCodeArr.specCode = 'rds.mssql.s3.large';
                            this.specCodeArr.maxConnectNum = '不限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = 'min{30 x 存储空间, 20000}';
                        break;
                        case '4核 16GB':
                            this.specCodeArr.specCode = 'rds.mssql.m1.medium';
                            this.specCodeArr.maxConnectNum = '不限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = 'min{30 x 存储空间, 20000}';
                        break;
                        case '8核 16GB':
                            this.specCodeArr.specCode = 'rds.mssql.c1.large';
                            this.specCodeArr.maxConnectNum = '不限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = 'min{30 x 存储空间, 20000}';
                        break;
                        case '8核 32GB':
                            this.specCodeArr.specCode = 'rds.mssql.c1.xlarge';
                            this.specCodeArr.maxConnectNum = '不限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = 'min{30 x 存储空间, 20000}';
                        break;
                        case '16核 64GB':
                            this.specCodeArr.specCode = 'rds.mssql.c2.xlarge';
                            this.specCodeArr.maxConnectNum = '不限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = 'min{30 x 存储空间, 20000}';
                        break;
                    }
                } else if (this.buyInfo.dataVersion == '2012_web' || this.buyInfo.dataVersion == '2016_web') {
                    switch(item) {
                        case '2核 4GB（独享套餐）':
                            this.specCodeArr.specCode = 'mssql.x2.medium.w1';
                            this.specCodeArr.maxConnectNum = '不限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = 'min{30 x 存储空间, 20000}';
                        break;
                        case '2核 8GB（独享套餐）':
                            this.specCodeArr.specCode = 'mssql.x4.medium.w1';
                            this.specCodeArr.maxConnectNum = '不限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = 'min{30 x 存储空间, 20000}';
                        break;
                        case '4核 8GB（独享套餐）':
                            this.specCodeArr.specCode = 'mssql.x2.large.w1';
                            this.specCodeArr.maxConnectNum = '不限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = 'min{30 x 存储空间, 20000}';
                        break;
                        case '4核 16GB（独享套餐）':
                            this.specCodeArr.specCode = 'mssql.x4.large.w1';
                            this.specCodeArr.maxConnectNum = '不限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = 'min{30 x 存储空间, 20000}';
                        break;
                        case '8核 16GB（独享套餐）':
                            this.specCodeArr.specCode = 'mssql.x2.xlarge.w1';
                            this.specCodeArr.maxConnectNum = '不限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = 'min{30 x 存储空间, 20000}';
                        break;
                        case '8核 32GB（独享套餐）':
                            this.specCodeArr.specCode = 'mssql.x4.xlarge.w1';
                            this.specCodeArr.maxConnectNum = '不限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = 'min{30 x 存储空间, 20000}';
                        break;
                        case '16核 32GB（独享套餐）':
                            this.specCodeArr.specCode = 'mssql.x2.2xlarge.w1';
                            this.specCodeArr.maxConnectNum = '不限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = 'min{30 x 存储空间, 20000}';
                        break;
                        case '16核 64GB（独享套餐）':
                            this.specCodeArr.specCode = 'mssql.x4.2xlarge.w1';
                            this.specCodeArr.maxConnectNum = '不限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = 'min{30 x 存储空间, 20000}';
                        break;
                    }
                }
            } else if (this.buyInfo.currentSeries == '高可用版' && this.buyInfo.dataType == 'SQLServer') {
                if(this.buyInfo.dataVersion == '2008r2') {
                    switch(item) {
                        case '2核 4GB':
                            this.specCodeArr.specCode = 'rds.mssql.s2.large';
                            this.specCodeArr.maxConnectNum = '1200';
                            this.specCodeArr.storage = '10GB-2000GB';
                            this.specCodeArr.iops = '2000';
                        break;
                        case '2核 8GB':
                            this.specCodeArr.specCode = 'rds.mssql.s2.xlarge';
                            this.specCodeArr.maxConnectNum = '2000';
                            this.specCodeArr.storage = '10GB-2000GB';
                            this.specCodeArr.iops = '4000';
                        break;
                        case '4核 8GB':
                            this.specCodeArr.specCode = 'rds.mssql.s2.xlarge';
                            this.specCodeArr.maxConnectNum = '2000';
                            this.specCodeArr.storage = '10GB-2000GB';
                            this.specCodeArr.iops = '5000';
                        break;
                        case '4核 16GB':
                            this.specCodeArr.specCode = 'rds.mssql.m1.medium';
                            this.specCodeArr.maxConnectNum = '4000';
                            this.specCodeArr.storage = '10GB-2000GB';
                            this.specCodeArr.iops = '7000';
                        break;
                        case '8核 16GB':
                            this.specCodeArr.specCode = 'rds.mssql.c1.large';
                            this.specCodeArr.maxConnectNum = '4000';
                            this.specCodeArr.storage = '10GB-2000GB';
                            this.specCodeArr.iops = '8000';
                        break;
                        case '8核 32GB':
                            this.specCodeArr.specCode = 'rds.mssql.c1.xlarge';
                            this.specCodeArr.maxConnectNum = '8000';
                            this.specCodeArr.storage = '10GB-2000GB';
                            this.specCodeArr.iops = '12000';
                        break;
                        case '16核 64GB':
                            this.specCodeArr.specCode = 'rds.mssql.c2.xlarge';
                            this.specCodeArr.maxConnectNum = '16000';
                            this.specCodeArr.storage = '10GB-2000GB';
                            this.specCodeArr.iops = '14000';
                        break;
                        case '16核 96GB':
                            this.specCodeArr.specCode = 'rds.mssql.c2.xlp2';
                            this.specCodeArr.maxConnectNum = '24000';
                            this.specCodeArr.storage = '10GB-2000GB';
                            this.specCodeArr.iops = '16000';
                        break;
                        case '2核 16GB（独享套餐）':
                            this.specCodeArr.specCode = 'mssql.x8.medium.2';
                            this.specCodeArr.maxConnectNum = '2500';
                            this.specCodeArr.storage = '250GB';
                            this.specCodeArr.iops = '4500';
                        break;
                        case '4核 32GB（独享套餐）':
                            this.specCodeArr.specCode = 'mssql.x8.large.2';
                            this.specCodeArr.maxConnectNum = '5000';
                            this.specCodeArr.storage = '500GB';
                            this.specCodeArr.iops = '9000';
                        break;
                        case '8核 64GB（独享套餐）':
                            this.specCodeArr.specCode = 'mssql.x8.xlarge.2';
                            this.specCodeArr.maxConnectNum = '10000';
                            this.specCodeArr.storage = '1000GB';
                            this.specCodeArr.iops = '18000';
                        break;
                        case '16核 128GB（独享套餐）':
                            this.specCodeArr.specCode = 'mssql.x8.2xlarge.2';
                            this.specCodeArr.maxConnectNum = '20000';
                            this.specCodeArr.storage = '2000GB';
                            this.specCodeArr.iops = '36000';
                        break;
                        case '30核 220GB（独占物理机型）':
                            this.specCodeArr.specCode = 'mssql.x8.2xlarge.2';
                            this.specCodeArr.maxConnectNum = '64000';
                            this.specCodeArr.storage = '2000GB';
                            this.specCodeArr.iops = '20000';
                        break;
                        case '60核 470GB（独占物理机型）':
                            this.specCodeArr.specCode = 'mssql.x8.2xlarge.2';
                            this.specCodeArr.maxConnectNum = '100000';
                            this.specCodeArr.storage = '2000GB';
                            this.specCodeArr.iops = '50000';
                        break;
                    }
                } else if (this.buyInfo.dataVersion == '2012' || this.buyInfo.dataVersion == '2016') {
                    switch(item) {
                        case '2核 8GB（独享套餐）':
                            this.specCodeArr.specCode = 'mssql.x4.medium.e2';
                            this.specCodeArr.maxConnectNum = '无限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = '取决于SSD云盘性能';
                        break;
                        case '2核 16GB（独享套餐）':
                            this.specCodeArr.specCode = 'mssql.x8.medium.e2';
                            this.specCodeArr.maxConnectNum = '无限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = '取决于SSD云盘性能';
                        break;
                        case '4核 16GB（独享套餐）':
                            this.specCodeArr.specCode = 'mssql.x4.large.e2';
                            this.specCodeArr.maxConnectNum = '无限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = '取决于SSD云盘性能';
                        break;
                        case '4核 32GB（独享套餐）':
                            this.specCodeArr.specCode = 'mssql.x8.large.e2';
                            this.specCodeArr.maxConnectNum = '无限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = '取决于SSD云盘性能';
                        break;
                        case '8核 32GB（独享套餐）':
                            this.specCodeArr.specCode = 'mssql.x4.xlarge.e2';
                            this.specCodeArr.maxConnectNum = '无限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = '取决于SSD云盘性能';
                        break;
                        case '8核 64GB（独享套餐）':
                            this.specCodeArr.specCode = 'mssql.x8.xlarge.e2';
                            this.specCodeArr.maxConnectNum = '无限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = '取决于SSD云盘性能';
                        break;
                        case '16核 64GB（独享套餐）':
                            this.specCodeArr.specCode = 'mssql.x4.2xlarge.e2';
                            this.specCodeArr.maxConnectNum = '无限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = '取决于SSD云盘性能';
                        break;
                        case '16核 128GB（独享套餐）':
                            this.specCodeArr.specCode = 'mssql.x8.2xlarge.e2';
                            this.specCodeArr.maxConnectNum = '无限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = '取决于SSD云盘性能';
                        break;
                        case '24核 96GB（独享套餐）':
                            this.specCodeArr.specCode = 'mssql.x4.3xlarge.e2';
                            this.specCodeArr.maxConnectNum = '无限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = '取决于SSD云盘性能';
                        break;
                        case '32核 128GB（独享套餐）':
                            this.specCodeArr.specCode = 'mssql.x4.4xlarge.e2';
                            this.specCodeArr.maxConnectNum = '无限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = '取决于SSD云盘性能';
                        break;
                        case '32核 256GB（独享套餐）':
                            this.specCodeArr.specCode = 'mssql.x8.4xlarge.e2';
                            this.specCodeArr.maxConnectNum = '无限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = '取决于SSD云盘性能';
                        break;
                        case '56核 480GB（独享套餐）':
                            this.specCodeArr.specCode = 'mssql.x8.7xlarge.e2';
                            this.specCodeArr.maxConnectNum = '无限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = '取决于SSD云盘性能';
                        break;
                        case '64核 256GB（独享套餐）':
                            this.specCodeArr.specCode = 'mssql.x4.8xlarge.e2';
                            this.specCodeArr.maxConnectNum = '无限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = '取决于SSD云盘性能';
                        break;
                        case '64核 512GB（独享套餐）':
                            this.specCodeArr.specCode = 'mssql.x8.8xlarge.e2 ';
                            this.specCodeArr.maxConnectNum = '无限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = '取决于SSD云盘性能';
                        break;
                    }
                } else if(this.buyInfo.dataVersion = '2012标准' || this.buyInfo.dataVersion == '2016标准') {
                    switch(item) {
                        case '2核 4GB':
                            this.specCodeArr.specCode = 'mssql.s2.medium.s2';
                            this.specCodeArr.maxConnectNum = '无限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = '取决于SSD云盘性能';
                        break;
                        case '4核 8GB':
                            this.specCodeArr.specCode = 'mssql.s2.large.s2';
                            this.specCodeArr.maxConnectNum = '无限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = '取决于SSD云盘性能';
                        break;
                        case '8核 16GB':
                            this.specCodeArr.specCode = 'mssql.s2.xlarge.s2';
                            this.specCodeArr.maxConnectNum = '无限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = '取决于SSD云盘性能';
                        break;
                        case '16核 32GB':
                            this.specCodeArr.specCode = 'mssql.s2.2xlarge.s2';
                            this.specCodeArr.maxConnectNum = '无限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = '取决于SSD云盘性能';
                        break;
                        case '2核 8GB（独享套餐）':
                            this.specCodeArr.specCode = 'mssql.x4.medium.s2';
                            this.specCodeArr.maxConnectNum = '无限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = '取决于SSD云盘性能';
                        break;
                        case '2核 16GB（独享套餐）':
                            this.specCodeArr.specCode = 'mssql.x8.medium.s2';
                            this.specCodeArr.maxConnectNum = '无限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = '取决于SSD云盘性能';
                        break;
                        case '4核 16GB（独享套餐）':
                            this.specCodeArr.specCode = 'mssql.x4.large.s2';
                            this.specCodeArr.maxConnectNum = '无限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = '取决于SSD云盘性能';
                        break;
                        case '4核 32GB（独享套餐）':
                            this.specCodeArr.specCode = 'mssql.x8.large.s2';
                            this.specCodeArr.maxConnectNum = '无限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = '取决于SSD云盘性能';
                        break;
                        case '8核 32GB（独享套餐）':
                            this.specCodeArr.specCode = 'mssql.x4.xlarge.s2';
                            this.specCodeArr.maxConnectNum = '无限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = '取决于SSD云盘性能';
                        break;
                        case '8核 64GB（独享套餐）':
                            this.specCodeArr.specCode = 'mssql.x8.xlarge.s2';
                            this.specCodeArr.maxConnectNum = '无限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = '取决于SSD云盘性能';
                        break;
                        case '16核 64GB（独享套餐）':
                            this.specCodeArr.specCode = 'mssql.x4.2xlarge.s2';
                            this.specCodeArr.maxConnectNum = '无限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = '取决于SSD云盘性能';
                        break;
                        case '16核 128GB（独享套餐）':
                            this.specCodeArr.specCode = 'mssql.x8.2xlarge.s2';
                            this.specCodeArr.maxConnectNum = '无限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = '取决于SSD云盘性能';
                        break;
                        case '24核 96GB（独享套餐）':
                            this.specCodeArr.specCode = 'mssql.x4.3xlarge.s2';
                            this.specCodeArr.maxConnectNum = '无限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = '取决于SSD云盘性能';
                        break;
                    }
                }
            } else if(this.buyInfo.currentSeries == '集群版' && this.buyInfo.dataType == 'SQLServer') {
                if (this.buyInfo.dataVersion == '2017' ) {
                    switch(item) {
                        case '2核 8GB（独享套餐）':
                            this.specCodeArr.specCode = 'mssql.x4.medium.e2';
                            this.specCodeArr.maxConnectNum = '无限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = '取决于SSD云盘性能';
                        break;
                        case '4核 16GB（独享套餐）':
                            this.specCodeArr.specCode = 'mssql.x4.large.e2';
                            this.specCodeArr.maxConnectNum = '无限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = '取决于SSD云盘性能';
                        break;
                        case '8核 32GB（独享套餐）':
                            this.specCodeArr.specCode = 'mssql.x4.xlarge.e2';
                            this.specCodeArr.maxConnectNum = '无限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = '取决于SSD云盘性能';
                        break;
                        case '16核 64GB（独享套餐）':
                            this.specCodeArr.specCode = 'mssql.x4.2xlarge.e2';
                            this.specCodeArr.maxConnectNum = '无限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = '取决于SSD云盘性能';
                        break;
                        case '32核 128GB（独享套餐）':
                            this.specCodeArr.specCode = 'mssql.x4.4xlarge.e2';
                            this.specCodeArr.maxConnectNum = '无限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = '取决于SSD云盘性能';
                        break;
                        case '64核 256GB（独享套餐）':
                            this.specCodeArr.specCode = 'mssql.x4.8xlarge.e2';
                            this.specCodeArr.maxConnectNum = '无限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = '取决于SSD云盘性能';
                        break;
                        case '2核 16GB':
                            this.specCodeArr.specCode = 'mssql.x8.medium.e2';
                            this.specCodeArr.maxConnectNum = '无限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = '取决于SSD云盘性能';
                        break;
                        case '4核 32GB':
                            this.specCodeArr.specCode = 'mssql.x8.large.e2';
                            this.specCodeArr.maxConnectNum = '无限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = '取决于SSD云盘性能';
                        break;
                        case '8核 64GB':
                            this.specCodeArr.specCode = 'mssql.x8.xlarge.e2';
                            this.specCodeArr.maxConnectNum = '无限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = '取决于SSD云盘性能';
                        break;
                        case '16核 128GB':
                            this.specCodeArr.specCode = 'mssql.x8.2xlarge.e2';
                            this.specCodeArr.maxConnectNum = '无限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = '取决于SSD云盘性能';
                        break;
                        case '32核 256GB':
                            this.specCodeArr.specCode = 'mssql.x8.4xlarge.e2';
                            this.specCodeArr.maxConnectNum = '无限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = '取决于SSD云盘性能';
                        break;
                        case '64核 512GB':
                            this.specCodeArr.specCode = 'mssql.x8.8xlarge.e2';
                            this.specCodeArr.maxConnectNum = '无限制';
                            this.specCodeArr.storage = '20GB-3000GB';
                            this.specCodeArr.iops = '取决于SSD云盘性能';
                        break;
                    }
                }
            } else if (this.buyInfo.currentSeries == '基础版' && this.buyInfo.dataType == 'PostgreSQL') {
                if (this.buyInfo.dataVersion == '10.0') {
                    switch(item) {
                        case '1核 1GB':
                            this.specCodeArr.specCode = 'pg.n1.micro.1';
                            this.specCodeArr.maxConnectNum = '100';
                            this.specCodeArr.storage = '20GB-2000GB';
                            this.specCodeArr.iops = 'min{1200 + 30 x 存储空间，20000}';
                        break;
                        case '1核 2GB':
                            this.specCodeArr.specCode = 'pg.n2.small.1';
                            this.specCodeArr.maxConnectNum = '200';
                            this.specCodeArr.storage = '20GB-2000GB';
                            this.specCodeArr.iops = 'min{1200 + 30 x 存储空间，20000}';
                        break;
                        case '2核 4GB':
                            this.specCodeArr.specCode = 'pg.n2.medium.1';
                            this.specCodeArr.maxConnectNum = '400';
                            this.specCodeArr.storage = '20GB-2000GB';
                            this.specCodeArr.iops = 'min{1200 + 30 x 存储空间，20000}';
                        break;
                        case '2核 8GB':
                            this.specCodeArr.specCode = 'pg.n4.medium.1';
                            this.specCodeArr.maxConnectNum = '800';
                            this.specCodeArr.storage = '20GB-2000GB';
                            this.specCodeArr.iops = 'min{1200 + 30 x 存储空间，20000}';
                        break;
                        case '4核 8GB':
                            this.specCodeArr.specCode = 'pg.n2.large.1';
                            this.specCodeArr.maxConnectNum = '800';
                            this.specCodeArr.storage = '20GB-2000GB';
                            this.specCodeArr.iops = 'min{1200 + 30 x 存储空间，20000}';
                        break;
                        case '4核 16GB':
                            this.specCodeArr.specCode = 'pg.n4.large.1';
                            this.specCodeArr.maxConnectNum = '1600';
                            this.specCodeArr.storage = '20GB-2000GB';
                            this.specCodeArr.iops = 'min{1200 + 30 x 存储空间，20000}';
                        break;
                        case '8核 16GB':
                            this.specCodeArr.specCode = 'pg.n2.xlarge.1';
                            this.specCodeArr.maxConnectNum = '1600';
                            this.specCodeArr.storage = '20GB-2000GB';
                            this.specCodeArr.iops = 'min{1200 + 30 x 存储空间，20000}';
                        break;
                        case '8核 32GB':
                            this.specCodeArr.specCode = 'pg.n4.xlarge.1';
                            this.specCodeArr.maxConnectNum = '3200';
                            this.specCodeArr.storage = '20GB-2000GB';
                            this.specCodeArr.iops = 'min{1200 + 30 x 存储空间，20000}';
                        break;
                        case '16核 32GB':
                            this.specCodeArr.specCode = 'pg.n2.2xlarge.1';
                            this.specCodeArr.maxConnectNum = '3200';
                            this.specCodeArr.storage = '20GB-2000GB';
                            this.specCodeArr.iops = 'min{1200 + 30 x 存储空间，20000}';
                        break;
                        case '16核 64GB':
                            this.specCodeArr.specCode = 'pg.n4.2xlarge.1';
                            this.specCodeArr.maxConnectNum = '6400';
                            this.specCodeArr.storage = '20GB-2000GB';
                            this.specCodeArr.iops = 'min{1200 + 30 x 存储空间，20000}';
                        break;
                        case '16核 128GB':
                            this.specCodeArr.specCode = 'pg.n8.2xlarge.1';
                            this.specCodeArr.maxConnectNum = '10000';
                            this.specCodeArr.storage = '20GB-2000GB';
                            this.specCodeArr.iops = 'min{1200 + 30 x 存储空间，20000}';
                        break;
                        case '32核 128GB':
                            this.specCodeArr.specCode = 'pg.n8.2xlarge.1';
                            this.specCodeArr.maxConnectNum = '12800';
                            this.specCodeArr.storage = '20GB-2000GB';
                            this.specCodeArr.iops = 'min{1200 + 30 x 存储空间，20000}';
                        break;
                        case '32核 256GB':
                            this.specCodeArr.specCode = 'pg.n8.4xlarge.1';
                            this.specCodeArr.maxConnectNum = '20000';
                            this.specCodeArr.storage = '20GB-2000GB';
                            this.specCodeArr.iops = 'min{1200 + 30 x 存储空间，20000}';
                        break;
                      case '56核 224GB':
                            this.specCodeArr.specCode = 'pg.n4.8xlarge.1';
                            this.specCodeArr.maxConnectNum = '22000';
                            this.specCodeArr.storage = '20GB-2000GB';
                            this.specCodeArr.iops = 'min{1200 + 30 x 存储空间，20000}';
                        break;
                        case '56核 480GB':
                            this.specCodeArr.specCode = 'pg.n8.8xlarge.1';
                            this.specCodeArr.maxConnectNum = '48000';
                            this.specCodeArr.storage = '20GB-2000GB';
                            this.specCodeArr.iops = 'min{1200 + 30 x 存储空间，20000}';
                        break;
                    }
                }
            } else if (this.buyInfo.currentSeries == '高可用版' && this.buyInfo.dataType == 'PostgreSQL') {
                if (this.buyInfo.dataVersion == '10.0' || this.buyInfo.dataVersion == '9.4' ) {
                    switch(item) {
                        case '1核 1GB':
                            this.specCodeArr.specCode = 'rds.pg.t1.small';
                            this.specCodeArr.maxConnectNum = '100';
                            this.specCodeArr.storage = '5GB-2000GB';
                            this.specCodeArr.iops = '600';
                        break;
                        case '1核 2GB':
                            this.specCodeArr.specCode = 'rds.pg.s1.small';
                            this.specCodeArr.maxConnectNum = '200';
                            this.specCodeArr.storage = '5GB-2000GB';
                            this.specCodeArr.iops = '1000';
                        break;
                        case '2核 4GB':
                            this.specCodeArr.specCode = 'rds.pg.s2.large';
                            this.specCodeArr.maxConnectNum = '400';
                            this.specCodeArr.storage = '5GB-2000GB';
                            this.specCodeArr.iops = '2000';
                        break;
                        case '4核 8GB':
                            this.specCodeArr.specCode = 'rds.pg.s3.large';
                            this.specCodeArr.maxConnectNum = '800';
                            this.specCodeArr.storage = '5GB-2000GB';
                            this.specCodeArr.iops = '5000';
                        break;
                        case '8核 16GB':
                            this.specCodeArr.specCode = 'rds.pg.s3.large';
                            this.specCodeArr.maxConnectNum = '1500';
                            this.specCodeArr.storage = '5GB-2000GB';
                            this.specCodeArr.iops = '8000';
                        break;
                        case '8核 32GB':
                            this.specCodeArr.specCode = 'rds.pg.c1.xlarge';
                            this.specCodeArr.maxConnectNum = '2000';
                            this.specCodeArr.storage = '5GB-2000GB';
                            this.specCodeArr.iops = '12000';
                        break;
                        case '16核 64GB':
                            this.specCodeArr.specCode = 'rds.pg.c2.xlarge';
                            this.specCodeArr.maxConnectNum = '2000';
                            this.specCodeArr.storage = '5GB-2000GB';
                            this.specCodeArr.iops = '14000';
                        break;
                        case '2核 16GB（独享型（高内存））':
                            this.specCodeArr.specCode = 'pg.x8.medium.2';
                            this.specCodeArr.maxConnectNum = '2500';
                            this.specCodeArr.storage = '250GB';
                            this.specCodeArr.iops = '4500';
                        break;
                        case '4核 32GB（独享型（高内存））':
                            this.specCodeArr.specCode = 'pg.x8.large.2';
                            this.specCodeArr.maxConnectNum = '5000';
                            this.specCodeArr.storage = '250GB';
                            this.specCodeArr.iops = '9000';
                        break;
                        case '8核 64GB（独享型（高内存））':
                            this.specCodeArr.specCode = 'pg.x8.xlarge.2';
                            this.specCodeArr.maxConnectNum = '10000';
                            this.specCodeArr.storage = '1000GB';
                            this.specCodeArr.iops = '18000';
                        break;
                        case '16核 128GB（独享型（高内存））':
                            this.specCodeArr.specCode = 'pg.x8.2xlarge.2';
                            this.specCodeArr.maxConnectNum = '12000';
                            this.specCodeArr.storage = '2000GB';
                            this.specCodeArr.iops = '36000';
                        break;
                        case '4核 16GB（独享型（高CPU））':
                            this.specCodeArr.specCode = 'pg.x4.large.2';
                            this.specCodeArr.maxConnectNum = '2500';
                            this.specCodeArr.storage = '250GB/500GB';
                            this.specCodeArr.iops = '4500';
                        break;
                        case '8核 32GB（独享型（高CPU））':
                            this.specCodeArr.specCode = 'pg.x4.xlarge.2';
                            this.specCodeArr.maxConnectNum = '5000';
                            this.specCodeArr.storage = '500GB/1000GB';
                            this.specCodeArr.iops = '9000';
                        break;
                        case '16核 64GB（独享型（高CPU））':
                            this.specCodeArr.specCode = 'pg.x4.2xlarge.2';
                            this.specCodeArr.maxConnectNum = '10000';
                            this.specCodeArr.storage = '1000GB/2000GB';
                            this.specCodeArr.iops = '18000';
                        break;
                        case '32核 128GB（独享型（高CPU））':
                            this.specCodeArr.specCode = 'pg.x4.2xlarge.2';
                            this.specCodeArr.maxConnectNum = '12000';
                            this.specCodeArr.storage = '2000GB/3000GB';
                            this.specCodeArr.iops = '36000';
                        break;
                        case '30核 220GB（独占物理机型）':
                            this.specCodeArr.specCode = 'pg.x4.2xlarge.2';
                            this.specCodeArr.maxConnectNum = '4000';
                            this.specCodeArr.storage = '3000GB';
                            this.specCodeArr.iops = '20000';
                        break;
                        case '60核 470GB（独占物理机型）':
                            this.specCodeArr.specCode = 'rds.pg.st.h43';
                            this.specCodeArr.maxConnectNum = '4000';
                            this.specCodeArr.storage = '3000GB';
                            this.specCodeArr.iops = '50000';
                        break;
                    }
                }
            } else if (this.buyInfo.currentSeries == '高可用版' && this.buyInfo.dataType == 'PPAS') {
                if (this.buyInfo.dataVersion == '10.0' || this.buyInfo.dataVersion == '9.3' ) {
                    switch(item) {
                        case '1核 1GB（兼容性测试用）':
                            this.specCodeArr.specCode = 'rds.ppas.t1.small';
                            this.specCodeArr.maxConnectNum = '100';
                            this.specCodeArr.storage = '150GB';
                            this.specCodeArr.iops = '1200';
                        break;
                        case '1核 4GB（独享套餐）':
                            this.specCodeArr.specCode = 'ppas.x4.small.2';
                            this.specCodeArr.maxConnectNum = '200';
                            this.specCodeArr.storage = '250GB';
                            this.specCodeArr.iops = '5000';
                        break;
                        case '2核 8GB（独享套餐）':
                            this.specCodeArr.specCode = 'ppas.x4.medium.2';
                            this.specCodeArr.maxConnectNum = '400';
                            this.specCodeArr.storage = '250GB';
                            this.specCodeArr.iops = '10000';
                        break;
                        case '2核 16GB（独享套餐）':
                            this.specCodeArr.specCode = 'ppas.x8.medium.2';
                            this.specCodeArr.maxConnectNum = '2500';
                            this.specCodeArr.storage = '250GB';
                            this.specCodeArr.iops = '15000';
                        break;
                        case '4核 16GB（独享套餐）':
                            this.specCodeArr.specCode = 'ppas.x4.large.2';
                            this.specCodeArr.maxConnectNum = '2500';
                            this.specCodeArr.storage = '250GB 或500GB';
                            this.specCodeArr.iops = '20000';
                        break;
                        case '4核 32GB（独享套餐）':
                            this.specCodeArr.specCode = 'ppas.x8.large.2';
                            this.specCodeArr.maxConnectNum = '5000';
                            this.specCodeArr.storage = '250GB 或500GB';
                            this.specCodeArr.iops = '30000';
                        break;
                        case '8核 32GB（独享套餐）':
                            this.specCodeArr.specCode = 'ppas.x4.xlarge.2';
                            this.specCodeArr.maxConnectNum = '5000';
                            this.specCodeArr.storage = '500GB 或1000GB';
                            this.specCodeArr.iops = '40000';
                        break;
                        case '8核 64GB（独享套餐）':
                            this.specCodeArr.specCode = 'ppas.x4.xlarge.2';
                            this.specCodeArr.maxConnectNum = '10000';
                            this.specCodeArr.storage = '500GB 或1000GB';
                            this.specCodeArr.iops = '60000';
                        break;
                        case '16核 64GB（独享套餐）':
                            this.specCodeArr.specCode = 'ppas.x4.2xlarge.2';
                            this.specCodeArr.maxConnectNum = '10000';
                            this.specCodeArr.storage = '1000GB 或2000GB';
                            this.specCodeArr.iops = '80000';
                        break;
                        case '16核 128GB（独享套餐）':
                            this.specCodeArr.specCode = 'ppas.x8.2xlarge.2';
                            this.specCodeArr.maxConnectNum = '12000';
                            this.specCodeArr.storage = '1000GB 或2000GB';
                            this.specCodeArr.iops = '120000';
                        break;
                        case '32核 128GB（独享套餐）':
                            this.specCodeArr.specCode = 'ppas.x4.4xlarge.2';
                            this.specCodeArr.maxConnectNum = '12000';
                            this.specCodeArr.storage = '2000GB 或3000GB';
                            this.specCodeArr.iops = '160000';
                        break;
                        case '32核 256GB（独享套餐）':
                            this.specCodeArr.specCode = 'ppas.x4.4xlarge.2';
                            this.specCodeArr.maxConnectNum = '12000';
                            this.specCodeArr.storage = '2000GB 或3000GB';
                            this.specCodeArr.iops = '240000';
                        break;
                        case '60核 470GB（独占物理机型）':
                            this.specCodeArr.specCode = 'ppas.x4.4xlarge.2';
                            this.specCodeArr.maxConnectNum = '12000';
                            this.specCodeArr.storage = '2000GB 或3000GB';
                            this.specCodeArr.iops = '450000';
                        break;
                    }
                }
            } else if (this.buyInfo.currentSeries == '高可用版' && this.buyInfo.dataType == 'MariaDB') {
                switch(item) {
                    case '1核 2GB':
                        this.specCodeArr.specCode = 'mariadb.n2.small.2c';
                        this.specCodeArr.maxConnectNum = '2000';
                        this.specCodeArr.storage = '20GB-1000GB';
                        this.specCodeArr.iops = 'min{1200 + 30 x 存储空间, 20000}';
                    break;
                    case '2核 4GB':
                        this.specCodeArr.specCode = 'mariadb.n2.medium.2c';
                        this.specCodeArr.maxConnectNum = '4000';
                        this.specCodeArr.storage = '20GB-1000GB';
                        this.specCodeArr.iops = 'min{1200 + 30 x 存储空间, 20000}';
                    break;
                    case '4核 8GB（独享套餐）':
                        this.specCodeArr.specCode = 'mariadb.x2.large.2c';
                        this.specCodeArr.maxConnectNum = '6000';
                        this.specCodeArr.storage = '20GB-6000GB';
                        this.specCodeArr.iops = 'min{1200 + 30 x 存储空间, 20000}';
                    break;
                    case '4核 16GB（独享套餐）':
                        this.specCodeArr.specCode = 'mariadb.x4.large.2c';
                        this.specCodeArr.maxConnectNum = '8000';
                        this.specCodeArr.storage = '20GB-6000GB';
                        this.specCodeArr.iops = 'min{1200 + 30 x 存储空间, 20000}';
                    break;
                    case '8核 16GB（独享套餐）':
                        this.specCodeArr.specCode = 'mariadb.x2.xlarge.2c';
                        this.specCodeArr.maxConnectNum = '8000';
                        this.specCodeArr.storage = '20GB-6000GB';
                        this.specCodeArr.iops = 'min{1200 + 30 x 存储空间, 20000}';
                    break;
                    case '8核 32GB（独享套餐）':
                        this.specCodeArr.specCode = 'mariadb.x2.xlarge.2c';
                        this.specCodeArr.maxConnectNum = '10000';
                        this.specCodeArr.storage = '20GB-6000GB';
                        this.specCodeArr.iops = 'min{1200 + 30 x 存储空间, 20000}';
                    break;
                    case '16核 32GB（独享套餐）':
                        this.specCodeArr.specCode = 'mariadb.x2.2xlarge.2c';
                        this.specCodeArr.maxConnectNum = '10000';
                        this.specCodeArr.storage = '20GB-6000GB';
                        this.specCodeArr.iops = 'min{1200 + 30 x 存储空间, 20000}';
                    break;
                    case '16核 64GB（独享套餐）':
                        this.specCodeArr.specCode = 'mariadb.x4.2xlarge.2c';
                        this.specCodeArr.maxConnectNum = '15000';
                        this.specCodeArr.storage = '20GB-6000GB';
                        this.specCodeArr.iops = 'min{1200 + 30 x 存储空间, 20000}';
                    break;
                    case '16核 128GB（独享套餐）':
                        this.specCodeArr.specCode = 'mariadb.x8.2xlarge.2c';
                        this.specCodeArr.maxConnectNum = '20000';
                        this.specCodeArr.storage = '20GB-6000GB';
                        this.specCodeArr.iops = 'min{1200 + 30 x 存储空间, 20000}';
                    break;
                    case '32核 128GB（独享套餐）':
                        this.specCodeArr.specCode = 'mariadb.x4.4xlarge.2c';
                        this.specCodeArr.maxConnectNum = '20000';
                        this.specCodeArr.storage = '20GB-6000GB';
                        this.specCodeArr.iops = 'min{1200 + 30 x 存储空间, 20000}';
                    break;
                    case '32核 256GB（独享套餐）':
                        this.specCodeArr.specCode = 'mariadb.x8.4xlarge.2c';
                        this.specCodeArr.maxConnectNum = '64000';
                        this.specCodeArr.storage = '20GB-6000GB';
                        this.specCodeArr.iops = 'min{1200 + 30 x 存储空间, 20000}';
                    break;
                    case '56核 224GB（独占物理机型）':
                        this.specCodeArr.specCode = 'mariadb.x4.8xlarge.2c';
                        this.specCodeArr.maxConnectNum = '64000';
                        this.specCodeArr.storage = '20GB-6000GB';
                        this.specCodeArr.iops = 'min{1200 + 30 x 存储空间, 20000}';
                    break;
                    case '56核 480GB（独占物理机型）':
                        this.specCodeArr.specCode = 'mariadb.x8.8xlarge.2c';
                        this.specCodeArr.maxConnectNum = '100000';
                        this.specCodeArr.storage = '20GB-6000GB';
                        this.specCodeArr.iops = 'min{1200 + 30 x 存储空间, 20000}';
                    break;
                }
            }
        },
        // 获取月份
        async getBuyMonth(num) {
            this.buyInfo.configCoast = 0;
            if (num == 10) {
                num = 12;
            } else if (num == 11) {
                num = 24
            } else if (num == 12 || num == 13) {
                num = 36;
            }
            this.buyInfo.buyMonth = num;
            var timeTYPE = 'Month';
            if (Number(this.buyInfo.buyMonth) >= 12) {
                timeTYPE = 'Year';
                this.buyInfo.buyMonth = this.buyInfo.buyMonth / 12;
                this.timeType = '年'
            } else {
                timeTYPE = 'Month';
                this.buyInfo.buyMonth = this.buyInfo.buyMonth;
                this.timeType = '月'
            }
            this.specCodeArr.storage = this.specCodeArr.storage.replace(/GB/g, '');
            // 存储量限制
            if (this.specCodeArr.storage.indexOf('-') != -1) { // 表示存储量是区间值
                let currentValue = this.specCodeArr.storage.split('-');
                if ((Number(currentValue[0]) <= Number(this.buyInfo.storageRoom)) && (Number(this.buyInfo.storageRoom) <= Number(currentValue[1]))) {
                    this.isPurQuality = true;
                } else {
                    this.isPurQuality = false;
                }
            } else if (this.specCodeArr.storage.indexOf('/') != -1) { // 表示存储量选择值
                let currentValue = this.specCodeArr.storage.split('/');
                    currentValue.forEach((item, index) => {
                        if (Number(this.buyInfo.storageRoom) != Number(item)) {
                            this.isPurQuality = false;
                        } else {
                            this.isPurQuality = true;
                        }
                    });
            } else { // 表示存储量是固定值
                if(Number(this.buyInfo.storageRoom) != Number(this.specCodeArr.storage)) {
                    this.isPurQuality = false;
                } else  {
                    this.isPurQuality =true;
                }
            }
            if (this.isPurQuality) {
                // 进行价格计算（包年包月）
                let data = await this.$http.createRdsPrice({
                    Engine: this.buyInfo.dataType,
                    EngineVersion: this.buyInfo.dataVersion,
                    CommodityCode: 'rds',
                    DBInstanceClass: this.specCodeArr.specCode,
                    DBInstanceStorage: this.buyInfo.storageRoom,
                    PayType: this.buyInfo.payType,
                    UsedTime: this.buyInfo.buyMonth,
                    TimeType: timeTYPE,
                    Quantity: this.buynum
                });
                if (data) {
                    this.buyInfo.configCoast = data.PriceInfo.OriginalPrice.toFixed(2)
                    this.buyInfo.preferentialCoast = data.PriceInfo.DiscountPrice.toFixed(2);
                }
            } else {
                this.$message.error(`该类型存储空间范围为${ this.specCodeArr.storage }`);
                this.isStorageSpec = false;
            }
        },
        // 默认获取价格
        async getDefaultPrice() {
            this.buyInfo.configCoast = 0;
                let data = await this.$http.createRdsPrice({
                    Engine: this.buyInfo.dataType,
                    EngineVersion: this.buyInfo.dataVersion,
                    CommodityCode: 'rds',
                    DBInstanceClass: this.buyInfo.specCode,
                    DBInstanceStorage: this.buyInfo.storageRoom,
                    PayType: this.buyInfo.payType,
                    UsedTime: this.buyInfo.buyMonth,
                    TimeType: 'Month',
                    Quantity: this.buynum
                });
                if (data) {
                    this.buyInfo.configCoast = data.PriceInfo.OriginalPrice.toFixed(2)
                    this.buyInfo.preferentialCoast = data.PriceInfo.DiscountPrice.toFixed(2);
                }
        },
        goBuy() {
            this.buyInfo.buyNum = this.buynum;
            this.buyInfo.specCode = this.specCodeArr.specCode;
            if (this.buyInfo.payType == 'Postpaid') {
                this.buyInfo.buyMonth = '按使用时长';
            } else {
                this.buyInfo.buyMonth = this.buyInfo.buyMonth;
            }
            this.$router.push({
                name: 'OrderConfirm',
                params: {
                    BuyInfo: this.buyInfo
                }
            });
        }
    },
    components: {
        slider1: slider,
        monthSlider: monthSlider
    },
    created () {
        this.getDefaultPrice();
    }
}
</script>

<style lang="scss" scoped>
.create-rds {
    position: relative;
    width: 100%;
    .data-header {
        margin: 0 0.75rem;
        margin-top: 1.3rem;
        padding-left: 0.75rem;
        display: flex;
        align-items: center;
        height: 1.5rem;
        border-left: 0.2rem solid #88B7E0;
        box-sizing: border-box;
        .header-left,.header-right {
        display: flex;
        align-items: center;
        height: 100%;
        }
        .header-left {
        font-size: 0.7rem;
        color: inherit;
        }
        .header-right {
        margin-left: auto;
        }
    }
    .mange-tab {
        margin: 0 0.75rem;
        display: flex;
        align-items: center;
        margin-top: 1.5rem;
        height: 2.5rem;
        border: 0.05rem solid #ddd;
        border-top: none;
        border-right: none;
        &.operaty {
            display: flex;
            justify-content: flex-end;
            margin-top: 0;
            border-left: none;
            border-bottom: none;
            .el-button {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 2rem;
                width: 3rem;
                &:nth-of-type(2) {
                    width: 5rem;
                }
            }
        }
        span {
            display: inline-block;
            padding: 0.7rem 0.5rem;
            padding-bottom: 0.8rem;
            color: #333;
            font-size: 0.6rem;
            border-top: 0.15rem solid #DDD;
            // border-bottom: 0.15rem solid red;
            border-right: 0.05rem solid #ddd;
            background-color: #FBFAF8;
            &.active {
                border-bottom: 0.15rem solid #fff;
                border-top: 0.15rem solid #00A2CA;
                background-color: #fff;
            }
        }
        .tips {
            margin-left: 3.25rem;
            font-style: normal;
            color: #666;
            font-size: 0.65rem;
            a {
                color: #06C;
            }
            &.pur-info {
                margin-left: auto;
                text-decoration: none;
            }
        }
    }
    .rds-attribute {
        margin-top: 1rem;
        padding-left: 0.75rem;
        box-sizing: border-box;
        .attribute-item {
            margin-bottom: 1rem;
            display: flex;
            height: 22.25rem;
            width: 74.5rem;
            background-color: #FAFAFA;
            &:nth-of-type(2) {
                height: 8.2rem;
                .item-left {
                    width: 1.1rem!important;
                }
                .network-select {
                    display: flex;
                    position: absolute;
                    bottom: -180%;
                    left: 23%;
                }
                .network-info {
                    position: absolute;
                    bottom: -280%;
                    left: 23%;
                    font-size: 0.6rem;
                    color: #999;
                    width: 140%;
                    a {
                        color: #00a2ca;
                        text-decoration: none;
                    }
                }
            }
            &:nth-of-type(3) {
                height: 5.55rem;
                .item-left {
                    width: 1.1rem!important;
                }
                .specifications-info {
                    position: absolute;
                    bottom: -90%;
                    left:18%;
                    color: #666;
                    font-size: 0.6rem;
                }
            }
            &:nth-of-type(4) {
                height: 5.55rem;
                .item-left {
                    width: 1.1rem!important;
                }
                .el-input__inner {
                    color: red;
                }
                .number {
                    padding-left: 1rem;
                    margin-left: 2rem;
                    width: 5rem;
                    border: 0.05rem solid #999;
                    box-sizing: border-box;
                }
                .unit {
                    position: relative;
                    left: -2rem;
                    top: 0.5rem;
                    font-size: 0.6rem;
                }
                .per-info {
                    position: absolute;
                    bottom: -90%;
                    left: 17%;
                    font-size: 0.6rem;
                    color: #999;
                    width: 140%;
                    color: #00a2ca;
                }
            }
            &:nth-of-type(5) {
                height: 8.55rem;
                .item-left {
                    width: 1.1rem!important;
                }
                .number {
                    padding-left: 1rem;
                    margin-left: 2rem;
                    width: 5rem;
                    height: 2rem;
                    font-size: 0.8rem;
                    border: 0.05rem solid #999;
                    box-sizing: border-box;
                }
            }
            &:hover {
                .item-left {
                    background-color: #DDDDDD;
                    color: #000;
                }
            }
            .item-left {
                display: flex;
                align-items: center;
                text-align: center;
                height: 100%;
                width: 2rem;
                background-color: #F2F2F2;
                color: #BFBBB6;
                font-size: 0.6rem;
            }
            .item-right {
                .item {
                    position: relative;
                    margin-top: 1.8rem;
                    display: flex;
                    a {
                        text-decoration: none;
                        font-size: 0.6rem;
                        &.select:hover {
                            color: #00a2ca;
                        }
                        &.select {
                            line-height: 20px;
                            color: #666;
                        }
                    }
                    .area-tips {
                        position: absolute;
                        bottom: -32%;
                        left: 5.3%;
                        color: #999;
                        font-size: 0.6rem;
                        a {
                            text-decoration: none;
                            color: #999;
                            &:hover {
                                color: #00a2ca;
                            }
                        }
                    }
                    .title {
                        margin-left: 1.5rem;
                        width: 4.5rem;
                        color: #999;
                        font-size: 0.6rem;
                    }
                }

            }
        }
    }
    .buy {
        padding: 1rem;
        position: fixed;
        width: 16rem;
        right: 1.5rem;
        top: 10.3rem;
        border: 1px solid red;
        background-color: #fff;
        box-sizing: border-box;
        .buy-top {
            display: flex;
            align-items: center;
            height: 2.1rem;
            font-size: 0.7rem;
            border-bottom: solid 1px #ddd;
        }
        .buy-content {
            .content-item {
                margin-top: 0.3rem;
                &:nth-of-type(8) {
                    display: flex;
                    flex-direction: column;
                    .name {
                        color: #f60;
                        font-size: 1.5rem;
                    }
                    .pre-price {
                        color: #390;
                        font-size: 0.6rem;
                    }
                }
                &:nth-of-type(9) {
                    .name {
                        display: inline-block;
                        background-color: #E4F0DC;
                        color: #333;
                    }
                }
                &:nth-of-type(10) {
                    display: flex;
                    justify-content: space-between;
                    button {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 6rem;
                        height: 1.8rem;
                        background-color: #FF6600;
                        cursor: pointer;
                        font-size: 0.9rem;
                        &.buy-now {
                            color: #fff;
                            &.disabled {
                                background-color:#ccc;
                            }
                        }
                        &.add-cart {
                            color: #ffdfc9;
                        }
                    }
                }
                &:nth-of-type(11) {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    span {
                        margin-bottom: 0.3rem;
                    }
                }
                span {
                    font-size: 0.6rem;
                    color: #999;
                    &:nth-last-of-type(1) {
                        color: #000;
                    }
                }
            }
        }
    }
}
</style>
