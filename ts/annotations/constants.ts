import { StorageModuleCollections } from '@worldbrain/storex-pattern-modules'

export const annotationCollectionName = 'annotations'
export const annotationBookmarkCollectionName = 'annotBookmarks'
export const annotationListEntryCollectionName = 'annotListEntries'

export const annotationCollectionDefinition: StorageModuleCollections = {
    [annotationCollectionName]: {
        version: new Date('2019-02-19'),
        fields: {
            pageTitle: { type: 'text' },
            pageUrl: { type: 'url' },
            body: { type: 'text' },
            comment: { type: 'text' },
            selector: { type: 'json' },
            createdWhen: { type: 'datetime' },
            lastEdited: { type: 'datetime' },
            url: { type: 'string' },
        },
        indices: [
            { field: 'url', pk: true },
            { field: 'pageUrl' },
            { field: 'pageTitle' },
            { field: 'body' },
            { field: 'createdWhen' },
            { field: 'lastEdited' },
            { field: 'comment' },
        ],
        history: [
            {
                version: new Date('2018-08-26'),
                fields: {
                    pageTitle: { type: 'text' },
                    pageUrl: { type: 'url' },
                    body: { type: 'text' },
                    comment: { type: 'text' },
                    selector: { type: 'json' },
                    createdWhen: { type: 'datetime' },
                    lastEdited: { type: 'datetime' },
                    url: { type: 'string' },
                },
                indices: [
                    { field: 'url', pk: true },
                    { field: 'pageTitle' },
                    { field: 'body' },
                    { field: 'createdWhen' },
                    { field: 'comment' },
                ],
            },
        ],
    },
}

export const annotationBookmarkCollectionDefinition: StorageModuleCollections = {
    [annotationBookmarkCollectionName]: {
        version: new Date('2019-01-05'),
        fields: {
            url: { type: 'string' },
            createdAt: { type: 'datetime' },
        },
        indices: [
            { field: 'url', pk: true },
            { field: 'createdAt' },
        ],
    },
}

export const annotationListEntryCollectionDefinition: StorageModuleCollections = {
    [annotationListEntryCollectionName]: {
        version: new Date('2019-01-04'),
        fields: {
            listId: { type: 'int' },
            url: { type: 'string' },
            createdAt: { type: 'datetime' },
        },
        indices: [
            { field: ['listId', 'url'], pk: true },
            { field: 'listId' },
            { field: 'url' },
        ],
    },
}
