export interface MetaTypeShape {
    name: string
    isChecked: boolean
    canAdd?: boolean
}

export interface Tag {
    url: string
    name: string
}

export interface List {
    id: number
    name: string
    isDeletable?: boolean
    isNestable?: boolean
    createdAt: Date
}

export interface ListEntry {
    listId: number
    pageUrl: string
    fullUrl: string
    createdAt: Date
}
