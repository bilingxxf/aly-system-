<template>
  <div>
	  <header class="m-header">
	    <span>控制台</span>
	    <div>
	      <span>{{ area }}</span>
	      <i class="el-icon-caret-bottom"></i>
	      <Area />
	    </div>
      <div class="f-fr" @click="loginout">
      退出
    </div>
	    <div class="f-fr" v-if="name">
	  	使用签名：{{ name }}
	  </div>
    <div class="f-fr" v-if="admin">
      当前用户：{{ admin }}
    </div>
	  </header>
	  <div class="m-container">
	  	<Menu />
	    <div id="app">
        <keep-alive include="instance">
	      	<router-view></router-view>
        </keep-alive>
	    </div>
	  </div>
	  <section class="init-area" v-if = "initArea">
	  	<h1>请先选择地区</h1>
	  	<Area />
	  </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Area from './components/items/Area'
import Menu from './components/items/Menu'
export default {
  name: 'App',
  data() {
  	return {
  		area: null,
  		initArea: false,
  		name: null
  	}
  },
  components: {
  	Area,
  	Menu
  },
  methods: {
    loginout() {
      this.$http.loginout()
      .then(res => {
        location.href = '/loginview'
      })
    }
  },
  created() {
  	const { area_name, UserName, AccessId, admin } = localStorage
  	this.name = UserName || null
    this.admin = admin || null
  	if (AccessId) {
	  	if (!area_name) {
	  		this.initArea = true
	  	} else {
	  		this.area = area_name
	  	}
	 }
  }
}
</script>

<style lang="scss">
  .m-header {
  	background: $back_header;
  	color: $font-normal;
  	font-size: .8rem;
  	height: 2.4rem;
  	line-height: 2.4rem;
  	padding: 0 1rem;
  	span {
  		display: inline-block;
  	}
  	.f-fr {
  		float: right
  	}
  	div {
  		margin-left: 2rem;
  		cursor: pointer;
  		display: inline-block;
  		.area {
  			display: none;
  		}
  		&:hover {
  			.area {
  				display: block;
  			}
  		}
  	}
  }
  .m-container {
  	position: relative;
  	display: flex;
  	top: 0;
  	left: 0;
  	width: 100%;
  	height: calc(100vh - 2.4rem);
  	overflow-y: auto;
    overflow-x: hidden;
  	#app {
  		flex: 1 1 auto;
  		display: flex;
  		position: relative;
  	}
  }
  .init-area h1 {
  	text-align: center;
  	margin-top: 10rem;
  }
</style>
