/* eslint-disable no-useless-concat */
import axios from 'axios'
import { getUserInfo } from './utils'

const instance = axios.create({
  //REMOVE: for API NEW
  // baseURL: process.env.REACT_APP_API + '/api',
  baseURL: process.env.REACT_APP_API,
})

instance.interceptors.request.use(
  (request: any) => {
    const user = getUserInfo()

    console.log(user)

    if (user) {
      if (request.headers && user.access_token) {
        request.headers['Authorization'] = 'Bearer ' + user.access_token
      }
    }

    request.headers['x-lab-name'] = localStorage.getItem('lab')

    return request
  },
  (error) => {
    return Promise.reject(error)
  },
)

instance.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default instance
