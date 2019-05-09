<template>
    <div class="account-mange modify-per">
        <div class="data-header">
            <div class="header-left">
            <span class="title">账号管理</span>
            </div>
        </div>
        <!-- tab栏 -->
        <div class="mange-tab">
            <span>用户账号</span>
        </div>
        <div class="mange-tab update-date">
            <span>用户账号</span>
            <span @click="back" class="back"><<返回账号管理</span>
        </div>
        <div class="per-list">
            <div class="header">
                <span class="title">数据库账号：</span>
                <span class="name">{{  this.$route.query.item.AccountName }}</span>
            </div>
            <div class="foot">
                <span class="title">授权数据库：</span>
                <el-transfer
                    v-model="value"
                    :titles="['未授权数据库', '授权数据库']"
                    :button-texts="['移除', '授权']"
                    @right-check-change="rightCheckChange"
                    :data="data">
                </el-transfer>
                <div class="radios" v-if="value.length > 0">
                    <el-radio-group v-for="(item, index) in value.length" :key="index" @change="selectOrwriteState(index)" v-model="radios[index]">
                        <el-radio label="ReadOnly">只读</el-radio>
                        <el-radio label="ReadWrite">读写</el-radio>
                        <el-radio label="DDLOnly">仅DDL</el-radio>
                        <el-radio label="DMLOnly">只DML</el-radio>
                    </el-radio-group>
                </div>
            </div>
            <div class="submit-bth">
                <el-button @click="subAuhorized">确定</el-button>
                <el-button>取消</el-button>
            </div>
        </div>

    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'modify-per',
    data () {
        return {
            data: [
            ],
            radios: [],
            havenauthIndexArr: [-1],
            currentRadio: 3,
            currentSelRadio: 'ReadWrite',
            dataInfo: null,
            noAuthorized: null,
            rightValueLength: 0,
            defaltSelArr: [],
            currentSelected: '',
            value: [],
            readOrWrite1: '10',
            authDataName: '',
            radioValue: '',
            DatabasePrivileges: '' // 表示已经授权的数据库
        }
    },
    components:{
    },
    watch: {
        value (newValue) {
            if (newValue.length) {
                this.value.map((v,i) => {
                    this.data[v].AccountPrivilege = this.radios[i] = 'ReadOnly'
                })
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
        back() {
            this.$router.go(-1);
        },
        // 选择读写状况
        selectOrwriteState(index) {
            this.value.map((v,i) => {
                this.data[v].AccountPrivilege = this.radios[i];
            })
        },
        // 获取所有的数据库列表
        async getDataInfo() {
                const data = await this.$http.dataInfo({
                    DBInstanceId: this.dataInfo,
                    PageNumber: 1,
                    PageSize: ''
                });
                this.data = data.Databases.Database;
                this.data.forEach((item, index) => {
                    item.label = item.DBName;
                    item.key = index;
                    this.DatabasePrivileges.forEach((v, i) => {
                        if (item.DBName === v.DBName) {
                            this.value.push(index);
                        }
                    });
                });
        },
        // 右侧选择项
        rightCheckChange(key) {
            this.data.forEach((item, index) => {
                if (index == key) {
                    this.authDataName = item.DBName;
                }
            });
        },
        // 取消授权
        async cancelAuth(item) {
            let data = await this.$http.cancelauth({
                DBInstanceId: this.dataInfo,
                AccountName: this.$route.query.item.AccountName,
                DBName: item.DBName
            });
        },
        // 进行授权
        subAuhorized() {
            if(this.value.length == 0) { // 表示全部移除
                this.data.forEach((v, i) => {
                    this.cancelAuth(v);
                });
            } else { // 表示部分移除
                this.value.forEach((item, index) => {
                    this.data.forEach((v, i) => {
                        if (v.key == item) { // 授权
                            this.authorization(v);
                        } else { // 移除
                            this.cancelAuth(v);
                        }
                    })
                });
            }
        },
        async authorization(item) {
            let data = await this.$http.dataauth({
                DBInstanceId: this.dataInfo,
                AccountName: this.$route.query.item.AccountName,
                DBName: item.DBName,
                AccountPrivilege: item.AccountPrivilege
            });
        }
    },
    created() {
    },
    mounted () {
        this.dataInfo = localStorage.getItem('DBInstanceId');
        this.DatabasePrivileges = this.$route.query.item.DatabasePrivileges.DatabasePrivilege;
        this.getDataInfo();
    }
}
</script>

<style lang="scss" scoped>
.account-mange {
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
        width: 100%;
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
    .per-list {
        margin-top: 2.5rem;
        margin-left: 9.5rem;
        height: 25rem;
        .header {
            display: flex;
            align-items: center;
            width: 100%;
            height: 2.5rem;
            span {
                font-size: 0.6rem;
                color: #000;
                font-weight: 700;
                &.name {
                    margin-left: 1.75rem;
                    align-self: flex-start;
                }
            }
        }
        .foot {
            position: relative;
            // display: flex;
            .title {
                margin-right: 1.75rem;
                font-size: 0.6rem;
                color: #000;
                font-weight: 700;
            }
            .radios {
                display: flex;
                flex-direction: column;
                position: absolute;
                left: 450px;
                top: 70px;
            }
        }
        .submit-bth {
            width: 100%;
        }
    }
}
</style>
