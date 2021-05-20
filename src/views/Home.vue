<template>
  <div>
    <el-container>
      <el-header class="homeHeader"
        ><div class="title">云E办</div>

        <div>
          <el-button
            @click="goTo"
            type="text"
            icon="el-icon-bell"
            style="margin-right:8px;color:black"
          ></el-button>
          <el-dropdown class="userInfo" @command="handleCommand">
            <span class="el-dropdown-link">
              {{ user.name }}<img :src="user.userFace" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="userInfo">个人中心</el-dropdown-item>
              <el-dropdown-item command="setting">设置</el-dropdown-item>
              <el-dropdown-item command="logout">注销登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>

      <el-container>
        <el-aside width="200px">
          <el-menu router unique-opened>
            <el-submenu
              :index="item.name"
              v-for="(item, index) in getRoute"
              :key="index"
            >
              <template slot="title"
                ><i
                  :class="item.iconCls"
                  style="margin-right: 5px; color: #1accff"
                ></i
                >{{ item.name }}</template
              >
              <el-menu-item
                v-for="(item1, index1) in item.children"
                :key="index1"
                :index="item1.path"
                >{{ item1.name }}</el-menu-item
              >
            </el-submenu></el-menu
          ></el-aside
        >
        <el-main
          ><el-breadcrumb
            separator-class="el-icon-arrow-right"
            v-show="$router.currentRoute.path !== '/home'"
          >
            <el-breadcrumb-item :to="{ path: '/home' }"
              >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>{{
              $router.currentRoute.name
            }}</el-breadcrumb-item>
          </el-breadcrumb>

          <div
            class="homeWelcome"
            v-show="$router.currentRoute.path === '/home'"
          >
            欢迎来到云E办系统！
          </div>
          <router-view class="homeRouterView"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      // user: JSON.parse(window.sessionStorage.getItem('user'))
    }
  },
  computed: {
    getRoute() {
      return this.$store.state.routes
    },
    user() {
      return this.$store.state.currentAdmin
    }
  },
  methods: {
    goTo() {
      this.$router.push('/chat')
    },
    async handleCommand(command) {
      if (command === 'logout') {
        const confirmResult = await this.$confirm(
          '此操作将注销登录，是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).catch(err => err)
        if (confirmResult !== 'confirm') {
          this.$message.info('已取消退出')
        } else {
          this.postRequest('/logout')
          window.sessionStorage.clear()
          this.$store.commit('initRoutes', [])
          this.$router.replace('/')
        }
      } else if (command === 'userInfo') {
        this.$router.push('/userinfo')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.homeWelcome {
  text-align: center;
  font-size: 30px;
  font-family: 华文楷体;
  color: #409eff;
  padding-top: 50px;
}
.homeHeader {
  background: #409eff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  .title {
    font-size: 30px;
    font-family: 华文楷体;
    color: white;
  }
  .userInfo {
    cursor: pointer;
    .el-dropdown-link img {
      width: 48px;
      height: 48px;
      border-radius: 24px;
      margin-left: 15px;
    }
  }
}
.homeRouterView {
  margin-top: 10px;
}
</style>
