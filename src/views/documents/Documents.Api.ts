import api from '../../api'
import ProtocolApi, { DocEnum } from '../protocol-reports/ProtocolReports.Api'

export default class DocumentsApi {
  static async getDocsByOrder(id: number) {
    return await api.get(
      `orders/${id}?populate=order_documents&populate=sampling_act`,
    )
  }

  static async getAllTop(limit = 20, offset = 0) {
    return await api.get(`company?l=${limit}&o=${offset}&top=true`)
  }

  static async getOne(id: number | string) {
    return await api.get(`company/${id}`)
  }

  static async getImageById(id: number | string) {
    return await api.get(`v1/documents/${id}`)
  }
  static async getImages() {
    return await api.get(`order-documents?populate=File `)
  }

  static async getImagesById(id: any) {
    return await api.get(`v1/documents/${id}`)
  }
  static async getProtocolById(id: any) {
    return await api.get(`protocols/${id}?populate=file`)
  }

  static async getImagesShow() {
    return await api.get(`v1/lab-docs`)
  }

  static async getAllForCounterParty(id: number | string) {
    return await api.get(`v1/lab-docs/company/${+id}`)
  }

  static async create(
    body: { orderId: number; name: string; isVisible?: boolean },
    file: File,
  ) {
    return ProtocolApi.uploadDoc(file).then((res: any) => {
      return api.post(`v1/documents`, { ...body, fileId: res.data.id })
    })
  }

  static async updateSamplingAct(
    id: number,
    body: any,
    abortController?: AbortController,
  ) {
    const hitApi = {
      data: body,
    }
    return await api.put(`sampling-acts/${id}`, hitApi, {
      signal: abortController?.signal,
    })
  }

  static async update(id: number | string, body: any) {
    return await api.patch(`company/${id}`, body)
  }

  static async updateOrder(id: number | string, value: any) {
    return await api.patch(`company/order/${id}/${value}`)
  }
}
