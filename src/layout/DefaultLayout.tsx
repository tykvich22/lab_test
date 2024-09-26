import React, { Suspense, useCallback, useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import {
  CButton,
  CContainer,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CSpinner,
} from '@coreui/react-pro'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import api from '../api'
import { AppAside, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { useTypedSelector } from '../store'
import AuthApi from '../views/auth/auth.api'
import { ToastNotification } from './ToastNotification'

const DefaultLayout = (): JSX.Element => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const modalLogoutStatus = useTypedSelector((state) => state.modalLogout)
  const modalLogoutTelegram = useTypedSelector(
    (state) => state.modalLogoutTelegram,
  )
  const userDataStore = useTypedSelector((state) => state.dataUser)
  const [isLoading, setIsLoading] = useState(true)
  const notifications = useTypedSelector<any>((state) => state.toast)

  const getRole = useCallback(
    function getRole(abortController: AbortController) {
      // this is needed because of when user logout, we clear the global store about the user data
      // so when they login, we don't fetch the logged in user, because of we not re-render <App /> Component,
      // so we needed to refetch it here, but we skip if already there dataUser in store
      if (userDataStore?.id) {
        setIsLoading(false)
        return
      }
      AuthApi.getMe(abortController)
        .then((result) => {
          return AuthApi.getRole(result.data.id, abortController).then(
            (res: any) => {
              console.log(res)
              dispatch({
                type: 'set',
                dataUser: {
                  id: res?.data?.id,
                  hash_telegraf: result?.data?.hash_telegraf,
                  telegram: result?.data?.telegram,
                  telegramUserId: result?.data?.telegramUserId,
                  role: res?.data?.role?.name,
                  roleName: res?.data?.role?.displayName,
                  firstName: res?.data?.name,
                  lastName: res?.data?.surname,
                },
              })
              const isLabRole =
                res?.data?.role?.name == 'labadmin' ||
                res?.data?.role?.name == 'labemployee'

              console.log(isLabRole)
              dispatch({
                type: 'set',
                role: res?.data?.role,
                isLabRole: isLabRole,
              })
              // console.log(res?.data)

              return api.get(`/v1/companies/${res?.data?.companyId}`)
            },
          )
        })
        .then((resp) => {
          //REMOVE LATER\
          console.log(resp)
          const getDataCompany = resp?.data
          if (getDataCompany) {
            dispatch({
              type: 'set',
              company: {
                id: getDataCompany.id,
                typeOwnership: getDataCompany?.legalForm,
                name: getDataCompany.name,
                telephone: getDataCompany.phone,
                legalAddress: getDataCompany.address,
                fullNameOfDirector: 'Sergey',
                type: getDataCompany.type,
              },
            })
          }
          setIsLoading(false)
        })
        .catch((err) => {
          const status = err.response?.status
          if (status === 403 || status === 401) {
            navigate('/login')
          }
        })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  useEffect(() => {
    const abortController = new AbortController()
    getRole(abortController)
    return () => {
      abortController.abort()
    }
  }, [getRole])

  console.log(notifications)

  return isLoading ? (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <CSpinner color="primary" />
    </div>
  ) : (
    <>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1 px-4 py-4">
          <CContainer lg>
            <div className="toast-wrapper">
              {notifications?.map((item: any, i: number) => {
                console.log(item)
                return <ToastNotification key={i} props={item.toast} />
              })}
            </div>
            <CModal
              onClose={() => dispatch({ type: 'set', modalLogout: false })}
              visible={modalLogoutStatus}
            >
              <CModalHeader>
                <CModalTitle>Подтверждение</CModalTitle>
              </CModalHeader>
              <CModalBody>{'Уверены, что хотите выйти?'}</CModalBody>
              <CModalFooter>
                <CButton
                  onClick={() => {
                    localStorage.clear()
                    navigate('/login')
                    dispatch({ type: 'set', modalLogout: false })
                    dispatch({
                      type: 'set',
                      dataUser: null,
                      role: false,
                      isLabRole: false,
                      company: {},
                    })
                    dispatch({
                      type: 'cleanToast',
                    })
                  }}
                  style={{
                    backgroundColor: '#747DEA',
                  }}
                >
                  Да
                </CButton>
                <CButton
                  onClick={() => {
                    dispatch({ type: 'set', modalLogout: false })
                  }}
                  color="secondary"
                >
                  Нет
                </CButton>
              </CModalFooter>
            </CModal>
            <CModal
              onClose={() => dispatch({ type: 'set', modalLogout: false })}
              visible={modalLogoutTelegram !== null}
            >
              <CModalHeader>
                <CModalTitle>Подтверждение</CModalTitle>
              </CModalHeader>
              <CModalBody>
                {modalLogoutTelegram == 0
                  ? 'Уверены, что хотите отключить уведомления в Telegram?'
                  : 'Уверены, что хотите отключить уведомления в Telegram для этого пользователя?'}
              </CModalBody>
              <CModalFooter>
                <CButton
                  onClick={() => {
                    dispatch({ type: 'set', modalLogoutTelegram: null })
                  }}
                  color="secondary"
                >
                  Нет
                </CButton>
              </CModalFooter>
            </CModal>
            <Suspense fallback={<CSpinner color="primary" />}>
              <Outlet />
            </Suspense>
          </CContainer>
        </div>
        {/* <AppFooter /> */}
      </div>
      <AppAside />
    </>
  )
}

export default DefaultLayout
