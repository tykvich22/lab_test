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
  CModalFooter,
  CCardHeader,
  CForm,
  CCol,
  CCardTitle,
  CCardText,
} from '@coreui/react-pro'
import React, { createRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DocumentsApi from './Documents.Api'
import { useParams } from 'react-router-dom'
import Modal from '../../components/Modal'
import Offcanvas from '../../components/Offcanvas'
import CIcon from '@coreui/icons-react'
import { cilArrowCircleLeft } from '@coreui/icons'
import { useTypedSelector } from '../../store'
import { Viewer, Worker } from '@react-pdf-viewer/core'
import { getImagePlaceholderFromMime, printOrDownloadDoc } from '../../utils'
import Card from '../../components/Card'
import setTime from '../../helper/timeFormat'

const Documents = (): JSX.Element => {
  const navigate = useNavigate()
  const [downloadFileName, setDownloadFileName] = useState('')
  const [listDocuments, setListDocuments] = useState<any[]>([])
  const [showPicture, setShowPicture] = useState('')
  const [downloadDocument, setDownloadDocument] = useState('')
  const [downloadDocumentMimeType, setDownloadDocumentMimeType] = useState('')
  const [titleName, setTitleName] = useState('')
  const [dataFormat, setDataFormat] = useState('')
  const dataUser = useTypedSelector((state) => state.dataUser)
  const company = useTypedSelector((state) => state.company)

  const { id } = useParams()

  const getDocumentsShow = () => {
    DocumentsApi.getAllForCounterParty(company.id).then((result: any) => {
      setListDocuments(result.data.filter((i: any) => i.isVisible))
    })
  }

  useEffect(() => {
    getDocumentsShow()
  }, [])

  return (
    <CContainer>
      <CRow>
        <CCard style={{ padding: '0' }}>
          <CCardHeader className="px-4">
            <div>Документы лаборатории</div>
          </CCardHeader>
          <CCardBody>
            <CCol>
              <CForm>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                  }}
                >
                  {listDocuments?.map((e: any, i: number) => {
                    if (!e.companyId) {
                      return (
                        <div
                          style={{
                            cursor: e.file ? 'pointer' : 'not-allowed',
                            flex: '0 0 33.33%',
                            display: 'flex',
                            padding: '1rem',
                          }}
                          key={i}
                          // className="px-2 py-2"
                          onClick={() => {
                            const file = e.file?.url
                            if (
                              file &&
                              (file?.includes('.pdf') ||
                                file?.includes('.jpg') ||
                                file?.includes('.jpeg') ||
                                file?.includes('.bmp') ||
                                file?.includes('.png'))
                            ) {
                              navigate(`/documents/${e.id}?name=${e.name}`)
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
                                alt={e.name}
                                src={getImagePlaceholderFromMime(e.file?.url)}
                              />
                              <CCardBody>
                                <CCardTitle>{e.name}</CCardTitle>
                                {e.createdAt ? (
                                  <CCardText>
                                    {dataUser.role === 'labemployee' ||
                                    dataUser.role === 'labadmin'
                                      ? setTime(e.createdAt)
                                      : ''}
                                  </CCardText>
                                ) : (
                                  <></>
                                )}
                              </CCardBody>
                            </CCard>
                          </div>
                          {/* <Card
                            createdAt={
                              dataUser.role === 'labemployee' ||
                              dataUser.role === 'labadmin'
                                ? e?.createdAt
                                : ''
                            }
                            mime={e?.mime}
                            url={e?.url}
                            name={e?.name}
                          /> */}
                        </div>
                      )
                    }
                  })}
                </div>
              </CForm>
            </CCol>
          </CCardBody>
        </CCard>
        <CCard style={{ padding: '0', marginTop: '50px' }}>
          <CCardHeader className="px-4">
            <div>Договоры с лабораторией</div>
          </CCardHeader>
          <CCardBody>
            <CCol>
              <CForm>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                  }}
                >
                  {listDocuments?.map((e: any, i: number) => {
                    if (e.companyId && e.isVisible) {
                      return (
                        <div
                          style={{
                            cursor: e.file ? 'pointer' : 'not-allowed',
                            flex: '0 0 33.33%',
                            display: 'flex',
                            padding: '1rem',
                          }}
                          key={i}
                          // className="px-2 py-2"
                          onClick={() => {
                            const file = e.file?.url
                            if (
                              file &&
                              (file?.includes('.pdf') ||
                                file?.includes('.jpg') ||
                                file?.includes('.jpeg') ||
                                file?.includes('.bmp') ||
                                file?.includes('.png'))
                            ) {
                              navigate(`/documents/${e.id}?name=${e.name}`)
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
                                alt={e.name}
                                src={getImagePlaceholderFromMime(e.file?.url)}
                              />
                              <CCardBody>
                                <CCardTitle>{e.name}</CCardTitle>
                                {e.createdAt ? (
                                  <CCardText>
                                    {dataUser.role === 'labemployee' ||
                                    dataUser.role === 'labadmin'
                                      ? setTime(e.createdAt)
                                      : ''}
                                  </CCardText>
                                ) : (
                                  <></>
                                )}
                              </CCardBody>
                            </CCard>
                          </div>
                        </div>
                      )
                    }
                  })}
                </div>
              </CForm>
            </CCol>
          </CCardBody>
        </CCard>
      </CRow>
    </CContainer>
  )
}

export default Documents
