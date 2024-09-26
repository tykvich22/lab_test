import React from 'react'
import {
  cilAccountLogout,
  cilNewspaper,
  cilDoor,
  cilPen,
  cilBuilding,
  cilPeople,
  cilFile,
  cilCheckAlt,
  cilCommentSquare,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CNavItem } from '@coreui/react-pro'
import { ElementType } from 'react'
import { getRole, getUserInfo } from './utils'
import AuthApi from './views/auth/auth.api'

export type Badge = {
  color: string
  text: string
}

export type NavItem = {
  component: string | ElementType
  name: string | JSX.Element
  icon?: string | JSX.Element
  badge?: Badge
  to: string
  items?: NavItem[]
}

const _nav: any = []

_nav.push(
  {
    component: CNavItem,
    name: 'Заявки',
    icon: <CIcon icon={cilPen} customClassName="nav-icon" />,
    to: '/orders',
  },
  {
    component: CNavItem,
    name: 'Карточка компании',
    icon: <CIcon icon={cilBuilding} customClassName="nav-icon" />,
    to: '/shop-card',
  },
  {
    component: CNavItem,
    name: 'Сотрудники',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    to: '/employees',
  },
  {
    component: CNavItem,
    name: 'Протоколы и отчеты',
    icon: <CIcon icon={cilNewspaper} customClassName="nav-icon" />,
    to: '/protocol-reports',
  },
  {
    component: CNavItem,
    name: 'Заявки',
    icon: <CIcon icon={cilCheckAlt} customClassName="nav-icon" />,
    to: '/orders',
  },
  {
    component: CNavItem,
    name: 'Мое предприятие',
    icon: <CIcon icon={cilCommentSquare} customClassName="nav-icon" />,
    to: '/company-card',
  },
  {
    component: CNavItem,
    name: 'Карточка предприятия',
    // icon: <CIcon icon={cilSquare} customClassName="nav-icon" />,
    to: '/company-card',
  },
  {
    component: CNavItem,
    name: 'Оборудование ',
    // icon: <CIcon icon={cilSquare} customClassName="nav-icon" />,
    to: '/equipment',
  },
  {
    component: CNavItem,
    name: 'Контрагенты',
    // icon: <CIcon icon={cilSquare} customClassName="nav-icon" />,
    to: '/counter-parties',
  },
  {
    component: CNavItem,
    name: 'Сотрудники',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    to: '/employees',
  },
  {
    component: CNavItem,
    name: 'Документы лаборатории',
    icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
    to: '/documents',
  },
)

export default _nav
