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
  CCol,
  CForm,
  CCardHeader,
} from '@coreui/react-pro'
import React, { createRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
// import DocumentsApi from './Documents.Api'
import { useParams } from 'react-router-dom'
import Modal from '../../components/Modal'
import Offcanvas from '../../components/Offcanvas'
import CIcon from '@coreui/icons-react'
import { cilArrowCircleLeft } from '@coreui/icons'
import { useTypedSelector } from '../../store'
import { RenderPageProps, Viewer, Worker } from '@react-pdf-viewer/core'
import { printOrDownloadDoc } from '../../utils'
import DocumentsApi from '../documents/Documents.Api'
import ProtocolApi from './ProtocolReports.Api'

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

const Protocol = (): JSX.Element => {
  const navigate = useNavigate()
  const [downloadFileName, setDownloadFileName] = useState('')
  const [listDocuments, setListDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showPicture, setShowPicture] = useState<any>('')
  const [downloadDocument, setDownloadDocument] = useState('')
  const [downloadDocumentMimeType, setDownloadDocumentMimeType] = useState('')
  const [dataFormat, setDataFormat] = useState('')

  const { id } = useParams()
  /* const showDocument = (e: any) => {
    const document = e

    setDownloadFileName(document.name)
    setDownloadDocumentMimeType(document.mime)

    if (document.ext === '.pdf') {
      setDataFormat('application/pdf')
      setShowPicture(process.env.REACT_APP_API + document.url)
    } else if (document.ext === '.txt') {
      setShowPicture(process.env.REACT_APP_API + '/uploads/word_c8322e10ff.png')
    } else if (document.ext === '.doc' || document.ext === '.docx') {
      setDataFormat('doc')
      setShowPicture(process.env.REACT_APP_API + '/uploads/word_c8322e10ff.png')
    } else if (document.ext === '.png') {
      setDataFormat('png')
      setShowPicture(process.env.REACT_APP_API + document.url)
    } else if (document.ext === '.jpg' || document.ext === '.jpeg') {
      setDataFormat('jpg')
      setShowPicture(process.env.REACT_APP_API + document.url)
    } else {
      setShowPicture(process.env.REACT_APP_API + document.url)
    }
    setDownloadDocument(process.env.REACT_APP_API + document.url)
  } */

  const getProtocol = (id: any) => {
    if (!loading) setLoading(true)
    ProtocolApi.getOneProtocol(id)
      .then((result: any) => {
        console.log(result)
        setShowPicture(result.data)
        /* if (!result.data.file) {
          navigate(-1)
        } */
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    getProtocol(id)
  }, [id])

  if (loading)
    return (
      <div className="loading_spinner">
        <CSpinner />
      </div>
    )

  return (
    <CContainer>
      <CCardBody>
        <CCard className="mt-4 px-0">
          <CCardHeader>
            <div>Протокол №{id}</div>
          </CCardHeader>
          <CCardBody
            style={{
              padding: '4rem 4rem',
            }}
          >
            <CCol>
              <CForm>
                <div
                  className="mt-2"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  {showPicture?.file?.url ? (
                    <>
                      {showPicture?.file?.url.includes('.pdf') ? (
                        <div
                          className="pdf-viewer"
                          style={{
                            border: '1px solid rgba(0, 0, 0, 0.3)',
                            // height: '690px',
                            width: '100%',
                          }}
                        >
                          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.5.141/build/pdf.worker.min.js">
                            <Viewer
                              fileUrl={showPicture?.file?.url}
                              renderPage={renderPdfPage}
                              withCredentials={true}
                            />
                          </Worker>
                        </div>
                      ) : (
                        <div>
                          <img
                            style={{
                              maxWidth: '100%',
                              maxHeight: '100%',
                            }}
                            src={showPicture?.file?.url}
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <></>
                  )}
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
      </CCardBody>
    </CContainer>
  )
}

export default Protocol
