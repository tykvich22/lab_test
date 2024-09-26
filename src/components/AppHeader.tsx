import React, { useEffect, useState, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useTypedSelector } from '../store'
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  CAvatar,
  CDropdownMenu,
  CDropdownItem,
  CDropdown,
  CButton,
} from '@coreui/react-pro'
import { cilApplicationsSettings, cilMenu } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import { AppBreadcrumb } from './index'

const AppHeader = (): JSX.Element => {
  const dispatch = useDispatch()
  const sidebarShow = useTypedSelector((state) => state.sidebarShow)
  const dataUser = useTypedSelector((state) => state.dataUser)
  const [visible, setVisible] = useState(false)
  const avatar = useRef(null)

  const closeModal = (e: any) => {
    e.stopPropagation()
    if (visible && e.target !== avatar.current) {
      setVisible(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', closeModal)
    return () => document.removeEventListener('click', closeModal)
  }, [visible])

  return (
    <CHeader position="sticky">
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderBrand className="mx-auto d-md-none"></CHeaderBrand>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            position: 'relative',
          }}
        >
          <CButton
            disabled={Boolean(dataUser.telegramUserId)}
            onClick={(e: any) => {
              e.preventDefault()
              if (dataUser.telegram) {
                window.open(`${dataUser.telegram}`, '_blank')
                dispatch({
                  type: 'set',
                  dataUser: { ...dataUser, telegramUserId: 's' },
                })
              }
            }}
            href="#"
          >
            {dataUser.telegramUserId
              ? 'Telegram подключен'
              : 'Подключить Telegram'}
          </CButton>
          <CAvatar
            ref={avatar}
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setVisible((visible) => !visible)
            }}
            color="primary"
            textColor="white"
          >
            {dataUser?.firstName ? dataUser?.firstName[0] : '-'}
            {dataUser?.lastName ? dataUser?.lastName[0] : '-'}
          </CAvatar>
          <CDropdown
            direction="dropstart"
            placement={'top-start'}
            visible={visible}
            /* style={{ position: 'relative', right: '150px', top: '15px' }} */
          >
            <CDropdownMenu style={{ right: 0, top: '30px' }}>
              <CDropdownItem>
                {dataUser?.firstName ? dataUser?.firstName : '-'}{' '}
                {dataUser?.lastName ? dataUser?.lastName : '-'}
              </CDropdownItem>
              {dataUser.telegramUserId ? (
                <CDropdownItem
                  onClick={() =>
                    dispatch({ type: 'set', modalLogoutTelegram: 0 })
                  }
                >
                  Отключить Telegram
                </CDropdownItem>
              ) : null}
              <>
                <CDropdownItem
                  onClick={() => dispatch({ type: 'set', modalLogout: true })}
                >
                  Выйти
                </CDropdownItem>
              </>
            </CDropdownMenu>
          </CDropdown>
        </div>
      </CContainer>
      <CHeaderDivider />
      <CContainer fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
