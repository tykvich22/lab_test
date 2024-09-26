import { cilArrowCircleRight } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CCloseButton,
  CFormInput,
  COffcanvas,
  COffcanvasBody,
  COffcanvasHeader,
  COffcanvasTitle,
} from '@coreui/react-pro'
import React from 'react'

const Offcanvas = ({
  Title,
  Content,
  visible,
  SetVisible,
  ShowCloseArrow = true,
  BlurBackground = true,
}: any): any => {
  return (
    <COffcanvas
      style={{ background: '#323C52', color: '#FFFFFF' }}
      placement="end"
      visible={visible}
      backdrop={BlurBackground} //SHOW STANISLAV
      onHide={() => {
        SetVisible(false)
      }}
      scroll={true}
    >
      {ShowCloseArrow ? (
        <CIcon
          style={{
            cursor: 'pointer',
            position: 'sticky',
            top: '250px',
            left: '200px',
          }}
          size="xxl"
          icon={cilArrowCircleRight}
          onClick={() => {
            SetVisible(false)
          }}
        />
      ) : (
        <></>
      )}
      <COffcanvasHeader style={{ justifyContent: 'center' }}>
        <COffcanvasTitle>{Title}</COffcanvasTitle>
        <CCloseButton
          style={{ color: '#FFFFFF' }}
          className="text-reset"
          onClick={() => SetVisible(false)}
        />
      </COffcanvasHeader>
      <COffcanvasBody
        style={{
          display: 'flex',
          marginTop: '2%',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {Content}
      </COffcanvasBody>
    </COffcanvas>
  )
}

export default React.memo(Offcanvas)
