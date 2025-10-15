export type TLabel = Array<{ text: string }>

export interface IAccount {
  id: string
  labels?: TLabel
  type: 'LDAP' | 'LOCAL'
  login: string
  password: string | null
}

export interface IAccountList {
  isPending: boolean
  isError: boolean
  accounts: Array<IAccount>
}

export enum TYPE_TEXT {
  'LDAP' = 'LDAP',
  'LOCAL' = 'локальный',
}
