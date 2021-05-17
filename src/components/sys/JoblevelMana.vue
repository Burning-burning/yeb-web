<template>
  <div>
    <div>
      <el-input
        v-model="jl.name"
        placeholder="添加职称等级..."
        icon="el-icon-plus"
        style="width:300px"
        size="mini"
      ></el-input>
      <el-select
        size="mini"
        v-model="jl.titleLevel"
        placeholder="职称等级"
        style="margin-left: 6px;margin-right: 6px"
      >
        <el-option
          v-for="item in titleLevels"
          :key="item"
          :label="item"
          :value="item"
        >
        </el-option>
      </el-select>
      <el-button type="primary" size="mini" @click="add">添加</el-button>
    </div>

    <div>
      <el-table
        stripe
        border
        :data="jobLevelList"
        style="width: 70%;margin-top: 10px"
        size="mini"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="id" label="编号" width="55"> </el-table-column
        ><el-table-column prop="name" label="职称名称" width="150">
        </el-table-column
        ><el-table-column prop="titleLevel" label="职称等级" width="150">
        </el-table-column>

        <el-table-column
          prop="createDate"
          label="创建日期"
          width="150"
        ></el-table-column>
        <el-table-column label="是否启用" width="150">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.enabled" type="success">已启用</el-tag>
            <el-tag v-else type="danger">未启用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scoped">
            <el-button size="mini" @click="handleEdit(scoped.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scoped.row)"
              >删除</el-button
            >
          </template>
        </el-table-column></el-table
      >
      <el-button
        type="danger"
        @click="deleteMany"
        :disabled="this.multipleSelection.length === 0"
        >批量删除</el-button
      >
    </div>
    <el-dialog title="编辑职称" :visible.sync="dialogVisible" width="30%">
      <el-form
        :model="editJs"
        status-icon
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="职称名称" prop="name">
          <el-input
            v-model="editJs.name"
            autocomplete="off"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="职称等级" prop="titleLevel">
          <el-select
            size="mini"
            v-model="editJs.titleLevel"
            placeholder="职称等级"
            style="margin-left: 6px;margin-right: 6px"
          >
            <el-option
              v-for="item in titleLevels"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select> </el-form-item
        ><el-form-item label="是否启用" prop="enabled">
          <el-switch
            v-model="editJs.enabled"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="已启用"
            inactive-text="未启用"
          >
          </el-switch> </el-form-item
      ></el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel" size="mini">取 消</el-button>
        <el-button type="primary" @click="submit" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      jobLevelList: [],
      jl: {
        name: '',
        titleLevel: '',
        enabled: false
      },
      titleLevels: ['正高级', '副高级', '初级', '中级', '员级'],
      multipleSelection: [],
      dialogVisible: false,
      editJs: {
        name: '',
        titleLevel: '',
        enabled: false
      },
      editFormRules: {
        name: [{ required: true, message: '请输入职称', trigger: 'blur' }],
        titleLevel: [{ required: true, message: '请选择', trigger: 'change' }],
        enabled: [{ required: true, message: '请选择', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getJobLevelList()
  },
  methods: {
    async getJobLevelList() {
      const res = await this.getRequest('/system/basic/joblevel/')
      if (res) {
        this.jobLevelList = res
      }
    },
    handleEdit(row) {
      // this.editJs = row
      Object.assign(this.editJs, row)

      this.dialogVisible = true
    },
    async handleDelete(row) {
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
        const res = await this.deleteRequest('/system/basic/joblevel/' + row.id)
        if (res) {
          this.getJobLevelList()
        }
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    async add() {
      if (this.jl.name && this.jl.titleLevel) {
        const res = await this.postRequest('/system/basic/joblevel/', this.jl)
        if (res) {
          this.getJobLevelList()
          this.jl = {}
        }
      } else {
        this.$message.error('输入数据有误')
      }
    },
    async deleteMany() {
      let ids = '?'
      this.multipleSelection.forEach(row => {
        ids += 'ids=' + row.id + '&'
      })
      const res = await this.deleteRequest('/system/basic/joblevel/' + ids)
      if (res) {
        this.getJobLevelList()
      }
    },
    submit() {
      this.$refs.editFormRef.validate(async valid => {
        if (valid) {
          const res = await this.putRequest(
            '/system/basic/joblevel/',
            this.editJs
          )
          if (res) {
            this.getJobLevelList()
            this.$refs.editFormRef.resetFields()
            this.dialogVisible = false
          }
        } else {
          this.$message.error('输入的数据有误')
        }
      })
    },
    cancel() {
      this.$refs.editFormRef.resetFields()
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped></style>
