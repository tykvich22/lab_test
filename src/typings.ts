export interface UserLoginResult {
  jwt: any
  user: {
    companies: any
    blocked: boolean
    confirmed: boolean
    createdAt: Date
    email: string
    id: number
    provider?: string
    updatedAt?: Date
    username?: string
  }
  access_token: string
}

export interface PushResponse {
  loading: boolean
  result:
    | {
        id: number
        email: string
        phone?: string
        lastName?: string
        firstName?: string
        patronymic?: string
        city?: string
        age?: number
        childrenAmount?: number
        balance: number
        qrcodes: QrCode[]
      }[]
    | undefined
}

export interface QrCode {
  id: number
  userId: number
  t: string
  s: string
  fn: string
  i: string
  fp: string
  n: number
  createdAt: string
  updatedAt: string
}

export interface Banner {
  id: number
  name: string
  active: boolean
  position: 'TOP' | 'BOTTOM' | 'MIDDLE'
  from?: number
  mediaId?: number
  linkId?: number
  linkType?: string
  to?: number
  previewPicture?: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface CreateBannerDto extends Partial<Banner> {
  id?: number
  name?: string
  active?: boolean
  position?: 'TOP' | 'BOTTOM' | 'MIDDLE'
}

export type UpdateBannerDto = CreateBannerDto

export interface Category {
  id: number
  parentId?: number
  title: string
  previewPicture?: string
  active: boolean
}

export type UpdateCategoryDto = Partial<Category>

export interface User {
  id: number
  roleId: number
  email: string
  activationState: boolean
  lastLogin?: Date
  lastLogout?: Date
  lastActivity?: Date
  lastLoginIp?: string
  phone: string
  lastName: string
  firstName: string
  patronymic?: string
  city: string
  age: number
  childrenAmount: number
  balance: number
  createdAt: Date
}

export type UpdateUserDto = Partial<User>

export interface Promotion {
  id: number
  companyId: number
  company: any
  name?: string
  description?: string
  site?: any
  from: string
  to?: string
  active: boolean
  previewPicture: string
  detailsPicture?: string
  createdAt: string
  updatedAt: string
}

export type UpdatePromotionDto = Partial<Promotion>

export type CreatePromotionDto = Partial<Promotion>

export interface Role {
  roleId: number
  roleName: string
}

export type UpdateRoleDto = Partial<Role>

export type CreateRoleDto = Role

export interface News {
  name?: string
  active: boolean
  from?: string
  to?: string
  previewPicture?: string
  previewText?: string
  detailsPicture?: string
  description?: string
  createdAt: string
  updatedAt: string
}

export type UpdateNewsDto = Partial<News>

export type CreateNewsDto = Partial<News>

export interface Rule {
  id: number
  entity: 'createdAt' | 'lastLogin' | 'lastActivity' | 'age' | 'childrenAmount'
  condition: 'gt' | 'lt' | 'eq'
  value: string
}

export enum TargetPlatforms {
  iOS = 'iOS',
  Android = 'Android',
}

export enum Tabs {
  first = 'first',
  second = 'second',
  third = 'third',
}

export enum OrderStatus {
  NEW = 'new',
  WIP = 'wip',
  DONE = 'done',
}

export interface Campaign {
  id?: string
  displayName?: string
  notificationOptions: {
    title: string
    text: string
    imageUrl?: string
  }
  targetPlatform: TargetPlatforms
  targetingJson: any
  startTime?: Date
  criteria: 'all' | 'any'
  conditions?: Rule[]
  data?: {
    [key: string]: string
  }
}

export type UpdateCampaignDto = Partial<Campaign>
