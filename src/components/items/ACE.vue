<template>
  <div class="ace">
  	<iframe ref="iframe" src="../../../static/ace/#/"></iframe>
  </div>
</template>

<script>
export default {
  name: 'ace',
  props: {
    callback: Function,
    show: Boolean
  },
  methods: {
  },
  watch: {
    show(val) {
      if (!val) {
        this.$refs.iframe.contentWindow.postMessage({ clear: true }, '*')
      }
    }
  },
  mounted() {
    window.addEventListener('message', (e) => {
      this.callback && this.callback(e.data)
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.ace {
  width: 20rem;
  height: 210px;
}
iframe{
  width: 100%;
  height: 100%;
}
</style>
