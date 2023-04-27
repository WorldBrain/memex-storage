import type { StorageModuleCollections } from '@worldbrain/storex-pattern-modules'

export const COLLECTION_NAMES = {
    templates: 'templates',
}

export const COLLECTION_DEFINITIONS: StorageModuleCollections = {
    [COLLECTION_NAMES.templates]: {
        version: new Date('2020-06-03'),
        fields: {
            id: { type: 'int' },
            title: { type: 'string' },
            code: { type: 'string' },
            isFavourite: { type: 'boolean' },
            outputFormat: { type: 'string' },
        },
        indices: [
            { field: 'id', pk: true },
            { field: 'title' },
            { field: 'code' },
            { field: 'isFavourite' },
        ],
    },
}
