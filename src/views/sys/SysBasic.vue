<template>
  <div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="部门管理" name="DepMana"
        ><dep-mana></dep-mana
      ></el-tab-pane>
      <el-tab-pane label="职位管理" name="PosMana"
        ><pos-mana></pos-mana
      ></el-tab-pane>
      <el-tab-pane label="职称管理" name="JoblevelMana"
        ><joblevel-mana></joblevel-mana
      ></el-tab-pane>
      <el-tab-pane label="奖惩规则" name="EcMana"
        ><ec-mana></ec-mana
      ></el-tab-pane>
      <el-tab-pane label="权限组" name="PermissMana"
        ><permiss-mana></permiss-mana
      ></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import DepMana from '../../components/sys//DepMana'
import EcMana from '../../components/sys/EcMana'
import PermissMana from '../../components/sys/PermissMana'
import PosMana from '../../components/sys/PosMana'
import JoblevelMana from '../../components/sys/JoblevelMana'

export default {
  name: '',
  data() {
    return {
      activeName: 'DepMana'
    }
  },
  components: {
    DepMana,
    EcMana,
    JoblevelMana,
    PosMana,
    PermissMana
  },
  computed: {},
  watch: {},
  methods: {}
}
</script>

<style lang="less" scoped></style>
