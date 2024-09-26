/* eslint-disable react-hooks/rules-of-hooks */
import api from '../../api'
import { useQuery, gql } from '@apollo/client'
import { useDispatch } from 'react-redux'

export default class OrderApi {
  static async getOrderById(id: number, signal?: AbortController) {
    return await api.get(
      `/v1/orders/${id}`,
      // `orders/${id}?pagination%5BwithCount%5D=false&pagination%5Blimit%5D=99999&populate=company&populate=protocol&populate=protocol.file&populate=userResponsible&populate=user&populate=sampling_act&populate=comments&populate=comments.users_permissions_user&populate=order_documents&populate=order_documents.File&populate=object&populate=protocols`,
      {
        signal: signal?.signal,
      },
    )
  }

  static async getAll(
    limit = 20,
    offset = 0,
    abortController?: AbortController,
  ) {
    return await api.get(`v1/orders`, {
      signal: abortController?.signal,
    })
  }

  static async getAllByCompanyId(id: string | number) {
    return await api.get(`v1/orders/company/${id}`)
  }

  static async getOrderByCompany(id: number, signal?: AbortController) {
    return await api.get(`v1/orders`, {
      signal: signal?.signal,
    })
  }
}
