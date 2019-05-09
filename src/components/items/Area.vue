<template>
  <div class="area">
    <ul v-if="area">
      <li v-for="item in area" @click="setArea(item)">{{ item.LocalName }}</li>
    </ul>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'area',
  data () {
    return {}
  },
  computed: {
    ...mapGetters([
      'area'
    ])
  },
  methods: {
    ...mapActions([
      'getArea'
    ]),
    setArea (item) {
      localStorage.area_id = item.RegionId
      localStorage.area_name = item.LocalName
      this.$router.push('/instance')
      setTimeout(() => {
        location.reload()
      },10)
    }
  },
  created () {
    this.getArea()
  }
}
</script>

<style lang="scss" scoped>
</style>
