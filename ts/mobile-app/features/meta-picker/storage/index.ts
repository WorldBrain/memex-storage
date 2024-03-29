import {
    StorageModule,
    StorageModuleConfig,
    StorageModuleConstructorArgs,
} from '@worldbrain/storex-pattern-modules'
import { URLNormalizer } from '@worldbrain/memex-url-utils/lib/normalize/types'
import {
    COLLECTION_DEFINITIONS as TAG_COLL_DEFINITIONS,
    COLLECTION_NAMES as TAG_COLL_NAMES,
} from '../../../../tags/constants'
import {
    COLLECTION_DEFINITIONS as LIST_COLL_DEFINITIONS,
    COLLECTION_NAMES as LIST_COLL_NAMES,
    SPECIAL_LIST_NAMES,
    SPECIAL_LIST_IDS,
} from '../../../../lists/constants'
import { SuggestArgs, SuggestPlugin } from '../../../plugins/suggest'

import { Tag, List, ListEntry, MetaTypeShape } from '../types'

export class MetaPickerStorage extends StorageModule {
    static TAG_COLL = TAG_COLL_NAMES.tag
    static LIST_COLL = LIST_COLL_NAMES.list
    static LIST_ENTRY_COLL = LIST_COLL_NAMES.listEntry
    static LIST_DESCRIPTION_COLL = LIST_COLL_NAMES.listDescription

    static DEF_SUGGESTION_LIMIT = 7
    static DEF_TAG_LIMIT = 1000

    /** This exists to mimic behavior implemented in memex WebExt; Storex auto-PK were not used for whatever reason. */
    static generateListId = () => Date.now()

    constructor(
        private options: StorageModuleConstructorArgs & {
            normalizeUrl: URLNormalizer
        },
    ) {
        super(options)
    }

    getConfig = (): StorageModuleConfig => ({
        collections: {
            ...TAG_COLL_DEFINITIONS,
            ...LIST_COLL_DEFINITIONS,
        },
        operations: {
            createList: {
                operation: 'createObject',
                collection: MetaPickerStorage.LIST_COLL,
            },
            createListEntry: {
                operation: 'createObject',
                collection: MetaPickerStorage.LIST_ENTRY_COLL,
            },
            createTag: {
                operation: 'createObject',
                collection: MetaPickerStorage.TAG_COLL,
            },
            findListByName: {
                operation: 'findObject',
                collection: MetaPickerStorage.LIST_COLL,
                args: {
                    name: '$name:string',
                },
            },
            findListsByNames: {
                operation: 'findObjects',
                collection: MetaPickerStorage.LIST_COLL,
                args: {
                    name: { $in: '$names:string[]' },
                },
            },
            findListById: {
                operation: 'findObject',
                collection: MetaPickerStorage.LIST_COLL,
                args: {
                    id: '$listId:number',
                },
            },
            findListDescriptionById: {
                operation: 'findObject',
                collection: MetaPickerStorage.LIST_DESCRIPTION_COLL,
                args: {
                    id: '$listId:number',
                },
            },
            findListsByIds: {
                operation: 'findObjects',
                collection: MetaPickerStorage.LIST_COLL,
                args: {
                    id: { $in: '$listIds:number[]' },
                },
            },
            findListSuggestions: {
                operation: 'findObjects',
                collection: MetaPickerStorage.LIST_COLL,
                args: [{}, { limit: '$limit:int' }],
            },
            findTagSuggestions: {
                operation: 'findObjects',
                collection: MetaPickerStorage.TAG_COLL,
                args: [{}, { limit: '$limit:int' }],
            },
            findTagsByPage: {
                operation: 'findObjects',
                collection: MetaPickerStorage.TAG_COLL,
                args: [{ url: '$url:string' }, { limit: '$limit:int' }],
            },
            findTagsByName: {
                operation: 'findObjects',
                collection: MetaPickerStorage.TAG_COLL,
                args: {
                    name: '$name:string',
                },
            },
            findEntriesByPage: {
                operation: 'findObjects',
                collection: MetaPickerStorage.LIST_ENTRY_COLL,
                args: {
                    pageUrl: '$url:string',
                },
            },
            findEntriesByList: {
                operation: 'findObjects',
                collection: MetaPickerStorage.LIST_ENTRY_COLL,
                args: {
                    listId: '$listId:number',
                },
            },
            findRecentEntriesByList: {
                operation: 'findObjects',
                collection: MetaPickerStorage.LIST_ENTRY_COLL,
                args: [
                    { listId: '$listId:number' },
                    {
                        order: [['createdAt', 'desc']],
                        limit: '$limit:number',
                        skip: '$skip:number',
                    },
                ],
            },
            deleteList: {
                operation: 'deleteObject',
                collection: MetaPickerStorage.LIST_COLL,
                args: {
                    id: '$listId:number',
                },
            },
            deletePageFromList: {
                operation: 'deleteObjects',
                collection: MetaPickerStorage.LIST_ENTRY_COLL,
                args: {
                    listId: '$listId:number',
                    pageUrl: '$url:string',
                },
            },
            deleteEntriesForList: {
                operation: 'deleteObjects',
                collection: MetaPickerStorage.LIST_ENTRY_COLL,
                args: {
                    listId: '$listId:number',
                },
            },
            deleteEntriesForPage: {
                operation: 'deleteObjects',
                collection: MetaPickerStorage.LIST_ENTRY_COLL,
                args: {
                    pageUrl: '$url:string',
                },
            },
            deleteTag: {
                operation: 'deleteObjects',
                collection: MetaPickerStorage.TAG_COLL,
                args: {
                    name: '$name:string',
                    url: '$url:string',
                },
            },
            deleteTagsByPage: {
                operation: 'deleteObjects',
                collection: MetaPickerStorage.TAG_COLL,
                args: {
                    url: '$url:string',
                },
            },
            [SuggestPlugin.SUGGEST_OP_ID]: {
                operation: SuggestPlugin.SUGGEST_OP_ID,
                args: {
                    query: '$query:string',
                    collection: '$collection:string',
                    limit: '$limit:number',
                },
            },
        },
    })

    createTag(tag: Tag) {
        return this.operation('createTag', {
            ...tag,
            url: this.options.normalizeUrl(tag.url),
        })
    }

    createList(
        list: Omit<List, 'id' | 'createdAt'>,
    ): Promise<{ object: { id: number } }> {
        return this.operation('createList', {
            id: MetaPickerStorage.generateListId(),
            createdAt: new Date(),
            ...list,
            searchableName: list.name,
        })
    }

    createPageListEntry(entry: { fullPageUrl: string; listId: number }) {
        return this.operation('createListEntry', {
            createdAt: new Date(),
            listId: entry.listId,
            pageUrl: this.options.normalizeUrl(entry.fullPageUrl),
            fullUrl: entry.fullPageUrl,
        })
    }

    findRecentListEntries(
        listId: number,
        options: { skip: number; limit: number },
    ) {
        return this.operation('findRecentEntriesByList', {
            listId,
            ...options,
        })
    }

    findTagsByPage({
        url,
        limit = MetaPickerStorage.DEF_TAG_LIMIT,
    }: {
        url: string
        limit?: number
    }): Promise<Tag[]> {
        url = this.options.normalizeUrl(url)
        return this.operation('findTagsByPage', { url, limit })
    }

    findTagsByAnnotation({ url }: { url: string }): Promise<Tag[]> {
        return this.operation('findTagsByPage', { url })
    }

    findTagsByName({ name }: { name: string }): Promise<Tag[]> {
        return this.operation('findTagsByName', { name })
    }

    findListsByNames({ names }: { names: string[] }): Promise<List[]> {
        return this.operation('findListsByNames', { names })
    }

    findPageListEntriesByPage({ url }: { url: string }): Promise<ListEntry[]> {
        return this.operation('findEntriesByPage', { url })
    }

    async findListsByPage({ url }: { url: string }): Promise<List[]> {
        url = this.options.normalizeUrl(url)
        const entries = await this.findPageListEntriesByPage({ url })
        const listIds = [...new Set(entries.map((e) => e.listId))]

        return this.filterMobileList(
            await this.operation('findListsByIds', { listIds }),
        ) as List[]
    }

    private filterMobileList = (
        lists: { name: string }[],
    ): { name: string }[] =>
        lists.filter((list) => list.name !== SPECIAL_LIST_NAMES.MOBILE)

    async findListSuggestions({
        limit = MetaPickerStorage.DEF_SUGGESTION_LIMIT,
        url,
    }: {
        limit?: number
        url?: string
    }): Promise<MetaTypeShape[]> {
        if (!url) {
            const lists: List[] = await this.operation('findListSuggestions', {
                limit,
            })

            return this.filterMobileList(
                lists.map((list) => ({
                    name: list.name,
                    isChecked: false,
                })),
            ) as MetaTypeShape[]
        }

        const entries = await this.findPageListEntriesByPage({ url })

        const entryListIds = new Set(entries.map((e) => e.listId))

        const lists: List[] = await this.operation('findListSuggestions', {
            limit,
        })

        return this.filterMobileList(
            lists.map((list) => ({
                name: list.name,
                isChecked: entryListIds.has(list.id),
            })),
        ) as MetaTypeShape[]
    }

    async findTagSuggestions({
        limit = MetaPickerStorage.DEF_SUGGESTION_LIMIT,
        url,
    }: {
        limit?: number
        url: string
    }): Promise<MetaTypeShape[]> {
        const tags: Tag[] = await this.operation('findTagSuggestions', {
            limit,
        })

        return tags.map((tag) => ({
            name: tag.name,
            isChecked: tag.url === url,
        }))
    }

    async suggest(suggestArgs: SuggestArgs): Promise<MetaTypeShape[]> {
        const suggested = await this.operation(
            SuggestPlugin.SUGGEST_OP_ID,
            suggestArgs,
        )

        return this.filterMobileList(
            suggested.map((entry) => ({ name: entry.name, isChecked: false })),
        ) as MetaTypeShape[]
    }

    findPageListEntriesByList({
        listId,
    }: {
        listId: number
    }): Promise<ListEntry[]> {
        return this.operation('findEntriesByList', { listId })
    }

    /**
     * Should go through input `tags` and ensure only these tags exist for a given page.
     */
    async setPageTags({ tags, url }: { tags: string[]; url: string }) {
        url = this.options.normalizeUrl(url)

        const existingTags = await this.findTagsByPage({ url })

        // Find any existing tags that are not in input list
        const inputTagsSet = new Set(tags)
        const toRemove = existingTags
            .map((tag) => tag.name)
            .filter((name) => !inputTagsSet.has(name))

        // Find any input tags that are not existing
        const existingTagsSet = new Set(existingTags.map((t) => t.name))
        const toAdd = tags.filter((name) => !existingTagsSet.has(name))

        for (const name of toAdd) {
            await this.createTag({ name, url })
        }

        for (const name of toRemove) {
            await this.deleteTag({ name, url })
        }
    }

    /**
     * Should go through input `lists`, make sure any new lists exist, then ensure entries for
     * only these lists exist for a given page.
     */
    async setPageLists({
        lists,
        fullPageUrl,
    }: {
        lists: string[]
        fullPageUrl: string
    }) {
        const normalizedPageUrl = this.options.normalizeUrl(fullPageUrl)
        const existingLists = await this.findListsByNames({ names: lists })
        const existingListsSet = new Set(existingLists.map((list) => list.name))

        // Create any missing lists
        const newListIds: number[] = []
        const missingLists = lists.filter((list) => !existingListsSet.has(list))
        for (const name of missingLists) {
            const result = await this.createList({ name })
            newListIds.push(result.object.id)
        }

        const existingEntries = await this.findPageListEntriesByPage({
            url: normalizedPageUrl,
        })

        // Find any existing entries that are not in input lists
        const inputListIds = [
            ...newListIds,
            ...existingLists.map((list) => list.id),
        ]
        const inputListIdsSet = new Set(inputListIds)
        const toRemove = existingEntries
            .map((entry) => entry.listId)
            .filter((id) => !inputListIdsSet.has(id))

        // Find any input entries that are not existing
        const existingEntryIdSet = new Set(
            existingEntries.map((entry) => entry.listId),
        )
        const toAdd = inputListIds.filter((id) => !existingEntryIdSet.has(id))

        for (const listId of toAdd) {
            await this.createPageListEntry({ listId, fullPageUrl })
        }

        for (const listId of toRemove) {
            await this.deletePageEntryFromList({
                listId,
                url: normalizedPageUrl,
            })
        }
    }

    async deleteList({ listId }: { listId: number }) {
        await this.deletePageListEntriesByList({ listId })
        await this.operation('deleteList', { listId })
    }

    deletePageListEntriesByList({ listId }: { listId: number }) {
        return this.operation('deleteEntriesForList', { listId })
    }

    deletePageEntryFromList(entry: { listId: number; url: string }) {
        return this.operation('deletePageFromList', entry)
    }

    async deletePageEntryByName(entry: { name: string; url: string }) {
        const lists = await this.findListsByNames({ names: [entry.name] })
        const listId = lists[0]?.id

        if (!listId) {
            return
        }

        return this.operation('deletePageFromList', {
            listId,
            url: entry.url,
        })
    }

    deleteTag(tag: Tag) {
        return this.operation('deleteTag', {
            ...tag,
            url: this.options.normalizeUrl(tag.url),
        })
    }

    deleteTagsByPage({ url }: { url: string }) {
        return this.operation('deleteTagsByPage', {
            url: this.options.normalizeUrl(url),
        })
    }

    async createMobileListIfAbsent({
        createdAt = new Date(),
    }: {
        createdAt?: Date
    }) {
        const staticMobileList = await this.operation('findListById', {
            listId: SPECIAL_LIST_IDS.MOBILE,
        })

        if (staticMobileList != null) {
            return SPECIAL_LIST_IDS.MOBILE
        }

        // The following code exists to update any dynamically created mobile list + entries to the static one - should only ever run once
        const dynamicMobileList = (await this.operation('findListByName', {
            name: SPECIAL_LIST_NAMES.MOBILE,
        })) as List

        await this.operation('createList', {
            id: SPECIAL_LIST_IDS.MOBILE,
            name: SPECIAL_LIST_NAMES.MOBILE,
            searchableName: SPECIAL_LIST_NAMES.MOBILE,
            isDeletable: false,
            isNestable: false,
            createdAt,
        })

        if (dynamicMobileList != null) {
            const dynamicEntries = await this.operation('findEntriesByList', {
                listId: dynamicMobileList.id,
            })
            for (const entry of dynamicEntries) {
                await this.operation('createListEntry', {
                    ...entry,
                    listId: SPECIAL_LIST_IDS.MOBILE,
                })
            }
            await this.operation('deleteEntriesForList', {
                listId: dynamicMobileList.id,
            })
            await this.operation('deleteList', { listId: dynamicMobileList.id })
        }

        return SPECIAL_LIST_IDS.MOBILE
    }

    async createMobileListEntry(args: { fullPageUrl: string }) {
        const mobileListId = await this.createMobileListIfAbsent({})

        await this.createPageListEntry({
            fullPageUrl: args.fullPageUrl,
            listId: mobileListId,
        })
    }

    async createInboxListIfAbsent({
        createdAt = new Date(),
    }: {
        createdAt?: Date
    }): Promise<number> {
        const foundInboxLists = await this.findListsByNames({
            names: [SPECIAL_LIST_NAMES.INBOX],
        })
        if (foundInboxLists?.length) {
            return foundInboxLists[0].id
        }

        return (
            await this.operation('createList', {
                id: SPECIAL_LIST_IDS.INBOX,
                name: SPECIAL_LIST_NAMES.INBOX,
                searchableName: SPECIAL_LIST_NAMES.INBOX,
                isDeletable: false,
                isNestable: false,
                createdAt,
            })
        ).object.id
    }

    async createInboxListEntry(args: { fullPageUrl: string }) {
        const inboxListId = await this.createInboxListIfAbsent({})

        await this.createPageListEntry({
            fullPageUrl: args.fullPageUrl,
            listId: inboxListId,
        })
    }
}
