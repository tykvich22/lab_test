import api from '../../api'
import { useQuery, gql } from '@apollo/client'

export default class ProtocolApi {
  static async getAll() {
    return await api.get(`v1/protocols`)
  }
  static async getAllRegistered() {
    return await api.get(`v1/protocols/registered`)
  }
  static async getAllObjectByCompany(id = 1) {
    return await api.get(`v1/research-objects`)
  }

  static async getProtocolsByObject(id = 1) {
    return await api.get(`v1/objects/${id}?populate=protocols`)
  }

  static async getAllTop(limit = 20, offset = 0) {
    return await api.get(`company?l=${limit}&o=${offset}&top=true`)
  }

  static async getObjectByOrder(id: number | string) {
    return await api.get(`v1/orders/${id}`)
  }

  static async getOneProtocol(id: number | string) {
    return await api.get(`v1/protocols/${id}`)
  }

  static async getLastNumber() {
    return await api.get(`v1/protocols/last`)
  }

  static async getOne(id: number | string) {
    return await api.get(`company/${id}`)
  }

  static async getImageById(id: number | string) {
    return await api.get(`protocols/${id}?populate=file`)
  }

  static async createCustom(body: any) {
    return api.post(`v1/protocols`, body)
  }

  static async updateCustom(id: number | string, body: any) {
    return api.patch(`v1/protocols/${+id}`, body)
  }

  static async getCustomProtocol(protocolId: number | string) {
    return api.patch(`v1/methods/${+protocolId}`)
  }

  static async createMethod(body: { data: JSON; protocolId: number | string }) {
    /* console.log(body)
    return api.post(`v1/methods`, body) */
  }

  static async create(
    body: {
      orderId?: number
      researchObjectId?: number
      name?: string
      confirmedBy?: string
      testedBy?: string
      filledBy?: string
      note?: string
      registered: boolean
      number: string | number
    },
    file: File,
  ) {
    if (!body.name || body.name == '') {
      body.name = file.name
    }
    return ProtocolApi.uploadDoc(file).then((res: any) => {
      return api.post(`v1/protocols`, { ...body, fileId: res.data.id })
      /* .then((response) => console.log(response)) */
    })
  }

  static async updateProtocolInObject(id: any, body: any) {
    const hitApi = {
      data: body,
    }
    return await api.put(`objects/${id}`, hitApi)
  }

  static async updateAddedProtocolOrder(id: any, body: any) {
    const hitApi = {
      data: body,
    }

    return await api.put(`orders/${id}`, hitApi)
  }

  static async update(id: number | string, body: any) {
    return await api.patch(`company/${id}`, body)
  }

  static async updateOrder(id: number | string, value: any) {
    return await api.patch(`company/order/${id}/${value}`)
  }

  static async uploadDoc(file: File) {
    return await api
      .post('v1/media', {
        filename: file.name.replace(',', ''),
      })
      .then(async (res: any) => {
        console.log(res)
        const fields = res.data.fields
        const formdata = new FormData()
        formdata.append('key', fields.key)
        formdata.append('bucket', fields.bucket)
        formdata.append('X-Amz-Algorithm', fields['X-Amz-Algorithm'])
        formdata.append('X-Amz-Credential', fields['X-Amz-Credential'])
        formdata.append('X-Amz-Date', fields['X-Amz-Date'])
        formdata.append('Policy', fields.Policy)
        formdata.append('X-Amz-Signature', fields['X-Amz-Signature'])
        formdata.append('file', file, file.name)

        const requestOptions: any = {
          method: 'POST',
          body: formdata,
          redirect: 'follow',
        }

        const sendFile = await fetch(res.data.url, requestOptions)
        return { ...res, status: sendFile }
      })
  }
}

export const ALLORDERSBYID = gql`
  query {
    orders(
      pagination: { limit: 999, start: 0 }
      filters: { company: { id: { eq: 119 } } }
    ) {
      data {
        id
        attributes {
          name
          date_finish
          date_start
          number
          object_control
          object_name
          publishedAt
          updatedAt
          protocol {
            data {
              id
            }
          }
          company {
            data {
              id
            }
          }
          usersResponsible {
            data {
              id
            }
          }
          object {
            data {
              id
            }
          }
        }
      }
    }
  }
`
export enum DocEnum {
  equipment = 'equipment',
  document = 'document',
  protocol = 'protocol',
}
