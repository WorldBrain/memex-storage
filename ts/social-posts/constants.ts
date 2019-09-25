import { StorageModuleCollections } from '@worldbrain/storex-pattern-modules'

import { COLLECTION_NAMES as LIST_COLLECTION_NAMES } from '../lists/constants'

export const COLLECTION_NAMES = {
    tag: 'socialTags',
    post: 'socialPosts',
    user: 'socialUsers',
    bookmark: 'socialBookmarks',
    listEntry: 'socialPostListEntries'
}

export const COLLECTION_DEFINITIONS: StorageModuleCollections = {
    [COLLECTION_NAMES.post]: {
        version: new Date('2019-04-22'),
        fields: {
            text: { type: 'text' },
            serviceId: { type: 'string' },
            createdAt: { type: 'datetime' },
            createdWhen: { type: 'datetime' },
        },
        relationships: [
            {
                childOf: COLLECTION_NAMES.user,
                alias: 'userId',
                fieldName: 'userId',
            },
        ],
        indices: [
            { field: 'text' },
            { field: 'serviceId' },
            { field: 'createdAt' },
            { field: { relationship: 'userId' } },
        ],
    },
    [COLLECTION_NAMES.user]: {
        version: new Date('2019-04-22'),
        fields: {
            serviceId: { type: 'string' },
            name: { type: 'string' },
            username: { type: 'string' },
            isVerified: { type: 'boolean' },
            profilePic: { type: 'blob' },
            type: { type: 'string' },
        },
        indices: [
            { field: 'serviceId' },
            { field: 'name' },
            { field: 'username' },
        ],
    },
    [COLLECTION_NAMES.tag]: {
        version: new Date('2019-05-17'),
        fields: {
            name: { type: 'string' },
        },
        relationships: [
            {
                childOf: COLLECTION_NAMES.post,
                alias: 'postId',
                fieldName: 'postId',
            },
        ],
        indices: [
            { field: 'name' },
            { field: { relationship: 'postId' } },
        ],
    },
    [COLLECTION_NAMES.bookmark]: {
        version: new Date('2019-05-15'),
        fields: {
            createdAt: { type: 'datetime' },
        },
        relationships: [
            {
                singleChildOf: COLLECTION_NAMES.post,
                alias: 'postId',
                fieldName: 'postId',
            },
        ],
        indices: [
            { field: 'createdAt' },
            { field: { relationship: 'postId' } },
        ],
    },
    [COLLECTION_NAMES.listEntry]: {
        version: new Date('2019-05-17'),
        fields: {
            createdAt: { type: 'datetime' },
        },
        relationships: [
            {
                childOf: LIST_COLLECTION_NAMES.list,
                alias: 'listId',
                fieldName: 'listId',
            },
            {
                childOf: COLLECTION_NAMES.post,
                alias: 'postId',
                fieldName: 'postId',
            },
        ],
        indices: [
            { field: { relationship: 'listId' } },
            { field: { relationship: 'postId' } },
        ],
    },
}
