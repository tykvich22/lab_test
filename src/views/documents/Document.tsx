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
} from '@coreui/react-pro'
import React, { createRef, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import DocumentsApi from './Documents.Api'
import { useParams } from 'react-router-dom'
import Modal from '../../components/Modal'
import Offcanvas from '../../components/Offcanvas'
import CIcon from '@coreui/icons-react'
import { cilArrowCircleLeft } from '@coreui/icons'
import { useTypedSelector } from '../../store'
import { Viewer, Worker, RenderPageProps } from '@react-pdf-viewer/core'
import { printOrDownloadDoc } from '../../utils'

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

const Document = (): JSX.Element => {
  const navigate = useNavigate()
  const [downloadFileName, setDownloadFileName] = useState('')
  const [listDocuments, setListDocuments] = useState<any[]>([])
  const [visible, setVisible] = useState(true)
  const [showPicture, setShowPicture] = useState<any>({})
  const [downloadDocument, setDownloadDocument] = useState('')
  const [downloadDocumentMimeType, setDownloadDocumentMimeType] = useState('')
  const [titleName, setTitleName] = useState('')
  const [dataFormat, setDataFormat] = useState('')

  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const docName = searchParams.get('name')

  const handleDocPrint = async () => {
    if (showPicture.file.url) {
      window.open(showPicture.file.url, '_blank')
    }
  }

  const handleDocDownload = async () => {
    if (showPicture.file.url) {
      window.open(showPicture.file.url, '_blank')
    }
  }

  const getDocumentsShow = (id: any) => {
    DocumentsApi.getImageById(id).then((result: any) => {
      setShowPicture(result.data)
    })
  }

  useEffect(() => {
    getDocumentsShow(id)
  }, [id])

  return (
    <CContainer>
      <CCard>
        <CCardHeader className="px-4">
          <div>{docName}</div>
        </CCardHeader>
        <CCardBody>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <p className="fs-1">{titleName}</p>
          </div>

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
                      // height: '490px',
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
        </CCardBody>
      </CCard>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end mb-2 mt-2">
        <CButton color="danger" className="me-md-2" onClick={handleDocPrint}>
          Печать
        </CButton>
        <CButton color="danger" onClick={handleDocDownload}>
          Скачать
        </CButton>
      </div>
    </CContainer>
  )
}

export default Document
