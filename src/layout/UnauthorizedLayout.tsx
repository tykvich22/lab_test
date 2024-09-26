import { CContainer, CSpinner } from '@coreui/react-pro'
import React, { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { AppFooter, AppAside } from '../components'

const UnauthorizedLayout = (): JSX.Element => {
  return (
    <>
      <div className="wrapper d-flex flex-column min-vh-100 bg-light dark:bg-transparent">
        <div className="body d-flex align-items-center flex-grow-1 px-3">
          <CContainer lg>
            <Suspense fallback={<CSpinner color="primary" />}>
              <Outlet />
            </Suspense>
          </CContainer>
        </div>
        <AppFooter />
      </div>
      <AppAside />
    </>
  )
}
export default UnauthorizedLayout
