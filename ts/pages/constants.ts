import { StorageModuleCollections } from '@worldbrain/storex-pattern-modules'
import { STORAGE_VERSIONS } from '../browser-extension/storage/versions'

export const COLLECTION_NAMES = {
    page: 'pages',
    visit: 'visits',
    favIcon: 'favIcons',
    bookmark: 'bookmarks',
    locators: 'locators',
}

export const COLLECTION_DEFINITIONS: StorageModuleCollections = {
    [COLLECTION_NAMES.page]: {
        version: STORAGE_VERSIONS[0].version,
        fields: {
            url: { type: 'string' },
            fullUrl: { type: 'text' },
            domain: { type: 'string' },
            hostname: { type: 'string' },
            fullTitle: { type: 'text', optional: true },
            text: { type: 'text', optional: true },
            screenshot: { type: 'blob', optional: true },
            lang: { type: 'string', optional: true },
            canonicalUrl: { type: 'string', optional: true },
            description: { type: 'text', optional: true },
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
        version: STORAGE_VERSIONS[0].version,
        fields: {
            url: { type: 'string' },
            time: { type: 'timestamp' },
            duration: { type: 'int', optional: true },
            scrollMaxPerc: { type: 'float', optional: true },
            scrollMaxPx: { type: 'float', optional: true },
            scrollPerc: { type: 'float', optional: true },
            scrollPx: { type: 'float', optional: true },
        },
        indices: [{ field: ['time', 'url'], pk: true }, { field: 'url' }],
    },
    [COLLECTION_NAMES.bookmark]: {
        version: STORAGE_VERSIONS[0].version,
        fields: {
            url: { type: 'string' },
            time: { type: 'timestamp' },
        },
        indices: [{ field: 'url', pk: true }, { field: 'time' }],
    },
    [COLLECTION_NAMES.favIcon]: {
        version: STORAGE_VERSIONS[0].version,
        fields: {
            hostname: { type: 'string' },
            favIcon: { type: 'blob' },
        },
        indices: [{ field: 'hostname', pk: true }],
    },
    [COLLECTION_NAMES.locators]: {
        version: STORAGE_VERSIONS[26].version,
        fields: {
            normalizedUrl: { type: 'string' },
            locationType: { type: 'string' },
            location: { type: 'string' },
            format: { type: 'string' },
            originalLocation: { type: 'string' },
            locationScheme: { type: 'string' },
            primary: { type: 'boolean' },
            valid: { type: 'boolean' },
            version: { type: 'timestamp' },
            fingerprintScheme: { type: 'string', optional: true },
            fingerprint: { type: 'string', optional: true },
            lastVisited: { type: 'timestamp', optional: true },
            contentSize: { type: 'int', optional: true }, // in bytes
        },
        indices: [
            { field: 'normalizedUrl' },
            { field: 'fingerprint' }
        ]
    }
}
