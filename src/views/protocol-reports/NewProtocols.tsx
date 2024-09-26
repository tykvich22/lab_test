/* eslint-disable jsx-a11y/alt-text */
import {
  CCard,
  CCardBody,
  CContainer,
  CLink,
  CPopover,
  CRow,
  CSmartTable,
  CSpinner,
  CButton,
  CFormInput,
  CFormLabel,
  CForm,
} from '@coreui/react-pro'
import React, { useEffect, useRef, useState } from 'react'
import { redirect, useNavigate } from 'react-router-dom'
import ProtocolReportsApi from './ProtocolReports.Api'
import { useParams } from 'react-router-dom'
import Modal from '../../components/Modal'
import AuthApi from '../auth/auth.api'
import api from '../../api'
import ProtocolReports from './ProtocolReports'
import { gql, useQuery } from '@apollo/client'
import { useTypedSelector } from '../../store'
import ProtocolApi from './ProtocolReports.Api'
import CIcon from '@coreui/icons-react'
import { cilNoteAdd, cilX } from '@coreui/icons'
import OrderApi from '../order/order.api'
import { OrderStatus } from '../../typings'
import { useDispatch } from 'react-redux'

const NewProtocols = (): JSX.Element => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(false)
  const [order, setOrder] = useState<any>({})
  const { orderId } = useParams()
  const [formData, setFormData] = useState<{
    name: string
    file: File | null
    method: string
    confirmedBy: string
    testedBy: string
    filledBy: string
    note: string
    registered: boolean
  }>({
    name: '',
    file: null,
    method: '',
    confirmedBy: '',
    testedBy: '',
    filledBy: '',
    note: '',
    registered: true,
  })

  const form = useRef(null)

  const dispatch = useDispatch()

  useEffect(() => {
    if (orderId) {
      OrderApi.getOrderById(+orderId)
        .then((res: any) => {
          if (res.data?.id) {
            setOrder(res.data)
          } else {
            dispatch({
              type: 'toast',
              toast: {
                visible: true,
                message: 'Заявка с таким номером не найдена',
                status: res.status,
              },
            })
            navigate(`/orders`)
          }
        })
        .catch((res: any) => {
          dispatch({
            type: 'toast',
            toast: {
              visible: true,
              message: 'Не удалось загрузить данные о заявке, попробуйте позже',
              status: res.status,
            },
          })
          navigate(`/orders`)
        })
        .finally(() => setLoading(false))
    }
  }, [orderId])

  const createProtocol = async () => {
    let nextNumber = null
    let prevNumber: any = null
    await ProtocolApi.getLastNumber().then(
      (res: { data: { number: string } }) => {
        prevNumber = res.data.number
      },
    )

    const today = new Date().getTime()
    const yearStart = new Date(new Date().getFullYear(), 0, 1).getTime()
    const offset = Math.floor((today - yearStart) / 1000 / 60 / 60 / 24)
    if (prevNumber) {
      const arr = prevNumber.split('/')
      console.log(
        prevNumber,
        prevNumber.split('/'),
        parseInt(arr[0]),
        arr.length > 1,
      )
      nextNumber =
        arr[0] == offset
          ? `${arr[0]}/${arr.length > 1 ? parseInt(arr[1]) + 1 : '1'}`
          : offset
    } else {
      nextNumber = offset
    }

    if (formData.file) {
      setLoading(true)
      ProtocolApi.create(
        {
          orderId: +orderId!,
          researchObjectId: +order.researchObjectId!,
          name: formData.name,
          confirmedBy: formData.confirmedBy,
          testedBy: formData.testedBy,
          filledBy: formData.filledBy,
          note: formData.note,
          registered: true,
          number: nextNumber,
        },
        formData.file,
      )
        .then((res: any) => {
          dispatch({
            type: 'toast',
            toast: {
              visible: true,
              message: 'Протокол успешно создан',
              status: res.status,
            },
          })
          /* if (isClose) {
            OrderApi.updateOrderById(orderId, {
              status: OrderStatus.DONE,
            })
              .then((resp) => {
                dispatch({
                  type: 'toast',
                  toast: {
                    visible: true,
                    message: 'Заявка успешно закрыта',
                    status: resp.status,
                  },
                })
                navigate(`/orders/${orderId}?view=true`)
              })
              .catch((res: any) => {
                dispatch({
                  type: 'toast',
                  toast: {
                    visible: true,
                    message: 'Ошибка при закрытии заявки, попробуйте позже',
                    status: res.status,
                  },
                })
              })
          } else { */
          setFormData({
            name: '',
            file: null,
            method: '',
            confirmedBy: '',
            testedBy: '',
            filledBy: '',
            note: '',
            registered: true,
          })
          if (form.current) {
            const forma = form.current as HTMLFormElement
            forma.reset()
          }
          /* } */
        })
        .catch((res: any) => {
          dispatch({
            type: 'toast',
            toast: {
              visible: true,
              message: 'Ошибка при создании протокола, попробуйте позже',
              status: res.status,
            },
          })
        })
        .finally(() => setLoading(false))
    }
  }

  if (loading)
    return (
      <div className="loading_spinner">
        <CSpinner />
      </div>
    )

  if (!orderId) {
    navigate('/orders')
  }

  console.log(order)

  return (
    <CContainer>
      <CRow>
        <CForm
          ref={form}
          onSubmit={(e: any) => {
            e.preventDefault()
            createProtocol()
          }}
        >
          <CCard>
            <CCardBody>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <p className="fs-1">Новый протокол</p>
                <p className="fs-6">
                  Заявка № {orderId} - Контрагент: {order?.user?.company?.name}{' '}
                  - Объект: {order?.researchObjects?.name}
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginTop: '2%',
                }}
              >
                <CFormLabel
                  style={{
                    width: '40%',
                  }}
                >
                  Связанная заявка:{' '}
                </CFormLabel>

                <CButton
                  style={{
                    width: '60%',
                  }}
                  color="dark"
                  /* onClick={() => {
                  setVisible(true)
                }} */
                  disabled={true}
                >
                  Заявка №{orderId}
                </CButton>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginTop: '2%',
                }}
              >
                <CFormLabel
                  style={{
                    width: '40%',
                  }}
                >
                  Вид испытаний:
                </CFormLabel>
                <CFormInput
                  required
                  type="text"
                  placeholder={'Введите вид испытаний' as any}
                  style={{
                    width: '60%',
                  }}
                  value={formData.method}
                  onChange={(e) => {
                    setFormData({ ...formData, method: e.target.value })
                  }}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginTop: '2%',
                }}
              >
                <CFormLabel
                  style={{
                    width: '40%',
                  }}
                >
                  Протокол утвердил
                </CFormLabel>
                <CFormInput
                  required
                  type="text"
                  placeholder={'Введите ФИО' as any}
                  style={{
                    width: '60%',
                  }}
                  value={formData.confirmedBy}
                  onChange={(e) => {
                    setFormData({ ...formData, confirmedBy: e.target.value })
                  }}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginTop: '2%',
                }}
              >
                <CFormLabel
                  style={{
                    width: '40%',
                  }}
                >
                  Испытания провёл:
                </CFormLabel>
                <CFormInput
                  required
                  type="text"
                  placeholder={'Введите ФИО' as any}
                  style={{
                    width: '60%',
                  }}
                  value={formData.testedBy}
                  onChange={(e) => {
                    setFormData({ ...formData, testedBy: e.target.value })
                  }}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginTop: '2%',
                }}
              >
                <CFormLabel
                  style={{
                    width: '40%',
                  }}
                >
                  Испытания оформил:
                </CFormLabel>
                <CFormInput
                  required
                  type="text"
                  placeholder={'Введите ФИО' as any}
                  style={{
                    width: '60%',
                  }}
                  value={formData.filledBy}
                  onChange={(e) => {
                    setFormData({ ...formData, filledBy: e.target.value })
                  }}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginTop: '2%',
                }}
              >
                <CFormLabel
                  style={{
                    width: '40%',
                  }}
                >
                  Примечание:
                </CFormLabel>
                <CFormInput
                  required
                  type="text"
                  placeholder={
                    'Введите примечание для журнала протокола' as any
                  }
                  style={{
                    width: '60%',
                  }}
                  value={formData.note}
                  onChange={(e) => {
                    setFormData({ ...formData, note: e.target.value })
                  }}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginTop: '2%',
                }}
              >
                <CFormLabel
                  style={{
                    width: '40%',
                  }}
                >
                  Введите название протокола:
                </CFormLabel>
                <CFormInput
                  required
                  type="text"
                  placeholder={'Название' as any}
                  style={{
                    width: '60%',
                  }}
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value })
                  }}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginTop: '2%',
                }}
              >
                <CFormLabel
                  style={{
                    width: '40%',
                  }}
                >
                  Скан протокола:
                </CFormLabel>
                <CFormInput
                  required
                  style={{
                    width: '60%',
                  }}
                  className="mt-2"
                  type="file"
                  id="formFile"
                  onChange={(e: any) => {
                    console.log(
                      e.target?.files[0]?.name
                        .split('.')
                        .slice(0, -1)
                        .join('.'),
                    )
                    setFormData({
                      ...formData,
                      name: e.target?.files[0]?.name
                        .split('.')
                        .slice(0, -1)
                        .join('.'),
                      file: e.target?.files[0],
                    })
                  }}
                />
              </div>
            </CCardBody>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  marginTop: '2%',
                  flexDirection: 'row',
                  gap: 10,
                }}
              >
                <CButton
                  style={{
                    width: '260px',
                    marginTop: '1%',
                    marginBottom: '2%',
                    backgroundColor: '#747DEA',
                  }}
                  onClick={() => {
                    navigate('../')
                  }}
                >
                  Отмена
                </CButton>
                <CButton
                  type="submit"
                  style={{
                    width: '260px',
                    marginTop: '1%',
                    marginBottom: '2%',
                    backgroundColor: '#747DEA',
                  }}
                >
                  Зарегистрировать протокол
                </CButton>
              </div>
            </div>
          </CCard>
        </CForm>
      </CRow>
    </CContainer>
  )
}

export default NewProtocols
