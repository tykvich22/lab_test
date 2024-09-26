/* eslint-disable jsx-a11y/alt-text */
import { cilSearch } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCollapse,
  CContainer,
  CFormInput,
  CRow,
  CSmartTable,
  CSpinner,
} from '@coreui/react-pro'
import { Viewer, Worker } from '@react-pdf-viewer/core'
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Modal from '../../components/Modal'
import Offcanvas from '../../components/Offcanvas'
import { useTypedSelector } from '../../store'
import AuthApi from '../auth/auth.api'
import ProtocolReportsApi from './ProtocolReports.Api'

const ProtocolReports = (): JSX.Element => {
  const navigate = useNavigate()
  const [data, setData] = useState<any[]>([])
  const [dataShow, setDataShow] = useState<any[]>([])
  const [picUrls, setPicUrls] = useState<any[]>([])
  const [dataProtocol, setDataProtocol] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(false)
  const [showPicture, setShowPicture] = useState('')
  const [modalProtocol, setModalProtocol] = useState(0)
  const [choosenObject, setChoosenObject] = useState(0)
  const [modalVisible, setModalVisible] = useState(false)
  const [labEmployee, isLabEmployee] = useState(false)
  const [fileMimeType, setFileMimeType] = useState('')
  const [downloadFileName, setDownloadFileName] = useState('')
  const company = useTypedSelector((state) => state.company)
  const [objectsRowExpanded, setObjectsRowExpanded] = useState<
    Record<string, boolean>
  >({})

  const { id } = useParams()

  /* const SearchBar = React.memo(searchBar) */

  const updateData = (id: number) => {
    ProtocolReportsApi.getAllObjectByCompany(id)
      .then((result) => {
        console.log(result, id)
        const objects = result.data.filter((i: any) => id == i.companyId)
        setData(objects)
        setDataShow(objects)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  /* const getProtocolsByObject = (id: number) => {
    ProtocolReportsApi.getProtocolsByObject(id).then((result) => {
      const protocolList = result?.data?.data?.attributes?.protocols?.data
      if (protocolList) {
        setDataProtocol(
          protocolList.map((e: any) => {
            return {
              id: e.id,
              ...e.attributes,
            }
          }),
        )
      } else {
        setDataProtocol([])
      }
    })
  } */

  /* function getRole() {
    AuthApi.getMe()
      .then((result: any) => {
        return AuthApi.getRole(result.data.id)
      })
      .then((res: any) => {
        if (res?.data?.role && res?.data?.role.name === 'LabEmployee') {
          isLabEmployee(true)
        }
        if (res?.data?.role && res?.data?.role.name !== 'LabEmployee') {
          isLabEmployee(false)
        }
      })
  } */

  /* const getImage = (id: any) => {
    ProtocolReportsApi.getImageById(id).then((result) => {
      const urlLists =
        result?.data?.data?.attributes?.file?.data?.attributes?.url || ''
      const fileFormat =
        result?.data?.data?.attributes?.file?.data?.attributes?.mime || ''
      const fileName =
        result?.data?.data?.attributes?.file?.data?.attributes?.name || ''
      setShowPicture(process.env.REACT_APP_API + urlLists)
      setFileMimeType(fileFormat)
      setDownloadFileName(fileName)
    })
  } */

  const toggleExpand = useCallback(
    (
      index: number,
      setExpand: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
    ) => {
      setExpand((prev) => {
        return { ...prev, [index]: !prev[index] }
      })
    },
    [],
  )

  useEffect(() => {
    /* getRole() */
    updateData(company.id)
  }, [company])

  const handleCreateClick = () => {
    setVisible(!visible)
  }

  if (loading)
    return (
      <div className="loading_spinner">
        <CSpinner />
      </div>
    )

  return (
    <CContainer>
      <Modal
        Title={`Протокол №${modalProtocol}`}
        Content={
          <div>
            {showPicture ? (
              <>
                {fileMimeType === 'application/pdf' ? (
                  <div
                    style={{
                      border: '1px solid rgba(0, 0, 0, 0.3)',
                      maxWidth: '620px',
                      margin: '0 auto',
                      height: '520px',
                    }}
                  >
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.5.141/build/pdf.worker.min.js">
                      <Viewer fileUrl={showPicture} />
                    </Worker>
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <img
                      style={{
                        justifyContent: 'space-around',
                        maxWidth: '950px',
                        maxHeight: '500px',
                      }}
                      src={showPicture}
                    />
                  </div>
                )}
              </>
            ) : (
              <></>
            )}
          </div>
        }
        size="xl"
        PrimaryButtonTitle="Печать"
        SecondaryButton="Скачать"
        visible={modalVisible}
        onClose={(e: any) => {
          setModalVisible(e)
        }}
      />

      <CRow>
        <CCard
          id="objects"
          style={{
            padding: '0',
            marginTop: '3rem',
          }}
        >
          <CCardHeader>Объекты</CCardHeader>
          <CCardBody
            style={{
              padding: '2rem 10rem',
            }}
          >
            <div>
              <div
                style={{
                  maxWidth: '50%',
                  margin: '0 auto',
                }}
              >
                <div
                  style={{
                    padding: '.1rem 0',
                    display: 'flex',
                    flexDirection: 'row',
                    borderRadius: '.8rem',
                    background: '#EBEDEF',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 .8rem',
                    }}
                  >
                    <CIcon
                      style={{
                        color: '#9DA5B1',
                      }}
                      icon={cilSearch}
                    ></CIcon>
                  </div>
                  <CFormInput
                    className="search-bar-input"
                    placeholder="Поиск"
                    style={{
                      background: '#EBEDEF',
                      border: 'none',
                      paddingLeft: '0',
                      borderRadius: '.8rem',
                    }}
                    onChange={(e: any) => {
                      setDataShow(
                        data.filter((item: any) =>
                          item.name
                            .toLowerCase()
                            .includes(e.target.value.toLowerCase()),
                        ),
                      )
                    }}
                  />
                </div>
              </div>
              <div
                style={{
                  marginTop: '5rem',
                }}
              >
                <CSmartTable
                  className="counter-party-detail-object-table"
                  pagination
                  columns={[
                    /* {
                      key: 'id',
                      label: '№',
                      _style: {
                        width: '4rem',
                      },
                    }, */
                    {
                      key: 'objectName',
                      label: 'Объекты',
                      _style: {
                        width: '22rem',
                      },
                    },
                    {
                      key: 'empty',
                      label: '',
                      _style: {
                        width: 0,
                        visibility: 'hidden',
                      },
                    },
                    {
                      key: 'expand',
                      label: (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                          }}
                        ></div>
                      ) as any,
                      _style: {
                        width: '3rem',
                        // visibility: 'hidden',
                      },
                    },
                  ]}
                  items={dataShow}
                  scopedColumns={{
                    /* id: (item: any) => {
                      return <td>{item.id || '-'}</td>
                    }, */
                    objectName: (item: any) => {
                      return <td>{item?.name || '-'}</td>
                    },
                    empty: () => <td></td>,
                    expand: (item: any) => (
                      <td>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                          }}
                        ></div>
                      </td>
                    ),
                    details: (item) => {
                      return item?.protocols?.length ? (
                        <CCollapse visible={!!objectsRowExpanded[item.id]}>
                          <table
                            className="table"
                            width={'100%'}
                            style={{
                              marginBottom: '0',
                            }}
                          >
                            <tbody>
                              {item?.protocols?.map((data: any, i: number) => {
                                return (
                                  <tr
                                    key={data.id}
                                    onClick={(e: any) => {
                                      navigate(
                                        `/protocol-reports/${data.id}?name=${data.name}`,
                                      )
                                    }}
                                  >
                                    <td
                                      style={{
                                        visibility: 'hidden',
                                        width: '4rem',
                                      }}
                                    >
                                      {data.id || '-'}
                                    </td>
                                    <td
                                      style={{
                                        // visibility: 'hidden',
                                        marginLeft: '20rem',
                                        width: '22rem',
                                      }}
                                    >
                                      <div
                                        style={{
                                          // visibility: 'hidden',
                                          marginLeft: '5rem',
                                        }}
                                      >
                                        {data.name || '-'}
                                      </div>
                                    </td>

                                    <td>
                                      <div
                                        style={{
                                          visibility: 'hidden',
                                          display: 'flex',
                                          justifyContent: 'center',
                                        }}
                                      ></div>
                                    </td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </CCollapse>
                      ) : (
                        <></>
                      )
                    },
                  }}
                  clickableRows
                  onRowClick={(item: any) => {
                    toggleExpand(item.id, setObjectsRowExpanded)
                  }}
                />
              </div>
            </div>
          </CCardBody>
        </CCard>

        {/* END HERE  */}
        {/* COMMENTING FOR FURTHURE DEV */}
        {/* <CCard style={{ padding: '0' }}>
          <CCardHeader className="px-4">
            <div>Протоколы и отчеты</div>
          </CCardHeader>
          <CCardBody>
            <div
              style={{
                padding: '2rem 0',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <CFormInput
                  type="text"
                  placeholder="поиск"
                  aria-label="default input example"
                  style={{
                    width: '500px',
                  }}
                />
              </div>
              <div
                className="mt-2"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <ul
                  className="list-group"
                  style={{
                    width: '500px',
                  }}
                >
                  <CSmartTable
                    header={true}
                    items={data}
                    clickableRows
                    pagination
                    itemsPerPage={7}
                    tableProps={{
                      hover: true,
                      responsive: true,
                    }}
                    columns={[
                      { key: 'id', label: '№' },
                      { key: 'object', label: 'Объекты' },
                    ]}
                    scopedColumns={{
                      id: (item: any, i: any) => {
                        const id = item?.id
                        return <td>{id || '-'}</td>
                      },
                      object: (item: any, i: any) => {
                        const bio = item?.name
                        return <td>{bio || '-'}</td>
                      },
                    }}
                    onRowClick={(e: any, i: number) => {
                      getProtocolsByObject(e.id)
                      setChoosenObject(e.id) //to show in page
                      setVisible(true)
                      getImage(e.id)
                    }}
                  />
                </ul>
              </div>
            </div>
          </CCardBody> */}
        {labEmployee ? (
          <div
            style={{
              display: 'flex',
              marginTop: '2%',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <CButton
              style={{
                width: '560px',
                marginTop: '1%',
                marginBottom: '2%',
              }}
              color="dark"
              onClick={() => {
                setVisible(true)
              }}
            >
              Добавить объект
            </CButton>
          </div>
        ) : (
          <></>
        )}
        {/* </CCard> */}
      </CRow>
    </CContainer>
  )
}

export default ProtocolReports
