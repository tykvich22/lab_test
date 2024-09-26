import React, { ReactNode } from 'react'

export type route = {
  component?: ReactNode
  name?: string
  path?: string
  routes?: route[]
}
const Orders = React.lazy(() => import('./views/order/Orders'))
const ActiveOrders = React.lazy(() => import('./views/order/ActiveOrders'))
const ProtocolReports = React.lazy(
  () => import('./views/protocol-reports/ProtocolReports'),
)
const Documents = React.lazy(() => import('./views/documents/Documents'))
const Document = React.lazy(() => import('./views/documents/Document'))
const DocumentDoc = React.lazy(() => import('./views/documents/DocumentDoc'))
const DocumentOrder = React.lazy(
  () => import('./views/documents/DocumentOrder'),
)
const NewProtocols = React.lazy(
  () => import('./views/protocol-reports/NewProtocols'),
)
const Protocol = React.lazy(() => import('./views/protocol-reports/Protocol'))

const routes = [
  { path: '/', name: 'Главная' },
  { path: '/orders', name: 'Заявки', component: Orders },
  {
    path: '/orders/document/:id/:orderId',
    name: 'Документ',
    component: Document,
  },
  { path: '/active-orders', name: 'Активные заявки', component: ActiveOrders },
  {
    path: 'orders/:orderId/new-protocol',
    name: 'Новый Протокол',
    component: NewProtocols,
  },
  {
    path: '/protocol/:orderId/:id',
    name: 'Протокол',
    component: Protocol,
  },
  {
    path: '/protocol-reports/:id',
    name: 'Протоколы и отчеты',
    component: Protocol,
  },
  { path: '/documents', name: 'Документы', component: Documents },
  { path: '/documents/:documentId', name: 'Документ', component: DocumentDoc },
  {
    path: '/orders/documents',
    name: 'Документы заявки',
    component: DocumentOrder,
  },
  {
    path: '/protocol-reports',
    name: 'Протоколы и отчеты',
    component: ProtocolReports,
  },
]

export default routes
