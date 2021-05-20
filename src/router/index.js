import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const Login = () => import('../views/Login.vue')
const FriendChat = () => import('../views/chat/FriendChat.vue')
const Home = () => import('../views/Home.vue')
const AdminInfo = () => import('../views/AdminInfo.vue')
const routes = [
  {
    path: '/',
    component: Login,
    hidden: true
  },
  {
    path: '/home',
    component: Home,
    name: '首页',
    children: [
      {
        path: '/chat',
        component: FriendChat,
        name: '在线聊天'
      },
      {
        path: '/userInfo',
        component: AdminInfo,

        name: '个人中心'
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
