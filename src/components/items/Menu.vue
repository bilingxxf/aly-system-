<template>
  <div class="m-menu">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      @select="handleSelect"
      background-color="#252a2f"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>云服务ECS</span>
        </template>
        <el-menu-item index="1-1"><router-link to="instance">实例</router-link></el-menu-item>
        <el-menu-item index="1-2"><router-link to="keysManage">密钥对管理</router-link></el-menu-item>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span>云服务RDS</span>
        </template>
        <el-menu-item class="rds-item" index="2-1"><router-link tag="span" to="/rdslist">实例</router-link></el-menu-item>
      </el-submenu>
      <el-menu-item index="3">
        <router-link to="/securityGroup">
          <i class="el-icon-document"></i>
          <span>安全组</span>
        </router-link>
      </el-menu-item>
      <el-menu-item index="4">
        <router-link to="/signlist">
          <i class="el-icon-setting"></i>
          <span >签名管理</span>
        </router-link>
      </el-menu-item>
      <el-menu-item index="5">
        <router-link to="/cloudy">
          <i class="el-icon-upload"></i>
          <span >云助手</span>
        </router-link>
      </el-menu-item>
      <el-menu-item index="6" v-if="showUser">
        <router-link to="/userlist">
          <i class="el-icon-setting"></i>
          <span >用户管理</span>
        </router-link>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>

export default {
  name: 'area',
  data() {
    return {
      activeIndex: '1-1',
      showUser: localStorage.superadmin === '1'
    }
  },
  watch: {
    $route(to) {
      //if (!this.showUser) this.$router.push('/')
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
    },
    handleSelect(key, keyPath) {
      this.activeIndex = key
    }
  }
}
</script>

<style lang="scss" scoped>
  .m-menu {
    flex: 0 0 10rem;
    overflow-x: hidden;
    overflow-y: auto;
    .el-submenu__title:hover{
      background-color: #00c1de!important
    }
    a {
      color: #fff;
      text-decoration: none;
      display: block;
    }
    .router-link-exact-active {
      color: rgb(255, 208, 75);
    }
    ul {
      overflow: hidden;
      min-height: 100%;
      .rds-item {
        min-width: 0rem;
      }

    }
  }
</style>
