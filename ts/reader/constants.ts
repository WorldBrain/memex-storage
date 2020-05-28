import { StorageModuleCollections } from '@worldbrain/storex-pattern-modules'

export const COLLECTION_NAMES = {
    readable: 'readable',
}

export const COLLECTION_DEFINITIONS: StorageModuleCollections = {
    [COLLECTION_NAMES.readable]: {
        version: new Date('2020-05-12'),
        fields: {
            url: { type: 'string' },
            fullUrl: { type: 'text' },
            title: { type: 'text' },
            content: { type: 'text', optional: true },
            length: { type: 'int', optional: true },
            strategy: { type: 'string' },
        },
        indices: [
            { field: 'url', pk: true },
            { field: 'fullUrl' },
            { field: 'title' },
        ],
    },
}
