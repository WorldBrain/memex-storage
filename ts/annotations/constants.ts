export const annotationCollectionName = 'annotations'
export const annotationBookmarkCollectionName = 'annotBookmarks'
export const annotationListEntryCollectionName = 'annotListEntries'

export const annotationCollectionDefinition = {
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
    },
}

export const annotationCollectionHistory = [
    {
        version: new Date(2018, 7, 26),
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
]

export const annotationBookmarkCollectionDefinition = {
    [annotationBookmarkCollectionName]: {
        version: new Date(2019, 0, 5),
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

export const annotationListEntryCollectionDefinition = {
    [annotationListEntryCollectionName]: {
        version: new Date(2019, 0, 4),
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
