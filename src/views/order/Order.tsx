import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CTimePicker,
  CDatePicker,
  CFormTextarea,
  CFormSelect,
  CCardHeader,
  CSpinner,
  CCardText,
  CCardTitle,
  CAlert,
  CListGroup,
  CListGroupItem,
} from '@coreui/react-pro'
import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import OrderApi from './order.api'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useTypedSelector } from '../../store'
import Modal from '../../components/Modal'
import DocumentsApi from '../documents/Documents.Api'
import AuthApi from '../auth/auth.api'
import Card from '../../components/Card'

import {
  getImagePlaceholderFromMime,
  phoneNumber,
  printOrDownloadDoc,
} from '../../utils'
import setTime, { setTimeV2 } from '../../helper/timeFormat'
import api from '../../api'
import { monthToWord } from '../../helper/timeFormat'
import ProtocolApi, { DocEnum } from '../protocol-reports/ProtocolReports.Api'
import { OrderStatus } from '../../typings'

const OrderDetail = (): JSX.Element => {
  const params = useParams()
  const [data, setData] = useState<any>({})
  const [users, setUsers] = useState<any>()
  const documentOrderIds: any = []
  const [showDate, setShowDate] = useState<any>('')
  const [dataComment, setDataComment] = useState<any>({
    comment: '',
    date: '',
    order: 0,
    users_permissions_user: 0,
  })

  const [loading, setLoading] = useState(true)
  const [dataModal, setDataModal] = useState<any>({
    name: '',
    verificationDate: '',
  })

  const [response, setResponse] =
    useState<{ type: 'success' | 'danger'; message: string }>()
  const [docNumbers, setDocNumbers] = useState<any>([])
  const [docNumbersPreview, setDocNumbersPreview] = useState<any>([])
  const [showPreviewPicture, setShowPreviewPicture] = useState('')
  const [visible, setVisible] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isDisabled, setIsDisabled] = useState(false)
  const dataUser = useTypedSelector((state) => state.dataUser)
  const isLabUser = useTypedSelector((state) => state.isLabRole)
  const isCompanyAdmin = useTypedSelector(
    (state) => state.dataUser.role == 'companyadmin',
  )
  const [searchParams] = useSearchParams()
  /* const [dataUsers, setDataUsers] = useState<any[]>([]) */
  const companyGlobalState = useTypedSelector((state) => state.company)
  const [modaVisible, setModalVisible] = useState(false)
  const [modal, setModal] = useState<boolean>(false)
  const [formUpload, setFormUpload] = useState<{
    name?: string
    file?: File | null
  }>({})
  const [isNewObject, setIsNewObject] = useState(false)
  const [objectsList, setObjectsList] = useState<any>([])
  const [filteredObjects, setFilteredObjects] = useState<any>({})
  const [employeesList, setEmployeesList] = useState<any>([])
  const [filteredEmployeesList, setFilteredEmployeesList] = useState<any>([])
  const [employeeName, setEmployeeName] = useState('')
  const [labInfo, setLabInfo] = useState<any>({})
  const [closeOrderModal, setCloseOrderModal] = useState(false)
  const [reasonError, setReasonError] = useState(false)
  const [protocolModalVisible, setProtocolModalVisible] = useState(false)
  const [method, setMethod] = useState<null | string>(null)

  const objects = useRef<any>(null)
  const objectsInput = useRef<any>(null)
  const employees = useRef<any>(null)
  const employeesInput = useRef<any>(null)

  const emptyCommentator = {
    name: '',
    surname: '',
    lastName: '',
  }

  const firstSectionRef = useRef<any>()
  const commentRef = useRef<any>()
  const documentRef = useRef<any>()
  const [firstSectionCompletePrint, setFirstSectionCompletePrint] =
    useState(false)
  const [firstSectionCompleteDownload, setFirstSectionCompleteDownload] =
    useState(false)
  const [documentRefCompletePrint, setDocumentRefCompletePrint] =
    useState(false)
  const [documentRefCompleteDownload, setDocumentRefCompleteDownload] =
    useState(false)

  useEffect(() => {
    if (firstSectionCompletePrint) {
      printOrDownloadDoc(firstSectionRef, true)
      setFirstSectionCompletePrint(false)
    }
  }, [firstSectionCompletePrint])

  useEffect(() => {
    if (firstSectionCompleteDownload) {
      printOrDownloadDoc(firstSectionRef, false)
      setFirstSectionCompleteDownload(false)
    }
  }, [firstSectionCompleteDownload])

  useEffect(() => {
    if (documentRefCompletePrint) {
      printOrDownloadDoc(documentRef, true)
      setDocumentRefCompletePrint(false)
    }
  }, [documentRefCompletePrint])

  useEffect(() => {
    if (documentRefCompleteDownload) {
      printOrDownloadDoc(documentRef, false)
      setDocumentRefCompleteDownload(false)
    }
  }, [documentRefCompleteDownload])

  const handleFirstSectionPrint = () => {
    setFirstSectionCompletePrint(true)
  }

  const handleFirstSectionDownload = () => {
    setFirstSectionCompleteDownload(true)
  }

  const handleCommentPrint = () => {
    printOrDownloadDoc(commentRef, true)
  }

  const handleCommentDownload = () => {
    printOrDownloadDoc(commentRef, false)
  }

  const handleDocumentPrint = () => {
    setFirstSectionCompletePrint(true)
  }

  const handleDocumentDownload = () => {
    setDocumentRefCompleteDownload(true)
  }

  const getDateV1 = (date: any, time?: boolean) => {
    const dateObj = new Date(date)
    const month = dateObj.getUTCMonth() + 1 //months from 1-12
    const day = dateObj.getUTCDate()
    const year = dateObj.getUTCFullYear()
    if (time) {
      const hour = date.split(':')[0]
      const minute = date.split(':')[1]

      return `${hour}:${minute}`
    }
    return day + ' ' + monthToWord(month) + ' ' + year
  }

  const getDateV2 = (date: any, time?: boolean) => {
    const dateObj = new Date(date)
    const day = dateObj.getUTCDate()
    const year = dateObj.getUTCFullYear()
    if (time) {
      const hour = date.split(':')[0]
      const minute = date.split(':')[1]

      return `${hour}:${minute}`
    }

    const month = dateObj.toLocaleDateString(undefined, {
      month: 'short',
    })

    return day + ' ' + month + ' ' + year
  }

  const [actDetail, setActDetail] = useState<any>({
    samplingDate: '',
    samplingTime: '',
    respCompUserId: null,
    materialName: '',
    user: '',
    note: '',
    samplingQuantity: '',
    qualityDocument: '',
    id: null,
    environmental: '',
  })
  const [haveAct, setHaveAct] = useState(false)
  const isView = searchParams.get('view') === 'true'

  const isCompany = dataUser?.role?.includes('company')

  const [alertGoToAddObject, setAlertGoToAddObject] = useState<any>(null)

  const [buttonStyle, setButtonStyle] = useState<any>({
    width: '180px',
    marginTop: '20px',
    backgroundColor: '#F1F4F7',
    color: '#414141',
    marginBottom: '20px',
  })

  const getData = useCallback(
    async (abortController: AbortController, id: string) => {
      setLoading(true)
      OrderApi.getOrderById(+id, abortController).then(
        async (response: any) => {
          // redirect if lab user try to edit order
          if (
            (isLabUser && !isView && !response.data.isSelf) ||
            response.data.status == OrderStatus.DONE
          ) {
            navigate(`/orders/${params.id}?view=true`, { replace: true })
          }

          setData((data: any) => ({ ...data, ...response.data }))

          const samplingAct = response.data.samplingAct

          if (samplingAct) {
            setActDetail({ ...samplingAct })
          }
          setLoading(false)
        },
      )
    },
    [],
  )
  useEffect(() => {
    const abortController = new AbortController()
    if (Number.isNaN(Number.parseInt(params?.id || ''))) {
      navigate(`/orders`, {
        replace: true,
      })
    }

    if (params.id) {
      dispatch({ type: 'set', order: `${params.id}` })
      getData(abortController, params.id)
    }
    return () => {
      abortController.abort()
    }
  }, [params.id, getData])

  useEffect(() => {
    const abortController = new AbortController()

    return () => {
      abortController.abort()
    }
  }, [companyGlobalState.id])

  const abortControllerGlobal = useMemo(() => new AbortController(), [])

  useEffect(() => {
    return () => {
      abortControllerGlobal.abort()
    }
  }, [])

  function sendButtonStyle(value: string | null) {
    if (value) {
      setButtonStyle({
        ...buttonStyle,
        backgroundColor: '#747DEA',
        color: '#fff',
      })
    } else {
      setButtonStyle({
        ...buttonStyle,
        backgroundColor: '#F1F4F7',
        color: '#414141',
      })
    }
  }

  const handleChange = (name: string, e: any) => {
    setData({ ...data, [name]: e.target?.value ?? e })
  }

  const handleChangeActDetail = (key: any, e: any) => {
    setActDetail({ ...actDetail, [key]: e.target?.value ?? e })
  }

  const filterObjects = (value: string) => {
    console.log(objectsList, filteredObjects)
    const filtered = objectsList?.filter(
      (i: any) => i.name.toLowerCase().indexOf(value.toLowerCase()) > -1,
    )
    console.log(filtered)
    setFilteredObjects(filtered)
  }

  const compareObjects = (value: string) => {
    return objectsList.some((item: any) => item.name == value)
  }

  const handleSubmit = () => {
    if (!data) return
    let dateProcess = null
    if (data.date_process) {
      dateProcess = new Date(data.date_process)
      setShowDate(dateProcess?.toISOString())
      dateProcess.setDate(dateProcess.getDate() + 1)
    }

    let testDate = null
    if (data.testDate) {
      testDate = new Date(data.testDate)
      setShowDate(testDate?.toISOString())
      testDate.setDate(testDate.getDate() + 1)
    }

    const sendData = {
      ...data,
    }

    sendData.researchObjects.companyId = companyGlobalState.id
    console.log(data, sendData)
  }

  const user = data?.user
  const userResponsible = data?.responsibleUser
  const actNumber = data?.id

  function DateShow({ date, onDateChange }: any) {
    return (
      <CDatePicker
        placeholder={'Выберите дату'}
        style={{
          width: '60%',
        }}
        locale="ru-RU"
        onDateChange={(e: any) => {
          onDateChange(e)
        }}
        date={date}
        weekdayFormat={1}
      />
    )
  }

  console.log(data, '<<<<<======= INI ADALAH DATA')

  const contentModal = (
    <>
      <div
        style={{
          marginTop: '2%',
        }}
      >
        <CFormInput
          type="text"
          placeholder={'Введите название документа' as any}
          value={formUpload.name}
          onChange={(e: any) => {
            setFormUpload((prev) => ({
              ...prev,
              name: e.target.value,
            }))
          }}
        />
      </div>
      <div
        style={{
          marginTop: '1.5rem',
        }}
      >
        <CFormInput
          onChange={(e: any) =>
            setFormUpload((prev) => ({
              ...prev,
              name: e.target?.files[0]?.name?.split('.').slice(0, -1).join('.'),
              file: e.target?.files?.item(0),
            }))
          }
          type="file"
        />
      </div>
    </>
  )

  const uploadDocuments = () => {
    if (formUpload.file) {
      setLoading(true)
      const abortController = new AbortController()
      DocumentsApi.create(
        {
          orderId: +params.id!,
          name: formUpload.name ?? 'Документ',
        },
        formUpload.file,
      )
        .then((res: any) => {
          dispatch({
            type: 'toast',
            toast: {
              message: 'Сопроводительный документ успешно добавлен',
              status: res.status,
            },
          })
          getData(abortController, params.id!)
          setFormUpload({})
        })
        .catch((res) => {
          dispatch({
            type: 'toast',
            toast: {
              message: 'Произошла ошибка загрузки документа, попробуйте позже',
              status: res.status,
            },
          })
        })
        .finally(() => setLoading(false))
    }
  }

  return loading ? (
    <div className="loading_spinner">
      <CSpinner />
    </div>
  ) : (
    <>
      <div
        style={{ maxWidth: visible ? '700px' : '' }}
        onClick={(e: any) => {
          if (e.target !== objectsInput.current && !isView) {
            objects.current.style.display = 'none'
          }
          if (
            e.target !== employees.current &&
            e.target !== employeesInput.current &&
            !isView &&
            employees.current
          ) {
            employees.current.style.display = 'none'
          }
        }}
      >
        <CRow>
          <CCard className="px-0">
            <CCardHeader>
              <div>
                Заявка №{data?.id} от {getDateV1(data?.createdAt)}г.
              </div>
            </CCardHeader>
            <CCardBody
              style={{
                padding: '6rem 4rem',
              }}
            >
              <CCol
                ref={firstSectionRef}
                style={{
                  wordBreak: 'break-word',
                }}
              >
                <CForm>
                  {/* UPPER INFO BORDER */}
                  <div
                    className="avoid-break-inside"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div
                      style={{
                        flex: 2,
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          paddingTop: '2px',
                        }}
                      >
                        <CFormLabel
                          style={{
                            flex: 1,
                          }}
                        >
                          Контрагент:{' '}
                        </CFormLabel>
                        <CFormLabel
                          style={{
                            flex: 2,
                            color: 'black',
                            fontWeight: 'bold',
                          }}
                        >
                          {data?.user
                            ? `${data?.user?.company?.legalForm} «${data?.user?.company?.name}»`
                            : '-'}
                        </CFormLabel>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          paddingTop: '2px',
                        }}
                      >
                        <CFormLabel
                          style={{
                            flex: 1,
                          }}
                        >
                          Заявку составил:{' '}
                        </CFormLabel>
                        <CFormLabel
                          style={{
                            flex: 2,
                            color: 'black',
                            fontWeight: 'bold',
                          }}
                        >
                          {user
                            ? `${user?.surname} ${user?.name[0]}.${
                                user.lastName ? `${user?.lastName[0]}.` : ''
                              }`
                            : ''}
                        </CFormLabel>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                        }}
                      >
                        <CFormLabel
                          style={{
                            flex: 1,
                          }}
                        >
                          Телефон составителя:{' '}
                        </CFormLabel>
                        <CFormLabel
                          style={{
                            flex: 2,
                            color: 'black',
                            fontWeight: 'bold',
                          }}
                        >
                          {user.phone[0] == '8' ||
                          user.phone[0] == '+' ||
                          user.phone[0] == '2' ||
                          user.phone == ''
                            ? user.phone
                            : `+${user.phone}`}
                        </CFormLabel>
                      </div>
                      <div style={{ display: 'flex' }}>
                        <div
                          style={{
                            flex: 1,
                          }}
                        >
                          <p>Ответственный:</p>
                        </div>
                        <div
                          style={{
                            flex: 2,
                            color: 'black',
                            fontWeight: 'bold',
                          }}
                        >
                          <p>
                            {userResponsible?.name
                              ? `${userResponsible?.surname} ${userResponsible?.name[0]}.${userResponsible?.lastName[0]}.`
                              : 'Не заполнено'}
                          </p>
                        </div>
                      </div>
                      <div style={{ display: 'flex' }}>
                        <div
                          style={{
                            // width: '200px',
                            flex: 1,
                          }}
                        >
                          <p>Телефон исполнителя:</p>
                        </div>
                        <div
                          style={{
                            flex: 2,
                            color: 'black',
                            fontWeight: 'bold',
                          }}
                        >
                          <p>
                            {
                              userResponsible?.phone
                                ? phoneNumber(userResponsible.phone)
                                : 'Не заполнено'
                              /* userResponsible?.phone?.indexOf('+') > -1 ||
                            userResponsible?.phone[0] == '8'
                              ? userResponsible?.phone
                              : `+${userResponsible?.phone}` */
                            }
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        fontSize: '16px',
                        color: 'black',
                        textAlign: 'end',
                        flex: 1,
                      }}
                    >
                      <p>
                        Генеральному директору
                        <br />
                        {labInfo?.legalForm + ' ' + labInfo?.name}
                        <br />
                        {`${labInfo.owner?.surname} ${labInfo.owner?.name?.[0]}. ${labInfo.owner?.lastName?.[0]}.`}
                      </p>
                    </div>
                  </div>
                  {/* HERE IT SHOWS IF VIEW IS TRUE */}
                  {isView ? (
                    <>
                      <div className="avoid-break-inside">
                        <div
                          style={{
                            margin: '0 auto',
                            width: '360px',
                            fontSize: '16px',
                            color: 'black',
                            textAlign: 'center',
                            fontWeight: 'bold',
                          }}
                        >
                          <p style={{}}>
                            Заявка № {data?.id} от {getDateV1(data?.createdAt)}
                            г.
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                  {/* UPPER INFO BORDER */}
                  <div
                    style={{
                      paddingTop: '40px',
                      paddingBottom: '40px',
                    }}
                  >
                    <p>
                      Прошу провести испытания по ниже указанным параметрам:
                    </p>
                  </div>
                  <div
                    className="avoid-break-inside"
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                    }}
                  >
                    <CFormLabel
                      style={{
                        width: '40%',
                      }}
                    >
                      Дата проведения испытаний:{' '}
                    </CFormLabel>
                    {isView ? (
                      <CFormLabel
                        style={{
                          width: '60%',
                        }}
                      >
                        {data.testDate
                          ? getDateV1(data?.testDate)
                          : 'Не выбрано'}
                      </CFormLabel>
                    ) : (
                      <DateShow
                        date={data?.testDate}
                        onDateChange={(e: any) => {
                          if (!e) {
                            setData({
                              ...data,
                              testDate: null,
                            })
                            return
                          }
                          const date = e.setMinutes(
                            e.getMinutes() - new Date().getTimezoneOffset(),
                          )
                          setData({
                            ...data,
                            testDate: date,
                          })
                        }}
                      />
                    )}
                  </div>
                  <div
                    className="avoid-break-inside"
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      paddingTop: '2%',
                    }}
                  >
                    <CFormLabel
                      style={{
                        width: '40%',
                      }}
                    >
                      Время проведения испытаний:{' '}
                    </CFormLabel>
                    {isView ? (
                      <CFormLabel
                        style={{
                          width: '60%',
                        }}
                      >
                        {data?.testTime ?? 'Не выбрано'}
                      </CFormLabel>
                    ) : (
                      <CTimePicker
                        seconds={false}
                        placeholder="17:00"
                        style={{
                          width: '60%',
                        }}
                        locale="ru-RU"
                        time={data?.testTime}
                        onTimeChange={(e: any) => {
                          const getTime = e.split(/[ ,:]/g)

                          setData({
                            ...data,
                            testTime: `${getTime[0]}:${getTime[1]}`,
                          })
                        }}
                      />
                    )}
                  </div>

                  <div
                    className="avoid-break-inside"
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      paddingTop: '2%',
                    }}
                  >
                    <CFormLabel
                      style={{
                        width: '40%',
                      }}
                    >
                      Виды работ:
                    </CFormLabel>
                    {isView ? (
                      <CFormLabel
                        style={{
                          width: '60%',
                        }}
                      >
                        {data?.typeJob || 'Не выбрано'}
                      </CFormLabel>
                    ) : (
                      <CFormInput
                        type="text"
                        placeholder={'введите виды работ' as any}
                        style={{
                          width: '60%',
                        }}
                        value={data?.typeJob}
                        onChange={(e: any) => {
                          handleChange('typeJob', e)
                        }}
                      />
                    )}
                  </div>
                  <div
                    className="avoid-break-inside"
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      paddingTop: '2%',
                      position: 'relative',
                    }}
                  >
                    <CFormLabel
                      style={{
                        width: '40%',
                      }}
                    >
                      Объект строительства:
                    </CFormLabel>
                    {isView ? (
                      <CFormLabel
                        style={{
                          width: '60%',
                        }}
                      >
                        {data?.researchObjects
                          ? data?.researchObjects?.name
                          : 'Не выбрано'}
                      </CFormLabel>
                    ) : (
                      // <CFormInput
                      //   type="text"
                      //   placeholder={'введите объект строительства' as any}
                      //   style={{
                      //     width: '60%',
                      //   }}
                      //   value={data?.researchObjects.name}
                      //   onChange={(e: any) => {
                      //     // setDataAct({ ...dataAct, objectName: e.target.value })
                      //     /* handleChange('object_name', e) */
                      //     setData({
                      //       ...data,
                      //       researchObjects: {
                      //         ...data.researchObjects,
                      //         name: e.target.value,
                      //       },
                      //     })
                      //   }}
                      // />
                      <>
                        <CFormInput
                          type="text"
                          placeholder={'введите объект строительства' as any}
                          style={{
                            width: '60%',
                          }}
                          ref={objectsInput}
                          value={data.researchObjects?.name}
                          onChange={(e: any) => {
                            /* setDataAct({ ...dataAct, objectName: e.target.value }) */
                            setData({
                              ...data,
                              researchObjects: {
                                name: e.target.value,
                              },
                            })
                            filterObjects(e.target.value)
                            objects.current.style.display = 'block'
                            setIsNewObject(!compareObjects(e.target.value))
                          }}
                          onFocus={() => {
                            objects.current.style.display = 'block'
                          }}
                        />
                        <div
                          ref={objects}
                          style={{
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            width: '60%',
                            height: 300,
                            display: 'none',
                          }}
                        >
                          <CListGroup className="input-list">
                            {filteredObjects.length
                              ? filteredObjects.map((i: any, index: number) => (
                                  <CListGroupItem
                                    onClick={(e: any) => {
                                      console.log(i)
                                      /* setDataAct({
                                        ...dataAct,
                                        researchObjects.name: e.target.textContent,
                                      }) */
                                      setData({
                                        ...data,
                                        researchObjects: {
                                          name: e.target.textContent,
                                        },
                                      })
                                      setIsNewObject(false)
                                      objects.current.style.display = 'none'
                                    }}
                                    style={{
                                      listStyleType: 'none',
                                      cursor: 'pointer',
                                    }}
                                    key={index}
                                    tabIndex={0}
                                    onKeyDown={(e: any) => {
                                      if (e.keyCode == 13) {
                                        setData({
                                          ...data,
                                          researchObjects: {
                                            name: e.target.textContent,
                                          },
                                        })
                                        objects.current.style.display = 'none'
                                        setIsNewObject(false)
                                      }
                                    }}
                                  >
                                    {i.name}
                                  </CListGroupItem>
                                ))
                              : null}
                          </CListGroup>
                        </div>
                      </>
                    )}
                  </div>
                  <div
                    className="avoid-break-inside"
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      paddingTop: '2%',
                    }}
                  >
                    <CFormLabel
                      style={{
                        width: '40%',
                      }}
                    >
                      Объект контроля:
                    </CFormLabel>
                    {isView ? (
                      <CFormLabel
                        style={{
                          width: '60%',
                        }}
                      >
                        {data?.objectControl || 'Не выбрано'}
                      </CFormLabel>
                    ) : (
                      <CFormInput
                        type="text"
                        placeholder={'введите объект контроля' as any}
                        style={{
                          width: '60%',
                        }}
                        value={data?.objectControl}
                        onChange={(e: any) => {
                          // setDataAct({
                          //   ...dataAct,
                          //   objectOfControl: e.target.value,
                          // })
                          handleChange('objectControl', e)
                        }}
                      />
                    )}
                  </div>
                  <div
                    className="avoid-break-inside"
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      paddingTop: '2%',
                    }}
                  >
                    <CFormLabel
                      style={{
                        width: '40%',
                      }}
                    >
                      Место отбора проб:
                    </CFormLabel>
                    {isView ? (
                      <CFormLabel
                        style={{
                          width: '60%',
                        }}
                      >
                        {data?.samplingLocation || 'Не выбрано'}
                      </CFormLabel>
                    ) : (
                      <CFormInput
                        type="text"
                        placeholder={'введите место отбора проб' as any}
                        style={{
                          width: '60%',
                        }}
                        value={data?.samplingLocation}
                        onChange={(e: any) => {
                          // setDataAct({
                          //   ...dataAct,
                          //   samplingLocation: e.target.value,
                          // })
                          handleChange('samplingLocation', e)
                        }}
                      />
                    )}
                  </div>
                  <div
                    className="avoid-break-inside"
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      paddingTop: '2%',
                    }}
                  >
                    <CFormLabel
                      style={{
                        width: '40%',
                      }}
                    >
                      Проект:
                    </CFormLabel>
                    {isView ? (
                      <CFormLabel
                        style={{
                          width: '60%',
                        }}
                      >
                        {data?.name || 'Не выбрано'}
                      </CFormLabel>
                    ) : (
                      <CFormInput
                        type="text"
                        placeholder={'введите наименование проекта' as any}
                        style={{
                          width: '60%',
                        }}
                        value={data?.name}
                        onChange={(e: any) => {
                          handleChange('name', e)
                        }}
                      />
                    )}
                  </div>
                  <div
                    className="avoid-break-inside"
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      paddingTop: '2%',
                    }}
                  >
                    <CFormLabel
                      style={{
                        width: '40%',
                      }}
                    >
                      Краткая информация:
                    </CFormLabel>
                    {isView ? (
                      <CFormLabel
                        style={{
                          width: '60%',
                        }}
                      >
                        {data?.description || 'Не выбрано'}
                      </CFormLabel>
                    ) : (
                      <CFormTextarea
                        id="info"
                        rows={data?.description?.split('\n').length}
                        placeholder={
                          'Введите: Класс прочности бетона; Материал; Тип грунта; и т.д.' as any
                        }
                        style={{
                          width: '60%',
                        }}
                        value={data?.description}
                        onChange={(e: any) => {
                          handleChange('description', e)
                        }}
                      />
                    )}
                  </div>
                  <div
                    {...(!actNumber ? { 'data-html2canvas-ignore': true } : {})}
                    style={{
                      /* display: 'flex', */
                      justifyContent: 'space-between',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        marginTop: '10px',
                        width: '500px',
                      }}
                    >
                      {actDetail.id ? (
                        <>
                          <CFormLabel
                            style={{
                              width: '200px',
                              color: 'black',
                              fontWeight: 'bold',
                            }}
                          >
                            Приложение:
                          </CFormLabel>
                          <CFormLabel
                            style={{
                              width: '300px',
                              color: 'black',
                              fontWeight: 'bold',
                            }}
                          >
                            Акт отбора проб № {actDetail?.id ?? '-'}
                          </CFormLabel>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                  {firstSectionCompleteDownload || firstSectionCompletePrint ? (
                    <div className="sign-section">
                      <div
                        style={{
                          display: 'flex',
                          paddingTop: '6rem',
                        }}
                      >
                        <div
                          className="auto-page-break-stop-recursive"
                          style={{
                            flex: 1,
                          }}
                        >
                          <span>Фамилия</span>
                          <span>{'_'.repeat(20)}</span>
                        </div>
                        <div
                          className="auto-page-break-stop-recursive"
                          style={{
                            flex: 1,
                            display: 'flex',
                            justifyContent: 'end',
                            flexDirection: 'row',
                          }}
                        >
                          <span>Подпись</span>
                          <span>{'_'.repeat(20)}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    ''
                  )}
                </CForm>
              </CCol>
            </CCardBody>

            <div className="d-grid gap-2 d-md-flex justify-content-md-end mb-2">
              <CButton
                color="danger"
                className="me-md-2"
                onClick={handleFirstSectionPrint}
              >
                Печать
              </CButton>
              <CButton color="danger" onClick={handleFirstSectionDownload}>
                Скачать
              </CButton>
            </div>
          </CCard>
          {/* THIRD CARD */}
          {actDetail.id || !isView ? (
            <CCard className="mt-4 px-0">
              <CCardHeader>
                <div>Акт отбора проб № {actDetail?.id}</div>
              </CCardHeader>
              <CCardBody
                style={{
                  padding: '4rem 4rem',
                }}
              >
                <CCol
                  ref={documentRef}
                  style={{
                    wordBreak: 'break-word',
                  }}
                >
                  <CForm
                    onSubmit={(e) => {
                      e.preventDefault()
                    }}
                    style={{
                      wordBreak: 'break-word',
                    }}
                  >
                    {/* UPPER INFO BORDER */}
                    {isView ? (
                      <div>
                        <div
                          style={{
                            margin: '0 auto',
                            width: '200px',
                            fontSize: '16px',
                            color: 'black',
                            textAlign: 'center',
                            fontWeight: 'bold',
                          }}
                        >
                          <p>Акт отбора проб № {actDetail?.id}</p>
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                      }}
                    >
                      <CFormLabel
                        style={{
                          width: '40%',
                        }}
                      >
                        Наименование организации:{' '}
                      </CFormLabel>
                      {isView ? (
                        <CFormLabel
                          style={{
                            width: '60%',
                          }}
                        >
                          {data?.user?.company?.name || 'Не выбрано'}
                        </CFormLabel>
                      ) : (
                        <CFormInput
                          type="text"
                          placeholder={'ООО "БТС-МОСТ' as any}
                          style={{
                            width: '60%',
                          }}
                          value={data?.user?.company?.name}
                          disabled={true}
                          /* onChange={(e: any) => {
                            handleChangeActDetail('nameOfCompany', e)
                          }} */
                        />
                      )}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        paddingTop: '2%',
                      }}
                    >
                      <CFormLabel
                        style={{
                          width: '40%',
                        }}
                      >
                        Наименование объекта:
                      </CFormLabel>
                      {isView ? (
                        <CFormLabel
                          style={{
                            width: '60%',
                          }}
                        >
                          {data?.researchObjects
                            ? data?.researchObjects?.name
                            : 'Не выбрано'}
                        </CFormLabel>
                      ) : (
                        <CFormInput
                          type="text"
                          placeholder={'Автоматически' as any}
                          style={{
                            width: '60%',
                          }} //setDataAct
                          value={
                            data?.researchObjects
                              ? data?.researchObjects?.name
                              : 'Не выбрано'
                          }
                          disabled={true}
                          /* onChange={(e: any) => {
                            handleChangeActDetail('objectName', e)
                          }} */
                        />
                      )}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        paddingTop: '2%',
                      }}
                    >
                      <CFormLabel
                        style={{
                          width: '40%',
                        }}
                      >
                        Место отбора проб:
                      </CFormLabel>
                      {isView ? (
                        <CFormLabel
                          style={{
                            width: '60%',
                          }}
                        >
                          {data?.samplingLocation || 'Не выбрано'}
                        </CFormLabel>
                      ) : (
                        <CFormInput
                          type="text"
                          placeholder={'Автоматически' as any}
                          style={{
                            width: '60%',
                          }}
                          value={data?.samplingLocation}
                          disabled={true}
                          /* onChange={(e: any) => {
                            handleChangeActDetail('samplingLocation', e)
                          }} */
                        />
                      )}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        paddingTop: '2%',
                      }}
                    >
                      <CFormLabel
                        style={{
                          width: '40%',
                        }}
                      >
                        Объект контроля:
                      </CFormLabel>
                      {isView ? (
                        <CFormLabel
                          style={{
                            width: '60%',
                          }}
                        >
                          {data?.objectControl || 'Не выбрано'}
                        </CFormLabel>
                      ) : (
                        <CFormInput
                          type="text"
                          placeholder={'Автоматически' as any}
                          style={{
                            width: '60%',
                          }}
                          value={data?.objectControl}
                          disabled={true}
                          /* onChange={(e: any) => {
                            handleChangeActDetail('objectOfControl', e)
                          }} */
                        />
                      )}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        paddingTop: '2%',
                      }}
                    >
                      <CFormLabel
                        style={{
                          width: '40%',
                        }}
                      >
                        Дата отбора проб:
                      </CFormLabel>
                      {isView ? (
                        <CFormLabel
                          style={{
                            width: '60%',
                          }}
                        >
                          {getDateV1(actDetail?.samplingDate) || 'Не выбрано'}
                        </CFormLabel>
                      ) : (
                        <CDatePicker
                          required
                          placeholder={'Выберите дату'}
                          style={{
                            width: '60%',
                          }}
                          locale="ru-RU"
                          date={actDetail?.samplingDate}
                          onDateChange={(e: any) => {
                            if (!e) {
                              handleChangeActDetail('samplingDate', '')
                              return
                            }
                            const date = new Date(e)
                            date.setMinutes(
                              date.getMinutes() - e.getTimezoneOffset(),
                            )
                            handleChangeActDetail(
                              'samplingDate',
                              date?.toISOString(),
                            )
                          }}
                          weekdayFormat={1}
                        />
                      )}
                    </div>
                    {/* START */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        paddingTop: '2%',
                      }}
                    >
                      <CFormLabel
                        style={{
                          width: '40%',
                        }}
                      >
                        Время отбора проб:
                      </CFormLabel>
                      {isView ? (
                        <CFormLabel
                          style={{
                            width: '60%',
                          }}
                        >
                          {actDetail?.samplingTime || 'Не выбрано'}
                        </CFormLabel>
                      ) : (
                        <CTimePicker
                          seconds={false}
                          placeholder="Выберите время"
                          style={{
                            width: '60%',
                          }}
                          time={actDetail?.samplingTime ?? ''}
                          locale="ru-RU"
                          onTimeChange={(e: any) => {
                            const getTime = e.split(/[ ,:]/g)
                            handleChangeActDetail(
                              'samplingTime',
                              `${getTime[0]}:${getTime[1]}:${getTime[2]}`,
                            )
                          }}
                        />
                      )}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        paddingTop: '2%',
                      }}
                    >
                      <CFormLabel
                        style={{
                          width: '40%',
                        }}
                      >
                        Наименование материала:
                      </CFormLabel>
                      {isView ? (
                        <CFormLabel
                          style={{
                            width: '60%',
                          }}
                        >
                          {actDetail?.materialName || 'Не выбрано'}
                        </CFormLabel>
                      ) : (
                        <CFormInput
                          required
                          type="text"
                          placeholder={'введите наименование материала' as any}
                          style={{
                            width: '60%',
                          }}
                          value={actDetail?.materialName}
                          onChange={(e: any) => {
                            handleChangeActDetail('materialName', e)
                          }}
                        />
                      )}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        paddingTop: '2%',
                      }}
                    >
                      <CFormLabel
                        style={{
                          width: '40%',
                        }}
                      >
                        Количество образцов:
                      </CFormLabel>
                      {isView ? (
                        <CFormLabel
                          style={{
                            width: '40%',
                          }}
                        >
                          {actDetail?.samplingQuantity || 'Не выбрано'}
                        </CFormLabel>
                      ) : (
                        <CFormInput
                          type="string"
                          placeholder={'введите количество образцов' as any}
                          style={{
                            width: '60%',
                          }}
                          value={actDetail?.samplingQuantity}
                          onChange={(e: any) => {
                            handleChangeActDetail('samplingQuantity', e)
                          }}
                        />
                      )}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        paddingTop: '2%',
                      }}
                    >
                      <CFormLabel
                        style={{
                          width: '40%',
                        }}
                      >
                        Документ о качестве:
                      </CFormLabel>
                      {isView ? (
                        <CFormLabel
                          style={{
                            width: '60%',
                          }}
                        >
                          {actDetail?.qualityDocument || 'Не выбрано'}
                        </CFormLabel>
                      ) : (
                        <CFormInput
                          type="text"
                          placeholder={'введите № документа о качестве' as any}
                          style={{
                            width: '60%',
                          }}
                          value={actDetail?.qualityDocument}
                          onChange={(e: any) => {
                            handleChangeActDetail('qualityDocument', e)
                          }}
                        />
                      )}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        paddingTop: '2%',
                        position: 'relative',
                      }}
                    >
                      <CFormLabel
                        style={{
                          width: '40%',
                        }}
                      >
                        Ответственное лицо:
                      </CFormLabel>
                      {isView ? (
                        <CFormLabel
                          style={{
                            width: '60%',
                          }}
                        >
                          {actDetail?.respUser ?? 'Не выбрано'}
                        </CFormLabel>
                      ) : (
                        <>
                          <CFormInput
                            ref={employeesInput}
                            type="text"
                            placeholder={
                              'выберите ответственного сотрудника' as any
                            }
                            style={{
                              width: '60%',
                            }}
                            value={actDetail?.respUser}
                            onChange={(e: any) => {
                              handleChangeActDetail('respUser', e.target.value)
                            }}
                            /* onChange={(e: any) => {
                              setEmployeeName(e.target.value)
                              setFilteredEmployeesList(() =>
                                employeesList.filter((i: any) => {
                                  const employeeName = `${i.surname} ${i.name} ${i.lastName}`
                                  return (
                                    employeeName
                                      .toLowerCase()
                                      .indexOf(e.target.value.toLowerCase()) >
                                    -1
                                  )
                                }),
                              )

                              employees.current.style.display = 'block'
                            }} */
                            /* onFocus={() => {
                              employees.current.style.display = 'block'
                            }} */
                          />
                          {/* <div
                            ref={employees}
                            style={{
                              position: 'absolute',
                              right: 0,
                              width: '60%',
                              top: '100%',
                              display: 'none',
                            }}
                          >
                            <CListGroup className="input-list">
                              {filteredEmployeesList.length
                                ? filteredEmployeesList.map(
                                    (i: any, index: number) => (
                                      <CListGroupItem
                                        onClick={(e: any) => {
                                          console.log(i)
                                          setActDetail({
                                            ...actDetail,
                                            respCompUserId: i.id,
                                          })
                                          setEmployeeName(
                                            `${i.name} ${i.surname} ${i.lastName}`,
                                          )
                                          employees.current.style.display =
                                            'none'
                                        }}
                                        style={{
                                          listStyleType: 'none',
                                          cursor: 'pointer',
                                        }}
                                        key={index}
                                        tabIndex={0}
                                        onKeyDown={(e: any) => {
                                          if (e.keyCode == 13) {
                                            handleChangeActDetail(
                                              'respCompUserId',
                                              i.id,
                                            )
                                            setEmployeeName(
                                              `${i.name} ${i.surname} ${i.lastName}`,
                                            )
                                            employees.current.style.display =
                                              'none'
                                          }
                                        }}
                                      >
                                        {`${i.name} ${i.surname} ${i.lastName}`}
                                      </CListGroupItem>
                                    ),
                                  )
                                : null}
                            </CListGroup>
                          </div> */}
                        </>
                      )}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        paddingTop: '2%',
                      }}
                    >
                      <CFormLabel
                        style={{
                          width: '40%',
                        }}
                      >
                        Примечание:
                      </CFormLabel>
                      {isView ? (
                        <CFormLabel
                          style={{
                            width: '40%',
                          }}
                        >
                          {actDetail?.note || 'Не выбрано'}
                        </CFormLabel>
                      ) : (
                        <CFormInput
                          type="text"
                          placeholder={'введите примечания' as any}
                          style={{
                            width: '60%',
                          }}
                          value={actDetail?.note}
                          onChange={(e: any) => {
                            handleChangeActDetail('note', e)
                          }}
                        />
                      )}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        paddingTop: '2%',
                      }}
                    >
                      <CFormLabel
                        style={{
                          width: '40%',
                        }}
                      >
                        Условия окружающей среды:
                      </CFormLabel>
                      {isView ? (
                        <CFormLabel
                          style={{
                            width: '40%',
                            whiteSpace: 'normal',
                          }}
                        >
                          {actDetail?.environmental || 'Не выбрано'}
                        </CFormLabel>
                      ) : (
                        <CFormInput
                          type="text"
                          placeholder={
                            'введите условия окружающей среды' as any
                          }
                          style={{
                            width: '60%',
                          }}
                          value={actDetail?.environmental}
                          onChange={(e: any) => {
                            handleChangeActDetail('environmental', e)
                          }}
                        />
                      )}
                    </div>
                    {documentRefCompletePrint || documentRefCompleteDownload ? (
                      <div id="sign-section-act">
                        <div
                          style={{
                            display: 'flex',
                            paddingTop: '6rem',
                          }}
                        >
                          <div
                            style={{
                              flex: 1,
                            }}
                          >
                            <span>Фамилия</span>
                            <span>{'_'.repeat(20)}</span>
                          </div>
                          <div
                            style={{
                              flex: 1,
                              display: 'flex',
                              justifyContent: 'end',
                              flexDirection: 'row',
                            }}
                          >
                            <span>Подпись</span>
                            <span>{'_'.repeat(20)}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      ''
                    )}
                  </CForm>
                </CCol>
              </CCardBody>
              <div className="d-grid gap-2 d-md-flex justify-content-md-end mb-2">
                <CButton
                  color="danger"
                  className="me-md-2"
                  onClick={handleDocumentPrint}
                >
                  Печать
                </CButton>
                <CButton color="danger" onClick={handleDocumentDownload}>
                  Скачать
                </CButton>
              </div>
            </CCard>
          ) : (
            <></>
          )}
          {/* FOURTH CARD */}
          <CCard className="mt-4 px-0">
            <CCardHeader>
              <div>Сопроводительные документы к заявке</div>
            </CCardHeader>
            <CCardBody
              style={{
                padding: '4rem 4rem',
              }}
            >
              <CCol>
                <CForm>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      marginBottom: '20px',
                    }}
                  >
                    {data.documents?.map((el: any, i: number) => {
                      return (
                        <div
                          style={{
                            flex: '0 0 33.33%',
                            display: 'flex',
                            padding: '1rem',
                            cursor: el.file ? 'pointer' : 'not-allowed',
                          }}
                          key={i}
                          className="mt-2"
                          onClick={() => {
                            const file = el.file?.url
                            if (
                              file &&
                              (file?.includes('.pdf') ||
                                file?.includes('.jpg') ||
                                file?.includes('.jpeg') ||
                                file?.includes('.bmp') ||
                                file?.includes('.png'))
                            ) {
                              navigate(
                                `/orders/document/${el.id}/${data.id}?name=${el.name}`,
                              )
                            }
                          }}
                        >
                          <div
                            style={{
                              flex: '0 0 100%',
                            }}
                          >
                            <CCard
                              style={{
                                width: '288px',
                                height: '100%',
                              }}
                            >
                              <img
                                style={{ height: '150px' }}
                                alt={el.name}
                                src={
                                  getImagePlaceholderFromMime(el.file?.url) ??
                                  null
                                }
                              />
                              <CCardBody>
                                <CCardTitle>{el.name}</CCardTitle>
                                {el.createdAt ? (
                                  <CCardText>{setTime(el.createdAt)}</CCardText>
                                ) : (
                                  <></>
                                )}
                              </CCardBody>
                            </CCard>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CForm>
              </CCol>
            </CCardBody>
          </CCard>
          {/* SECOND CARD */}
          <CCard className="mt-4 px-0">
            <CCardHeader>
              <div>Комментарии к заявке</div>
            </CCardHeader>
            <CCardBody
              style={{
                padding: '4rem 4rem',
              }}
            >
              <CCol
                ref={commentRef}
                style={{
                  wordBreak: 'break-word',
                }}
              >
                <CForm>
                  {/* UPPER INFO BORDER */}
                  {isView ? (
                    <div>
                      <div
                        className="avoid-break-inside"
                        style={{
                          margin: '0 auto',
                          width: '250px',
                          fontSize: '16px',
                          color: 'black',
                          textAlign: 'center',
                          fontWeight: 'bold',
                        }}
                      >
                        <p style={{}}>Комментарии к заявке № {data?.id}</p>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                  <div>
                    {data?.comments?.length ? (
                      <div>
                        {data?.comments?.map((e: any, i: number) => {
                          const { user, createdAt } = e
                          const { surname, name, lastName } =
                            user ?? emptyCommentator

                          return (
                            <div
                              key={i}
                              style={{
                                display: 'flex',
                                flexDirection: 'row',
                                marginBottom: '0.7rem',
                              }}
                              className="auto-page-break-stop-recursive avoid-break-inside"
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  width: '25%',
                                }}
                              >
                                {/* <CFormLabel> */}
                                <div
                                  style={{
                                    marginBottom: '0.5rem',
                                    width: '590px',
                                  }}
                                >
                                  {surname} {name[0]}. {lastName[0]}. :
                                </div>
                                {/* </CFormLabel> */}
                                <div
                                  style={{
                                    width: '300px',
                                    color: 'GrayText',
                                    fontSize: '12px',
                                    marginBottom: '0.5rem',
                                  }}
                                >
                                  {setTimeV2(e.createdAt)}
                                </div>
                              </div>
                              <div
                                style={{
                                  wordWrap: 'break-word',
                                  whiteSpace: 'pre-wrap',
                                  wordBreak: 'break-word',
                                  width: '75%',
                                }}
                              >
                                {e?.text}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>

                  <div data-html2canvas-ignore>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'end',
                        marginTop: '2rem',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          width: '590px',
                        }}
                      ></div>
                      {/* //FIELD BAR */}
                      <div style={{ width: '100%', padding: '0 1rem' }}>
                        <CFormTextarea
                          id="info"
                          rows={data?.comment?.split('\n').length}
                          placeholder={
                            'Введите: Класс прочности бетона; Материал; Тип грунта; и т.д.' as any
                          }
                          style={{
                            width: '100%',
                          }}
                          value={data?.comment}
                          onChange={(e: any) => {
                            setDataComment({
                              text: e?.target?.value,
                              orderId: params.id,
                              userId: dataUser.id,
                            })
                            sendButtonStyle(e?.target?.value)
                          }}
                        />
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'right',
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* BUTTOM BORDER */}
                  </div>
                </CForm>
              </CCol>
            </CCardBody>

            <div className="d-grid gap-2 d-md-flex justify-content-md-end mb-2">
              <CButton
                color="danger"
                className="me-md-2"
                onClick={handleCommentPrint}
              >
                Печать
              </CButton>
              <CButton color="danger" onClick={handleCommentDownload}>
                Скачать
              </CButton>
            </div>
          </CCard>
          {/* PROTOCOL CARD */}
          {data?.protocols?.length ? (
            <CCard className="mt-4 px-0">
              <CCardHeader>
                <div>Зарегистрированные протоколы заявки</div>
              </CCardHeader>
              <CCardBody
                style={{
                  padding: '4rem 4rem',
                }}
              >
                <CCol>
                  <CForm>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        marginBottom: '20px',
                      }}
                    >
                      {data?.protocols
                        ?.filter((i: any) => i.registered)
                        .map((el: any, i: number) => {
                          return (
                            <div
                              key={i}
                              style={{
                                flex: '0 0 33.33%',
                                display: 'flex',
                                padding: '1rem',
                                cursor:
                                  el.file || el.isCustom
                                    ? 'pointer'
                                    : 'not-allowed',
                              }}
                              className="mt-2 card-protocol"
                              onClick={() => {
                                const file = el.file?.url
                                console.log(el)
                                if (
                                  file &&
                                  (file?.includes('.pdf') ||
                                    file?.includes('.jpg') ||
                                    file?.includes('.jpeg') ||
                                    file?.includes('.bmp') ||
                                    file?.includes('.png'))
                                ) {
                                  navigate(
                                    `/protocol/${data?.id}/${el.id}?name=${el.name}`,
                                  )
                                } else if (el.isCustom) {
                                  navigate(
                                    `/orders/${params.id}/custom-protocol/${el.id}?view=true?name=${el.number}`,
                                  )
                                }
                              }}
                            >
                              <div
                                style={{
                                  flex: '0 0 100%',
                                }}
                              >
                                <CCard
                                  style={{
                                    width: '288px',
                                    height: '100%',
                                  }}
                                >
                                  <img
                                    style={{ height: '150px' }}
                                    alt={el?.name}
                                    src={getImagePlaceholderFromMime(
                                      el?.file?.url,
                                    )}
                                  />
                                  <CCardBody>
                                    <CCardTitle>
                                      {el.isCustom
                                        ? `Протокол ${
                                            el.number ? `№ ${el.number}` : ''
                                          }`
                                        : el?.name}
                                    </CCardTitle>
                                    {el.createdAt ? (
                                      <CCardText>
                                        {setTime(el.createdAt)}
                                      </CCardText>
                                    ) : (
                                      <></>
                                    )}
                                  </CCardBody>
                                </CCard>
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  </CForm>
                </CCol>
              </CCardBody>
            </CCard>
          ) : (
            <></>
          )}
          {data.protocols.find((protocol: any) => !protocol.registered) ? (
            <CCard className="mt-4 px-0">
              <CCardHeader>
                <div>Незарегистрированные протоколы заявки</div>
              </CCardHeader>
              <CCardBody
                style={{
                  padding: '4rem 4rem',
                }}
              >
                <CCol>
                  <CForm>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        marginBottom: '20px',
                      }}
                    >
                      {data?.protocols
                        ?.filter((i: any) => !i.registered)
                        .map((el: any, i: number) => {
                          return (
                            <div
                              key={i}
                              style={{
                                flex: '0 0 33.33%',
                                display: 'flex',
                                padding: '1rem',
                                cursor:
                                  el.file || el.isCustom
                                    ? 'pointer'
                                    : 'not-allowed',
                              }}
                              className="mt-2 card-protocol"
                              onClick={() => {
                                const file = el.file?.url
                                console.log(el)
                                /* if (
                                  file &&
                                  (file?.includes('.pdf') ||
                                    file?.includes('.jpg') ||
                                    file?.includes('.jpeg') ||
                                    file?.includes('.bmp') ||
                                    file?.includes('.png'))
                                ) {
                                  navigate(
                                    `/protocol/${data?.id}/${el.id}?name=${el.name}`,
                                  )
                                } else  */
                                if (isLabUser) {
                                  if (el.isCustom) {
                                    navigate(
                                      `/orders/${params.id}/custom-protocol/${el.id}`,
                                    )
                                  }
                                }
                              }}
                            >
                              <div
                                style={{
                                  flex: '0 0 100%',
                                }}
                              >
                                <CCard
                                  style={{
                                    width: '288px',
                                    height: '100%',
                                  }}
                                >
                                  <img
                                    style={{ height: '150px' }}
                                    alt={el?.name}
                                    src={getImagePlaceholderFromMime(
                                      el?.file?.url,
                                    )}
                                  />
                                  <CCardBody>
                                    <CCardTitle>Протокол</CCardTitle>
                                    {el.createdAt ? (
                                      <CCardText>
                                        {setTime(el.createdAt)}
                                      </CCardText>
                                    ) : (
                                      <></>
                                    )}
                                  </CCardBody>
                                </CCard>
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  </CForm>
                </CCol>
              </CCardBody>
            </CCard>
          ) : null}
          {/* В РАБОТУ */}
          {!isCompany &&
          (data?.status == OrderStatus.NEW ||
            data?.status == OrderStatus.WIP) ? (
            <div className="mt-4 p-0">
              <CAlert
                color="danger"
                dismissible
                visible={!!alertGoToAddObject}
                onClose={() => setAlertGoToAddObject(null)}
              >
                {alertGoToAddObject}
              </CAlert>
              <CCard className="px-0">
                <CCardHeader>
                  <div>
                    {!data?.responsibleUser
                      ? 'Добавить в работу'
                      : 'Добавить протокол'}
                  </div>
                </CCardHeader>
                <CCardBody
                  style={{
                    padding: '4rem 4rem',
                  }}
                >
                  <CCol>
                    <CForm>
                      {/* UPPER INFO BORDER */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          paddingTop: '2%',
                        }}
                      >
                        <CFormLabel
                          style={{
                            width: '40%',
                          }}
                        >
                          Ответственный:
                        </CFormLabel>
                        <CFormSelect
                          aria-label="Default select example"
                          style={{
                            width: '60%',
                          }}
                          value={data?.responsibleUserId}
                        >
                          {data.status == OrderStatus.NEW ? (
                            <option value="default">
                              Назначить ответственного
                            </option>
                          ) : null}
                          {employeesList.map((e: any, i: number) => {
                            return (
                              <option key={e.id} value={e.id}>
                                {e.surname} {e.name} {e.lastName}
                              </option>
                            )
                          })}
                        </CFormSelect>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          paddingTop: '2%',
                        }}
                      >
                        <CFormLabel
                          style={{
                            width: '40%',
                          }}
                        >
                          Дата проведения испытаний:
                        </CFormLabel>

                        <DateShow
                          date={data?.testDate}
                          onDateChange={(e: Date) => {
                            if (!e) {
                              setData({
                                ...data,
                                testDate: null,
                              })
                              return
                            }
                            const date = e.setMinutes(
                              e.getMinutes() - new Date().getTimezoneOffset(),
                            )
                          }}
                        />
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'end',
                        }}
                      ></div>
                    </CForm>
                  </CCol>
                </CCardBody>
              </CCard>
            </div>
          ) : (
            <></>
          )}
        </CRow>
      </div>
    </>
  )
}

export default OrderDetail
