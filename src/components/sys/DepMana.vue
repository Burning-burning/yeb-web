<template>
  <div style="width:500px">
    <el-input
      placeholder="请输入部门名称进行搜索..."
      prefix-icon="el-icon-search"
      v-model="filterText"
    >
    </el-input>
    <el-tree
      :data="departmentList"
      :props="defaultProps"
      :filter-node-method="filterNode"
      :expand-on-click-node="false"
      ref="tree"
    >
      <span
        class="custom-tree-node"
        slot-scope="{ node, data }"
        style="display: flex;justify-content:space-between;width: 100%"
      >
        <span>{{ node.label }}</span>
        <span>
          <el-button
            type="primary"
            size="mini"
            class="btn"
            @click="() => addDepartment(data)"
          >
            添加部门
          </el-button>
          <el-button
            type="danger"
            size="mini"
            class="btn"
            @click="() => deleteDepartment(data)"
          >
            删除部门
          </el-button>
        </span>
      </span>
    </el-tree>
    <el-dialog title="添加部门" :visible.sync="dialogVisible" width="30%">
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item label="上级部门">
          <el-input v-model="pname" disabled></el-input> </el-form-item
        ><el-form-item label="部门名称" prop="name">
          <el-input v-model="addForm.name"></el-input> </el-form-item
      ></el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelForm">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      departmentList: [],
      dialogVisible: false,
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      addForm: {
        name: '',
        parentId: -1
      },
      addFormRules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
      pname: ''
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    async getDepartmentList() {
      const res = await this.getRequest('/system/basic/department/')
      if (res) {
        this.departmentList = res
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    async addDepartment(data) {
      this.dialogVisible = true
      this.pname = data.name
      this.addForm.parentId = data.id
    },
    async deleteDepartment(data) {
      if (data.isParent) {
        this.$message.error('父部门删除失败')
      } else {
        const confirmResult = await this.$confirm(
          '确定删除，是否继续？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).catch(err => err)
        if (confirmResult !== 'confirm') {
          this.$message.info('已取消删除')
        } else {
          const res = await this.deleteRequest(
            '/system/basic/department/' + data.id
          )
          if (res) {
            this.initPartment(null, this.departmentList, data.id)
          }
        }
      }
    },
    initPartment(p, deps, id) {
      for (let i = 0; i < deps.length; i++) {
        const dep = deps[i]
        if (dep.id === id) {
          deps.splice(i, 1)
          if (deps.length == 0) {
            p.isParent = false
          }
        } else {
          this.initPartment(dep, dep.children, id)
        }
      }
    },
    submitForm() {
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          const res = await this.postRequest(
            '/system/basic/department/',
            this.addForm
          )
          if (res) {
            this.dialogVisible = false
            this.$refs.addFormRef.resetFields()
            this.pname = ''
            this.initList(this.departmentList, res.obj)
          }
        } else {
          this.$message.error('输入的数据有误，请重新输入')
        }
      })
    },
    cancelForm() {
      this.dialogVisible = false
      this.$refs.addFormRef.resetFields()
    },
    initList(deps, res) {
      for (let i = 0; i < deps.length; i++) {
        const d = deps[i]
        if (d.id === res.parentId) {
          d.children = d.children.concat(res)
          if (d.children.length > 0) {
            d.isParent = true
          }
          return
        } else {
          this.initList(d.children, res)
        }
      }
    }
  },
  created() {
    this.getDepartmentList()
  }
}
</script>

<style lang="less" scoped>
.btn {
  padding: 2px;
}
</style>
