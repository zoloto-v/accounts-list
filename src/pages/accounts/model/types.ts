interface IColumn {
  key?: string
  value?: string
  title?: string
  fixed?: boolean
  align?: 'start' | 'end' | 'center'
  width?: number | string
  minWidth?: number | string
  maxWidth?: number | string
  sortable?: boolean
}

export type IHeaders = Array<IColumn>
