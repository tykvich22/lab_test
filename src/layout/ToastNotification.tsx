import { CToast, CToastBody, CToastHeader } from '@coreui/react-pro'
import React from 'react'

export const ToastNotification = (props: any) => {
  const { message, status } = props.props
  let color, finalMessage
  switch (+status) {
    case 200:
    case 201:
    case 202:
    case 203:
    case 204:
      color = '#39db39'
      finalMessage = message
      break
    case 500:
      color = '#f71414'
      finalMessage = message
      break
    case 403:
      color = '#f5e539'
      finalMessage = 'У вас нет прав на это действие'
      break
    case 404:
      color = '#f71414'
      finalMessage = 'Произошла ошибка подключения к серверу, попробуйте позже'
      break
    default:
      color = '#f71414'
      finalMessage = 'Произошла непредвиденная ошибка, попробуйте позже'
      break
  }
  return (
    <CToast className="toast" delay={20000} visible={true}>
      <CToastHeader closeButton>
        <svg
          className="rounded me-2"
          width="20"
          height="20"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
          role="img"
        >
          <rect width="100%" height="100%" fill={color}></rect>
        </svg>
        <div className="fw-bold me-auto">Оповещение о действии</div>
        <small>Только что</small>
      </CToastHeader>
      <CToastBody>{finalMessage}</CToastBody>
    </CToast>
  )
}
