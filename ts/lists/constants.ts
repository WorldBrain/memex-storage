import { StorageModuleCollections } from '@worldbrain/storex-pattern-modules'
import { STORAGE_VERSIONS } from '../browser-extension/storage/versions'

export const SPECIAL_LIST_NAMES = {
    MOBILE: 'Saved from Mobile',
    INBOX: 'Inbox',
}

export const SPECIAL_LIST_IDS = {
    INBOX: 20201014,
}

export const COLLECTION_NAMES = {
    list: 'customLists',
    listEntry: 'pageListEntries',
    listDescription: 'customListDescriptions',
    listEntryDescription: 'pageListEntryDescriptions',
}

export const COLLECTION_DEFINITIONS: StorageModuleCollections = {
    [COLLECTION_NAMES.list]: {
        version: new Date('2019-09-13'),
        fields: {
            id: { type: 'int' },
            name: { type: 'string' },
            isDeletable: { type: 'boolean', optional: true },
            isNestable: { type: 'boolean', optional: true },
            createdAt: { type: 'datetime' },
        },
        indices: [
            { field: 'id', pk: true },
            { field: 'name' },
            { field: 'isDeletable' },
            { field: 'isNestable' },
            { field: 'createdAt' },
        ],
        history: [
            {
                version: new Date('2018-07-12'),
                fields: {
                    id: { type: 'int' },
                    name: { type: 'string' },
                    isDeletable: { type: 'boolean', optional: true },
                    isNestable: { type: 'boolean', optional: true },
                    createdAt: { type: 'datetime' },
                },
                indices: [
                    { field: 'id', pk: true },
                    { field: 'name', unique: true },
                    { field: 'isDeletable' },
                    { field: 'isNestable' },
                    { field: 'createdAt' },
                ],
            },
            {
                version: new Date('2019-08-21'),
                fields: {
                    id: { type: 'int' },
                    name: { type: 'string' },
                    isDeletable: { type: 'boolean', optional: true },
                    isNestable: { type: 'boolean', optional: true },
                    createdAt: { type: 'datetime' },
                    updatedAt: { type: 'datetime', optional: true },
                },
                indices: [
                    { field: 'id', pk: true },
                    { field: 'name', unique: true },
                    { field: 'isDeletable' },
                    { field: 'isNestable' },
                    { field: 'createdAt' },
                ],
            },
            {
                version: new Date('2019-08-29'),
                fields: {
                    id: { type: 'int' },
                    name: { type: 'string' },
                    isDeletable: { type: 'boolean', optional: true },
                    isNestable: { type: 'boolean', optional: true },
                    createdAt: { type: 'datetime' },
                },
                indices: [
                    { field: 'id', pk: true },
                    { field: 'name', unique: true },
                    { field: 'isDeletable' },
                    { field: 'isNestable' },
                    { field: 'createdAt' },
                ],
            },
        ],
    },
    [COLLECTION_NAMES.listEntry]: {
        version: new Date('2018-07-12'),
        fields: {
            listId: { type: 'int' },
            pageUrl: { type: 'string' },
            fullUrl: { type: 'string' },
            createdAt: { type: 'datetime' },
        },
        indices: [
            { field: ['listId', 'pageUrl'], pk: true },
            { field: 'listId' },
            { field: 'pageUrl' },
        ],
    },
    [COLLECTION_NAMES.listDescription]: {
        version: new Date(STORAGE_VERSIONS[20].version),
        fields: {
            listId: { type: 'int' },
            description: { type: 'text' },
        },
        indices: [{ field: 'listId', pk: true }],
    },
    [COLLECTION_NAMES.listEntryDescription]: {
        version: new Date(STORAGE_VERSIONS[20].version),
        fields: {
            listId: { type: 'int' },
            pageUrl: { type: 'string' },
            description: { type: 'text' },
        },
        indices: [{ field: ['listId', 'pageUrl'], pk: true }],
    },
}
