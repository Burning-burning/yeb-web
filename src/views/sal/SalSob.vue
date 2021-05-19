<template>
  <div>
    <div style="display:flex;justify-content:space-between">
      <el-button
        type="primary"
        icon="el-icon-plus"
        size="mini"
        @click="addSalary"
        >添加工资账套</el-button
      >
      <el-button
        type="success"
        icon="el-icon-refresh"
        size="mini"
        @click="getSalaryList"
      ></el-button>
    </div>
    <div>
      <el-table
        :data="salaryList"
        border
        stripe
        style="width: 100%;margin-top:10px"
      >
        <el-table-column type="selection" width="40"> </el-table-column>

        <el-table-column prop="name" label="账套名称" width="120">
        </el-table-column>
        <el-table-column prop="basicSalary" label="基本工资" width="70">
        </el-table-column>
        <el-table-column prop="trafficSalary" label="交通补助" width="70">
        </el-table-column
        ><el-table-column prop="lunchSalary" label="午餐补助" width="70">
        </el-table-column
        ><el-table-column prop="bonus" label="奖金" width="70">
        </el-table-column>
        <el-table-column prop="createDate" label="启用时间" width="100">
        </el-table-column>

        <el-table-column label="养老金" align="center">
          <el-table-column prop="pensionPer" label="比率" width="70">
          </el-table-column>
          <el-table-column prop="pensionBase" label="基数" width="70">
          </el-table-column>
        </el-table-column>

        <el-table-column label="医疗保险" align="center">
          <el-table-column prop="medicalPer" label="比率" width="70">
          </el-table-column>
          <el-table-column prop="medicalBase" label="基数" width="70">
          </el-table-column>
        </el-table-column>

        <el-table-column label="公积金" align="center">
          <el-table-column prop="accumulationFundPer" label="比率" width="70">
          </el-table-column>
          <el-table-column prop="accumulationFundBase" label="基数" width="70">
          </el-table-column>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scoped">
            <el-button
              size="mini"
              type="primary"
              @click="handleEdit(scoped.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="mini"
              @click="handleDelete(scoped.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :title="title" :visible.sync="dialogVisible" width="50%">
        <div
          style="display: flex;justify-content: space-between;align-items: center"
        >
          <el-steps direction="vertical" :active="activeIndex">
            <el-step
              :title="item"
              v-for="(item, index) in itemName"
              :key="index"
            ></el-step>
          </el-steps>
          <el-input
            v-show="activeIndex === index"
            style="width: 200px"
            v-for="(value, title, index) in salary"
            v-model="salary[title]"
            :key="index"
            :placeholder="'请输入' + itemName[index]"
          ></el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="preStep">{{
            activeIndex === 10 ? '取消' : '上一步'
          }}</el-button>
          <el-button type="primary" @click="nextStep">{{
            activeIndex == 10 ? '完成' : '下一步'
          }}</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      title: '添加工资账套',
      salaryList: [],
      dialogVisible: false,
      activeIndex: 0,
      itemName: [
        '账套名称',
        '基本工资',
        '交通补助',

        '午餐补助',
        '奖金',
        '养老金比率',
        '养老金基数',
        '医疗保险比率',
        '医疗保险基数',
        '公积金比率',
        '公积金基数'
      ],
      salary: {
        name: '',
        basicSalary: 0,
        trafficSalary: 0,
        lunchSalary: 0,
        bonus: 0,
        pensionPer: 0,
        pensionBase: 0,
        medicalPer: 0,
        medicalBase: 0,
        accumulationFundPer: 0,
        accumulationFundBase: 0
      }
    }
  },
  methods: {
    async getSalaryList() {
      const res = await this.getRequest('/salary/sob/')
      if (res) {
        this.salaryList = res
      }
    },
    addSalary() {
      this.title = '添加工资账套'
      this.activeIndex = 0
      this.dialogVisible = true
      this.salary = {
        name: '',
        basicSalary: 0,
        trafficSalary: 0,
        lunchSalary: 0,
        bonus: 0,
        pensionPer: 0,
        pensionBase: 0,
        medicalPer: 0,
        medicalBase: 0,
        accumulationFundPer: 0,
        accumulationFundBase: 0
      }
    },
    preStep() {
      if (this.activeIndex == 0) {
        return
      } else if (this.activeIndex === 10) {
        this.dialogVisible = false
        return
      }
      this.activeIndex--
    },
    async nextStep() {
      if (this.activeIndex === 10) {
        if (this.title === '添加工资账套') {
          const res = await this.postRequest('/salary/sob/', this.salary)
          if (res) {
            this.getSalaryList()
            this.dialogVisible = false
          }
        } else {
          const res = await this.putRequest('/salary/sob/', this.salary)
          if (res) {
            this.getSalaryList()
            this.dialogVisible = false
          }
        }
        return
      }
      this.activeIndex++
    },
    async handleEdit(data) {
      this.title = '编辑工资账套'

      this.activeIndex = 0
      this.dialogVisible = true
      this.salary.id = data.id
      this.salary.name = data.name
      this.salary.basicSalary = data.basicSalary
      this.salary.trafficSalary = data.trafficSalary
      this.salary.lunchSalary = data.lunchSalary
      this.salary.bonus = data.bonus
      this.salary.pensionBase = data.pensionBase
      this.salary.pensionPer = data.pensionPer
      this.salary.medicalPer = data.medicalPer
      this.salary.medicalBase = data.medicalBase
      this.salary.accumulationFundPer = data.accumulationFundPer
      this.salary.accumulationFundBase = data.accumulationFundBase
    },
    async handleDelete(data) {
      const confirmResult = await this.$confirm('确定删除，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        this.$message.info('已取消删除')
      } else {
        const res = await this.deleteRequest('/salary/sob/' + data.id)
        if (res) {
          this.getSalaryList()
        }
      }
    }
  },
  created() {
    this.getSalaryList()
  }
}
</script>

<style lang="less" scoped></style>
