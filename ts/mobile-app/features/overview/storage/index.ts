import {
    StorageModule,
    StorageModuleConfig,
    StorageModuleConstructorArgs,
} from '@worldbrain/storex-pattern-modules'
import { URLPartsExtractor } from '@worldbrain/memex-url-utils/lib/extract-parts/types'
import { URLNormalizer } from '@worldbrain/memex-url-utils/lib/normalize/types'

import {
    COLLECTION_DEFINITIONS,
    COLLECTION_NAMES,
} from '../../../../pages/constants'
import { COLLECTION_NAMES as LISTS_COLLECTION_NAMES } from '../../../../lists/constants'
import { Page, Visit, Bookmark } from '../types'

export interface Props extends StorageModuleConstructorArgs {
    normalizeUrl: URLNormalizer
    extractUrlParts: URLPartsExtractor
}

export interface PageOpArgs {
    url: string
}

export class OverviewStorage extends StorageModule {
    static PAGE_COLL = COLLECTION_NAMES.page
    static VISIT_COLL = COLLECTION_NAMES.visit
    static BOOKMARK_COLL = COLLECTION_NAMES.bookmark
    static FAVICON_COLL = COLLECTION_NAMES.favIcon

    private normalizeUrl: URLNormalizer
    private extractUrlParts: URLPartsExtractor

    constructor({ normalizeUrl, extractUrlParts, ...args }: Props) {
        super(args)

        this.normalizeUrl = normalizeUrl
        this.extractUrlParts = extractUrlParts
    }

    getConfig = (): StorageModuleConfig => {
        // TODO: These types differ from corresponding Memex ext type (not supported in react native)
        //  TYPE: 'media' => 'string'
        COLLECTION_DEFINITIONS[
            OverviewStorage.PAGE_COLL
        ].fields.screenshot.type = 'string'
        //  TYPE: 'media' => 'string'
        COLLECTION_DEFINITIONS[
            OverviewStorage.FAVICON_COLL
        ].fields.favIcon.type = 'string'
        //  TYPE: 'timestamp' => 'datetime'
        COLLECTION_DEFINITIONS[OverviewStorage.VISIT_COLL].fields.time.type =
            'datetime'
        //  TYPE: 'timestamp' => 'datetime'
        COLLECTION_DEFINITIONS[OverviewStorage.BOOKMARK_COLL].fields.time.type =
            'datetime'

        return {
            collections: {
                ...COLLECTION_DEFINITIONS,
            },
            operations: {
                createPage: {
                    operation: 'createObject',
                    collection: OverviewStorage.PAGE_COLL,
                },
                deletePage: {
                    operation: 'deleteObject',
                    collection: OverviewStorage.PAGE_COLL,
                    args: {
                        url: '$url:string',
                    },
                },
                findPage: {
                    operation: 'findObject',
                    collection: OverviewStorage.PAGE_COLL,
                    args: {
                        url: '$url:string',
                    },
                },
                updatePageTitle: {
                    operation: 'updateObject',
                    collection: OverviewStorage.PAGE_COLL,
                    args: [
                        { url: '$url:string' },
                        {
                            fullTitle: '$title:string',
                        },
                    ],
                },
                findBookmark: {
                    operation: 'findObject',
                    collection: OverviewStorage.BOOKMARK_COLL,
                    args: {
                        url: '$url:string',
                    },
                },
                findRecentBookmarks: {
                    operation: 'findObjects',
                    collection: OverviewStorage.BOOKMARK_COLL,
                    args: [
                        {},
                        {
                            order: [['time', 'desc']],
                            limit: '$limit:number',
                            skip: '$skip:number',
                        },
                    ],
                },
                starPage: {
                    operation: 'createObject',
                    collection: OverviewStorage.BOOKMARK_COLL,
                },
                unstarPage: {
                    operation: 'deleteObject',
                    collection: OverviewStorage.BOOKMARK_COLL,
                    args: {
                        url: '$url:string',
                    },
                },
                createVisit: {
                    operation: 'createObject',
                    collection: OverviewStorage.VISIT_COLL,
                },
                deleteVisit: {
                    operation: 'deleteObject',
                    collection: OverviewStorage.VISIT_COLL,
                    args: {
                        url: '$url:string',
                        time: '$time:number',
                    },
                },
                findVisitsForPage: {
                    operation: 'findObjects',
                    collection: OverviewStorage.VISIT_COLL,
                    args: {
                        url: '$url:string',
                    },
                },
                findRecentVisits: {
                    operation: 'findObjects',
                    collection: OverviewStorage.VISIT_COLL,
                    args: [
                        {},
                        {
                            order: [['time', 'desc']],
                            limit: '$limit:number',
                            skip: '$skip:number',
                        },
                    ],
                },
                deleteVisitsForPage: {
                    operation: 'deleteObjects',
                    collection: OverviewStorage.VISIT_COLL,
                    args: {
                        url: '$url:string',
                    },
                },
                deleteListEntriesForPage: {
                    operation: 'deleteObjects',
                    collection: LISTS_COLLECTION_NAMES.listEntry,
                    args: {
                        pageUrl: '$url:string',
                    },
                },
            },
        }
    }

    async findPage({ url }: PageOpArgs): Promise<Page | null> {
        url = this.normalizeUrl(url)
        const page = await this.operation('findPage', { url })
        if (!page) {
            return null
        }
        const isStarred = await this.operation('findBookmark', { url })
        return { ...page, isStarred: !!isStarred }
    }

    async isPageStarred({ url }: PageOpArgs): Promise<boolean> {
        url = this.normalizeUrl(url)
        const bookmark = await this.operation('findBookmark', { url })
        return !!bookmark
    }

    createPage(inputPage: Omit<Page, 'domain' | 'hostname'>) {
        const { domain, hostname } = this.extractUrlParts(inputPage.url)

        const page: Page = {
            ...inputPage,
            url: this.normalizeUrl(inputPage.url),
            canonicalUrl: inputPage.canonicalUrl ?? inputPage.fullUrl,
            domain,
            hostname,
        }

        return this.operation('createPage', page)
    }

    async deletePage({ url }: PageOpArgs): Promise<void> {
        url = this.normalizeUrl(url)
        // TODO: can we do this in a transaction?
        await this.operation('deleteVisitsForPage', { url })
        await this.operation('unstarPage', { url })
        await this.operation('deletePage', { url })
        await this.operation('deleteListEntriesForPage', { url })
    }

    async deleteVisit(args: { url: string; time: number }): Promise<void> {
        const normalizedUrl = this.normalizeUrl(args.url)

        await this.operation('deleteVisit', {
            url: normalizedUrl,
            time: args.time,
        })
    }

    async updatePageTitle({
        url,
        title,
    }: { title: string } & PageOpArgs): Promise<void> {
        url = this.normalizeUrl(url)
        await this.operation('updatePageTitle', { url, title })
    }

    starPage({ url, time = Date.now() }: PageOpArgs & { time?: number }) {
        url = this.normalizeUrl(url)
        return this.operation('starPage', { url, time })
    }

    unstarPage({ url }: PageOpArgs) {
        url = this.normalizeUrl(url)
        return this.operation('unstarPage', { url })
    }

    async setPageStar({
        url,
        isStarred,
        time = Date.now(),
    }: PageOpArgs & { isStarred: boolean; time?: number }) {
        url = this.normalizeUrl(url)
        const bookmark = await this.operation('findBookmark', { url })

        if (bookmark == null && isStarred) {
            return this.starPage({ url, time })
        } else if (bookmark != null && !isStarred) {
            return this.unstarPage({ url })
        } else {
            return
        }
    }

    async findLatestBookmarks({
        limit,
        skip,
    }: {
        limit: number
        skip: number
    }): Promise<Bookmark[]> {
        return this.operation('findRecentBookmarks', { limit, skip })
    }

    visitPage({ url, time = Date.now() }: PageOpArgs & { time?: number }) {
        const visit: Visit = {
            url: this.normalizeUrl(url),
            time,
        }

        return this.operation('createVisit', visit)
    }

    findPageVisits({ url }: PageOpArgs): Promise<Visit[]> {
        return this.operation('findVisitsForPage', { url })
    }

    async findLatestVisitsByPage({
        limit,
        skip,
    }: {
        limit: number
        skip: number
    }): Promise<Visit[]> {
        const visitsByPage = new Map<string, Visit>()

        const trackVisitIfPageNotSeen = (visit: Visit) => {
            if (visitsByPage.get(visit.url) != null) {
                return
            }

            visitsByPage.set(visit.url, visit)
        }

        // Internally we need to loop over visits, then group them by URL and see if we have enough
        for (
            let innerSkip = 0;
            visitsByPage.size < limit + skip;
            innerSkip += limit
        ) {
            const latestVisits: Visit[] = await this.operation(
                'findRecentVisits',
                { limit, skip: innerSkip },
            )

            if (!latestVisits.length) {
                break // We've exhausted them!
            }

            latestVisits.forEach(trackVisitIfPageNotSeen)
        }

        return [...visitsByPage.values()]
            .sort((a, b) => b.time - a.time)
            .slice(skip, skip + limit)
    }
}
