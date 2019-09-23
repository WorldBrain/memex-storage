import { StorageModuleCollections } from '@worldbrain/storex-pattern-modules'

export const tagCollectionName = 'tags'

export const tagCollectionDefinition: StorageModuleCollections = {
    [tagCollectionName]: {
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
