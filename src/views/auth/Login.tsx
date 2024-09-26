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
  CFormSelect,
} from '@coreui/react-pro'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthApi from './auth.api'
import logo from '../../assets/images/auth_logo.svg'

const Login = (): JSX.Element => {
  const navigate = useNavigate()
  const [validated, setValidated] = useState(false)
  const [state, setState] = useState<any>({
    loading: false,
    message: '',
  })
  const [options, setOptions] = useState<any>([])
  const [select, setSelect] = useState(false)
  const [lab, setLab] = useState<any>(null)

  useEffect(() => {
    localStorage.clear()
  }, [])

  const handleSubmit = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    if (select) {
      localStorage.setItem('lab', lab)
      navigate('/orders')
      return
    }
    setState({
      loading: true,
    })
    const form = e.currentTarget
    if (!form.checkValidity()) {
      setState({ loading: false })
      setValidated(false)
    }
    setValidated(true)
    AuthApi.login(form.login.value, form.password.value)
      .then((response) => {
        const data = response.data.filter((i: any) => i.schema !== 'public')
        localStorage.setItem('user', JSON.stringify(data[0]))
        localStorage.setItem('access_token', data[0].access_token)
        AuthApi.getRole(data[0].user.id).then((resp) => {
          localStorage.setItem('role', resp?.data?.role?.name)
        })
        if (data.length == 1) {
          localStorage.setItem('lab', JSON.stringify(data[0].schema))
          navigate('/orders')
          return
        } else if (data.length > 1) {
          setOptions(data.map((i: any) => i.schema))
          setSelect(true)
        }
      })

      .catch((error) => {
        console.log(error)
        return setState({
          loading: false,
          message: 'Неверный логин или пароль',
        })
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
                <div
                  style={{
                    padding: '50px 0',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <img src={logo} />
                </div>
                <CForm
                  className={'needs-validation'}
                  validated={validated}
                  onSubmit={handleSubmit}
                >
                  <h1>Вход</h1>
                  <p className="text-medium-emphasis">Войдите в свой аккаунт</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Введите email"
                      name={'login'}
                      autoComplete="login"
                      required={true}
                      onChange={() => {
                        setState((prev: any) => ({
                          loading: false,
                          message: '',
                        }))
                      }}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      id="password"
                      placeholder="Введите пароль"
                      type="password"
                      name={'password'}
                      autoComplete="password"
                      required={true}
                      onChange={() => {
                        setState((prev: any) => ({
                          loading: false,
                          message: '',
                        }))
                      }}
                    />
                  </CInputGroup>
                  {select ? (
                    <CFormSelect
                      style={{ marginBottom: '30px' }}
                      options={options}
                      onChange={(e: any) => {
                        setLab(e.target.value)
                      }}
                    />
                  ) : null}
                  {state.message ? (
                    <div>
                      <p className="text-danger">неверный логин или пароль</p>
                    </div>
                  ) : (
                    <></>
                  )}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <CRow>
                      <CCol xs={6}>
                        <CLoadingButton
                          color="dark"
                          className="px-4"
                          type={'submit'}
                          disabled={state.loading}
                          timeout={2000}
                        >
                          Войти
                        </CLoadingButton>
                      </CCol>
                    </CRow>
                    <div
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        navigate('/recovery')
                      }}
                    >
                      <p className="text-medium-emphasis">Забыли пароль?</p>
                    </div>
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

export default Login
