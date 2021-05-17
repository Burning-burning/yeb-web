import axios from 'axios'
import { Message } from 'element-ui'
import router from '../router'
/* eslint-disable */

axios.interceptors.request.use(
  config => {
    if (window.sessionStorage.getItem('tokenStr')) {
      config.headers['Authorization'] = window.sessionStorage.getItem(
        'tokenStr'
      )
    }
    return config
  },
  error => {
    console.log(error)
  }
)
axios.interceptors.response.use(
  success => {
    // 表示成功调到了后端接口，但是业务逻辑错误
    if (success.status && success.status === 200) {
      // 500 业务逻辑错误   401未登录   403权限错误
      if (
        success.data.code === 500 ||
        success.data.code === 401 ||
        success.data.code === 403
      ) {
        Message.error({ message: success.data.message })
        return
      }

      if (success.data.message) {
        Message.success({ message: success.data.message })
      }
    }
    return success.data
  },
  error => {
    if (error.response.code === 504 || error.response.code === 404) {
      Message.error({ message: '服务器被吃了' })
    } else if (error.response.code === 403) {
      Message.error({ message: '权限不足，请联系管理员' })
    } else if (error.response.code === 401) {
      Message.error({ message: '尚未登录，请登录' })
      router.replace('/')
    } else {
      if (error.response.data.message) {
        Message.error({ message: error.response.data.message })
      } else {
        Message.error({ message: '未知错误!' })
      }
    }
    return
  }
)

const baseUrl = ''
export const postRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${baseUrl}${url}`,
    data: params
  })
}

export const putRequest = (url, params) => {
  return axios({
    method: 'put',
    url: `${baseUrl}${url}`,
    data: params
  })
}

export const getRequest = (url, params) => {
  return axios({
    method: 'get',
    url: `${baseUrl}${url}`,
    data: params
  })
}

export const deleteRequest = (url, params) => {
  return axios({
    method: 'delete',
    url: `${baseUrl}${url}`,
    data: params
  })
}
