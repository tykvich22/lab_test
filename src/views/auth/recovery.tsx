import { cilUser, cilLockLocked } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CContainer,
  CRow,
  CCol,
  CCardGroup,
  CCard,
  CAlert,
  CCardBody,
  CForm,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CLoadingButton,
} from '@coreui/react-pro'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthApi from './auth.api'
import logo from '../../assets/icons/lab-expert.png'

const Recovery = (): JSX.Element => {
  const navigate = useNavigate()
  const [validated, setValidated] = useState(false)
  const [state, setState] = useState<any>({
    loading: false,
    message: '',
  })
  const [data, setData] = useState<any>({
    email: '',
  })

  const handleSubmit = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    setState({
      loading: true,
    })
    const form = e.currentTarget
    if (!form.checkValidity()) {
      setState({ loading: false })
      setValidated(false)
    }
    setValidated(true)
    AuthApi.recovery(data.email)
      .then((response) => {
        console.log(response, '<<<<<<RESPONSE')

        // if (response.data.jwt) {
        //   localStorage.setItem('user', JSON.stringify(response.data))
        //   localStorage.setItem('access_token', response.data.jwt)
        //   navigate('/dashboard')
        //   window.location.reload()
        // }
      })
      .catch((error) => {
        console.log(error, '<<<<<<error')
        // if (error.response.status === 404)
        //   return setState({
        //     loading: false,
        //     message: 'Неверный логин или пароль',
        //   })
      })
    setState((prev: any) => ({ ...prev, ...{ loading: false } }))
  }
  return (
    <CContainer>
      <CRow className="justify-content-center">
        <CCol md={8}>
          <CCardGroup
            style={{
              marginTop: '50px',
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            <CCard className="p-4">
              <CCardBody>
                <CForm
                  className={'needs-validation'}
                  validated={validated}
                  onSubmit={handleSubmit}
                >
                  <h1>Восстановление пароля</h1>
                  <p className="text-medium-emphasis">Введите свой email</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="email"
                      name={'email'}
                      autoComplete="email"
                      required={true}
                      onChange={(e) => {
                        setData({ ...data, email: e.target.value })
                      }}
                    />
                  </CInputGroup>
                  <div>
                    <p className="text-medium-emphasis">
                      Мы отправим Вам письмо <br /> Откройте для восстановления
                      пароля
                    </p>
                    <CRow>
                      <CCol xs={6}>
                        <CLoadingButton
                          color="dark"
                          className="px-4"
                          type={'submit'}
                          disabled={state.loading}
                          timeout={2000}
                          onClick={() => handleSubmit}
                        >
                          Отправить
                        </CLoadingButton>
                      </CCol>
                    </CRow>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default Recovery
