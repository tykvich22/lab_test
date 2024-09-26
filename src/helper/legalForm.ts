export const legalForm = (form: string) => {
  switch (form) {
    case 'ООО':
      return 'Общество с Ограниченной Ответственностью'
    case 'ЗАО':
      return 'Закрытое Акционерное Общество'
    case 'ОАО':
      return 'Открытое Акционерное Общество'
    case 'АО':
      return 'Акционерное Общество'
    case 'ПАО':
      return 'Публичное Акционерное Общество'
    case 'ИП':
      return 'Индивидуальный Предприниматель'
    default:
      return 'Индивидуальный Предприниматель'
  }
}
