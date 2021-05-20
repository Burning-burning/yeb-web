<template>
  <div>
    <el-card class="box-card" style="width: 400px">
      <div slot="header" class="clearfix">
        <span>{{ admin.name }}</span>
      </div>
      <div>
        <div style="display: flex;justify-content: center">
          <el-upload
            :show-file-list="false"
            action="/admin/userface"
            :headers="header"
            :data="admin"
            :on-success="handleUploadSuccess"
          >
            <img
              :src="admin.userFace"
              title="点击修改头像"
              style="width: 100px;height: 100px;border-radius: 50px"
            />
          </el-upload>
        </div>
        <div>
          电话号码：<el-tag>{{ admin.telephone }}</el-tag>
        </div>
        <div>
          手机号码:<el-tag>{{ admin.phone }}</el-tag>
        </div>
        <div>
          居住地址:<el-tag>{{ admin.address }}</el-tag>
        </div>
        <div>
          用户标签:<el-tag
            v-for="(r, index) in admin.roles"
            type="success"
            :key="index"
            >{{ r.nameZh }}</el-tag
          >
        </div>
        <div style="margin-top:10px;display: flex;justify-content:space-around">
          <el-button size="mini" type="primary" @click="updateInfo"
            >修改信息</el-button
          >
          <el-button size="mini" type="danger" @click="updatePassword"
            >修改密码</el-button
          >
        </div>
      </div>
    </el-card>

    <el-dialog title="编辑用户信息" :visible.sync="dialogVisible" width="30%">
      <div>
        <table>
          <tr>
            <td>用户昵称：</td>
            <td><el-input v-model="admin2.name"></el-input></td>
          </tr>

          <tr>
            <td>电话号码</td>
            <td><el-input v-model="admin2.telephone"></el-input></td>
          </tr>

          <tr>
            <td>手机号码</td>
            <td><el-input v-model="admin2.phone"></el-input></td>
          </tr>

          <tr>
            <td>地址</td>
            <td><el-input v-model="admin2.address"></el-input></td>
          </tr>
        </table>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="更新密码"
      @close="handleClose"
      :visible.sync="dialogPasswordVisible"
      width="30%"
    >
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        ><el-form-item label="旧密码" prop="oldPass">
          <el-input
            type="password"
            v-model="ruleForm.oldPass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input
            type="password"
            v-model="ruleForm.pass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input
            type="password"
            v-model="ruleForm.checkPass"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >提交</el-button
          >
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      admin: null,
      dialogVisible: false,
      admin2: null,
      dialogPasswordVisible: false,
      ruleForm: {
        pass: '',
        checkPass: '',
        oldPass: ''
      },
      rules: {
        pass: [{ validator: validatePass, trigger: 'blur' }],
        checkPass: [{ validator: validatePass2, trigger: 'blur' }],
        oldPass: [{ validator: validatePass, trigger: 'blur' }]
      },
      header: {
        Authorization: window.sessionStorage.getItem('tokenStr')
      }
    }
  },

  computed: {},
  watch: {},
  methods: {
    async initAdmin() {
      const res = await this.getRequest('/admin/info')
      if (res) {
        this.admin = res
        this.admin2 = Object.assign({}, this.admin)
        window.sessionStorage.setItem('user', res)
        this.$store.commit('INIT_ADMIN', res)
      }
    },
    updateInfo() {
      this.dialogVisible = true
    },
    handleUploadSuccess() {
      this.initAdmin()
    },
    updatePassword() {
      this.dialogPasswordVisible = true
    },
    async submit() {
      const res = await this.putRequest('/admin/info', this.admin2)
      if (res) {
        this.dialogVisible = false
        this.initAdmin()
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.ruleForm.adminId = this.admin.id
          const res = await this.putRequest('/admin/pass', this.ruleForm)
          if (res) {
            this.postRequest('/logout')
            window.sessionStorage.clear()
            this.$store.commit('initRoutes', [])
            this.$router.replace('/')
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleClose() {
      this.$refs.ruleForm.resetFields()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  },
  created() {
    this.initAdmin()
  }
}
</script>

<style lang="less" scoped></style>
