<template>
  <div>
    <div style="display:flex;justify-content: space-between">
      <div>
        <el-input
          :disabled="addvanceSearchVisible"
          v-model="empName"
          clearable=""
          @clear="search"
          style="width:300px;margin-right: 10px"
          placeholder="请输入员工名进行搜索..."
          prefix-icon="el-icon-search"
          @keydown.native.enter="search"
          size="mini"
        ></el-input>
        <el-button
          :disabled="addvanceSearchVisible"
          @click="search"
          type="primary"
          size="mini"
          icon="el-icon-search"
          >搜索</el-button
        ><el-button
          @click="addvanceSearchVisible = !addvanceSearchVisible"
          type="primary"
          size="mini"
          ><i
            :class="
              addvanceSearchVisible
                ? 'fa fa-angle-double-up'
                : 'fa fa-angle-double-down'
            "
            aria-hidden="true"
          ></i
          >高级搜索</el-button
        >
      </div>
      <div>
        <el-upload
          style="display:inline-flex;margin-right: 10px"
          :show-file-list="false"
          action="/system/basic/employee/import"
          :headers="heads"
          :before-upload="beforeUpload"
          :on-success="onSuccess"
          :on-error="onError"
        >
          <el-button
            :disabled="disable"
            size="mini"
            type="success"
            :icon="icon"
            >{{ text }}</el-button
          >
        </el-upload>
        <el-button
          size="mini"
          type="success"
          @click="exportData"
          el-icon-download
          >导出数据</el-button
        >
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="addEm"
          >添加员工</el-button
        >
      </div>
    </div>
    <transition name="slide-fade">
      <div
        v-show="addvanceSearchVisible"
        style="border: 1px solid #409eff; border-radius: 5px; box-sizing: border-box; padding:5px;margin-top:10px"
      >
        <el-row>
          <el-col :span="5">
            政治面貌：
            <el-select
              size="mini"
              style="width:130px"
              v-model="searchValue.politicId"
              placeholder="请选择"
            >
              <el-option
                v-for="item in politicsStatus"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4"
            >民族：<el-select
              size="mini"
              style="width:130px"
              v-model="searchValue.nationId"
              placeholder="请选择"
            >
              <el-option
                v-for="item in nations"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option> </el-select
          ></el-col>
          <el-col :span="4">
            职位：
            <el-select
              size="mini"
              style="width:130px"
              v-model="searchValue.posId"
              placeholder="请选择"
            >
              <el-option
                v-for="item in positions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4"
            >职称：<el-select
              size="mini"
              style="width:140px"
              v-model="searchValue.jobLevelId"
              placeholder="请选择"
            >
              <el-option
                v-for="item in joblevels"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option> </el-select
          ></el-col>
          <el-col :span="7"
            >聘用形式：<el-radio-group v-model="searchValue.engageForm">
              <el-radio label="劳动合同">劳动合同</el-radio>
              <el-radio label="劳务合同">劳务合同</el-radio>
            </el-radio-group></el-col
          >
        </el-row>
        <el-row style="margin-top:10px">
          <el-col :span="5"
            >所属部门：
            <el-popover
              placement="bottom"
              title="请选择部门"
              width="200"
              trigger="manual"
              v-model="visible2"
              ><el-tree
                :data="allDeps"
                :props="defaultProps"
                @node-click="searchHandleNodeClick"
                default-expand-all
              ></el-tree>
              <div
                @click="showDepView2"
                slot="reference"
                style="width:130px;border-radius:5px;display:inline-flex;border: 1px solid #dedede;height:24px;
                  cursor: pointer;box-sizing: border-box;padding-left:8px;font-size:12px;align-items: center"
              >
                {{ inputDepName }}
              </div>
            </el-popover></el-col
          >
          <el-col :span="10"
            >入职日期：<el-date-picker
              v-model="searchValue.beginDateScope"
              type="daterange"
              size="mini"
              unlink-panels
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker
          ></el-col>
          <el-col :span="5" :offset="4">
            <el-button size="mini">取消</el-button>
            <el-button
              icon="el-icon-search"
              type="primary"
              size="mini"
              @click="getEmList('advanced')"
              >搜索</el-button
            >
          </el-col>
        </el-row>
      </div>
    </transition>

    <div>
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        border
        :data="emList"
        style="width: 100%;margin-top:10px"
        size="mini"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="姓名" fixed width="70" align="left">
        </el-table-column
        ><el-table-column prop="workID" label="工号" width="85">
        </el-table-column
        ><el-table-column prop="gender" label="性别" width="50">
        </el-table-column
        ><el-table-column prop="birthday" label="出生日期" width="90">
        </el-table-column
        ><el-table-column prop="idCard" label="身份证号" width="150">
        </el-table-column
        ><el-table-column prop="wedlock" label="婚姻状况" width="60">
        </el-table-column
        ><el-table-column prop="nation.name" label="民族" width="50">
        </el-table-column
        ><el-table-column prop="nativePlace" label="籍贯" width="80">
        </el-table-column
        ><el-table-column
          prop="politicsStatus.name"
          label="政治面貌"
          width="50"
        >
        </el-table-column
        ><el-table-column prop="email" label="电子邮件" width="150">
        </el-table-column
        ><el-table-column prop="phone" label="电话号码" width="100">
        </el-table-column
        ><el-table-column prop="address" label="联系地址" width="220">
        </el-table-column
        ><el-table-column prop="department.name" label="所属部门" width="70">
        </el-table-column
        ><el-table-column prop="position.name" label="职位" width="70">
        </el-table-column
        ><el-table-column prop="engageForm" label="聘用形式" width="100">
        </el-table-column
        ><el-table-column prop="tiptopDegree" label="最高学历" width="80">
        </el-table-column
        ><el-table-column prop="school" label="学校" width="100">
        </el-table-column
        ><el-table-column prop="specialty" label="专业" width="120">
        </el-table-column
        ><el-table-column prop="workState" label="在职状态" width="70">
        </el-table-column
        ><el-table-column prop="beginDate" label="入职日期" width="95">
        </el-table-column
        ><el-table-column prop="conversionTime" label="转正日期" width="95">
        </el-table-column
        ><el-table-column prop="beginContract" label="合同起始日期" width="95">
        </el-table-column
        ><el-table-column prop="endContract" label="合同截止日期" width="95">
        </el-table-column
        ><el-table-column label="合同期限" width="80">
          <template slot-scope="scoped">
            <el-tag>{{ scoped.row.contractTerm }}</el-tag
            >年
          </template> </el-table-column
        ><el-table-column fixed="right" label="操作" width="200">
          <template>
            <el-button style="padding:3px" size="mini">编辑</el-button>
            <el-button style="padding:3px" type="primary" size="mini"
              >查看高级资料</el-button
            >
            <el-button style="padding:3px" type="danger" size="mini"
              >删除</el-button
            >
          </template>
        </el-table-column></el-table
      >
      <el-pagination
        class="fenye"
        background
        @size-change="handleSizeChange"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @current-change="handleChange"
      >
      </el-pagination>
    </div>

    <el-dialog title="添加员工" :visible.sync="dialogVisible" width="80%">
      <div>
        <el-form :model="emp" ref="empRef" :rules="empRules">
          <el-row>
            <el-col :span="6">
              <el-form-item label="姓名:" prop="name">
                <el-input
                  v-model="emp.name"
                  size="mini"
                  style="width: 150px"
                  placeholder="请输入员工姓名"
                  prefix-icon="el-icon-edit"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="性别:" prop="gender">
                <el-radio-group v-model="emp.gender">
                  <el-radio label="男">男</el-radio>
                  <el-radio label="女">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="出生日期:" prop="birthday">
                <el-date-picker
                  size="mini"
                  style="width: 150px"
                  v-model="emp.birthday"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="政治面貌:" prop="politicId">
                <el-select
                  size="mini"
                  style="width:200px"
                  v-model="emp.politicId"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in politicsStatus"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="6">
              <el-form-item label="民族:" prop="nationId">
                <el-select
                  size="mini"
                  style="width:150px"
                  v-model="emp.nationId"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in nations"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="籍贯:" prop="nativePlace">
                <el-input
                  v-model="emp.nativePlace"
                  size="mini"
                  style="width: 120px"
                  placeholder="请输入籍贯"
                  prefix-icon="el-icon-edit"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="电子邮箱:" prop="email">
                <el-input
                  v-model="emp.email"
                  size="mini"
                  style="width: 150px"
                  placeholder="请输入电子邮箱"
                  prefix-icon="el-icon-edit"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="联系地址:" prop="address"
                ><el-input
                  v-model="emp.address"
                  size="mini"
                  style="width: 200px"
                  placeholder="请输入地址"
                  prefix-icon="el-icon-message"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="6">
              <el-form-item label="职位:" prop="posId">
                <el-select
                  size="mini"
                  style="width:150px"
                  v-model="emp.posId"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in positions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="职称:" prop="jobLevelId">
                <el-select
                  size="mini"
                  style="width:150px"
                  v-model="emp.jobLevelId"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in joblevels"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="所属部门:"
                prop="departmentId"
                style="margin-top:5px"
              >
                <el-popover
                  placement="bottom"
                  title="请选择部门"
                  width="200"
                  trigger="manual"
                  v-model="visible"
                  ><el-tree
                    :data="allDeps"
                    :props="defaultProps"
                    @node-click="handleNodeClick"
                    default-expand-all
                  ></el-tree>
                  <div
                    @click="showDepView"
                    slot="reference"
                    style="width:150px;border-radius:5px;display:inline-flex;border: 1px solid #dedede;height:24px;
                  cursor: pointer;box-sizing: border-box;padding-left:8px;font-size:12px;align-items: center"
                  >
                    {{ inputName }}
                  </div>
                </el-popover>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="电话号码:" prop="phone"
                ><el-input
                  v-model="emp.phone"
                  size="mini"
                  style="width: 200px"
                  placeholder="请输入地址"
                  prefix-icon="el-icon-phone"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="6">
              <el-form-item label="工号:" prop="workID">
                <el-input
                  disabled
                  v-model="emp.workID"
                  size="mini"
                  style="width: 150px"
                  placeholder="请输入工号"
                  prefix-icon="el-icon-edit"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="学历:" prop="tiptopDegree">
                <el-select
                  size="mini"
                  style="width:150px"
                  v-model="emp.tiptopDegree"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in tiptopDegrees"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="毕业院校:" prop="school">
                <el-input
                  v-model="emp.school"
                  size="mini"
                  style="width: 150px"
                  placeholder="请输入学校"
                  prefix-icon="el-icon-edit"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="专业名称:" prop="specialty"
                ><el-input
                  v-model="emp.specialty"
                  size="mini"
                  style="width: 200px"
                  placeholder="请输入专业名称"
                  prefix-icon="el-icon-phone"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="6">
              <el-form-item label="入职日期:" prop="beginDate">
                <el-date-picker
                  size="mini"
                  style="width: 130px"
                  v-model="emp.beginDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="转正日期:" prop="conversionTime">
                <el-date-picker
                  size="mini"
                  style="width: 125px"
                  v-model="emp.conversionTime"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="合同起始日期:" prop="beginContract">
                <el-date-picker
                  size="mini"
                  style="width: 125px"
                  v-model="emp.beginContract"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="合同截止日期:" prop="endContract"
                ><el-date-picker
                  size="mini"
                  style="width: 125px"
                  v-model="emp.endContract"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item label="身份证号:" prop="idCard">
                <el-input
                  v-model="emp.idCard"
                  size="mini"
                  style="width: 180px"
                  placeholder="请输入身份证号"
                  prefix-icon="el-icon-edit"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="聘用形式:" prop="engageForm">
                <el-radio-group v-model="emp.engageForm">
                  <el-radio label="劳动合同">劳动合同</el-radio>
                  <el-radio label="劳务合同">劳务合同</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="婚姻状况:" prop="wedlock">
                <el-radio-group v-model="emp.wedlock">
                  <el-radio label="已婚">已婚</el-radio>
                  <el-radio label="未婚">未婚</el-radio>
                  <el-radio label="离异">离异</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
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
      searchValue: {
        politicId: null,
        nationId: '',
        posId: null,
        jobLevelId: null,
        engageForm: '',
        departmentId: null,
        beginDateScope: null
      },
      emList: [],
      visible2: false,
      loading: false,
      total: 0,
      currentPage: 1,
      size: 10,
      empName: '',
      dialogVisible: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      allDeps: [],
      addvanceSearchVisible: false,
      tiptopDegrees: [
        '博士',
        '硕士',
        '本科',
        '大专',
        '高中',
        '初中',
        '小学',
        '其他'
      ],
      emp: {
        name: '',
        gender: '',
        birthday: '',
        idCard: '',
        wedlock: '',
        nationId: null,
        nativePlace: '',
        politicId: null,
        email: '',
        phone: '',
        address: '',
        departmentId: null,
        jobLevelId: null,
        posId: null,
        engageForm: '',
        tiptopDegree: '',
        specialty: '',
        school: '',
        beginDate: '',
        workState: '在职',
        workID: '',
        contractTerm: null,
        conversionTime: '',
        notWorkDate: null,
        beginContrct: '',
        endContract: '',
        workAge: null,
        salaryId: null
      },
      empRules: {
        name: [{ required: true, message: '请输入员工姓名', trigger: 'blur' }],
        gender: [
          { required: true, message: '请输入员工性别', trigger: 'blur' }
        ],
        birthday: [
          { required: true, message: '请输入员工出生日期', trigger: 'blur' }
        ],
        idCard: [
          { required: true, message: '请输入员工身份证号', trigger: 'blur' }
        ],
        wedlock: [
          { required: true, message: '请输入婚姻状况', trigger: 'blur' }
        ],
        nationId: [{ required: true, message: '请输入民族', trigger: 'blur' }],
        nativePlace: [
          { required: true, message: '请输入籍贯', trigger: 'blur' }
        ],
        politicId: [
          { required: true, message: '请输入政治面貌', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '邮箱地址格式不正确', trigger: 'blur' }
        ],
        phone: [{ required: true, message: '请输入电话号码', trigger: 'blur' }],
        address: [
          { required: true, message: '请输入员工地址', trigger: 'blur' }
        ],
        departmentId: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ],
        jobLevelId: [
          { required: true, message: '请输入职称', trigger: 'blur' }
        ],
        posId: [{ required: true, message: '请输入职位', trigger: 'blur' }],
        engageForm: [
          { required: true, message: '请输入聘用形式', trigger: 'blur' }
        ],
        tiptopDegree: [
          { required: true, message: '请输入学历', trigger: 'blur' }
        ],
        specialty: [{ required: true, message: '请输入专业', trigger: 'blur' }],
        school: [{ required: true, message: '请输入学校', trigger: 'blur' }],
        beginDate: [
          { required: true, message: '请输入入职日期', trigger: 'blur' }
        ],
        workState: [
          { required: true, message: '请输入工作状态', trigger: 'blur' }
        ],
        workID: [{ required: true, message: '请输入工号', trigger: 'blur' }],
        contractTerm: [
          { required: true, message: '请输入合同期限', trigger: 'blur' }
        ],
        conversionTime: [
          { required: true, message: '请输入转正日期', trigger: 'blur' }
        ],
        notWorkDate: [
          { required: true, message: '请输入离职日期', trigger: 'blur' }
        ],
        beginContract: [
          { required: true, message: '请输入合同起始日期', trigger: 'blur' }
        ],
        endContract: [
          { required: true, message: '请输入合同结束日期', trigger: 'blur' }
        ],
        workAge: [{ required: true, message: '请输入工龄', trigger: 'blur' }]
      },
      inputDepName: '',
      nations: [],
      joblevels: [],
      politicsStatus: [],
      positions: [],
      visible: false,
      inputName: '',
      icon: 'el-icon-upload2',
      text: '导入数据',
      disable: false,
      heads: {
        Authorization: window.sessionStorage.getItem('tokenStr')
      }
    }
  },
  methods: {
    async getEmList(type) {
      this.loading = true
      let url =
        '/system/basic/employee/?currentPage=' +
        this.currentPage +
        '&size=' +
        this.size
      if (type && type === 'advanced') {
        if (this.searchValue.politicId) {
          url += '&politicId=' + this.searchValue.politicId
        }
        if (this.searchValue.nationId) {
          url += '&nationId=' + this.searchValue.nationId
        }
        if (this.searchValue.posId) {
          url += '&posId=' + this.searchValue.posId
        }
        if (this.searchValue.jobLevelId) {
          url += '&jobLevelId=' + this.searchValue.jobLevelId
        }
        if (this.searchValue.engageForm) {
          url += '&engageForm=' + this.searchValue.engageForm
        }

        if (this.searchValue.departmentId) {
          url += '&departmentId=' + this.searchValue.departmentId
        }
        if (this.searchValue.beginDateScope) {
          console.log(this.searchValue.beginDateScope)
          url += '&beginDateScope=' + this.searchValue.beginDateScope
        }
      } else {
        url += '&name=' + this.empName
      }
      const res = await this.getRequest(url)
      if (res) {
        this.loading = false
        this.emList = res.data
        this.total = res.total
      }
    },
    onSuccess() {
      this.icon = 'el-icon-upload2'
      this.text = '导入数据'
      this.disable = false
      this.getEmList()
    },
    onError() {
      this.icon = 'el-icon-upload2'
      this.text = '导入数据'
      this.disable = false
    },
    beforeUpload() {
      this.icon = 'el-icon-loading'
      this.text = '正在导入'
      this.disable = true
    },
    async exportData() {
      await this.downloadRequest('/system/basic/employee/export')
    },
    importData() {},
    handleChange(pageNum) {
      this.currentPage = pageNum
      this.getEmList()
    },
    handleSizeChange(pageSize) {
      this.size = pageSize
      this.getEmList()
    },
    showDepView() {
      this.visible = !this.visible
    },
    search() {
      this.getEmList()
    },
    async initPositions() {
      const res = await this.getRequest('/system/basic/employee/position')
      if (res) {
        this.positions = res
      }
    },
    addEm() {
      this.dialogVisible = true
      this.initPositions()
      this.getMaxWorkId()
    },
    submitForm() {
      this.$refs.empRef.validate(async valid => {
        if (valid) {
          const res = await this.postRequest(
            '/system/basic/employee/',
            this.emp
          )
          if (res) {
            this.$refs.empRef.resetFields()
            this.dialogVisible = false
            this.getEmList()
          }
        }
      })
    },
    handleNodeClick(data) {
      this.emp.departmentId = data.id
      this.visible = !this.visible
      this.inputName = data.name
    },
    async initData() {
      if (!window.sessionStorage.getItem('nations')) {
        const res = await this.getRequest('/system/basic/employee/nation')
        if (res) {
          this.nations = res
          window.sessionStorage.setItem('nations', JSON.stringify(res))
        }
      } else {
        this.nations = JSON.parse(window.sessionStorage.getItem('nations'))
      }

      if (!window.sessionStorage.getItem('allDeps')) {
        const res = await this.getRequest('/system/basic/employee/deps')
        if (res) {
          this.allDeps = res
          window.sessionStorage.setItem('allDeps', JSON.stringify(res))
        }
      } else {
        this.allDeps = JSON.parse(window.sessionStorage.getItem('allDeps'))
      }

      if (!window.sessionStorage.getItem('joblevels')) {
        const res = await this.getRequest('/system/basic/employee/joblevel')
        if (res) {
          this.joblevels = res
          window.sessionStorage.setItem('joblevels', JSON.stringify(res))
        }
      } else {
        this.joblevels = JSON.parse(window.sessionStorage.getItem('joblevels'))
      }

      if (!window.sessionStorage.getItem('politicsStatus')) {
        const res = await this.getRequest(
          '/system/basic/employee/politicsStatus'
        )
        if (res) {
          this.politicsStatus = res
          window.sessionStorage.setItem('politicsStatus', JSON.stringify(res))
        }
      } else {
        this.politicsStatus = JSON.parse(
          window.sessionStorage.getItem('politicsStatus')
        )
      }
    },
    async getMaxWorkId() {
      const res = await this.getRequest('/system/basic/employee/maxWorkID')
      if (res) {
        this.emp.workID = res.obj
      }
    },
    searchHandleNodeClick(data) {
      this.visible2 = !this.visible2
      this.searchValue.departmentId = data.id
      this.inputDepName = data.name
    },
    showDepView2() {
      this.visible2 = !this.visible2
    }
  },
  created() {
    this.getEmList()
    this.initData()
    this.initPositions()
  }
}
</script>

<style lang="less" scoped>
.fenye {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all 0.8s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
