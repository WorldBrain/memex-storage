import { StorageModuleCollections } from '@worldbrain/storex-pattern-modules'

import { listCollectionName } from '../lists/constants'

export const socialPostCollectionName = 'socialPosts'
export const socialUserCollectionName = 'socialUsers'
export const socialTagCollectionName = 'socialTags'
export const socialBookmarkCollectionName = 'socialBookmarks'
export const socialPostListEntryCollectionName = 'socialPostListEntries'

export const socialPostCollectionDefinition: StorageModuleCollections = {
    [socialPostCollectionName]: {
        version: new Date('2019-04-22'),
        fields: {
            text: { type: 'text' },
            serviceId: { type: 'string' },
            createdAt: { type: 'datetime' },
            createdWhen: { type: 'datetime' },
        },
        relationships: [
            {
                childOf: socialUserCollectionName,
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
}

export const socialUserCollectionDefinition: StorageModuleCollections = {
    [socialUserCollectionName]: {
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
}

export const socialTagCollectionDefinition: StorageModuleCollections = {
    [socialTagCollectionName]: {
        version: new Date('2019-05-17'),
        fields: {
            name: { type: 'string' },
        },
        relationships: [
            {
                childOf: socialPostCollectionName,
                alias: 'postId',
                fieldName: 'postId',
            },
        ],
        indices: [
            { field: 'name' },
            { field: { relationship: 'postId' } },
        ],
    },
}

export const socialBookmarkCollectionDefinition: StorageModuleCollections = {
    [socialBookmarkCollectionName]: {
        version: new Date('2019-05-15'),
        fields: {
            createdAt: { type: 'datetime' },
        },
        relationships: [
            {
                singleChildOf: socialPostCollectionName,
                alias: 'postId',
                fieldName: 'postId',
            },
        ],
        indices: [
            { field: 'createdAt' },
            { field: { relationship: 'postId' } },
        ],
    },
}

export const socialPostListEntryDefinition: StorageModuleCollections = {
    [socialPostListEntryCollectionName]: {
        version: new Date('2019-05-17'),
        fields: {
            createdAt: { type: 'datetime' },
        },
        relationships: [
            {
                childOf: listCollectionName,
                alias: 'listId',
                fieldName: 'listId',
            },
            {
                childOf: socialPostCollectionName,
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
