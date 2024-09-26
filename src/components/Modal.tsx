import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react-pro'
import React from 'react'

const Modal = ({
  Title,
  Content,
  PrimaryButtonTitle,
  PrimaryButtonColor,
  SecondaryButton,
  SecondaryButtonColor,
  ThirdButtonColor,
  visible,
  onClose,
  onClickPrimaryButton,
  onClickSecondaryButton,
  onClickThirdButton,
  thirdButton,
  disabledPrimaryButton,
  size,
  offFooter,
  customFooter,
  style,
}: any): any => {
  const backgroundColorTag = () => {
    if (PrimaryButtonColor === 'primary') {
      return '#747DEA'
    } else if (PrimaryButtonColor === 'dark') {
      return '#49546A'
    }
    return ''
  }
  return (
    <CModal
      style={style}
      className="show d-block"
      backdrop={true}
      keyboard={true}
      portal={false}
      visible={visible}
      onClose={() => {
        onClose(false)
      }}
      size={size}
    >
      <CModalHeader>
        <CModalTitle>{Title}</CModalTitle>
      </CModalHeader>
      <CModalBody>{Content}</CModalBody>
      {offFooter ? (
        <></>
      ) : (
        <>
          {customFooter ? (
            <CModalFooter>{customFooter}</CModalFooter>
          ) : PrimaryButtonTitle || SecondaryButton || thirdButton ? (
            <CModalFooter
              style={{
                justifyContent: 'space-around',
              }}
            >
              {PrimaryButtonTitle ? (
                <CButton
                  style={{
                    backgroundColor: backgroundColorTag(),
                    minWidth: '150px',
                  }}
                  disabled={disabledPrimaryButton}
                  onClick={() => {
                    onClickPrimaryButton()
                  }}
                  color={PrimaryButtonColor || 'primary'}
                >
                  {PrimaryButtonTitle}
                </CButton>
              ) : null}
              {SecondaryButton ? (
                <CButton
                  style={{
                    backgroundColor: backgroundColorTag(),
                    minWidth: '150px',
                  }}
                  onClick={() => {
                    onClickSecondaryButton()
                  }}
                  color={SecondaryButtonColor || 'primary'}
                >
                  {SecondaryButton}
                </CButton>
              ) : (
                <></>
              )}
              {thirdButton ? (
                <CButton
                  style={{
                    backgroundColor: backgroundColorTag(),
                    minWidth: '150px',
                  }}
                  onClick={() => {
                    onClickThirdButton()
                  }}
                  color={ThirdButtonColor || 'danger'}
                >
                  {thirdButton}
                </CButton>
              ) : (
                <></>
              )}
            </CModalFooter>
          ) : null}
        </>
      )}
    </CModal>
  )
}

export default React.memo(Modal)
