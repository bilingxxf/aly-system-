import Vue from 'vue'
import Vuex from 'vuex'
import { fetch, http } from '@/assets/js/http'

Vue.use(Vuex)

const origin = location.origin
const isOnline = !(origin.includes('localhost') || /\d+\./.test(origin))
const state = {
  isOnline,
  area: null,
  rdsItemInfo: null
}

const actions = {
  async getArea ({ commit, state }) {
    let { area } = state
    if (area) return
    area = await http.area()
    commit('setArea', area.Regions.Region)
  },
  setRdsItemInfo ({ commit }, opt) {
    return commit('SETRDSITEMINFO', opt)
  }
}

const mutations = {
  setArea (state, area) {
    state.area = area
  },
  'SETRDSITEMINFO' (state, rdsItemInfo) {
    state.rdsItemInfo = rdsItemInfo
  }
}

const getters = {
  area (state) {
    return state.area
  },
  getRdsItemInfo (state) {
    return state.rdsItemInfo
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
