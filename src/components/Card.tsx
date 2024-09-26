import {
  CButton,
  CCard,
  CCardBody,
  CCardImage,
  CCardText,
  CCardTitle,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react-pro'
import React from 'react'
import { Viewer, Worker } from '@react-pdf-viewer/core'
import setTime from '../helper/timeFormat'

const Card = ({ mime, url, name, createdAt, width = '18rem' }: any): any => {
  return (
    <CCard style={{ width: width }}>
      {mime === 'application/pdf' ? (
        <>
          <div
            style={{
              border: '1px solid rgba(0, 0, 0, 0.3)',
              height: '150px',
              width: width,
            }}
          >
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.5.141/build/pdf.worker.min.js">
              <Viewer fileUrl={process.env.REACT_APP_API + url} />{' '}
            </Worker>
          </div>
        </>
      ) : (
        <>
          <img
            style={{ height: '150px', width: width }}
            src={process.env.REACT_APP_API + url}
          />
        </>
      )}
      <CCardBody>
        <CCardTitle>{name}</CCardTitle>
        {createdAt ? <CCardText>{setTime(createdAt)}</CCardText> : <></>}
      </CCardBody>
    </CCard>
  )
}

export default React.memo(Card)
