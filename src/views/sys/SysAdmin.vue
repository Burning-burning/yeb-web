<template>
  <div>
    <div style="display:flex;justify-content:center;margin-top:10px">
      <el-input
        placeholder="通过用户名搜索用户"
        prefix-icon="el-icon-search"
        style="width:400px;margin-right: 10px"
        size="mini"
        v-model="keywords"
      ></el-input>
      <el-button
        type="primary"
        icon="el-icon-search"
        size="mini"
        @click="search"
        >搜索</el-button
      >
    </div>
    <div class="card">
      <el-card
        class="admin-card"
        v-for="(item, index) in operatorList"
        :key="index"
      >
        <div slot="header" class="clearfix">
          <span>{{ item.name }}</span>
          <el-button
            style="float: right; padding: 3px 0;color:red"
            type="text"
            @click="deleteRole(item.id)"
            icon="el-icon-delete"
          ></el-button>
        </div>
        <div>
          <div>
            <img :src="item.userFace" alt="item.name" />
          </div>
          <div class="userInfo">
            <div>用户名：{{ item.name }}</div>
            <div>手机号码：{{ item.phone }}</div>
            <div>电话号码：{{ item.telephone }}</div>
            <div>地址：{{ item.address }}</div>
            <div>
              用户状态：<el-switch
                @change="handleChange(item)"
                style="display: block"
                v-model="item.enabled"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="启用"
                inactive-text="禁用"
              >
              </el-switch>
            </div>
            <div>
              用户角色：<el-tag
                style="margin-right:10px"
                type="success"
                v-for="(role, index) in item.roles"
                :key="index"
                >{{ role.nameZh }}</el-tag
              >
              <el-popover
                placement="right
                "
                @show="show(item)"
                @hide="hide(item)"
                title="角色列表"
                width="200"
                trigger="click"
              >
                <el-select
                  multiple
                  v-model="selectedRoles"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in allRoles"
                    :key="item.id"
                    :label="item.nameZh"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
                <el-button
                  slot="reference"
                  type="text"
                  icon="el-icon-more"
                  @click="btnSelect"
                ></el-button>
              </el-popover>
            </div>
            <div>备注：{{ item.remark }}</div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      operatorList: [],
      keywords: '',
      allRoles: [],
      selectedRoles: []
    }
  },
  methods: {
    async getOperatorList() {
      const res = await this.getRequest('/system/admin/')
      if (res) {
        this.operatorList = res
      }
    },
    show(admin) {
      this.selectedRoles = []
      const role = admin.roles
      role.forEach(r => {
        this.selectedRoles.push(r.id)
      })
    },
    async deleteRole(id) {
      const res = await this.deleteRequest('/system/admin/' + id)
      if (res) {
        this.getOperatorList()
      }
    },
    async search() {
      const res = await this.getRequest(
        '/system/admin/?keywords=' + this.keywords
      )
      if (res) {
        this.operatorList = res
      }
    },
    async handleChange(admin) {
      const res = await this.putRequest('/system/admin/', admin)
      if (res) {
        this.getOperatorList()
      }
    },
    async initAllRole() {
      const res = await this.getRequest('/system/admin/roles')
      if (res) {
        this.allRoles = res
      }
    },
    btnSelect() {},
    async hide(item) {
      let flag = false
      const roles = []
      Object.assign(roles, item.roles)
      if (roles.length !== this.selectedRoles.length) {
        flag = true
      } else {
        for (let i = 0; i < roles.length; i++) {
          const role = roles[i]
          for (let j = 0; j < this.selectedRoles.length; j++) {
            // const sr = this.selectedRoles[j]
            if (role.id === this.selectedRoles[j]) {
              roles.splice(i, 1)
              i--
              break
            }
          }
        }
        if (roles.length !== 0) {
          flag = true
        }
      }
      if (flag) {
        const adminId = item.id
        let l = ''
        this.selectedRoles.forEach(r => {
          l += '&rids=' + r
        })
        const res = await this.putRequest(
          '/system/admin/role?adminId=' + adminId + l
        )
        if (res) {
          this.getOperatorList()
        }
      }
    }
  },
  created() {
    this.getOperatorList()
    this.initAllRole()
  }
}
</script>

<style lang="less" scoped>
.admin-card {
  width: 350px;
  margin-bottom: 20px;
}
.card {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.userInfo {
  font-size: 12px;
  color: #409eff;
}
</style>
