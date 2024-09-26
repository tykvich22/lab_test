import api from '../../api'
import { UserLoginResult } from '../../typings'

export default class AuthApi {
  static async login(login: string, password: string) {
    return api.post('/v1/auth/login', {
      email: login,
      password: password,
    })
  }
  static async recovery(email: string) {
    return api.post('/auth/forgot-password', {
      email: email,
    })
  }
  static async getMe(signal?: AbortController) {
    return api.get('/v1/users/me', {
      signal: signal?.signal,
    })
  }
  static async getUsers(signal?: AbortController) {
    return api.get('/users', {
      signal: signal?.signal,
    })
  }
  static async getRole(id: any, signal?: AbortController) {
    return api.get(`/v1/users/${id}`, {
      signal: signal?.signal,
    })
  }
  static async getCompanyOfUser(id: any, signal?: AbortController) {
    return api.get(`/v1/users/${id}`, {
      signal: signal?.signal,
    })
  }
  static async getUsersOfCompany(id: any, signal?: AbortController) {
    return api.get(`/v1/companies/${id}`, {
      signal: signal?.signal,
    })
  }
}
