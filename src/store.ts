import { createStore, applyMiddleware, compose } from 'redux'
import { useSelector, TypedUseSelectorHook } from 'react-redux'

export type state = {
  sidebarShow: boolean
  sidebarUnfoldable: boolean
  asideShow: boolean
  modalLogout: boolean
  modalLogoutTelegram: number | string | null
  theme: string
  role: boolean
  isLabRole: boolean
  dataAddOrder: {
    id: string
    date_finish: string
    userResponsible: any
    dateTesting?: string | null
  }
  dataUser: {
    id: string
    hash_telegraf: string
    telegram: undefined | string
    telegramUserId: undefined | string
    role: string
    roleName: string
    firstName: string
    lastName: string
  }
  order: string
  company: {
    id: number
    name: string
    telephone: string
    legalAddress: string
    fullNameOfDirector: string
    typeOwnership: string
    type: string
  }
  isSuperAdmin?: boolean
  toast:
    | [
        {
          message: string
          visible: boolean
          status: number | string
        },
      ]
    | []
}

const initialState: state = {
  sidebarShow: true,
  sidebarUnfoldable: false,
  asideShow: false,
  modalLogout: false,
  modalLogoutTelegram: null,
  theme: 'default',
  role: false,
  isLabRole: false,
  dataAddOrder: {
    id: '',
    date_finish: '',
    userResponsible: '',
    dateTesting: null,
  },
  dataUser: {
    id: '',
    hash_telegraf: '',
    telegram: undefined,
    telegramUserId: undefined,
    role: '',
    roleName: '',
    firstName: '',
    lastName: '',
  },
  order: '',
  company: {
    id: 0,
    name: '',
    telephone: '',
    legalAddress: '',
    fullNameOfDirector: '',
    typeOwnership: '',
    type: '',
  },
  toast: [],
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type args = { type?: string; [key: string]: any }

const changeState = (state = initialState, { type, ...rest }: any) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    case 'toast':
      return { ...state, toast: [...state.toast, { ...rest }] }
    case 'cleanToast':
      return { ...state, toast: [] }
    default:
      return state
  }
}

const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(changeState, composeEnhancers(applyMiddleware()))

export default store

// https://react-redux.js.org/using-react-redux/static-typing#typing-the-useselector-hook
export const useTypedSelector: TypedUseSelectorHook<state> = useSelector
