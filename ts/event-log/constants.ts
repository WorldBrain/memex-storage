import { StorageModuleCollections } from '@worldbrain/storex-pattern-modules'

export const COLLECTION_NAMES = {
     eventLog: 'eventLog'
}

export const COLLECTION_DEFINITIONS: StorageModuleCollections = {
    [COLLECTION_NAMES.eventLog]: {
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
