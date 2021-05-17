<template>
  <div>
    <el-form
      :model="loginForm"
      class="loginContent"
      :rules="loginFormRules"
      ref="loginFormRef"
      :v-loading="loading"
      element-loading-text="正在登陆"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <h3 class="loginTitle">系统登录</h3>
      <el-form-item prop="username">
        <el-input
          auto-complete="false"
          placeholder="请输入用户名"
          v-model="loginForm.username"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          placeholder="请输入密码"
          v-model="loginForm.password"
          type="password"
          auto-complete="false"
        ></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <div style="display: flex;align-items: center">
          <el-input
            style="width:240px;margin-right: 5px"
            placeholder="根据图片输入验证码"
            v-model="loginForm.code"
            auto-complete="false"
          ></el-input>
          <img :src="captchaUrl" @click="updateImg" />
        </div>
      </el-form-item>
      <el-checkbox v-model="checked" class="remember">记住我</el-checkbox>
      <el-button type="primary" style="width:100%" @click="submitLogin"
        >登录</el-button
      >
    </el-form>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      loading: false,
      loginForm: {
        username: 'admin',
        password: '123',
        code: ''
      },
      checked: true,
      captchaUrl: '/captcha?time=' + new Date(),
      loginFormRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
        ],
        code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      }
    }
  },

  methods: {
    submitLogin() {
      this.$refs.loginFormRef.validate(async valid => {
        if (valid) {
          this.loading = true
          const res = await this.postRequest('/login', this.loginForm)
          if (res.code == 200) {
            this.loading = false
            const tokenStr = res.obj.tokenHead + res.obj.token
            window.sessionStorage.setItem('tokenStr', tokenStr)
            // const path = this.$route.query.redirect
            // this.$router.replace(
            //   path === '/' || path === undefined ? '/home' : path
            // )
            this.$router.replace('/home')
          }
        } else {
          this.$message.error('请输入所有字段')
          return false
        }
      })
    },
    updateImg() {
      this.captchaUrl = '/captcha?time=' + new Date()
    }
  }
}
</script>

<style lang="less" scoped>
.el-form-item__content {
  display: flex !important;
  align-items: center;
  // justify-items: center;
}
.loginContent {
  width: 350px;
  margin: 180px auto;
  border-radius: 15px;
  background-color: #fff;
  box-shadow: 0 0 25px #cac6c6;
  padding: 15px 35px;
}
.loginTitle {
  text-align: center;
}
.remember {
  text-align: left;
  margin: 0 0 15px 0;
}
</style>
