import { CButton, CCard, CCardBody, CCardText } from '@coreui/react-pro'
import React from 'react'

const OrderForm = ({
  orderNumber,
  dateProcess,
  time,
  createdAt,
  workType,
  objectConstruction,
  objectControl,
  projectName,
  companyName,
  employeeName,
  companyPhone,
  samplingLocation,
  shortInformation,
  aktNumber = '5',
  onModal = false,
  dateTesting,
  timeTesting,
}: any): any => {
  const getDate = (date: any, time?: boolean) => {
    const dateObj = new Date(date)
    const month = dateObj.getUTCMonth() + 1 //months from 1-12
    const day = dateObj.getUTCDate()
    const year = dateObj.getUTCFullYear()
    if (time) {
      const hour = date.split(':')[0]
      const minute = date.split(':')[1]

      return `${hour}:${minute}`
    }
    return day + '-' + month + '-' + year
  }

  return (
    <>
      {onModal ? (
        <CCard style={{ width: '28rem', boxShadow: 'unset' }}>
          <CCardBody>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div
                style={{
                  width: '200px',
                  fontSize: '16px',
                  color: 'black',
                  textAlign: 'end',
                }}
              >
                <p>Генеральному директору ООО «ДЛ-Юг» А. Ю. Макайда</p>
              </div>
            </div>
            <div>
              <div
                style={{
                  margin: '0 auto',
                  width: '160px',
                  fontSize: '16px',
                  color: 'black',
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}
              >
                <p style={{}}>
                  Заявка № {orderNumber} от {getDate(createdAt)}г.
                </p>
              </div>
            </div>
            <div
              style={{
                marginTop: '10px',
              }}
            >
              <div
                style={{
                  width: '330px',
                  fontSize: '10px',
                  color: 'black',
                  textAlign: 'left',
                }}
              >
                <p>Прошу провести испытания по ниже указанным параметрам:</p>
              </div>
            </div>
            <div
              style={{
                width: '400px',
                fontSize: '10px',
                color: 'black',
                textAlign: 'left',
              }}
            >
              <p>
                Дата отбора проб: {dateProcess ? getDate(dateProcess) : '-'}
              </p>
              <p style={{ marginTop: '-12px' }}>
                Время отбора проб: {time ? getDate(time, true) : '-'}
              </p>
              <p style={{ marginTop: '-12px' }}>
                Дата проведения испытаний:{' '}
                {dateTesting ? getDate(dateTesting) : '-'}
              </p>
              <p style={{ marginTop: '-12px' }}>
                Время проведения испытаний:{' '}
                {timeTesting ? getDate(timeTesting, true) : '-'}
              </p>
              <p style={{ marginTop: '-12px' }}>Вид работы: {workType}</p>
              <p style={{ marginTop: '-12px' }}>
                Объект строительства: {objectConstruction}
              </p>
              <p style={{ marginTop: '-12px' }}>
                Объект контроля: {objectControl}
              </p>
              <p style={{ marginTop: '-12px' }}>
                Место отбора проб: {samplingLocation}
              </p>
              <p style={{ marginTop: '-12px' }}>Проект: {projectName}</p>
            </div>
            <div>
              <div
                style={{
                  width: '250px',
                  fontSize: '10px',
                  color: 'black',
                  textAlign: 'center',
                  margin: '0 auto',
                }}
              >
                <p>
                  Краткая информация: (класс прочности бетона; материал; тип
                  грунта; и т.д.)
                </p>
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: '10px',
                  color: 'black',
                  textAlign: 'center',
                  wordBreak: 'break-word',
                }}
              >
                <p>{shortInformation}</p>
              </div>
            </div>
            <div
              style={{
                marginTop: '70px',
              }}
            >
              <div
                style={{
                  fontSize: '10px',
                  color: 'black',
                  textAlign: 'left',
                }}
              >
                <p style={{ marginTop: '-12px' }}>Контрагент: {companyName}</p>
                <p style={{ marginTop: '-12px' }}>
                  Заявку составил: {employeeName}
                </p>
                <p style={{ marginTop: '-12px' }}>
                  Телефон составителя: +{companyPhone}
                </p>
                <p style={{ fontWeight: 'bold', marginTop: '-12px' }}>
                  Приложение: Акт отбора проб № {aktNumber || '-'}
                </p>
              </div>
            </div>
          </CCardBody>
        </CCard>
      ) : (
        <CCard style={{ width: '18rem' }}>
          <CCardBody>
            <div
              style={{
                display: 'flex',
                justifyContent: 'end',
              }}
            >
              <div
                style={{
                  width: '70px',
                  fontSize: '5px',
                  color: 'black',
                  textAlign: 'end',
                }}
              >
                <p>Генеральному директору ООО «ДЛ-Юг» А. Ю. Макайда</p>
              </div>
            </div>
            <div>
              <div
                style={{
                  margin: '0 auto',
                  width: '60px',
                  fontSize: '6px',
                  color: 'black',
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}
              >
                <p>
                  Заявка № {orderNumber} от {getDate(createdAt)}г.
                </p>
              </div>
            </div>
            <CCardText>
              <div>
                <div
                  style={{
                    width: '200px',
                    fontSize: '5px',
                    color: 'black',
                    textAlign: 'left',
                  }}
                >
                  <p>Прошу провести испытания по ниже указанным параметрам:</p>
                </div>
                <div
                  style={{
                    width: '200px',
                    fontSize: '5px',
                    color: 'black',
                    textAlign: 'left',
                  }}
                >
                  <p>
                    Дата отбора проб: {dateProcess ? getDate(dateProcess) : '-'}
                  </p>
                  <p style={{ marginTop: '-12px' }}>
                    Время отбора проб: {time ? getDate(time, true) : '-'}
                  </p>
                  <p style={{ marginTop: '-12px' }}>
                    Дата проведения испытаний:{' '}
                    {dateTesting ? getDate(dateTesting) : '-'}
                  </p>
                  <p style={{ marginTop: '-12px' }}>
                    Время проведения испытаний:{' '}
                    {timeTesting ? getDate(timeTesting, true) : '-'}
                  </p>
                  <p style={{ marginTop: '-12px' }}>Вид работы: {workType}</p>
                  <p style={{ marginTop: '-12px' }}>
                    Объект строительства: {objectConstruction}
                  </p>
                  <p style={{ marginTop: '-12px' }}>
                    Объект контроля: {objectControl}
                  </p>
                  <p style={{ marginTop: '-12px' }}>
                    Место отбора проб: {samplingLocation}
                  </p>
                  <p style={{ marginTop: '-12px' }}>Проект: {projectName}</p>
                </div>
              </div>
              <div>
                <div
                  style={{
                    width: '150px',
                    fontSize: '5px',
                    color: 'black',
                    textAlign: 'center',
                    margin: '0 auto',
                  }}
                >
                  <p>
                    Краткая информация: (класс прочности бетона; материал; тип
                    грунта; и т.д.)
                  </p>
                </div>
              </div>
              <div
                style={{
                  width: '16rem',
                  margin: '0 auto',
                }}
              >
                <div
                  style={{
                    fontSize: '5px',
                    color: 'black',
                    textAlign: 'center',
                  }}
                >
                  <p>{shortInformation}</p>
                </div>
              </div>
              <div
                style={{
                  marginTop: '35px',
                }}
              >
                <div
                  style={{
                    width: '150px',
                    fontSize: '5px',
                    color: 'black',
                    textAlign: 'left',
                  }}
                >
                  <p style={{ marginTop: '-12px' }}>
                    Контрагент: {companyName}
                  </p>
                  <p style={{ marginTop: '-12px' }}>
                    Заявку составил: {employeeName}
                  </p>
                  <p style={{ marginTop: '-12px' }}>
                    Телефон составителя: +{companyPhone}
                  </p>
                  <p style={{ fontWeight: 'bold', marginTop: '-12px' }}>
                    Приложение: Акт отбора проб № {aktNumber || '-'}
                  </p>
                </div>
              </div>
            </CCardText>
          </CCardBody>
        </CCard>
      )}
    </>
  )
}

export default React.memo(OrderForm)
