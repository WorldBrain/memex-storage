import { StorageModuleCollections } from '@worldbrain/storex-pattern-modules'

export const eventLogCollectionName = 'eventLog'

export const eventLogCollectionDefinition: StorageModuleCollections = {
    [eventLogCollectionName]: {
        version: new Date('2018-07-14'),
        fields: {
            time: { type: 'datetime' },
            type: { type: 'string' },
            details: { type: 'json' },
        },
        indices: [
            { field: ['time', 'type'], pk: true },
            { field: 'time' },
            { field: 'type' },
        ],
        watch: false,
        backup: false,
    },
}
