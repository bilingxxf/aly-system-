<template>
    <div class="data-manage">
        <div class="manage-left">
            <router-link tag="div" to="/SecurityGroup" class="left-head">
                <i class="el-icon-arrow-left"></i>
            </router-link>
            <div class="left-list">
                <div class="list-item" :class="{ 'active': index == currentIndex }" @click="loadrouter(index)" v-for="(item, index) in selectItem" :key="index">{{ item.title }}</div>
            </div>
        </div>
        <div class="manage-right">
        	<keep-alive>
        		<router-view></router-view>
        	</keep-alive>
            
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'dataManage',
    data () {
        return {
            selectItem: [
                {
                    title: '安全组规则'
                },
                {
                    title: '安全组内实例列表'
                }
            ],
            currentIndex: 0,
            DBInstanceId: null
        }
    },
    computed: {
    },
    methods: {
        loadrouter(index) {
            this.currentIndex = index;
            switch(Number(index)) {
                case 0:
                    this.$router.push({
                        path: 'configurRule'
                    });
                    break;
                case 1:
                    this.$router.push({
                        path: 'manaExam'
                    });
                    break;
            }
        }
    },
    created () {
        this.DBInstanceId = localStorage.getItem('id');
        // 默认路由跳转到基本信息
        if(this.DBInstanceId == 0) {
        	this.currentIndex = 0
        	this.$router.push({
	            path: 'configurRule'
	        });
        }else {
        	this.currentIndex = 1
        	this.$router.push({
	            path: 'manaExam'
	        });
        }
    }
}
</script>

<style lang="scss" scoped>
.data-manage {
    display: flex;
    width: 100%;
    height: 100%;
    background: #fff;
    .manage-left {
        height: 100%;
        width: 9rem;
        background-color: #EAEDF1;
        .left-head{
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 3.5rem;
            background-color: #D9DEE4;
            .el-icon-arrow-left {
                font-size: 2rem;
                font-weight: 700;
            }
        }
        .left-list {
            display: flex;
            flex-direction: column;
            height: 100%;
            width: 100%;
            background-color: #EAEDF1;
            .active {
                background-color: #fff;
            }
            .list-item {
                padding-left: 1.5rem;
                display: flex;
                align-items: center;
                width: 100%;
                height: 2rem;
                box-sizing: border-box;
                color: #333;
                font-size: 0.6rem;
                cursor: pointer;
                &:hover {
                    background-color: #fff;
                }
            }
        }
    }
    .manage-right {
        width: 90.5%;
        height: 100%;
    }
}
</style>
