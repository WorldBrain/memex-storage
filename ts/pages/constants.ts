import { StorageModuleCollections } from '@worldbrain/storex-pattern-modules'

export const COLLECTION_NAMES = {
    page: 'pages',
    visit: 'visits',
    favIcon: 'favIcons',
    bookmark: 'bookmarks',
}

export const COLLECTION_DEFINITIONS: StorageModuleCollections = {
    [COLLECTION_NAMES.page]: {
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
    [COLLECTION_NAMES.visit]: {
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
    [COLLECTION_NAMES.bookmark]: {
        version: new Date('2018-02-01'),
        fields: {
            url: { type: 'string' },
            time: { type: 'timestamp' },
        },
        indices: [{ field: 'url', pk: true }, { field: 'time' }],
    },
    [COLLECTION_NAMES.favIcon]: {
        version: new Date('2018-02-01'),
        fields: {
            hostname: { type: 'string' },
            favIcon: { type: 'media' },
        },
        indices: [{ field: 'hostname', pk: true }],
    },
}
