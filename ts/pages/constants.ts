import { StorageModuleCollections } from '@worldbrain/storex-pattern-modules'

export const pageCollectionName = 'pages'
export const visitCollectionName = 'visits'
export const bookmarkCollectionName = 'bookmarks'
export const favIconCollectionName = 'favIcons'

export const pageCollectionDefinition: StorageModuleCollections = {
    [pageCollectionName]: {
        version: new Date('2018-02-01'),
        fields: {
            url: { type: 'string' },
            fullUrl: { type: 'text' },
            fullTitle: { type: 'text' },
            text: { type: 'text' },
            domain: { type: 'string' },
            hostname: { type: 'string' },
            screenshot: { type: 'media' },
            lang: { type: 'string' },
            canonicalUrl: { type: 'url' },
            description: { type: 'text' },
        },
        indices: [
            { field: 'url', pk: true },
            { field: 'text', fullTextIndexName: 'terms' },
            { field: 'fullTitle', fullTextIndexName: 'titleTerms' },
            { field: 'fullUrl', fullTextIndexName: 'urlTerms' },
            { field: 'domain' },
            { field: 'hostname' },
        ],
    },
}

export const visitCollectionDefinition: StorageModuleCollections = {
    [visitCollectionName]: {
        version: new Date('2018-02-01'),
        fields: {
            url: { type: 'string' },
            time: { type: 'timestamp' },
            duration: { type: 'int' },
            scrollMaxPerc: { type: 'float' },
            scrollMaxPx: { type: 'float' },
            scrollPerc: { type: 'float' },
            scrollPx: { type: 'float' },
        },
        indices: [{ field: ['time', 'url'], pk: true }, { field: 'url' }],
    },
}

export const bookmarkCollectionDefinition: StorageModuleCollections = {
    [bookmarkCollectionName]: {
        version: new Date('2018-02-01'),
        fields: {
            url: { type: 'string' },
            time: { type: 'timestamp' },
        },
        indices: [{ field: 'url', pk: true }, { field: 'time' }],
    },
}

export const favIconCollectionDefinition: StorageModuleCollections = {
    [favIconCollectionName]: {
        version: new Date('2018-02-01'),
        fields: {
            hostname: { type: 'string' },
            favIcon: { type: 'media' },
        },
        indices: [{ field: 'hostname', pk: true }],
    },
}
