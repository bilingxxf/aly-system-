<template>
    <div class="account-mange modify-per create-per datasecurity-per">
        <div class="data-header">
            <div class="header-left">
            <span class="title">数据安全性</span>
            </div>
        </div>
        <!-- tab栏 -->
        <div class="mange-tab">
            <span>白名单设置</span>
        </div>
        <div class="sec-header">
            <span class="title">网络隔离模式：通用白名单模式。以下白名单不区分经典网络及专有网络。</span>
            <el-button icon="el-icon-plus">添加白名单分组</el-button>
            <i class="el-icon-question"></i>
        </div>
        <div class="sec-list">
            <div class="list-item" v-for="(item, index) in securityData" :key="index">
                <div class="item-top">
                    <i class="el-icon-minus"></i>
                    <!-- <i class="el-icon-plus" v-else  @click="fold(currentIndex1 = !currentIndex1)"></i> -->
                    <span class="item-title">{{ item.DBInstanceIPArrayName }}</span>
                    <span @click="update(item)" class="exit">修改</span>
                    <span class="del">删除</span>
                </div>
                <div v-show="true" class="item-bottom">{{ item.SecurityIPList }}</div>
            </div>
        </div>
        <p class="pay">注：RDS IP白名单设计支持IP段如X.X.X.X/X的配置，设置为127.0.0.1代表禁止所有地址访问</p>
        <!-- 修改与删除 -->
        <div class="modal" v-show="modalShow">
            <div class="modal-center">
                <div class="center-top">
                    <span>{{ isUpdate }}白名单分组</span>
                    <span @click="modalShow = false" class="icon-closet">X</span>
                </div>
                <div class="modal-content">
                    <el-form :model="itemData" status-icon  :rules="rules"  ref="itemData" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="分组名称*：">
                            <el-input disabled type="text" v-model="itemData.accountName" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="组内白名单*:" prop="desc">
                            <el-input type="textarea" v-model="itemData.desc"></el-input>
                        </el-form-item>
                        <el-form-item label="">
                            <div class="foot-top">
                                <a  target="_blank" href="https://help.aliyun.com/knowledge_detail/41754.html?spm=5176.2020520104.0.0.2b4b1450yNXCUh">加载ECS内网IP</a>
                                <span class="number">还可添加999个白名单</span>
                            </div>
                        </el-form-item>
                        <el-form-item label="">
                            <el-input disabled type="textarea" class="bind-ip" v-model="itemData.bindIp"></el-input>
                            <a  target="_blank" href="https://help.aliyun.com/knowledge_detail/41754.html?spm=5176.2020520104.0.0.2b4b1450yNXCUh" class="locate-ip">如何定位本机IP</a>
                        </el-form-item>
                        <el-form-item label="">
                            <div class="count-down">新白名单将于1分钟后生效</div>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit('itemData')">确定</el-button>
                            <el-button @click="cancle">取消</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'datasecurity-per',
    data () {
        return {
            dataInfo: null,
            foldShow: true,
            currentIndex1: true,
            modalShow: false,
            isUpdate: '',
            formData: {
                data: null
            },
            securityData: [
                {
                    title: 'ali_dms_group',
                    name: '100.104.205.0/24'
                },
                {
                    title: 'ali_dms_group',
                    name: '100.104.205.0/24'
                },
                {
                    title: 'ali_dms_group',
                    name: '100.104.205.0/24'
                }
            ],
            itemData: {
                accountName: '',
                desc: '',
                bindIp: '指定IP地址：192.168.0.1 允许192.168.0.1的IP地址访问RDS指定IP段：192.168.0.0/24 允许从192.168.0.1到192.168.0.255的IP地址访问RDS多个IP设置，用英文逗号隔开，如192.168.0.1,192.168.0.0/24'
            },
            rules: {
                desc: [
                    { required: true, message: '组内白名单不能为空', trigger: 'blur' }
                ]
            }
        }
    },
    computed: {
        ...mapGetters([
            'getRdsItemInfo'
        ])
    },
    filters: {
        isReady: function(value) {
            if (!value) return;
            switch(value) {
                case 'ReadWrite':
                    return '读写';
                    break;
            }
        }
    },
    methods: {
        // 获得没有授权的数据库列表
        async getDataInfo() {
            let data = await this.$http.dataInfo({
                DBInstanceId: this.dataInfo,
                PageNumber: 1,
                PageSize: 10
            });
            if (data) {
                this.formData.data = data.Databases.Database;
            }
        },
        async getSecurityData() {
            let data = await this.$http.getSecurityData({
                DBInstanceId: this.dataInfo
            });
            if (data) {
                this.securityData = data.Items.DBInstanceIPArray;
            }
        },
        operity() {
            this.$alert('这是一段内容', '修改白名单分组', {
                confirmButtonText: '确定'
            });
        },
        update(item) {
            this.isUpdate = '修改';
            this.modalShow = true;
            this.itemData.accountName = item.DBInstanceIPArrayName;
            this.itemData.desc = item.SecurityIPList;
        },
        async modifyIpLIST() {
                const data = await this.$http.modifyIpList({
                    DBInstanceId: this.dataInfo,
                    SecurityIps: this.itemData.desc
                });
                // console.log(data);
            if (data) {
                this.getSecurityData();
                this.modalShow = false;
            }
        },
        onSubmit(itemData) {
            this.$refs[itemData].validate((valid) => {
                if (valid) {
                    this.modifyIpLIST();
                } else {
                    return false;
                }
            });
        },
        cancle() {
           this.modalShow = false;
        }
    },
    mounted () {
        this.dataInfo = localStorage.getItem('DBInstanceId');
        this.getDataInfo();
        this.getSecurityData();
    }
}
</script>

<style lang="scss" scoped>
.account-mange {
    position: relative;
    width: 100%;
    height: 100%;
    .data-header {
        margin: 0 0.75rem;
        padding-left: 0.75rem;
        display: flex;
        align-items: center;
        width: 100%;
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
        // background: pink;
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
            border-top: 0.15rem solid #00A2CA;
            border-bottom: 0.15rem solid #fff;
            border-right: 0.05rem solid #ddd;
        }
        &.update-date {
            height: 1.5rem;
            border: none;
            border-left: 0.2rem solid #88B7E0;
            span {
                border: none;
                &.back {
                    padding-left: 0;
                    color: #06C;
                    cursor: pointer;
                }
            }
        }
    }
    .sec-header {
        display: flex;
        align-items: center;
        margin: 0 0.75rem;
        height: 2.5rem;
        .title {
            font-size: 0.6rem;
            color: #333;
        }
    }
    .sec-list {
        margin: 0 0.75rem;
        .list-item {
            margin-bottom: 1rem;
            display: flex;
            flex-direction: column;
            height: 3.8rem;
            border: 0.05rem solid #E1E6EB;
            .item-top,.item-bottom {
                flex: 1;
            }
            .item-top,.item-bottom {
                display: flex;
                align-items: center;
                padding-left: 0.4rem;
                box-sizing: border-box;
            }
            .item-top {
                border-bottom: 0.05rem solid #E1E6EB;
                background-color: #F5F6FA;
                span {
                    &.exit,&.del {
                        color: #06c;
                        font-size: 0.6rem;
                        cursor: pointer;
                    }
                    &.exit {
                        margin-left: auto;
                    }
                    &.del {
                        margin: 0 0.2rem;
                    }
                    &.item-title {
                        color: #999;
                        font-size: 0.6rem;
                    }
                }
            }
            .item-bottom {
                color: #333;
                font-size: 0.6rem;
            }
        }
    }
    .pay {
        margin: 0 0.75rem;
        color: #999;
        font-size: 0.6rem;
    }
    .modal {
        position: fixed;
        top: 0;
        width: 100%;
        height: 100%;
        left: 0;
        background-color: rgba(255, 255, 255, .5);
        .modal-center {
            margin-top: 1%;
            margin-left: 30%;
            width: 35rem;
            height: 29rem;
            background-color: #fff;
            box-shadow: 0px 5px 10px rgba(0,0,0,0.5);
            .center-top {
                margin-bottom: 1.5rem;
                padding: 0 20px;
                display: flex;
                align-items: center;
                height: 2.5rem;
                box-sizing: border-box;
                border-bottom: 0.05rem solid #e5e5e5;
                span {
                    font-size: 0.7rem;
                }
                .icon-closet {
                    margin-left: auto;
                    padding: 10px;
                    cursor: pointer;
                }
            }
            .foot-top {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 20.5rem!important;
                a, span {
                    color: #333;
                    font-weight: normal;
                    font-size: 0.6rem;
                }
                a {
                    text-decoration: none;
                    color: #428bca;
                }
            }
            .modal-content {
                position: relative;
                border-bottom: 0.05rem solid #e5e5e5;
            }
            .count-down {
                height: 2rem;
                color: #f68300;
            }
        }
    }
}
</style>
