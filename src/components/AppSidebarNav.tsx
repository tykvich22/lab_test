import React, { FC, ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'

import { CBadge } from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'

import { Badge, NavItem } from '../_nav'
import { useDispatch } from 'react-redux'
interface AppSidebarNavProps {
  items: NavItem[]
}

export const AppSidebarNav: FC<AppSidebarNavProps> = ({ items }) => {
  const location = useLocation()
  const dispatch = useDispatch()

  const navLink = (
    name: string | JSX.Element,
    icon: string | ReactNode,
    badge?: Badge,
  ) => {
    return (
      <>
        {icon && typeof icon === 'string' ? (
          <CIcon icon={icon} customClassName="nav-icon" />
        ) : (
          icon
        )}
        {name && name}
        {badge && (
          <CBadge color={badge.color} className="ms-auto">
            {badge.text}
          </CBadge>
        )}
      </>
    )
  }

  const navItem = (item: NavItem, index: number) => {
    const { component, name, badge, icon, ...rest } = item
    const Component = component
    return (
      <Component
        {...(rest.to &&
          !rest.items && {
            component: NavLink,
          })}
        key={index}
        {...rest}
      >
        {navLink(name, icon, badge)}
      </Component>
    )
  }
  const navGroup = (item: NavItem, index: number) => {
    const { component, name, icon, to, ...rest } = item
    const Component = component
    return (
      <Component
        idx={String(index)}
        key={index}
        toggler={navLink(name, icon)}
        visible={location.pathname.startsWith(to)}
        {...rest}
      >
        {item.items?.map((item: NavItem, index: number) =>
          item.items ? navGroup(item, index) : navItem(item, index),
        )}
      </Component>
    )
  }

  return (
    <React.Fragment>
      {items &&
        items.map((item: NavItem, index: number) =>
          item.items ? navGroup(item, index) : navItem(item, index),
        )}
    </React.Fragment>
  )
}

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
}
