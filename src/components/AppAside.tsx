import React from 'react'
import { useDispatch } from 'react-redux'
import { CCloseButton, CSidebar, CSidebarHeader } from '@coreui/react-pro'

import { useTypedSelector } from '../store'

const AppAside = () => {
  const dispatch = useDispatch()
  const asideShow = useTypedSelector((state) => state.asideShow)

  return (
    <CSidebar
      colorScheme="light"
      size="lg"
      overlaid
      placement="end"
      visible={asideShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', asideShow: visible })
      }}
    >
      <CSidebarHeader className="bg-transparent">
        <CCloseButton
          className="float-end"
          onClick={() => dispatch({ type: 'set', asideShow: false })}
        />
      </CSidebarHeader>
    </CSidebar>
  )
}

export default React.memo(AppAside)
