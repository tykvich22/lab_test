/* eslint-disable jsx-a11y/alt-text */
import { cilCloudUpload } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CCard,
  CCardBody,
  CRow,
  CButton,
  CForm,
  CCol,
  CFormFloating,
  CFormLabel,
  CFormInput,
  COffcanvasHeader,
  COffcanvasBody,
  CCloseButton,
  COffcanvasTitle,
  COffcanvas,
  CFormSwitch,
  CFormTextarea,
  CCardHeader,
} from '@coreui/react-pro'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../api'
import Modal from '../../components/Modal'
import Offcanvas from '../../components/Offcanvas'
import { useTypedSelector } from '../../store'
import OrderApi from '../order/order.api'
import { Viewer, Worker, RenderPageProps } from '@react-pdf-viewer/core'
import Card from '../../components/Card'

const CustomPageLayer: React.FC<{
  renderPageProps: RenderPageProps
}> = ({ renderPageProps }) => {
  React.useEffect(() => {
    // Mark the page rendered completely when the canvas layer is rendered completely
    // So the next page will be rendered
    if (renderPageProps.canvasLayerRendered) {
      renderPageProps.markRendered(renderPageProps.pageIndex)
    }
  }, [renderPageProps.canvasLayerRendered])

  return (
    <>
      {renderPageProps.canvasLayer.children}
      {renderPageProps.annotationLayer.children}
    </>
  )
}

const renderPdfPage = (props: RenderPageProps) => (
  <CustomPageLayer renderPageProps={props} />
)

const DocumentDoc = (): JSX.Element => {
  const { documentId } = useParams()
  const [data, setData] = useState<any>({
    username: '',
    name: '',
    fullNameOfDirector: '',
    legalAddress: '',
    bankDetails: '',
    email: '',
    telephone: '',
    hash_telegraf: '',
    typeOwnership: '',
    mainLab: [], //Doesnt change so far
    login: '',
    users: [], //user
    password: '',
  })
  const navigate = useNavigate()
  const [downloadFileName, setDownloadFileName] = useState('')
  const [modalAddDocuement, setModalAddDocuement] = useState(false)
  const [modaVisible, setModalVisible] = useState(false)
  const [documentDetail, setDocumentDetail] = useState<any>({})
  const [listDocuments, setListDocuments] = useState<any[]>([])
  const [titleName, setTitleName] = useState('')
  const [showPicture, setShowPicture] = useState('')
  const company = useTypedSelector((state) => state.company)
  const dataUser = useTypedSelector((state) => state.dataUser)
  const [isDisabled, setIsDisabled] = useState(false)
  const documentOrderIds: string[] = []
  const [docNumbers, setDocNumbers] = useState<any>([])

  const [response, setResponse] =
    useState<{ type: 'success' | 'danger'; message: string }>()
  const [documentName, setDocumentName] = useState('')
  const [visible, setVisible] = useState(false)
  /* const [documentDetail?.file?.url, setdocumentDetail?.file?.url] = useState('') */
  const [dataFormat, setDataFormat] = useState('')

  return (
    <>
      <COffcanvas
        style={{ background: '#323C52', color: '#FFFFFF' }}
        placement="end"
        visible={visible}
        onHide={() => setVisible(false)}
      >
        <COffcanvasHeader style={{ justifyContent: 'center' }}>
          <COffcanvasTitle>Документ</COffcanvasTitle>
          <CCloseButton
            style={{ color: '#FFFFFF' }}
            className="text-reset"
            onClick={() => setVisible(false)}
          />
        </COffcanvasHeader>
        <COffcanvasBody>
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
                width: '171px',
                marginTop: '2%',
              }}
              color="secondary"
              variant="outline"
              type="submit"
            >
              Подать заявку
            </CButton>
          </div>
        </COffcanvasBody>
      </COffcanvas>
      <Modal
        Title={
          !modalAddDocuement ? (
            titleName
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <CFormInput
                type="text"
                placeholder="Введите название документа"
                aria-label="default input example"
                style={{
                  width: '400px',
                }}
                onChange={(e: any) => setDocumentName(e.target.value)}
              />
            </div>
          )
        }
        PrimaryButtonTitle={
          !modalAddDocuement ? 'Печать' : 'Загрузить документ'
        }
        PrimaryButtonColor="primary"
        disabledPrimaryButton={isDisabled}
        visible={modaVisible}
        onClose={(e: any) => {
          setModalVisible(e)
        }}
      />
      <CRow>
        <CCol>
          <CCard style={{ padding: '0' }}>
            <CCardHeader className="px-4">
              <div>{documentDetail.name}</div>
            </CCardHeader>
            <CCardBody>
              <div>
                {documentDetail.file ? (
                  <>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {documentDetail?.file?.url.includes('.pdf') ? (
                        <div
                          className="pdf-viewer"
                          style={{
                            border: '1px solid rgba(0, 0, 0, 0.3)',
                            width: '100%',
                          }}
                        >
                          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.5.141/build/pdf.worker.min.js">
                            <Viewer
                              fileUrl={documentDetail?.file?.url}
                              renderPage={renderPdfPage}
                            />{' '}
                          </Worker>
                        </div>
                      ) : (
                        <img
                          style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                          }}
                          src={documentDetail?.file?.url}
                        />
                      )}
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default DocumentDoc
