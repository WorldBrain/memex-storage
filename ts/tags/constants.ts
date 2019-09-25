import { StorageModuleCollections } from '@worldbrain/storex-pattern-modules'

export const COLLECTION_NAMES = {
    tag: 'tags',
}

export const COLLECTION_DEFINITIONS: StorageModuleCollections = {
    [COLLECTION_NAMES.tag]: {
        version: new Date('2018-02-01'),
        fields: {
            url: { type: 'string' },
            name: { type: 'string' },
        },
        indices: [
            { field: ['name', 'url'], pk: true },
            { field: 'name' },
            { field: 'url' },
        ],
    },
}
