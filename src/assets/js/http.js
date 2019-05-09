import 'babel-polyfill'
import flyio from 'flyio'

const local = location.host.includes('localhost')
let http = {}
// const sign = localStorage.token
const sign = '7942c4f3404724e1d8c57c378b7ee31d'
const common = { sign }
const APIS = {
  area: {
    url: `/api/ecses/region`,
    method: 'GET'
  },
  instance_list: {
    url: `/api/instances`,
    method: 'GET'
  },
  start: {
    url: '/api/instances/start',
    method: 'POST'
  },
  stop: {
    url: '/api/instances/shutdown',
    method: 'POST'
  },
  restart: {
    url: '/api/instances/restart',
    method: 'POST'
  },
  instances_status: {
    url: '/api/instances/status',
    method: 'GET'
  },
  instance_create: {
    url: '/api/instances/create',
    method: 'POST'
  },
  instance_disks: {
    url: '/api/disk',
    method: 'GET'
  },
  typesinfo: {
    url: '/api/instances/typesinfo',
    method: 'GET'
  },
  prize: {
    url: '/api/instances/spotprice',
    method: 'GET'
  },
  images: {
    url: '/api/image',
    method: 'GET'
  },
  ecsprize: {
    url: '/api/price/ecsprice',
    method: 'GET'
  },
  sign_list: {
    url: '/api/server',
    method: 'GET'
  },
  selfsign: {
    url: '/api/server/selflist',
    method: 'GET'
  },
  delete_sign: {
    url: '/api/server/delete',
    method: 'DELETE'
  },
  create_sign: {
    url: '/api/server/create',
    method: 'POST'
  },
  create_command: {
    url: '/api/command',
    method: 'POST'
  },
  delete_command: {
    url: '/api/command',
    method: 'DELETE'
  },
  command_list: {
    url: '/api/command/list',
    method: 'GET'
  },
  instance_install: {
    url: '/api/command/listcloudassistantstatus',
    method: 'GET'
  },
  cloudy_install: {
    url: '/api/command/installcloudassistant',
    method: 'POST'
  },
  command_history: {
    url: '/api/command/invocation',
    method: 'GET'
  },
  command_invoke: {
    url: '/api/command/invoke',
    method: 'POST'
  },
  command_result: {
    url: '/api/command/invocationresults',
    method: 'GET'
  },
  command_stop: {
    url: '/api/command/stop',
    method: 'POST'
  },
  user_list: {
    url: '/api/user/list',
    method: 'GET'
  },
  edit_user: {
    url: '/api/user',
    method: 'PATCH'
  },
  user_add: {
    url: '/api/user',
    method: 'POST'
  },
  user_delete: {
    url: '/api/user',
    method: 'DELETE'
  },
  rdsList: {
    url: '/api/rds',
    method: 'GET'
  },
  rdsInfo: {
    url: '/api/rds/info',
    method: 'GET'
  },
  security_list: {
    url: '/api/securitygroup',
    method: 'GET'
  },
  renewmany: {
    url: '/api/instances/renewmany',
    method: 'PATCH'
  },
  instance_change: {
    url: '/api/instances/type',
    method: 'PATCH'
  },
  instance_delete: {
    url: '/api/instances/delete',
    method: 'DELETE'
  },
  create_security: {
    url: '/api/securitygroup/create',
    method: 'POST'
  },
  delete_security_group: {
    url: '/api/securitygroup/delete',
    method: 'DELETE'
  },
  edit_security_group: {
    url: '/api/securitygroup/groupattr',
    method: 'PATCH'
  },
  dataInfo: {
    url: '/api/rds/describedatabases',
    method: 'GET'
  },
  modifyDbDesc: {
    url: '/api/rds/description',
    method: 'PATCH'
  },
  accountList: {
    url: '/api/rds/describeaccounts',
    method: 'GET'
  },
  instanceout: {
    url: '/api/securitygroup/instanceout',
    method: 'POST'
  },
  status: {
    url: '/api/instances/status',
    method: 'GET'
  },
  joinInsatnce: {
    url: '/api/securitygroup/instancejoin',
    method: 'POST'
  },
  ruleList: {
    url: '/api/securitygroup/groupinfo',
    method: 'GET'
  },
  inrule: {
    url: '/api/securitygroup/inrule',
    method: 'POST'
  },
  outrule: {
    url: '/api/securitygroup/outrule',
    method: 'POST'
  },
  dataauth: {
    url: '/api/rds/grantaccountprivilege',
    method: 'PATCH'
  },
  createDataBase: {
    url: '/api/rds/createaccount',
    method: 'POST'
  },
  getSecurityData: {
    url: '/api/rds/describedbinstanceiparraylist',
    method: 'GET'
  },
  modifyIpList: {
    url: '/api/rds/modifyips',
    method: 'PATCH'
  },
  edit_inrule: {
    url: '/api/securitygroup/inrule',
    method: 'PATCH'
  },
  del_inrule: {
    url: '/api/securitygroup/inrule',
    method: 'DELETE'
  },
  del_outrule: {
    url: '/api/securitygroup/outrule',
    method: 'DELETE'
  },
  resetAccountPwd: {
    url: '/api/rds/resetaccountpassword',
    method: 'PATCH'
  },
  restartInstance: {
    url: '/api/rds/restart',
    method: 'GET'
  },
  loginout: {
    url: '/loginout',
    method: 'GET'
  },
  createRdsPrice: {
    url: '/api/rds/rdscreateprice',
    method: 'GET'
  },
  createRds: {
    url: '/api/rds/createdbinstance',
    method: 'POST'
  },
  delRdsItem: {
    url: '/api/rds/deldbinstance',
    method: 'PATCH'
  },
  getConnectInfo: {
    url: '/api/rds/netinfo',
    method: 'GET'
  },
  applyExterNetadd: {
    url: '/api/rds/allocatepublicconnection',
    method: 'POST'
  },
  releaseIns: {
    url: '/api/rds/releaseConnection',
    method: 'POST'
  },
  exitIntance: {
    url: '/api/rds/modifyconnectionstring',
    method: 'PATCH'
  },
  createBaseInfo: {
    url: '/api/rds/createdatabase',
    method: 'POST'
  },
  delBaseInfo: {
    url: '/api/rds/deletedatabase',
    method: 'POST'
  },
  baseIndoExitDesc: {
    url: '/api/rds/modifydbdescription',
    method: 'POST'
  },
  delAccountItem: {
    url: '/api/rds/deleteaccount',
    method: 'POST'
  },
  createTemptyIns: {
    url: '/api/rds/createtemp',
    method: 'POST'
  },
  getBackUpList: {
    url: '/api/rds/backups',
    method: 'GET'
  },
  createBackUp: {
    url: '/api/rds/createbackup',
    method: 'POST'
  },
  cancelauth: {
    url: '/api/rds/revokeaccountprivilege',
    method: 'POST'
  },
  getKeysList: {
    url: '/api/ssh/list',
    method: 'GET'
  },
  bindKeys: {
    url: '/api/ssh/bind',
    method: 'POST'
  },
  checkName: {
    url: '/api/ssh/unique',
    method: 'GET'
  },
  createKey: {
    url: '/api/ssh',
    method: 'POST'
  },
  portExistKey: {
    url: '/api/ssh/import',
    method: 'POST'
  },
  unbindKey: {
    url: '/api/ssh/unbind',
    method: 'POST'
  },
  deleteKey: {
    url: '/api/ssh',
    method: 'DELETE'
  },
  exportKey: {
    url: '/api/ssh/download',
    method: 'GET'
  }

}

flyio.config.baseURL = local ? 'http://192.168.2.211:8010' : ''
// flyio.config.withCredentials = true
flyio.config.timeout = 100000
flyio.config.responseType = 'json'

flyio.interceptors.request.use(config => {
  let contentType = 'application/json'
  if (config.method === 'POST' || config.method === 'PATCH') contentType = 'application/x-www-form-urlencoded'
  config.headers['Content-Type'] = contentType
  config.headers['AccessId'] = localStorage.AccessId
  config.headers['RegionId'] = localStorage.area_id
  return config
},
error => {
  return Promise.reject(error)
})

flyio.interceptors.response.use(
  response => {
    return response
  },
  error => {
    switch (error.status) {
      case 401:
        if (!local) {
          location.href = '/loginview'
        }
        break
    }
    return Promise.reject(error)
  }
)

for (let api of Object.keys(APIS)) {
  http[api] = (params) => fetch({
    api,
    params
  })
}

const matchUri = (url, params) => {
  url = url.replace(/\$\w+/, a => {
    const key = a.slice(1)
    const val = params[key]
    delete params[key]
    return val
  })
  return url
}

const fetch = (options) => {
  if (options.constructor !== Object) throw new Error('fetch options must be object!')
  if (!options.api && !options.url) throw new Error('fetch options have no api or url!')

  return new Promise((resolve, reject) => {
    const fromApi = !!options.api
    let { method, url } = fromApi ? APIS[options.api] : options
    if (!method) throw new Error('fetch options have no method!')
    if (url.includes('$')) {
      url = matchUri(url, options.params)
    }

    const params = Object.assign(options.params || {}, common)

    flyio[method.toLowerCase()](url, params, options.configs)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
  })
}

export {
  http,
  fetch
}
