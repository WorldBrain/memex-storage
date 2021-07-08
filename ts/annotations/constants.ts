import { StorageModuleCollections } from '@worldbrain/storex-pattern-modules'
import { STORAGE_VERSIONS } from '../browser-extension/storage/versions'

export const COLLECTION_NAMES = {
    annotation: 'annotations',
    annotationPrivacy: 'annotationPrivacyLevels',
    listEntry: 'annotListEntries',
    bookmark: 'annotBookmarks',
}

export const COLLECTION_DEFINITIONS: StorageModuleCollections = {
    [COLLECTION_NAMES.annotation]: {
        version: new Date('2019-02-19'),
        fields: {
            pageTitle: { type: 'text' },
            pageUrl: { type: 'string' },
            body: { type: 'text', optional: true },
            comment: { type: 'text', optional: true },
            selector: { type: 'json', optional: true },
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
                    pageUrl: { type: 'string' },
                    body: { type: 'text', optional: true },
                    comment: { type: 'text', optional: true },
                    selector: { type: 'json', optional: true },
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
    [COLLECTION_NAMES.annotationPrivacy]: {
        version: new Date(STORAGE_VERSIONS[24].version),
        fields: {
            annotation: { type: 'string' }, // TODO: Set this as a proper FK to annotation collection
            privacyLevel: { type: 'int' },
            createdWhen: { type: 'datetime' },
            updatedWhen: { type: 'datetime', optional: true },
        },
        indices: [{ field: 'annotation' }],
    },
    [COLLECTION_NAMES.bookmark]: {
        version: new Date('2019-01-05'),
        fields: {
            url: { type: 'string' },
            createdAt: { type: 'datetime' },
        },
        indices: [{ field: 'url', pk: true }, { field: 'createdAt' }],
    },
    [COLLECTION_NAMES.listEntry]: {
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
