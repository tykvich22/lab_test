import React, { useState } from 'react'
import { useLocation, useSearchParams, useParams } from 'react-router-dom'

import routes from '../routes'

import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react-pro'
import { useTypedSelector } from '../store'

type breadcrumb = {
  pathname?: string
  name?: boolean | string
  active?: boolean
}

type route = {
  path: string
  name: string
}

const AppBreadcrumb = () => {
  const [searchParams] = useSearchParams()
  const docName = searchParams.get('name')
  const equipName = searchParams.get('equipName')
  const companyName = searchParams.get('companyName')
  const currentLocation = useLocation().pathname
  const order = useTypedSelector((state) => state.order)

  const getRouteName = (pathname: string, routes: route[]) => {
    const currentRoute = routes.find((route) => route.path === pathname)
    return currentRoute ? currentRoute.name : false
  }

  const getBreadcrumbs = (location: string) => {
    const breadcrumbs: breadcrumb[] = []
    location.split('/').reduce((prev, curr, index, array) => {
      const currentPathname = `${prev}/${curr}`
      const routeName = getRouteName(currentPathname, routes)
      breadcrumbs.push({
        pathname: currentPathname,
        name: routeName,
        active: index + 1 === array.length ? true : false,
      })
      return currentPathname
    })
    return breadcrumbs
  }
  let isAddProtocol = false
  let isBreadcrumbs = false
  let isBreadcrumbsEmployee = false
  let isDocumentOrder = false
  let isOrderDocumentOrder = false
  let isProtocol = false
  let isDetailEquipment = false
  let isDetailOrder = false
  let isProtocolAndReports = false
  let isLabDoc = false
  let isCompanyCard = false
  let isContract = false
  let isCustomProtocol = false
  let isProtocolsJournal = false
  let isActsJournal = false
  let orderNumber = ''
  let companyNumber = ''
  let equipmentNumber = ''

  const breadcrumbs = getBreadcrumbs(currentLocation)

  console.log(breadcrumbs)

  if (breadcrumbs?.length === 4) {
    const isCustom = breadcrumbs[3]?.pathname?.includes('/custom-protocol/')
    if (isCustom) {
      orderNumber = `${breadcrumbs[2].pathname?.split('/')[2]}`
      isCustomProtocol = true
    }
  }

  if (breadcrumbs?.length === 4) {
    const isPickingObject = breadcrumbs[3]?.pathname?.includes(
      '/orders/add-object/',
    )
    if (isPickingObject) {
      orderNumber = `${breadcrumbs[2].pathname?.split('/')[3]}`
      companyNumber = `${breadcrumbs[3].pathname?.split('/')[4]}`

      isBreadcrumbs = true
    }
  }

  if (breadcrumbs?.length === 4) {
    const isDocument = breadcrumbs[1]?.pathname?.includes('/orders/document')
    if (isDocument) {
      orderNumber = `${breadcrumbs[3].pathname?.split('/')[4]}`
      isOrderDocumentOrder = true
      breadcrumbs.pop()
    }
  }

  if (breadcrumbs?.length === 4) {
    const contract =
      breadcrumbs[3]?.pathname?.includes(`/counter-parties/`) &&
      breadcrumbs[3]?.pathname?.includes('/documents/')
    console.log(contract)
    if (contract) {
      companyNumber = `${breadcrumbs[2].pathname?.split('/')[2]}`
      isContract = true
    }
  }

  if (breadcrumbs?.length === 3) {
    const isDocument = breadcrumbs[2]?.pathname?.includes('/protocol/')
    if (isDocument) {
      orderNumber = `${breadcrumbs[2].pathname?.split('/')[2]}`
      breadcrumbs.pop()
      isProtocol = true
    }
  }

  if (breadcrumbs?.length === 3) {
    const AddProtocol = breadcrumbs[2]?.pathname?.includes('/new-protocol')
    if (AddProtocol) {
      orderNumber = `${breadcrumbs[2].pathname?.split('/')[1]}`
      orderNumber = `${breadcrumbs[2].pathname?.split('/')[2]}`
      isAddProtocol = true
    }
  }

  if (breadcrumbs?.length === 3) {
    const isDetailEmployee =
      breadcrumbs[2]?.pathname?.includes('/counter-parties/')
    if (isDetailEmployee) {
      companyNumber = `${breadcrumbs[2].pathname?.split('/')[2]}`
      isBreadcrumbsEmployee = true
    }
  }

  if (breadcrumbs?.length === 2) {
    const isProtocolReports =
      breadcrumbs[1]?.pathname?.includes('/protocol-reports/')
    if (isProtocolReports) {
      isProtocolAndReports = true
    }
  }

  if (breadcrumbs?.length === 2) {
    if (breadcrumbs[1].name === 'Документы заявки') {
      isDocumentOrder = true
    }
  }
  if (breadcrumbs?.length === 2) {
    const isOrderDetail = breadcrumbs[1]?.pathname?.includes('/orders/')
    if (isOrderDetail) {
      orderNumber = `${breadcrumbs[1].pathname?.split('/')[2]}`
      isDetailOrder = true
    }
  }
  if (breadcrumbs?.length === 2) {
    const isCardCompany = breadcrumbs[1]?.pathname?.includes('/company-card/')
    if (isCardCompany) {
      isCompanyCard = true
    }
  }
  if (breadcrumbs?.length === 2) {
    const isDocsLab = breadcrumbs[1]?.pathname?.includes('/documents/')
    if (isDocsLab) {
      isLabDoc = true
    }
  }
  if (breadcrumbs.length === 2) {
    const isEquipment = breadcrumbs[1]?.pathname?.includes('/equipment/')
    if (isEquipment) {
      isDetailEquipment = true
    }
  }
  if (breadcrumbs?.length === 3) {
    const hasDetailEquipment = breadcrumbs[2]?.pathname?.includes('/equipment/')
    if (hasDetailEquipment) {
      equipmentNumber = `${breadcrumbs[2].pathname?.split('/')[2]}`
      isDetailEquipment = true
    }
  }
  if (breadcrumbs?.length === 1) {
    isProtocolsJournal = Boolean(
      breadcrumbs[0]?.pathname?.includes('/protocols-journal'),
    )
  }
  if (breadcrumbs?.length === 1) {
    isActsJournal = Boolean(breadcrumbs[0]?.pathname?.includes('/acts-journal'))
  }

  return (
    <CBreadcrumb className="m-0 ms-2">
      {breadcrumbs.map((breadcrumb, index) => {
        if (isBreadcrumbsEmployee && index === 1) {
          return (
            <CBreadcrumbItem
              {...(breadcrumb.active
                ? { active: true }
                : { href: `/counter-parties/${companyNumber}` })}
              key={index}
            >
              Контрагент {companyNumber}
            </CBreadcrumbItem>
          )
        }
        if (isProtocol && index === 0) {
          return (
            <>
              <CBreadcrumbItem {...{ href: `/orders` }} key={index}>
                Заявки
              </CBreadcrumbItem>
            </>
          )
        }
        if (isDetailEquipment && index === 1) {
          return (
            <>
              <CBreadcrumbItem
                {...(breadcrumb.active
                  ? { active: true }
                  : { href: `../${equipmentNumber}?equipName=${equipName}` })}
                key={index}
              >
                {equipName}
              </CBreadcrumbItem>
            </>
          )
        }
        if (isDetailEquipment && index === 2) {
          return (
            <>
              <CBreadcrumbItem key={index}>{docName}</CBreadcrumbItem>
            </>
          )
        }
        if (isProtocol && index === 1) {
          return (
            <>
              <CBreadcrumbItem
                {...{ href: `/orders/${orderNumber}?view=true` }}
                key={index}
              >
                Заявка №{orderNumber}
              </CBreadcrumbItem>
              <CBreadcrumbItem active>{docName}</CBreadcrumbItem>
            </>
          )
        }
        if (isDocumentOrder && index === 1) {
          return (
            <>
              <CBreadcrumbItem
                {...{ href: `/orders/${orderNumber}` }}
                key={index}
              >
                Заявка №{orderNumber}
              </CBreadcrumbItem>
              <CBreadcrumbItem
                {...(breadcrumb.active
                  ? { active: true }
                  : { href: breadcrumb.pathname })}
                key={index + 25}
              >
                {breadcrumb.name}
              </CBreadcrumbItem>
            </>
          )
        }
        if (isOrderDocumentOrder && index === 0) {
          return (
            <CBreadcrumbItem
              {...(breadcrumb.active ? { active: true } : { href: `/orders` })}
              key={index}
            >
              Заявки
            </CBreadcrumbItem>
          )
        }
        if (isOrderDocumentOrder && index === 1) {
          return (
            <CBreadcrumbItem
              {...(breadcrumb.active
                ? { active: true }
                : { href: `/orders/${orderNumber}?view=true` })}
              key={index}
            >
              Заявка №{orderNumber}
            </CBreadcrumbItem>
          )
        }
        if (isBreadcrumbs && index === 1) {
          return (
            <CBreadcrumbItem
              {...(breadcrumb.active
                ? { active: true }
                : { href: `/orders/${orderNumber}` })}
              key={index}
            >
              Заявка №{orderNumber}
            </CBreadcrumbItem>
          )
        }
        if (isBreadcrumbs && index === 3) {
          return (
            <CBreadcrumbItem
              {...(breadcrumb.active
                ? { active: true }
                : { href: `/orders/${orderNumber}` })}
              key={index}
            >
              Выбор объекта
            </CBreadcrumbItem>
          )
        }
        if (isBreadcrumbs && index === 2) {
          return (
            <CBreadcrumbItem
              {...(breadcrumb.active
                ? { active: true }
                : { href: `/counter-parties/${companyNumber}` })}
              key={index}
            >
              {companyName}
            </CBreadcrumbItem>
          )
        }
        if (isDetailOrder && index === 1) {
          return (
            <CBreadcrumbItem
              {...(breadcrumb.active
                ? { active: true }
                : { href: `/counter-parties/${companyNumber}` })}
              key={index}
            >
              Заявка №{orderNumber}
            </CBreadcrumbItem>
          )
        }
        if (isOrderDocumentOrder && index === 2) {
          return (
            <CBreadcrumbItem {...{ active: true }} key={index}>
              {docName}
            </CBreadcrumbItem>
          )
        }
        if (isProtocolAndReports && index === 0) {
          return (
            <CBreadcrumbItem
              key={index}
              {...(breadcrumb.active
                ? { active: true }
                : { href: `/protocol-reports` })}
            >
              Протколы и отчеты
            </CBreadcrumbItem>
          )
        }
        if (isProtocolAndReports && index === 1) {
          return (
            <CBreadcrumbItem {...{ active: true }} key={index}>
              {docName}
            </CBreadcrumbItem>
          )
        }
        if (isLabDoc && index === 0) {
          return (
            <CBreadcrumbItem
              key={index}
              {...(breadcrumb.active
                ? { active: true }
                : { href: `/documents` })}
            >
              {breadcrumb.name}
            </CBreadcrumbItem>
          )
        }
        if (isCompanyCard && index === 1) {
          return (
            <>
              <CBreadcrumbItem key={index}>{docName}</CBreadcrumbItem>
            </>
          )
        }
        if (isLabDoc && index === 1) {
          return (
            <CBreadcrumbItem {...{ active: true }} key={index}>
              {docName}
            </CBreadcrumbItem>
          )
        }
        if (isAddProtocol && index == 1) {
          return (
            <CBreadcrumbItem
              {...(breadcrumb.active
                ? { active: true }
                : { href: `/orders/${orderNumber}?view=true` })}
              key={index}
            >
              Заявка №{orderNumber}
            </CBreadcrumbItem>
          )
        }
        if (isAddProtocol && index == 2) {
          return (
            <CBreadcrumbItem {...{ active: false }} key={index}>
              Новый протокол
            </CBreadcrumbItem>
          )
        }
        if (isContract && index == 0) {
          return (
            <CBreadcrumbItem
              {...(breadcrumb.active
                ? { active: true }
                : { href: `/counter-parties` })}
              key={index}
            >
              Контрагенты
            </CBreadcrumbItem>
          )
        }
        if (isContract && index == 1) {
          return (
            <CBreadcrumbItem
              {...(breadcrumb.active
                ? { active: true }
                : {
                    href: `/counter-parties/${companyNumber}?name=${companyName}`,
                  })}
              key={index}
            >
              {companyName}
            </CBreadcrumbItem>
          )
        }
        if (isContract && index == 2) {
          return
        }

        if (isCustomProtocol && index == 1) {
          return (
            <CBreadcrumbItem
              {...(breadcrumb.active
                ? { active: true }
                : {
                    href: `/orders/${orderNumber}?view=true`,
                  })}
              key={index}
            >
              Заявка № {orderNumber}
            </CBreadcrumbItem>
          )
        }

        if (isCustomProtocol && index == 2) {
          return (
            <CBreadcrumbItem active key={index}>
              Протокол {docName ? `№ ${docName}` : null}
            </CBreadcrumbItem>
          )
        }
        if (isCustomProtocol && index == 3) {
          return
        }

        if (isProtocolsJournal && index == 0) {
          return (
            <CBreadcrumbItem active={false} key={index}>
              Журнал протоколов
            </CBreadcrumbItem>
          )
        }

        if (isActsJournal && index == 0) {
          return (
            <CBreadcrumbItem active={false} key={index}>
              Журнал актов отбора
            </CBreadcrumbItem>
          )
        }

        return (
          <CBreadcrumbItem
            {...(breadcrumb.active
              ? { active: true }
              : { href: breadcrumb.pathname })}
            key={index}
          >
            {breadcrumb.active && docName ? docName : breadcrumb.name}
          </CBreadcrumbItem>
        )
      })}
    </CBreadcrumb>
  )
}

export default React.memo(AppBreadcrumb)
