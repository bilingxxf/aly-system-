import Vue from 'vue'
import Router from 'vue-router'
const SignList = (resolve) => require(['@/components/SignList.vue'], resolve)
const UserList = (resolve) => require(['@/components/UserList.vue'], resolve)
const Cloudy = (resolve) => require(['@/components/Cloudy.vue'], resolve)
const Instance = (resolve) => require(['@/components/Instance.vue'], resolve)
const KeysManage = (resolve) => require(['@/components/KeysManage.vue'], resolve)
const CreateKeys = (resolve) => require(['@/components/CreateKeys.vue'], resolve)
const Renew = (resolve) => require(['@/components/Renew.vue'], resolve)
const CreateInstance = (resolve) => require(['@/components/CreateInstance.vue'], resolve)
// rds
const Rdslist = (resolve) => require(['@/components/rds/rdsList'], resolve)
const DataManage = (resolve) => require(['@/components/rds/dataManage'], resolve)
const BaseInfo = (resolve) => require(['@/components/rds/baseInfo'], resolve)
const DataInfo = (resolve) => require(['@/components/rds/dataInfo'], resolve)

const SecurityGroup = (resolve) => require(['@/components/SecurityGroup.vue'], resolve)
const DataManages = (resolve) => require(['@/components/DataManage.vue'], resolve)
const ManaExam = (resolve) => require(['@/components/ManaExam.vue'], resolve)
const ConfigurRule = (resolve) => require(['@/components/ConfigurRule.vue'], resolve)
const MdsAccountMange = (resolve) => require(['@/components/rds/accountMange.vue'], resolve)
const ModifyPer = (resolve) => require(['@/components/rds/modifyPer.vue'], resolve)
const CreateAccount = (resolve) => require(['@/components/rds/createcount.vue'], resolve)
const DataSecurity = (resolve) => require(['@/components/rds/dataSecurity.vue'], resolve)
const CreateRds = (resolve) => require(['@/components/rds/createRds.vue'], resolve)
const OrderConfirm = (resolve) => require(['@/components/rds/orderConfirm.vue'], resolve)
const DatabaseConnect = (resolve) => require(['@/components/rds/databaseConnect.vue'], resolve)
const CreateDataBase = (resolve) => require(['@/components/rds/createDataBase.vue'], resolve)
const BackUp = (resolve) => require(['@/components/rds/backUp.vue'], resolve)

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: 'instance'
    },
    {
      path: '/instance',
      name: 'Instance',
      component: Instance
    },
    {
    	path: '/keysManage',
    	name: 'KeysManage',
    	component: KeysManage
    },
    {
    	path:'/createKeys',
    	name: 'CreateKeys',
    	component: CreateKeys
    },
    {
      path: '/cloudy',
      name: 'Cloudy',
      component: Cloudy
    },
    {
      path: '/signlist',
      name: 'SignList',
      component: SignList
    },
    {
      path: '/userlist',
      name: 'UserList',
      component: UserList
    },
    {
      path: '/renew',
      name: 'Renew',
      component: Renew
    },
    {
      path: '/createinstance',
      name: 'CreateInstance',
      component: CreateInstance
    },
    {
      path: '/createrds',
      name: 'CreateRds',
      component: CreateRds
    },
    {
      path: '/orderconfirm',
      name: 'OrderConfirm',
      component: OrderConfirm
    },
    {
      path: '/rdslist',
      name: 'Rdslist',
      component: Rdslist
    },
    {
      path: '/securityGroup',
      name: 'SecurityGroup',
      component: SecurityGroup
    },
    {
      path: '/datamanage',
      name: 'DataManage',
      component: DataManage,
      children: [
        {
          path: '/backup',
          name: 'BackUp',
          component: BackUp
        },
        {
          path: '/baseinfo/:id',
          name: 'BaseInfo',
          component: BaseInfo
        },
        {
          path: '/datainfo',
          name: 'DataInfo',
          component: DataInfo
        },
        {
          path: '/databaseconnect',
          name: 'DatabaseConnect',
          component: DatabaseConnect
        },
        {
          path: '/mdsaccountmange',
          name: 'AccountMange',
          component: MdsAccountMange
        },
        {
          path: '/datasecurity',
          name: 'AccountMange',
          component: DataSecurity
        },
        {
          path: '/modifyper',
          name: 'ModifyPer',
          component: ModifyPer
        },
        {
          path: '/createaccount',
          name: 'CreateAccount',
          component: CreateAccount
        },
        {
          path: '/createdatabase',
          name: 'CreateDataBase',
          component: CreateDataBase
        }
      ]
    },
    {
      path: '/securityGroup',
      name: 'SecurityGroup',
      component: SecurityGroup
    },
    {
      path: '/dataManages',
      name: 'DataManages',
      component: DataManages,
      children: [
        {
		    	path: '/configurRule',
		    	name: 'ConfigurRule',
		    	component: ConfigurRule
		    },
        {
		    	path: '/manaExam',
		    	name: 'ManaExam',
		    	component: ManaExam
		    }
      ]
    }
  ]
})
