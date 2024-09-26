import { CSpinner } from '@coreui/react-pro'
import React from 'react'

const LoadingSpinner = ({ color }: any) => {
  return (
    <div
      style={{
        flex: '1 1 auto',
        display: 'flex',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'stretch',
      }}
    >
      <CSpinner color={color} />
    </div>
  )
}

export default LoadingSpinner
