<template>
    <div class="order-confirm">
        <div class="confirm-header">
            <span>订单确认</span>
            <el-button @click="back" icon="el-icon-back">返回</el-button>
        </div>
        <!-- 数据列表 -->
        <div class="confirm-content">
            <table>
                <tr class="theader">
                    <th>产品名称</th>
                    <th>实例配置</th>
                    <th>时长</th>
                    <th>单价</th>
                    <th>数量</th>
                    <th>付费方式</th>
                    <th>资费</th>
                </tr>
                <tr class="server">
                    <td colspan="7">服务商：阿里云计算有限公司</td>
                </tr>
                <tr class="tbody">
                    <td>1.	关系型数据库（RDS）</td>
                    <td>
                        <span>地域 :     {{ buyInfo.city }}</span>
                        <span>可用区 :     {{ buyInfo.area }}</span>
                        <span>数据库类型 :     {{ buyInfo.dataType }}</span>
                        <span>版本 :     {{ buyInfo.dataVersion }}</span>
                        <span>存储空间 :     {{ buyInfo.storageRoom }}G</span>
                        <span>网络类型 :     {{ buyInfo.networkType }}</span>
                        <span>规格 :     {{ buyInfo.specifications }}</span>
                        <span>系列 :     {{ buyInfo.currentSeries }}</span>
                    </td>
                    <td>{{ buyInfo.buyMonth | filterMonth }}</td>
                    <td>￥ {{ buyInfo.configCoast }}</td>
                    <td>{{ buyInfo.buyNum }}台</td>
                    <td>{{ buyInfo.payType | filterPaytype }}</td>
                    <td>￥ {{ buyInfo.configCoast }}</td>
                </tr>
            </table>
        </div>
        <!-- 合计 -->
        <div class="confirm-combined">
            <span class="pay">应付款：<i>￥ {{  buyInfo.configCoast}}</i> </span>
            <span class="pre-price">优惠￥ {{ buyInfo.preferentialCoast }}</span>
            <span class="discount">1年付立享85折优惠价</span>
            <span class="tips">重要提醒：订单对应可开发票的类型和抬头为您在用户中心-发票信息管理中设置的信息</span>
            <el-button @click="goPay">去支付</el-button>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'order-confirm',
    data () {
        return {
            buyInfo: null
        }
    },
    computed: {
    },
    filters: {
        filterMonth(value) {
            return value;
        },
        filterPaytype(value) {
            return value == 'Postpaid' ? '按量付费' : '包年包月';
        }
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        async goPay() {
            this.buyInfo.currentSeries = this.buyInfo.currentSeries === '高可用版' ? 'HighAvailability' : 'Basic';
            this.buyInfo.per = this.buyInfo.per === 'SSD云盘' ? 'cloud_ssd' : 'local_ssd';
            this.buyInfo.networkType = this.buyInfo.networkType === '经典网络' ? 'VPC' : 'VPC';
            this.buyInfo.netType = this.buyInfo.netType === '公网连接' ? 'Internet' : 'Intranet';
            const params = {
                Engine: this.buyInfo.dataType,
                EngineVersion: this.buyInfo.dataVersion,
                Category: this.buyInfo.currentSeries,
                DBInstanceClass: this.buyInfo.specCode,
                DBInstanceStorage: this.buyInfo.storageRoom,
                DBInstanceNetType: this.buyInfo.netType,
                SecurityIPList: '0.0.0.0/0',
                PayType: this.buyInfo.payType,
                InstanceNetworkType: this.buyInfo.networkType,
                ConnectionMode: 'Safty',
                DBInstanceStorageType: this.buyInfo.per,
                ZoneId: 'cn-huhehaote-a',
            };
            this.$http.createRds(params).then(res => {
                console.log(res);
            }).catch(e => {
                console.log(e);
            })
        }
    },
    created () {
        this.buyInfo = this.$route.params.BuyInfo;
    }
}
</script>

<style lang="scss" scoped>
.order-confirm {
    padding: 1rem;
    width: 100%;
    box-sizing: border-box;
    .confirm-header {
        padding-left: 0.5rem;
        border-left: 0.1rem solid #88B7E0;
        font-size: 0.7rem;
        box-sizing: border-box;
    }
    .confirm-content {
        margin-top: 2rem;
        table {
            width: 100%;
        }
        .theader {
            background-color: #F2F2F2;
            th {
                padding-left: 1rem;
                border-top: 0.2rem solid #ddd;
                border-bottom: 0.05rem solid #ddd;
                text-align: left;
                height: 1.75rem;
                box-sizing: border-box;
                color: #333;
                font-size: 0.6rem;
            }
            th:nth-of-type(1) {
                width: 25%;
            }
            th:nth-of-type(2) {
                width: 30%;
            }
        }
        .tbody {
            background: #F9F9F9;
            td {
                padding-left: 1rem;
                border-top: 0.05rem solid #ddd;
                border-bottom: 0.05rem solid #ddd;
                text-align: left;
                box-sizing: border-box;
                color: #333;
                font-size: 0.6rem;
                &:nth-of-type(2) {
                    display: flex;
                    flex-direction: column;
                    span {
                        width: 200%;
                        margin: 0.25rem 0;
                    }
                }
            }
            td:nth-of-type(1) {
                width: 25%;
            }
            td:nth-of-type(2) {
                width: 30%;
            }
        }
        tr {
            height: 1.75rem;
        }
        .server {
            background-color: #fff;
            td {
                padding-left: 1rem;
                color: #333;
                font-size: 0.6rem;
                box-sizing: border-box;
            }
        }
    }
    .confirm-combined {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        margin-top: 2rem;
        text-align: right;
        span {
            margin-bottom: 0.5rem;
        }
        .pay {
            i {
                color: #f60;
                font-style: normal;
                font-size: 1.2rem;
            }
        }
        .pre-price {
            color: #390;
            font-size: 0.6rem;
        }
        .discount {
            display: inline-block;
            font-size: 0.6rem;
            color: #390;
        }
        .tips {
            color: #f68300;
            font-size: 0.6rem;
        }
    }
}
</style>
