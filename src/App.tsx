import { CSpinner } from '@coreui/react-pro'
import React, {
  PropsWithChildren,
  ReactElement,
  Suspense,
  useCallback,
  useEffect,
  useState,
} from 'react'
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom'
import './scss/style.scss'
import AuthApi from './views/auth/auth.api'

// Containers
import { useDispatch } from 'react-redux'

import Document from './views/documents/Document'
import DocumentDoc from './views/documents/DocumentDoc'
import OrderDetail from './views/order/Order'
import Protocol from './views/protocol-reports/Protocol'

import { useTypedSelector } from './store'

const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

const Login = React.lazy(() => import('./views/auth/Login'))
const Recovery = React.lazy(() => import('./views/auth/recovery'))

const Orders = React.lazy(() => import('./views/order/Orders'))
const ActiveOrders = React.lazy(() => import('./views/order/ActiveOrders'))

const ProtocolReports = React.lazy(
  () => import('./views/protocol-reports/ProtocolReports'),
)
const Documents = React.lazy(() => import('./views/documents/Documents'))
const DocumentOrder = React.lazy(
  () => import('./views/documents/DocumentOrder'),
)
const NewProtocols = React.lazy(
  () => import('./views/protocol-reports/NewProtocols'),
)

const RequireAuthHelper: React.FC<
  PropsWithChildren<{
    forbiddenRoles?: string[]
  }>
> = ({ children, forbiddenRoles }): ReactElement => {
  const loggedInUserRole = useTypedSelector((state) => state.dataUser?.roleName)

  const userCantAccess =
    loggedInUserRole && forbiddenRoles?.includes(loggedInUserRole)
      ? true
      : false

  if (!localStorage.access_token) {
    return <Navigate to="/login" />
  }

  if (forbiddenRoles && userCantAccess) {
    return <Navigate to="/" />
  }

  return <>{children}</>
}

const RequireAuth = React.memo(RequireAuthHelper)

const GuestRoutes = React.memo(function GuestRoutes({ children }: any) {
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  useEffect(() => {
    const abortController = new AbortController()
    AuthApi.getMe()
      .then(() => {
        navigate(`/dashboard`)
      })
      .catch(() => {
        setLoading(false)
      })

    return () => {
      abortController.abort()
    }
  }, [])

  return loading ? (
    <div
      style={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CSpinner color="primary" />
    </div>
  ) : (
    <>{children}</>
  )
})

const App = (): JSX.Element => {
  const ROLELAB = {
    labadmin: 'LabAdmin',
    labemployee: 'LabEmployee',
  }
  const ROLECOMPANY = {
    companyadmin: 'CompanyAdmin',
    companyemployee: 'CompanyEmployee',
  }

  return (
    <Router>
      <Suspense
        fallback={
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100vh',
              width: '100vw',
            }}
          >
            <CSpinner color="primary" />
          </div>
        }
      >
        <Routes>
          <Route
            path="/recovery"
            element={
              <GuestRoutes>
                <Recovery />
              </GuestRoutes>
            }
          />
          <Route
            path="/login"
            element={
              // <GuestRoutes>
              <Login />
              // </GuestRoutes>
            }
          />
          <Route path="/" element={<DefaultLayout />}>
            <Route
              index
              element={
                <RequireAuth>
                  <Navigate to="/dashboard" />
                </RequireAuth>
              }
            />

            <Route
              path="/protocol/:orderId/:id"
              element={
                <RequireAuth>
                  <Protocol />
                </RequireAuth>
              }
            />
            <Route
              path="/documents"
              element={
                <RequireAuth>
                  <Documents />
                </RequireAuth>
              }
            />
            <Route
              path="/documents/:documentId"
              element={
                <RequireAuth>
                  <DocumentDoc />
                </RequireAuth>
              }
            />
            <Route
              path="/orders/document/:id/:orderId"
              element={
                <RequireAuth>
                  <Document />
                </RequireAuth>
              }
            />
            <Route
              path="/orders/documents"
              element={
                <RequireAuth>
                  <DocumentOrder />
                </RequireAuth>
              }
            />

            <Route
              path="/counter-parties/:companyId/:id"
              element={
                <RequireAuth>
                  <Protocol />
                </RequireAuth>
              }
            />

            <Route
              path="/protocol-reports"
              element={
                <RequireAuth
                  forbiddenRoles={[ROLELAB.labadmin, ROLELAB.labemployee]}
                >
                  <ProtocolReports />
                </RequireAuth>
              }
            />
            <Route
              path="/protocol-reports/:id"
              element={
                <RequireAuth>
                  <Protocol />
                </RequireAuth>
              }
            />
            <Route
              path="/orders/:orderId/new-protocol"
              element={
                <RequireAuth
                  forbiddenRoles={[
                    ROLECOMPANY.companyadmin,
                    ROLECOMPANY.companyemployee,
                  ]}
                >
                  <NewProtocols />
                </RequireAuth>
              }
            />

            <Route
              path="/active-orders"
              element={
                <RequireAuth>
                  <ActiveOrders />
                </RequireAuth>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <RequireAuth>
                  <OrderDetail />
                </RequireAuth>
              }
            />
            <Route
              path="/orders"
              element={
                <RequireAuth>
                  <Orders />
                </RequireAuth>
              }
            />

            <Route
              path="*"
              element={
                <RequireAuth>
                  <Navigate replace to="/orders" />
                </RequireAuth>
              }
            />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
