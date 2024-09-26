import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CButtonGroup,
  CFormCheck,
} from '@coreui/react-pro'
// import { CButtonToolbar } from '@coreui/react'

import React from 'react'

const GroupButtons = ({
  titlePrimary,
  titleSecondary,
  titleThird,
  onClickPrimaryButton,
  onClickSecondaryButton,
  onClickThirdButton,
}: any): any => {
  return (
    <CButtonGroup role="group" aria-label="Basic checkbox toggle button group">
      <CFormCheck
        type="radio"
        button={{ color: 'primary', variant: 'outline' }}
        name="btnradio"
        id="btnradio1"
        autoComplete="off"
        label={titlePrimary}
        onClick={() => {
          onClickPrimaryButton('first')
        }}
        defaultChecked
      />
      <CFormCheck
        type="radio"
        button={{ color: 'primary', variant: 'outline' }}
        name="btnradio"
        id="btnradio2"
        autoComplete="off"
        label={titleSecondary}
        onClick={() => {
          onClickSecondaryButton('second')
        }}
      />
      <CFormCheck
        type="radio"
        button={{ color: 'primary', variant: 'outline' }}
        name="btnradio"
        id="btnradio3"
        autoComplete="off"
        label={titleThird}
        onClick={() => {
          onClickThirdButton('third')
        }}
      />
    </CButtonGroup>
  )
}

export default React.memo(GroupButtons)
