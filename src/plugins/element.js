import Vue from 'vue'
import {
  Button,
  Checkbox,
  Input,
  Message,
  Container,
  Header,
  Main,
  Aside,
  Menu,
  Submenu,
  MenuItem,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  MessageBox,
  Breadcrumb,
  BreadcrumbItem,
  TabPane,
  Tabs,
  Table,
  TableColumn,
  Dialog,
  Select,
  Option,
  Tag,
  Form,
  FormItem,
  Switch,
  Collapse,
  CollapseItem,
  Card
} from 'element-ui'

Vue.use(Button)

Vue.use(Checkbox)
Vue.use(Input)
Vue.use(Header)
Vue.use(Main)
Vue.use(Aside)
Vue.use(Switch)
Vue.use(Container)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(Card)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Tag)
Vue.use(FormItem)
Vue.use(Form)
Vue.use(MenuItem)
Vue.use(Dialog)
Vue.use(Select)
Vue.use(Option)
Vue.use(Dropdown)
Vue.use(DropdownItem)
Vue.use(DropdownMenu)
Vue.use(BreadcrumbItem)
Vue.use(Breadcrumb)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Table)
Vue.use(TableColumn)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
