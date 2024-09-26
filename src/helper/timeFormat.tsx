import { string } from 'prop-types'

function setTime(value: any, withTime?: boolean) {
  const date = new Date(value).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  })
  const hour = new Date(value).toLocaleString('ru-RU', {
    hour: 'numeric',
    minute: 'numeric',
  })
  if (withTime) {
    return `${date} ${hour}`
  }

  return `${date}`
}
export default setTime

export const setTimeV2 = (date: Date | string | undefined) => {
  if (typeof date == 'string') {
    date = new Date(date)
  }
  if (!date) {
    date = new Date()
  }
  const day = date.getDate()
  const month = monthToWord(date.getUTCMonth() + 1)
  const year = date.getUTCFullYear()
  return `${day} ${month} ${year}`
}

export const monthToWord = (month: number) => {
  switch (month) {
    case 1:
      return 'Января'
    case 2:
      return 'Февраля'
    case 3:
      return 'Марта'
    case 4:
      return 'Апреля'
    case 5:
      return 'Мая'
    case 6:
      return 'Июня'
    case 7:
      return 'Июля'
    case 8:
      return 'Августа'
    case 9:
      return 'Сентября'
    case 10:
      return 'Октября'
    case 11:
      return 'Ноября'
    case 12:
      return 'Декабря'
    default:
      return month
  }
}
