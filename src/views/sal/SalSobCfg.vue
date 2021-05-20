<template>
  <div>
    <el-table :data="salaryList" border stripe>
      <el-table-column
        type="selection"
        align="left"
        width="55"
      ></el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        align="left"
        fixed=""
        width="120"
      >
      </el-table-column>
      <el-table-column prop="workID" label="工号" align="left" width="120">
      </el-table-column
      ><el-table-column prop="email" label="电子邮箱" width="200">
      </el-table-column
      ><el-table-column prop="phone" label="电话号码" width="120">
      </el-table-column
      ><el-table-column
        prop="department.name"
        label="部门名称"
        width="120"
        align="left"
      >
      </el-table-column>
      <el-table-column align="center" label="工资账套">
        <template slot-scope="scoped">
          <el-tooltip placement="top" v-if="scoped.row.salary">
            <div slot="content">
              <table>
                <tr>
                  <td>基本工资</td>
                  <td>{{ scoped.row.salary.basicSalary }}</td>
                </tr>
                <tr>
                  <td>
                    交通补助
                  </td>
                  <td>
                    {{ scoped.row.salary.trafficSalary }}
                  </td>
                </tr>
                <tr>
                  <td>
                    午餐补助
                  </td>
                  <td>
                    {{ scoped.row.salary.lunchSalary }}
                  </td>
                </tr>
                <tr>
                  <td>
                    奖金
                  </td>
                  <td>
                    {{ scoped.row.salary.bonus }}
                  </td>
                </tr>

                <tr>
                  <td>
                    养老金比率
                  </td>
                  <td>
                    {{ scoped.row.salary.pensionPer }}
                  </td>
                </tr>
                <tr>
                  <td>
                    养老金基数
                  </td>
                  <td>
                    {{ scoped.row.salary.pensionBase }}
                  </td>
                </tr>

                <tr>
                  <td>
                    医疗保险比率
                  </td>
                  <td>
                    {{ scoped.row.salary.medicalPer }}
                  </td>
                </tr>
                <tr>
                  <td>
                    医疗保险基数
                  </td>
                  <td>
                    {{ scoped.row.salary.medicalBase }}
                  </td>
                </tr>

                <tr>
                  <td>
                    公积金比率
                  </td>
                  <td>
                    {{ scoped.row.salary.accumulationFundPer }}
                  </td>
                </tr>

                <tr>
                  <td>
                    公积金基数
                  </td>
                  <td>
                    {{ scoped.row.salary.accumulationFundBase }}
                  </td>
                </tr>
              </table>
            </div>
            <el-tag>{{ scoped.row.salary.name }}</el-tag>
          </el-tooltip>

          <el-tag v-else>暂未设置</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scoped">
          <el-popover
            @hide="hide(scoped.row)"
            @show="show(scoped.row)"
            placement="left"
            title="编辑工资账套"
            width="200"
            trigger="click"
          >
            <div>
              <el-select v-model="currentSalary" placeholder="请选择">
                <el-option
                  v-for="item in salaries"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </div>
            <el-button type="danger" slot="reference" size="mini"
              >修改工资账套</el-button
            >
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top:10px;display: flex;justify-content:flex-end">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      salaryList: [],
      total: 0,
      currentPage: 1,
      size: 10,
      currentSalary: null,
      salaries: []
    }
  },
  created() {
    this.getsalaryList()
    this.getSalarySob()
  },
  methods: {
    async getSalarySob() {
      const res = await this.getRequest('/salary/sobcfg/salaries')
      console.log(res)
      if (res) {
        this.salaries = res
      }
    },
    show(data) {
      if (data.salary) {
        this.currentSalary = data.salary.id
      } else {
        this.currentSalary = null
      }
    },
    async hide(data) {
      if (this.currentSalary !== data.salary.id) {
        const res = await this.putRequest(
          '/salary/sobcfg/?eid=' + data.id + '&sid=' + data.salary.id
        )
        if (res) {
          this.getsalaryList()
        }
      }
    },
    async getsalaryList() {
      const res = await this.getRequest(
        '/salary/sobcfg/?currentPage=' + this.currentPage + '&size=' + this.size
      )
      if (res) {
        this.salaryList = res.data
        this.total = res.total
      }
    },
    handleCurrentChange(pagenum) {
      this.currentPage = pagenum
      this.getsalaryList()
    },
    handleSizeChange(size) {
      this.size = size
      this.getsalaryList()
    }
  }
}
</script>

<style lang="less" scoped></style>
