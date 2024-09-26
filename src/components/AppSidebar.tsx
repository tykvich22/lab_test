import {
  cilBriefcase,
  cilBuilding,
  cilCheckAlt,
  cilCommentSquare,
  cilFile,
  cilList,
  cilNewspaper,
  cilPen,
  cilPeople,
  cilStorage,
} from '@coreui/icons'
import {
  CNavItem,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarToggler,
} from '@coreui/react-pro'
import logo from '../assets/images/navbar_logo.svg'
import small_logo from '../assets/images/small_logo.svg'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { state, useTypedSelector } from '../store'

import { AppSidebarNav } from './AppSidebarNav'

import CIcon from '@coreui/icons-react'

import 'simplebar/dist/simplebar.min.css'
// sidebar nav config
import { getRole } from '../utils'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useTypedSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useTypedSelector((state) => state.sidebarShow)
  const [sideBar, setSideBar] = useState<any[]>([])
  const isLabEmployee = useTypedSelector((state) => state.isLabRole)
  const isSuperAdmin = useTypedSelector((state) => state.isSuperAdmin)

  useEffect(() => {
    getRole()
  }, [])

  useEffect(() => {
    if (isLabEmployee) {
      setSideBar([
        {
          component: CNavItem,
          name: 'Заявки',
          icon: <CIcon icon={cilCheckAlt} customClassName="nav-icon" />,
          to: '/orders',
        },
      ])
    }
    /* if (isSuperAdmin) {
      setSideBar([
        ...sideBar,
        {
          component: CNavItem,
          name: 'Лаборатории',
          icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
          to: '/laboratories',
        },
      ])
    } */
  }, [isLabEmployee])

  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarBrand style={{ padding: '9px 6%' }} className="d-none d-md-flex">
        {<img alt="logo" src={logo} style={{ width: '100%' }} />}
      </CSidebarBrand>
      <CSidebarNav>
        {/* <SimpleBar> */}
        {sideBar.length ? <AppSidebarNav items={sideBar} /> : <></>}
        {/* </SimpleBar> */}
      </CSidebarNav>
      <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() =>
          dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })
        }
      />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
