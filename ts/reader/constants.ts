import { StorageModuleCollections } from '@worldbrain/storex-pattern-modules'
import { STORAGE_VERSIONS } from '../browser-extension/storage/versions'

export const COLLECTION_NAMES = {
    readablePage: 'readablePageArchives',
}

export const COLLECTION_DEFINITIONS: StorageModuleCollections = {
    [COLLECTION_NAMES.readablePage]: {
        version: STORAGE_VERSIONS[20].version,
        fields: {
            url: { type: 'string' },
            title: { type: 'text' },
            excerpt: { type: 'text', optional: true },
            byline: { type: 'text', optional: true },
            dir: { type: 'string' },
            content: { type: 'text' },
            length: { type: 'int' },
            strategy: { type: 'string' },
            createdWhen: { type: 'datetime' },
            lastEdited: { type: 'datetime' },
        },
        indices: [
            { field: 'url', pk: true },
            { field: 'createdWhen' },
            { field: 'lastEdited' },
        ],
    },
}
