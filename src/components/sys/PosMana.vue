<template>
  <div>
    <div>
      <el-input
        style="width: 300px;margin-right:8px"
        size="mini"
        placeholder="添加职位..."
        suffix-icon="el-icon-plus"
        v-model="pos.name"
        @keydown.enter.native="addPos"
      >
      </el-input>
      <el-button @click="addPos" type="primary" size="mini">添加</el-button>
    </div>
    <div class="posManaMain">
      <el-table
        stripe
        border
        :data="posList"
        style="width: 70%"
        size="mini"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="id" label="编号" width="55"> </el-table-column>
        <el-table-column prop="name" label="职位" width="120">
        </el-table-column>
        <el-table-column prop="createDate" label="创建时间" width="200">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              @click="handleDelete(scope.row)"
              type="danger"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-button
        type="danger"
        size="mini"
        style="margin-top:8px"
        @click="deleteMany"
        :disabled="multipleSelection.length === 0"
        >批量删除</el-button
      >
    </div>
    <el-dialog title="编辑职位" :visible.sync="dialogVisible" width="30%">
      <div>
        <el-tag>职位名称</el-tag>
        <el-input
          size="mini"
          style="margin-left: 8px; width: 250px"
          v-model="updatePos.name"
        ></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="update">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      pos: {
        name: ''
      },
      posList: [],
      dialogVisible: false,
      updatePos: {
        name: ''
      },
      multipleSelection: []
    }
  },
  created() {
    this.getPosList()
  },

  methods: {
    async addPos() {
      if (this.pos.name) {
        const res = await this.postRequest('/system/basic/pos/', this.pos)
        if (res) {
          this.getPosList()
          this.pos.name = ''
        }
      } else {
        this.$message.error('职位名称不能为空')
      }
    },
    async getPosList() {
      const res = await this.getRequest('/system/basic/pos/')
      if (res) {
        this.posList = res
      }
    },
    async handleDelete(row) {
      const confirmResult = await this.$confirm('确定删除，是否继续', '提示', {
        confirmTextButton: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        this.$message.info('已取消删除')
      } else {
        const res = await this.deleteRequest('/system/basic/pos/' + row.id)
        if (res) {
          this.getPosList()
        }
      }
    },
    handleEdit(row) {
      this.dialogVisible = true
      // this.updatePos = row
      Object.assign(this.updatePos, row)
      this.updatePos.createDate = ''
    },
    async update() {
      const res = await this.putRequest('/system/basic/pos/', this.updatePos)
      if (res) {
        this.getPosList()
        this.dialogVisible = false
      }
    },
    async deleteMany() {
      let ids = '?'
      this.multipleSelection.forEach(row => {
        ids += 'ids=' + row.id + '&'
      })
      const res = await this.deleteRequest('/system/basic/pos/' + ids)
      if (res) {
        this.getPosList()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log(val)
    }
  }
}
</script>

<style lang="less" scoped>
.posManaMain {
  margin-top: 10px;
}
</style>
