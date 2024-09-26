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
  COffcanvasHeader,
  COffcanvas,
  CCloseButton,
  COffcanvasTitle,
  COffcanvasBody,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CDropdown,
} from '@coreui/react-pro'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import OrderApi from './order.api'
import { gql, useQuery } from '@apollo/client'

const ActiveOrders = (): JSX.Element => {
  const navigate = useNavigate()
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(false)

  const updateData = (limit: number, offset: number) => {
    if (!loading) setLoading(true)
    OrderApi.getAll(/* limit, offset */)
      .then((result) => {
        setData(result.data.data)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    updateData(99999, 0)
  }, [])

  const handleCreateClick = () => {
    setVisible(!visible)
  }
  const showLink = (item: any, index: number) => {
    if (item?.previewPicture !== null) {
      if (item?.previewPicture.split('/')[0] !== '#media') {
        return process.env.REACT_APP_CG + item.previewPicture
      }
      const showImage = item?.previewPicture?.split('#media')[1]
      return process.env.REACT_APP_REACT_APP_FRONT_REACT_URL + '/' + showImage
    }
  }
  if (loading)
    return (
      <div className="loading_spinner">
        <CSpinner />
      </div>
    )

  return (
    <CContainer>
      <COffcanvas
        style={{ background: '#323C52', color: '#FFFFFF' }}
        placement="end"
        visible={visible}
        onHide={() => setVisible(false)}
      >
        <COffcanvasHeader style={{ justifyContent: 'center' }}>
          <COffcanvasTitle>Информация по заявке </COffcanvasTitle>
          <CCloseButton
            style={{ color: '#FFFFFF' }}
            className="text-reset"
            onClick={() => setVisible(false)}
          />
        </COffcanvasHeader>
        <COffcanvasBody>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '200px' }}>
              <p>Заявку составил:</p>
            </div>
            <div>
              <p>Хамицевич К. А.</p>
            </div>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '200px' }}>
              <p>Ответственный за исследования:</p>
            </div>
            <div>
              <p>Ботвинко Иван</p>
            </div>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '200px' }}>
              <p>Телефон исполнителя:</p>
            </div>
            <div>
              <p>+7 999 888 88 88</p>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: '50%',
            }}
          >
            <CDropdown
              style={{
                width: '312px',
              }}
              className="mt-2"
            >
              <CDropdownToggle caret color="light">
                Назначить ответственного
              </CDropdownToggle>
              <CDropdownMenu>
                {['Сотрудник №1', 'Сотрудник №2'].map((e, i) => {
                  return (
                    <CDropdownItem
                      style={{
                        width: '312px',
                      }}
                      key={i}
                    >
                      {e}
                    </CDropdownItem>
                  )
                })}
              </CDropdownMenu>
            </CDropdown>
            <CButton
              style={{
                width: '312px',
                marginTop: '5%',
              }}
              color="dark"
              onClick={() => {
                setVisible(true)
                // navigate(`/add-order`)
              }}
            >
              Добавить
            </CButton>
            <div>
              <CButton
                style={{
                  display: 'flex',
                  width: '312px',
                  marginTop: '5%',
                }}
                color="dark"
                onClick={() => {
                  setVisible(true)
                  // navigate(`/add-order`)
                }}
              >
                Закрыть заявку без протокола
              </CButton>
            </div>
          </div>
        </COffcanvasBody>
      </COffcanvas>
      <CRow>
        <CCard>
          <CCardBody>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <p className="fs-1">Активные заявки</p>
            </div>
            <CSmartTable
              items={data}
              // itemsPerPage={20}
              // itemsPerPageLabel={'Показывать'}
              clickableRows
              pagination
              columnSorter
              // itemsPerPageSelect={true}
              tableProps={{
                hover: true,
                responsive: true,
              }}
              columns={[
                { key: 'id', label: '#' },
                { key: 'issuedDate', label: 'Дата выдачи заявки' },
                { key: 'executionTime', label: 'Дата исполнения' },
                { key: 'objectName', label: 'Наименование объекта' },
                { key: 'objectControl', label: 'Объект контроля' },
              ]}
              scopedColumns={{
                createdAt: (item: any) => (
                  <td>
                    {new Date(item.createdAt).toLocaleString('ru-RU', {
                      hour12: false,
                    })}
                  </td>
                ),
                id: (item: any, i: any) => {
                  return <td>{i + 1 || '-'}</td>
                },
                name: (item: any, data: any) => {
                  return <td>{item.attributes.name || '-'}</td>
                },
                executionTime: (item: any, data: any) => {
                  return (
                    <td>
                      {new Date(item.attributes.date_start).toLocaleString(
                        'ru-RU',
                        {
                          hour12: false,
                        },
                      ) || '-'}
                      До{' '}
                      {new Date(item.attributes.date_process).toLocaleString(
                        'ru-RU',
                        {
                          hour12: false,
                        },
                      ) || '-'}
                    </td>
                  )
                },
                issuedDate: (item: any, data: any) => {
                  return (
                    <td>
                      {new Date(item.attributes.publishedAt).toLocaleString(
                        'ru-RU',
                        {
                          hour12: false,
                        },
                      ) || '-'}
                    </td>
                  )
                },
                objectName: (item: any, data: any) => {
                  return <td>{item.attributes.object_name || '-'}</td>
                },
                objectControl: (item: any, data: any) => {
                  return <td>{item.attributes.object_control || '-'}</td>
                },
                previewPicture: (item: any, index: any) => (
                  <td>
                    <CPopover
                      content={<img src={showLink(item, index)} alt="" />}
                      trigger="hover"
                    >
                      {item.previewPicture ? (
                        <CLink href={showLink(item, index)} target="_blank">
                          Предпросмотр
                        </CLink>
                      ) : (
                        <p></p>
                      )}
                    </CPopover>
                  </td>
                ),
              }}
              onRowClick={(item) => {
                setVisible(true)
                // navigate(`${item.id}`, { state: { id: item.id } })
              }}
            />
          </CCardBody>
          <div
            style={{
              display: 'flex',
              marginTop: '2%',
              marginBottom: '2%',
              flexDirection: 'column',
              alignItems: 'flex-end',
            }}
          >
            <CButton
              style={{
                width: '171px',
              }}
              color="dark"
              onClick={() => {
                setVisible(true)
              }}
            >
              История заявок
            </CButton>
          </div>
        </CCard>
      </CRow>
    </CContainer>
  )
}

export default ActiveOrders
