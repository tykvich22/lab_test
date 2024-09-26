/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/rules-of-hooks */
import {
  CCard,
  CCardBody,
  CContainer,
  CRow,
  CSmartTable,
  CSpinner,
  CButton,
  CDatePicker,
  CFormSelect,
  CFormInput,
  CCardHeader,
  CButtonGroup,
  CFormCheck,
} from '@coreui/react-pro'
import { useDispatch } from 'react-redux'
import React, {
  useEffect,
  useState,
  createRef,
  useCallback,
  useMemo,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { getUserInfo } from '../../utils'
import OrderApi from './order.api'
import { cilPencil } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import Offcanvas from '../../components/Offcanvas'
import { OrderStatus } from '../../typings'
import GroupButtons from '../../components/GroupButtons'
import Modal from '../../components/Modal'
import ProtocolApi from '../protocol-reports/ProtocolReports.Api'
import setTime, { setTimeV2 } from '../../helper/timeFormat'
import OrderForm from '../../components/OrderForm'
import { useTypedSelector } from '../../store'
import { printOrDownloadDoc } from '../../utils'
import { Viewer, Worker } from '@react-pdf-viewer/core'
import { log, table } from 'console'
import { Tabs } from '../../typings'
import { position } from 'html2canvas/dist/types/css/property-descriptors/position'

const docRef = createRef<any>()

const Orders = (): JSX.Element => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = getUserInfo()
  const getId = user?.user
  const [loading, setLoading] = useState(true)
  const [dateTemporary, setDateTemporary] = useState<string>('')
  const [dataFirst, setDataFirst] = useState<any[]>([])
  const [dataSecond, setDataSecond] = useState<any[]>([])
  const [dataThird, setDataThird] = useState<any[]>([])
  const [dataUsers, setDataUsers] = useState<any[]>([])
  const [dataOrders, setDataOrders] = useState<any[]>([])
  const [visible, setVisible] = useState(false)
  const [showPicture, setShowPicture] = useState('')
  const [modaVisible, setModalVisible] = useState(false)
  const [modaOrderVisible, setModalOrderVisible] = useState(false)
  const labEmployee = useTypedSelector((state) => state.isLabRole)
  const company = useTypedSelector((state) => state.company)
  const [modalProtocolVisible, setModalProtocolVisible] = useState(false)
  const [createdAtInput, setCreatedAtInput] = useState('')
  const [testDateInput, setTestDateInput] = useState('')

  const [dataSideBar, setDataSideBar] = useState<any>({
    name: '',
    nameSecond: '',
    phone: '',
    phoneLab: '',
    date_finish: '',
  })
  const [dataProtocol, setDataProtocol] = useState<any>({
    id: 0,
    pictureProtocol: '',
  })
  const [dataOrderById, setDataOrderById] = useState<any>({})
  const [dataAddOrder, setDataAddOrder] = useState<any>({
    id: '',
    date_finish: '',
    userResponsible: '',
    closeReaso: '',
    sureNameid: 0,
  })
  const [protocolNumber, setProtocolNumber] = useState(0)
  const [counterPartyId, setCounterPartyId] = useState(0)
  const [selectedOrder, setSelectedOrder] = useState(0)
  const [idOfResponsiblePerson, setIdOfResponsiblePerson] = useState(0)
  const [selectedTab, setSelectedTab] = useState<Tabs>(Tabs.first)

  const getDetailProtocol = useCallback(
    (id: any, abortController: AbortController) => {
      ProtocolApi.getOneProtocol(id).then((result: any) => {
        const document = result?.data?.data?.attributes?.file?.data?.attributes
        let type = ''
        if (document.ext === '.doc' || document.ext === '.docx') {
          type = 'doc'
        } else if (document.ext === '.png') {
          type = 'png'
        } else if (document.ext === '.jpg' || document.ext === '.jpeg') {
          type = 'jpg'
        } else if (document.ext === '.pdf') {
          type = 'application/pdf'
        }

        setDataProtocol({
          id: result?.data?.data?.id,
          pictureProtocol: document?.url,
          documentType: type,
          name: document.name,
          mime: document.mime,
        })
        setModalProtocolVisible(true)
      })
    },
    [],
  )

  const getDetailOrder = (id: any) => {
    OrderApi.getOrderById(id).then((result) => {
      const dataOrderBy = result?.data?.data?.attributes
      setCounterPartyId(dataOrderBy?.company?.data?.id)
      setProtocolNumber(dataOrderBy?.protocol?.data?.id)
      setDataOrderById(result?.data?.data)
      const firstName =
        dataOrderBy?.userResponsible?.data?.attributes?.firstName
      const sureName = dataOrderBy?.userResponsible?.data?.attributes?.surName
      const sureNameid = dataOrderBy?.userResponsible?.data?.id
      const company = dataOrderBy?.user?.data?.attributes.firstName
      const companySurname = dataOrderBy?.user?.data?.attributes.surName
      const telephone = dataOrderBy?.user?.data?.attributes.telephone
      const telephoneLab =
        dataOrderBy?.userResponsible?.data?.attributes?.telephone

      const date = new Date(dataOrderBy?.date_finish)

      date.setDate(date.getDate() + 1)
      const dateString = date.toISOString()

      if (company) {
        setIdOfResponsiblePerson(sureNameid ? sureNameid : 0)
        setDataSideBar({
          name: company ? `${companySurname} ${company}` : 'не указан',
          nameSecond: firstName ? `${sureName} ${firstName}` : 'не указан',
          phone: telephone || 'не указан',
          phoneLab: telephoneLab || 'не указан',
          date_finish: dataOrderBy?.date_finish ? dateString.split('T')[0] : '',
        })
        setDateTemporary(
          dataOrderBy?.date_finish ? dateString.split('T')[0] : '',
        )
      }
    })
    setVisible(true)
  }

  const fetchData = async (abortController: AbortController) => {
    setLoading(true)
    if (labEmployee) {
      await OrderApi.getAll(20, 0, abortController).then((res: any) =>
        setDataOrders([...res.data]),
      )
    } else {
      await OrderApi.getAllByCompanyId(company.id).then((res: any) =>
        setDataOrders([...res.data]),
      )
    }
    setLoading(false)
  }

  function DateShow({ date, onDateChange }: any) {
    return (
      <CDatePicker
        placeholder={'Выбрать дату проведений испытаний'}
        style={{ width: '312px', marginTop: '25px' }}
        locale="ru-RU"
        onDateChange={(e: any) => {
          onDateChange(e)
        }}
        date={date}
        weekdayFormat={1}
      />
    )
  }

  useEffect(() => {
    setDataAddOrder({
      ...dataAddOrder,
      date_finish: dateTemporary,
    })
  }, [dateTemporary])

  useEffect(() => {
    setDataAddOrder({
      ...dataAddOrder,
      sureNameid: idOfResponsiblePerson,
    })
  }, [idOfResponsiblePerson])

  useEffect(() => {
    const abortController = new AbortController()
    ;(async () => {
      try {
        if (company.type !== 'lab') {
          await Promise.all([fetchData(abortController)])
        } else {
          await Promise.all([fetchData(abortController)])
        }
      } catch (error) {
        console.log(error)
      }
    })()

    return () => {
      abortController.abort()
    }
  }, [labEmployee, company.id])

  useEffect(() => {
    const getDataFirstViewed: any = []
    const getDataFirstUnviewed: any = []
    const getDataSecond: any = []
    const getDataThird: any = []

    const data: any = dataOrders

    let dataCalled = data.map((i: any) => {
      return {
        ...i,
        /* createdAt: i.createdAt ? setTimeV2(i.createdAt) : '-', */
        /* testDate: i.testDate ? setTimeV2(i.testDate) : '-', */
        id: +i.id,
        objectControl: i.objectControl ?? '-',
        companyName: i.user?.company?.name ?? '-',
        responsibleUser:
          i.responsibleUser?.surname && i.responsibleUser?.lastName
            ? `${i.responsibleUser?.surname} ${i.responsibleUser?.name[0]}. ${i.responsibleUser?.lastName[0]}.`
            : '-',
        researchObject: i.researchObjects?.name ?? '-',
        _props: { className: !i.viewed && labEmployee ? 'fw-semibold' : '' },
      }
    })

    dataCalled = dataCalled.sort((a: any, b: any) => +b.id - +a.id)

    dataCalled?.map((e: any) => {
      if (!labEmployee) {
        //company

        if (e?.status == OrderStatus.DONE) {
          getDataSecond.push(e)
        } else {
          getDataFirstViewed.push(e)
        }
      } else {
        if (e?.status == OrderStatus.NEW) {
          if (e.viewed) {
            getDataFirstViewed.push(e)
          } else {
            getDataFirstUnviewed.push(e)
          }
        } else if (e?.status == OrderStatus.WIP) {
          getDataSecond.push(e)
        } else {
          getDataThird.push(e)
        }
      }
    })

    setDataFirst([...getDataFirstUnviewed, ...getDataFirstViewed])
    setDataSecond(getDataSecond)
    setDataThird(getDataThird)
  }, [labEmployee, dataOrders])

  /* loadingOrders ? (<div className="loading_spinner">
      <CSpinner />
    </div>) : null */

  const abortController = useMemo(() => new AbortController(), [])

  useEffect(() => {
    return () => {
      abortController.abort()
    }
  }, [])

  const ButtonFunction = () => {
    if (selectedTab === 'first') {
      return (
        <CButton
          style={{
            width: '312px',
            marginTop: '1%',
            backgroundColor: '#747DEA',
          }}
          onClick={() => {
            setVisible(true)
            dispatch({ type: 'set', dataAddOrder: dataAddOrder })
            navigate(`/orders/add-object/${selectedOrder}/${counterPartyId}`)
          }}
        >
          Выбор объекта
        </CButton>
      )
    }
  }

  const contentSideBar = (
    <>
      <div className="mt-2">
        {showPicture ? (
          <div
            onClick={() => {
              setModalOrderVisible(true)
            }}
          >
            <OrderForm
              orderNumber={selectedOrder}
              samplingLocation={
                dataOrderById?.attributes?.samplingLocation || ''
              }
              dateProcess={dataOrderById?.attributes?.date_process || ''}
              dateTesting={dataOrderById?.attributes?.dateTesting || ''}
              time={dataOrderById?.attributes?.time || ''}
              timeTesting={dataOrderById?.attributes?.timeTesting || ''}
              createdAt={dataOrderById?.attributes?.createdAt || ''}
              workType={dataOrderById?.attributes?.typeJob || ''}
              shortInformation={
                dataOrderById?.attributes?.shortInformation || ''
              }
              objectConstruction={dataOrderById?.attributes?.object_name || ''}
              objectControl={dataOrderById?.attributes?.object_control || ''}
              projectName={dataOrderById?.attributes?.name || ''}
              companyName={
                dataOrderById?.attributes?.company?.data?.attributes?.name || ''
              }
              employeeName={dataSideBar.name || ''}
              companyPhone={dataSideBar.phone || ''}
              aktNumber={
                dataOrderById?.attributes?.sampling_act?.data?.attributes
                  ?.number || ''
              }
            />
          </div>
        ) : (
          <></>
        )}
      </div>

      <div style={{ width: '310px', marginLeft: '0px' }}>
        <div style={{ display: 'flex' }}>
          <div style={{ width: '190px' }}>
            <p>Заявку составил:</p>
          </div>
          <div
            style={{
              maxHeight: '550px',
              maxWidth: '140px',
            }}
          >
            <p>{dataSideBar.name ? dataSideBar.name : ''}</p>
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          <div style={{ width: '190px' }}>
            <p>Телефон составителя:</p>
          </div>
          <div
            style={{
              maxHeight: '550px',
              maxWidth: '140px',
            }}
          >
            <p>{dataSideBar.phone ? `+${dataSideBar.phone}` : ''}</p>
          </div>
        </div>
        {/* FROM COMPANY */}
        {!labEmployee ||
        (labEmployee &&
          (selectedTab === 'second' || selectedTab === 'third')) ? (
          <>
            <div style={{ display: 'flex' }}>
              <div style={{ width: '190px' }}>
                <p>Ответственный за исследования:</p>
              </div>
              <div
                style={{
                  maxHeight: '550px',
                  maxWidth: '140px',
                }}
              >
                <p>{dataSideBar.nameSecond ? dataSideBar.nameSecond : ''}</p>
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
        <div style={{ display: 'flex' }}>
          <div style={{ width: '190px' }}>
            <p>Телефон исполнителя:</p>
          </div>
          <div
            style={{
              maxHeight: '550px',
              maxWidth: '140px',
            }}
          >
            <p>{dataSideBar.phoneLab ? `+${dataSideBar.phoneLab}` : ''}</p>
          </div>
        </div>
      </div>

      {labEmployee ? (
        <div
          style={{
            display: 'flex',
            marginTop: '2%',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {selectedTab !== 'third' ? (
            <>
              <DateShow date={dataAddOrder.date_finish} />

              <CFormSelect
                size="sm"
                style={{ width: '312px', marginTop: '1%' }}
                aria-label="small select example"
                value={dataAddOrder?.sureNameid}
              >
                <option>Назначить ответственного</option>
                {dataUsers.map((e: any, i: number) => {
                  return (
                    <option key={e.id} value={e.id}>
                      {e.attributes.firstName} {e.attributes.surName}{' '}
                      {e.attributes.middleName}
                    </option>
                  )
                })}
              </CFormSelect>
            </>
          ) : (
            <></>
          )}
        </div>
      ) : (
        //FOR COUNTER PARTY
        <></>
      )}
    </>
  )

  const getDataToTable = () => {
    if (selectedTab === 'first') {
      return dataFirst
    } else if (selectedTab === 'second') {
      return dataSecond
    }
    return dataThird
  }

  const contentOrderForm = (
    <div style={{ marginLeft: '10px' }} ref={docRef}>
      <OrderForm
        orderNumber={selectedOrder}
        samplingLocation={dataOrderById?.attributes?.samplingLocation || ''}
        dateProcess={dataOrderById?.attributes?.date_process || ''}
        dateTesting={dataOrderById?.attributes?.dateTesting || ''}
        time={dataOrderById?.attributes?.time || ''}
        timeTesting={dataOrderById?.attributes?.timeTesting || ''}
        createdAt={dataOrderById?.attributes?.createdAt || ''}
        shortInformation={dataOrderById?.attributes?.shortInformation || ''}
        workType={dataOrderById?.attributes?.typeJob || ''}
        objectConstruction={dataOrderById?.attributes?.object_name || ''}
        objectControl={dataOrderById?.attributes?.object_control || ''}
        projectName={dataOrderById?.attributes?.name || ''}
        companyName={
          dataOrderById?.attributes?.company?.data?.attributes?.name || ''
        }
        employeeName={dataSideBar.name || ''}
        companyPhone={dataSideBar.phone || ''}
        aktNumber={
          dataOrderById?.attributes?.sampling_act?.data?.attributes?.number ||
          ''
        }
        onModal={true}
      />
    </div>
  )
  const contentOffcanvas = (
    <>
      {modalProtocolVisible ? (
        <>
          {dataProtocol.documentType === 'application/pdf' ? (
            <div
              style={{
                border: '1px solid rgba(0, 0, 0, 0.3)',
                height: '490px',
                width: '450px',
              }}
            >
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.5.141/build/pdf.worker.min.js">
                <Viewer
                  fileUrl={
                    process.env.REACT_APP_API + dataProtocol?.pictureProtocol
                  }
                />{' '}
              </Worker>
            </div>
          ) : (
            <img
              style={{ maxWidth: '450px', maxHeight: '650px' }}
              src={process.env.REACT_APP_API + dataProtocol?.pictureProtocol}
            />
          )}
        </>
      ) : (
        <div>
          <p className="fs-6">Укажите причину закрытия заявки</p>
          <p style={{ marginTop: '-20px' }} className="fs-6">
            без протокола:
          </p>

          <div
            style={{
              marginTop: '2%',
            }}
          >
            <CFormInput
              type="text"
              placeholder={
                'Ввести причину закрытия заявки без прикрепления протокола.' as any
              }
              onChange={(e) => {
                setDataAddOrder({
                  ...dataAddOrder,
                  closeReaso: e.target.value,
                })
              }}
            />
          </div>
        </div>
      )}
    </>
  )

  const titleSideBar = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '-50px',
      }}
    >
      <p className="fs-4">Информация по заявке</p>
      <p className="fs-5">№ {dataOrderById.id}</p>
    </div>
  )

  const tabs = (
    notLabName: string,
    labName: string,
    button: string,
    value: number,
  ) => {
    const isActive: boolean = button == selectedTab
    console.log(isActive)
    let styles: any
    if (isActive) {
      styles = {
        color: '#747DEA',
        backgroundColor: '#fff',
      }
    } else {
      styles = {
        color: '#fff',
        backgroundColor: '#747DEA',
      }
    }
    console.log(styles)
    return (
      <div
        style={{
          display: 'flex',
          columnGap: '10px',
        }}
      >
        <div>{!labEmployee ? notLabName : labName}</div>
        {(labEmployee && (button == 'first' || button == 'second')) ||
        (!labEmployee && button == 'third') ? (
          <span
            style={{
              width: '35px',
              borderRadius: '5px',
              ...styles,
            }}
          >
            {value}
          </span>
        ) : null}
      </div>
    )
  }

  return loading ? (
    <div className="loading_spinner">
      <CSpinner />
    </div>
  ) : (
    <CContainer>
      <Modal
        Title={`Протокол №${protocolNumber}`}
        Content={contentOffcanvas}
        PrimaryButtonTitle="Печать"
        SecondaryButton="Скачать"
        PrimaryButtonColor="dark"
        SecondaryButtonColor="dark"
        visible={modalProtocolVisible}
        onClose={(e: any) => {
          setModalProtocolVisible(false)
        }}
      />
      <Modal
        Title="Внимание!"
        Content={contentOffcanvas}
        PrimaryButtonTitle="Назад"
        PrimaryButtonColor="primary"
        onClickPrimaryButton={() => {
          setModalVisible(false)
        }}
        thirdButton="Закрыть заявку"
        visible={modaVisible}
        onClose={(e: any) => {
          setModalVisible(false)
          // setModalVisible(e)
        }}
      />
      <Modal
        Title="Заявка"
        Content={contentOrderForm}
        PrimaryButtonTitle="Печать"
        PrimaryButtonColor="primary"
        SecondaryButton="Скачать"
        thirdButton="Редактировать заявку"
        ThirdButtonColor="primary"
        onClickPrimaryButton={() => {
          printOrDownloadDoc(docRef, true)
          setModalOrderVisible(false)
        }}
        onClickSecondaryButton={() => {
          printOrDownloadDoc(docRef, false)
          setModalOrderVisible(false)
        }}
        onClickThirdButton={() => {
          navigate(`/orders/${selectedOrder}`)
        }}
        visible={modaOrderVisible}
        onClose={(e: any) => {
          setModalOrderVisible(false)
          // setModalVisible(e)
        }}
      />
      <Offcanvas
        visible={visible && dataAddOrder?.id}
        SetVisible={(e: boolean) => {
          setVisible(e)
        }}
        Title={titleSideBar}
        Content={contentSideBar}
      />

      <CRow>
        <CCard
          style={{
            padding: '0',
          }}
        >
          <CCardHeader className="px-4">
            <div>Все заявки</div>
          </CCardHeader>
          <CCardBody
            className="px-4"
            style={{
              paddingTop: '3rem',
            }}
          >
            <CSmartTable
              items={getDataToTable()}
              columnFilter
              columnSorter
              clickableRows
              pagination
              itemsPerPage={20}
              tableProps={{
                hover: true,
                responsive: true,
              }}
              columns={[
                {
                  key: 'id',
                  label: '№',
                  _style: {
                    minWidth: '60px',
                    width: '5%',
                    verticalAlign: 'top',
                  },
                },
                ...(labEmployee
                  ? [
                      {
                        key: 'companyName',
                        label: 'Контрагент',
                        _style: {
                          width: '10%',
                          minWidth: '125px',
                          verticalAlign: 'top',
                        },
                      },
                    ]
                  : []),
                {
                  key: 'createdAt',
                  label: 'Дата выдачи заявки',
                  _style: {
                    minWidth: '200px',
                    width: '20%',
                    verticalAlign: 'top',
                  },
                  filter: (values, onChange) => {
                    return (
                      <CFormInput
                        className="form-control form-control-sm"
                        onChange={(e: any) => {
                          e.preventDefault()
                          onChange((item: any) => {
                            return setTimeV2(item)
                              .toLowerCase()
                              .includes(e.target.value.toLowerCase())
                          })
                        }}
                      />
                    )
                  },
                },
                {
                  key: 'testDate',
                  label: 'Дата исполнения',
                  _style: {
                    minWidth: '175px',
                    width: '20%',
                    verticalAlign: 'top',
                  },
                  filter: (values, onChange) => {
                    return (
                      <CFormInput
                        className="form-control form-control-sm"
                        onChange={(e: any) => {
                          e.preventDefault()
                          onChange((item: any) => {
                            if (e.target.value == '') {
                              return true
                            } else if (item) {
                              return setTimeV2(item)
                                .toLowerCase()
                                .includes(e.target.value.toLowerCase())
                            }
                          })
                        }}
                      />
                    )
                  },
                },
                {
                  key: 'researchObject',
                  label: 'Объект строительства',
                  _style: {
                    minWidth: '210px',
                    width: '25%',
                    verticalAlign: 'top',
                  },
                },
                {
                  key: 'objectControl',
                  label: 'Объект контроля',
                  _style: {
                    width: '20%',
                    verticalAlign: 'top',
                    minWidth: '175px',
                  },
                },
                ...(!(labEmployee && selectedTab === 'first')
                  ? [
                      {
                        key: 'responsibleUser',
                        label: 'Ответственный',
                        _style: {
                          width: '10%',
                          minWidth: '160px',
                          verticalAlign: 'top',
                        },
                        _props: { className: 'fw-semibold' },
                      },
                    ]
                  : []),
                { key: 'change', label: '', filter: false, sorter: false },
              ]}
              scopedColumns={{
                id: (item: any, i: any) => {
                  return (
                    <td>
                      {(
                        <div style={{ position: 'relative' }}>
                          {!item.viewed && labEmployee ? (
                            <div className="unviewed"></div>
                          ) : null}
                          <div>{item.id}</div>
                        </div>
                      ) || '-'}
                    </td>
                  )
                },
                createdAt: (item: any) => <td>{setTimeV2(item.createdAt)}</td>,
                testDate: (item: any) => (
                  <td>{item.testDate ? setTimeV2(item.testDate) : '-'}</td>
                ),
              }}
              onRowClick={(item: any, e: any, column: any) => {
                navigate(`/orders/${item.id}?view=true`)
              }}
            />
          </CCardBody>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          ></div>
        </CCard>
      </CRow>
    </CContainer>
  )
}

export default Orders
