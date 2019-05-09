// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './App'
import router from './router'
import store from './store'
import { fetch, http } from '@/assets/js/http'
import '@/assets/css/style.scss'

Vue.config.productionTip = false

Vue.prototype.$fetch = fetch
Vue.prototype.$http = http
Vue.use(ElementUI)

Vue.filter('timeFilter', function (time) {
  const isTen = num => num < 10 ? `0${num}` : num
  const data = new Date(time)
	const [ year, month, date, hour, minute ] = [
    data.getFullYear(),
    isTen(data.getMonth() + 1),
    isTen(data.getDate()),
    isTen(data.getHours()),
    isTen(data.getMinutes())
  ]
  return `${year}-${month}-${date} ${hour}:${minute}`
})

router.beforeEach((to, from, next) => {
	if (to.path === '/signlist') {
		next()
		return
	}
	const { AccessId } = localStorage
    if (!AccessId ) {
    	ElementUI.Message.error('请先设置签名！')
    	next({
            path:'/signlist'
        })
    } else {
    	next()
    	
    }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
