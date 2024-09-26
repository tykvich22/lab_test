import { cilSearch } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CFormInput } from '@coreui/react-pro'
import React, { useState } from 'react'

const searchBar: React.FC<{
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  value?: string
  placeholder: string
}> = ({ onChange, value, placeholder }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [search, setSearch] = useState('')

  return (
    <div
      style={{
        padding: '.1rem 0',
        display: 'flex',
        flexDirection: 'row',
        borderRadius: '.8rem',
        background: '#EBEDEF',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0 .8rem',
        }}
      >
        <CIcon
          style={{
            color: '#9DA5B1',
          }}
          icon={cilSearch}
        ></CIcon>
      </div>
      <CFormInput
        className="search-bar-input"
        placeholder={placeholder}
        style={{
          background: '#EBEDEF',
          border: 'none',
          paddingLeft: '0',
          borderRadius: '.8rem',
        }}
        onChange={(e) => {
          setSearch(e.target.value)
          onChange?.(e)
        }}
        value={value || search}
      />
    </div>
  )
}
export default React.memo(searchBar)
