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
      ></el-input>
      <el-button size="mini" type="primary">添加角色</el-button>
    </div>
    <div class="main">
      <el-collapse @change="handleChange" accordion>
        <el-collapse-item
          v-for="item in roleList"
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
              ></el-button>
            </div>
            <div></div>
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
      roleList: []
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    handleChange(val) {
      console.log(val)
    },
    async getRoleList() {
      const res = await this.getRequest('/system/basic/permission/')
      if (res) {
        this.roleList = res
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
