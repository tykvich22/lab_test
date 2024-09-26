/* eslint-disable jsx-a11y/alt-text */
import {
  CCard,
  CCardBody,
  CContainer,
  CRow,
  CSpinner,
  CButton,
  CModalFooter,
  CFormInput,
  CFormLabel,
  CForm,
  CDatePicker,
} from '@coreui/react-pro'
import React, { useEffect, useState, createRef } from 'react'
import { useNavigate } from 'react-router-dom'
import DocumentsApi from './Documents.Api'
import { useParams } from 'react-router-dom'
import Modal from '../../components/Modal'
import Offcanvas from '../../components/Offcanvas'
import CIcon from '@coreui/icons-react'
import { cilArrowCircleLeft } from '@coreui/icons'
import { useTypedSelector } from '../../store'
import { printOrDownloadDoc } from '../../utils'
// Import the main component
import { Viewer, Worker } from '@react-pdf-viewer/core'

// Import the styles
import '@react-pdf-viewer/core/lib/styles/index.css'

import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer'

const docRef = createRef<any>()

const DocumentOrder = (): JSX.Element => {
  const navigate = useNavigate()
  const [data, setData] = useState<any[]>([])
  const [visible, setVisible] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [showPicture, setShowPicture] = useState('')
  const [downloadDocument, setDownloadDocument] = useState('')
  const [downloadFileName, setDownloadFileName] = useState('')
  const [dataFormat, setDataFormat] = useState('')
  const [documentList, setDocumentList] = useState<any[]>([])
  //PAGES PDF
  const [pageNumber, setPageNumber] = useState(1)

  const [titleName, setTitleName] = useState('')
  const [actDetail, setActDetail] = useState({
    nameOfCompany: '',
    objectName: '',
    objectLocation: '',
    objectOfControl: '',
    date_finish: '',
    materialName: '',
    responsiblePerson: '',
    note: '',
    number: '',
    samplingLocation: '',
    numberOfSamples: '',
    samplingDate: '',
    qualityDocument: '',
    id: '',
  })
  const [imgDisplay, setImgDisplay] = useState<any>({
    maxWidth: '450px',
    maxHeight: '400px',
  })

  const order = useTypedSelector((state) => state.order)
  const dataUser = useTypedSelector((state) => state.dataUser)

  const getDocuments = (id: any) => {
    DocumentsApi.getDocsByOrder(id).then((result) => {
      const docLists = result?.data?.data?.attributes?.order_documents?.data
      const samplingAct = result?.data?.data?.attributes?.sampling_act?.data
      if (docLists) {
        const listTemporary: any = []
        docLists?.forEach((e: any, i: number) => {
          if (i === 0) {
            getImage(e.id)
            setTitleName(e.attributes.Title)
          }
          listTemporary.push({ name: e.attributes.Title, imageId: e.id })
        })

        setDocumentList(listTemporary)
      }
      setActDetail({ id: samplingAct.id, ...samplingAct.attributes })
    })
  }

  const updateSamplingActReq = (id: any, body: any) => {
    DocumentsApi.updateSamplingAct(id, body).then((result) => {
      const samplingAct = result?.data?.data
      setActDetail({ id: samplingAct.id, ...samplingAct.attributes })
    })
  }

  const handleChange = (key: any, e: any) => {
    setActDetail({ ...actDetail, [key]: e.target.value })
  }

  const getImage = (id: any) => {
    DocumentsApi.getImageById(id).then((result) => {
      const document = result.data.data.attributes.File.data.attributes

      setDownloadFileName(document.name)

      if (document.ext === '.pdf') {
        setDataFormat('application/pdf')
        setShowPicture(
          process.env.REACT_APP_API +
            '/uploads/PDF_file_icon_svg_0e4a29b8e2.png',
        )
      } else if (document.ext === '.doc' || document.ext === '.docx') {
        setDataFormat('doc')
        setShowPicture(
          process.env.REACT_APP_API + '/uploads/word_c8322e10ff.png',
        )
      } else if (document.ext === '.png') {
        setDataFormat('png')
        setShowPicture(process.env.REACT_APP_API + document.url)
      } else {
        setShowPicture(process.env.REACT_APP_API + document.url)
      }
      setDownloadDocument(process.env.REACT_APP_API + document.url)
    })
  }

  useEffect(() => {
    getDocuments(order)
  }, [order])

  const titleSideBar = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginLeft: '20px',
      }}
    >
      <p className="fs-4">Сопроводительные документы к Заявке № {order}</p>
    </div>
  )

  const contentSideBar = (
    <>
      {documentList.map((e: any, i: number) => {
        return (
          <div key={i}>
            <CButton
              style={{
                width: '312px',
                height: '56px',
                marginTop: '2%',
              }}
              color="light"
              onClick={() => {
                setTitleName(e.name)
                getImage(e.imageId)
              }}
            >
              {e.name}
            </CButton>
          </div>
        )
      })}
      {actDetail.number ? (
        <div>
          <CButton
            style={{
              width: '312px',
              height: '56px',
              marginTop: '2%',
            }}
            color="light"
            onClick={() => {
              setModalVisible(true)
            }}
          >
            Акт отбора проб № {actDetail.number || '-'}
          </CButton>
        </div>
      ) : (
        <></>
      )}
    </>
  )

  const contentModal = (
    <CForm
      onSubmit={() => {
        console.log('Submit')
      }}
    >
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
          Наименование организации:
        </CFormLabel>
        <CFormInput
          type="text"
          placeholder={'ООО "БТС-МОСТ' as any}
          style={{
            width: '60%',
          }}
          value={actDetail?.nameOfCompany}
          onChange={(e: any) => {
            handleChange('nameOfCompany', e)
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
          Наименование объекта:
        </CFormLabel>
        <CFormInput
          type="text"
          placeholder={'Автоматически' as any}
          style={{
            width: '60%',
          }} //setDataAct
          value={actDetail?.objectName}
          onChange={(e: any) => {
            handleChange('objectName', e)
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
          Место отбора проб:
        </CFormLabel>
        <CFormInput
          type="text"
          placeholder={'Автоматически' as any}
          style={{
            width: '60%',
          }}
          value={actDetail?.samplingLocation}
          onChange={(e: any) => {
            handleChange('samplingLocation', e)
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
          Объект контроля:
        </CFormLabel>
        <CFormInput
          type="text"
          placeholder={'Автоматически' as any}
          style={{
            width: '60%',
          }}
          value={actDetail?.objectOfControl}
          onChange={(e: any) => {
            handleChange('objectOfControl', e)
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
          Дата отбора проб:
        </CFormLabel>
        <CDatePicker
          placeholder={'Выберите дату'}
          style={{
            width: '60%',
          }}
          locale="ru-RU"
          date={actDetail?.samplingDate}
          onDateChange={(e: any) => {
            const date = e.setMinutes(
              e.getMinutes() - new Date().getTimezoneOffset(),
            )
            setActDetail({
              ...actDetail,
              samplingDate: date,
            })
          }}
          weekdayFormat={1}
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
          Наименование материала:
        </CFormLabel>
        <CFormInput
          type="text"
          placeholder={'введите наименование материала' as any}
          style={{
            width: '60%',
          }}
          value={actDetail?.materialName}
          onChange={(e: any) => {
            handleChange('materialName', e)
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
          Количество образцов:
        </CFormLabel>
        <CFormInput
          type="text"
          placeholder={'введите количество образцов' as any}
          style={{
            width: '60%',
          }}
          value={actDetail?.numberOfSamples}
          onChange={(e: any) => {
            handleChange('numberOfSamples', e)
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
          Документ о качестве:
        </CFormLabel>
        <CFormInput
          type="text"
          placeholder={'введите № документа о качестве' as any}
          style={{
            width: '60%',
          }}
          value={actDetail?.qualityDocument}
          onChange={(e: any) => {
            handleChange('qualityDocument', e)
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
          Ответственное лицо:
        </CFormLabel>
        <CFormInput
          type="text"
          placeholder={'введите: ФИО, номер телефона' as any}
          style={{
            width: '60%',
          }}
          value={actDetail?.responsiblePerson}
          onChange={(e: any) => {
            handleChange('responsiblePerson', e)
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
          type="text"
          placeholder={'введите примечания' as any}
          style={{
            width: '60%',
          }}
          value={actDetail?.note}
          onChange={(e: any) => {
            handleChange('note', e)
          }}
        />
      </div>
    </CForm>
  )

  function changePage(offset: any) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset)
  }

  return (
    <CContainer>
      <Modal
        Title={`Акт отбора проб № ${actDetail?.number}`}
        Content={contentModal}
        PrimaryButtonTitle="Далее"
        disabledPrimaryButton={dataUser.role !== 'labadmin'}
        PrimaryButtonColor="dark"
        onClickPrimaryButton={() => {
          updateSamplingActReq(actDetail.id, actDetail)
          setModalVisible(false)
        }}
        visible={modalVisible}
        onClose={(e: any) => {
          setModalVisible(e)
        }}
      />
      <Offcanvas
        Title={titleSideBar}
        visible={visible}
        Content={contentSideBar}
        ShowCloseArrow={true}
        BlurBackground={false}
        SetVisible={(e: boolean) => setVisible(e)}
      />

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
              <>
                {dataFormat === 'application/pdf' ? (
                  <div
                    style={{
                      border: '1px solid rgba(0, 0, 0, 0.3)',
                      height: '550px',
                      width: '850px',
                    }}
                  >
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.5.141/build/pdf.worker.min.js">
                      <Viewer fileUrl={downloadDocument} />{' '}
                    </Worker>
                  </div>
                ) : (
                  <img
                    style={{ maxWidth: '450px', maxHeight: '500px' }}
                    src={showPicture}
                  />
                )}
              </>
            </div>
          </CCardBody>
        </CCard>
        <CIcon
          style={{
            position: 'fixed',
            top: '250px',
            right: '1px',
          }}
          size="4xl"
          icon={cilArrowCircleLeft}
          onClick={() => {
            setVisible(true)
          }}
        />
      </CRow>
    </CContainer>
  )
}

export default DocumentOrder
