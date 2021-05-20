import Vue from 'vue'
import Vuex from 'vuex'
import { getRequest } from '../network/api'
import SockJs from 'sockjs-client'
import Stomp from 'stompjs'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    routes: [],
    sessions: {},
    currentSession: null,
    filterKey: '',
    admins: [],
    stomp: null,
    currentAdmin: JSON.parse(window.sessionStorage.getItem('user'))
  },
  getters: {},
  mutations: {
    changecurrentSession(state, currentSession) {
      state.currentSession = currentSession
    },
    addMessage(state, msg) {
      const mss = state.sessions[state.currentAdmin.name + '#' + msg.to]
      if (!mss) {
        state.sessions[state.currentAdmin.name + '#' + msg.to] = []
      } else {
        state.sessions[state.currentAdmin.name + '#' + msg.to].push({
          content: msg.content,
          date: new Date(),
          self: !msg.notSelf
        })
      }
    },
    initRoutes(state, data) {
      state.routes = data
    },
    INIT_ADMIN(state, admin) {
      state.currentAdmin = admin
    },
    INIT_DATA(state) {
      const data = localStorage.getItem('vue-chat-session')

      if (data) {
        state.sessions = JSON.parse(data)
      }
    },
    INIT_ADMINS(state, data) {
      state.admins = data
    }
  },
  actions: {
    async initData(context) {
      const res = await getRequest('/chat/')
      if (res) {
        context.commit('INIT_ADMINS', res)
      }
    },
    connect(context) {
      context.state.stomp = Stomp.over(new SockJs('/ws/ep'))
      const token = window.sessionStorage.getItem('tokenStr')
      context.state.stomp.connect(
        { 'Auth-Token': token },
        success => {
          context.state.stomp.subscribe('/user/queue/chat', msg => {
            const receiveMsg = JSON.parse(msg.body)
            receiveMsg.notSelf = true
            receiveMsg.to = receiveMsg.from
            context.commit('addMessage', receiveMsg)
          })
        },
        err => console.log(err)
      )
    }
  }
})

store.watch(
  function(state) {
    return state.sessions
  },
  function(val) {
    console.log('CHANGE: ', val)
    localStorage.setItem('vue-chat-session', JSON.stringify(val))
  },
  {
    deep: true
  }
)

export default store
