import { StorageModuleCollections } from '@worldbrain/storex-pattern-modules'

export const COLLECTION_NAMES = {
    readablePage: 'readablePageArchives',
}

export const COLLECTION_DEFINITIONS: StorageModuleCollections = {
    [COLLECTION_NAMES.readablePage]: {
        version: new Date('2020-05-12'),
        fields: {
            url: { type: 'string' },
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
