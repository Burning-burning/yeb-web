<template>
  <div>
    <div class="permission">
      <el-input size="mini" placeholder="请输入角色英文名" v-model="role.name">
        <template slot="prepend">ROLE</template>
      </el-input>
      <el-input
        placeholder="请输入角色中文名"
        size="mini"
        v-model="role.nameZh"
        @keydown.enter.native="addRole"
      ></el-input>
      <el-button size="mini" type="primary" @click="addRole"
        >添加角色</el-button
      >
    </div>
    <div class="main">
      <el-collapse @change="handleChange" accordion v-model="activeName">
        <el-collapse-item
          v-for="(item, index) in roleList"
          :key="item.id"
          :title="item.nameZh"
          :name="item.id"
        >
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>可访问资源</span>
              <el-button
                style="float: right; padding: 3px 0;color:red"
                type="text"
                icon="el-icon-delete"
                @click="deleteRole(item.id)"
              ></el-button>
            </div>
            <div>
              <el-tree
                :data="allMenus"
                :props="defaultProps"
                show-checkbox
                node-key="id"
                :default-checked-keys="roleMenu"
                :key="index"
                ref="tree"
              ></el-tree>
            </div>
            <div style="display:flex;justify-content:flex-end">
              <el-button @click="cancelUpdate" size="mini">取消修改</el-button>
              <el-button
                @click="doUpdate(item.id, index)"
                size="mini"
                type="primary"
                >确定修改</el-button
              >
            </div>
          </el-card>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>
<script>
export default {
  name: '',
  data() {
    return {
      role: {
        name: '',
        nameZh: ''
      },
      roleList: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      allMenus: [],
      roleMenu: [],
      activeName: -1
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const res = await this.getRequest('/system/basic/permission/')
      if (res) {
        this.roleList = res
      }
    },
    async deleteRole(id) {
      const res = await this.deleteRequest(
        '/system/basic/permission/role/' + id
      )
      if (res) {
        this.getRoleList()
      }
    },
    async handleChange(val) {
      if (val) {
        const res = await this.getRequest('/system/basic/permission/menus')
        if (res) {
          this.allMenus = res
        }
        const res1 = await this.getRequest(
          '/system/basic/permission/mid/' + val
        )
        if (res1) {
          this.roleMenu = res1
        }
      }
    },
    cancelUpdate() {
      this.activeName = -1
    },
    async doUpdate(rid, index) {
      const trees = this.$refs.tree[index].getCheckedKeys(true)
      let mids = '&'
      trees.forEach(tree => {
        mids += 'mids=' + tree + '&'
      })
      const res = await this.putRequest(
        '/system/basic/permission/?rid=' + rid + mids
      )

      if (res) {
        this.activeName = -1
        this.getRoleList()
      }
    },
    async addRole() {
      if (this.role.name && this.role.nameZh) {
        const res = await this.postRequest(
          '/system/basic/permission/',
          this.role
        )
        if (res) {
          this.getRoleList()
          this.role = {}
        }
      } else {
        this.$message.error('所有字段不能为空')
      }
    }
  }
}
</script>
<style lang="less" scoped>
.permission {
  display: flex;
  justify-content: flex-start;
  .el-input {
    width: 300px;
    margin-right: 6px;
  }
}
.main {
  margin-top: 10px;
  width: 700px;
}
</style>
