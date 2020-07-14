import {
    StorageModule,
    StorageModuleConfig,
    StorageModuleConstructorArgs,
} from '@worldbrain/storex-pattern-modules'
import { URLNormalizer } from '@worldbrain/memex-url-utils'

import {
    COLLECTION_DEFINITIONS,
    COLLECTION_NAMES,
} from '../../../../annotations/constants'
import { Note } from '../types'

type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

type NoteCreate = Omit<Note, 'url'>

export interface NoteOpArgs {
    url: string
}

export interface Props extends StorageModuleConstructorArgs {
    normalizeUrl: URLNormalizer
}

export class PageEditorStorage extends StorageModule {
    static NOTE_COLL = COLLECTION_NAMES.annotation
    static BOOKMARK_COLL = COLLECTION_NAMES.bookmark
    static LIST_ENTRY_COLL = COLLECTION_NAMES.listEntry

    private normalizeUrl: URLNormalizer

    constructor({ normalizeUrl, ...args }: Props) {
        super(args)

        this.normalizeUrl = normalizeUrl
    }

    getConfig = (): StorageModuleConfig => {
        // TODO: This type differs from corresponding Memex ext type (not supported in react native)
        //  TYPE: 'json' => 'string'

        return {
            collections: {
                ...COLLECTION_DEFINITIONS,
            },
            operations: {
                addNoteToList: {
                    operation: 'createObject',
                    collection: PageEditorStorage.LIST_ENTRY_COLL,
                },
                createNote: {
                    operation: 'createObject',
                    collection: PageEditorStorage.NOTE_COLL,
                },
                findNote: {
                    operation: 'findObject',
                    collection: PageEditorStorage.NOTE_COLL,
                    args: {
                        url: '$url:string',
                    },
                },
                findNotesForPage: {
                    operation: 'findObjects',
                    collection: PageEditorStorage.NOTE_COLL,
                    args: {
                        pageUrl: '$url:string',
                    },
                },
                findEntriesForList: {
                    operation: 'findObjects',
                    collection: PageEditorStorage.LIST_ENTRY_COLL,
                    args: {
                        listId: '$listId:number',
                    },
                },
                findEntriesForNote: {
                    operation: 'findObjects',
                    collection: PageEditorStorage.LIST_ENTRY_COLL,
                    args: {
                        url: '$url:string',
                    },
                },
                updateNoteText: {
                    operation: 'updateObject',
                    collection: PageEditorStorage.NOTE_COLL,
                    args: [
                        { url: '$url:string' },
                        {
                            comment: '$text:string',
                            lastEdited: '$lastEdited:date',
                        },
                    ],
                },
                deleteNote: {
                    operation: 'deleteObject',
                    collection: PageEditorStorage.NOTE_COLL,
                    args: {
                        url: '$url:string',
                    },
                },
                deleteNotesForPage: {
                    operation: 'deleteObjects',
                    collection: PageEditorStorage.NOTE_COLL,
                    args: {
                        pageUrl: '$url:string',
                    },
                },
                deleteNoteFromList: {
                    operation: 'deleteObject',
                    collection: PageEditorStorage.LIST_ENTRY_COLL,
                    args: {
                        url: '$url:string',
                        listId: '$listId:number',
                    },
                },
                deleteEntriesForList: {
                    operation: 'deleteObjects',
                    collection: PageEditorStorage.LIST_ENTRY_COLL,
                    args: {
                        listId: '$listId:number',
                    },
                },
                deleteEntriesForNote: {
                    operation: 'deleteObjects',
                    collection: PageEditorStorage.LIST_ENTRY_COLL,
                    args: {
                        url: '$url:string',
                    },
                },
                findBookmark: {
                    operation: 'findObject',
                    collection: PageEditorStorage.BOOKMARK_COLL,
                    args: {
                        url: '$url:string',
                    },
                },
                starNote: {
                    operation: 'createObject',
                    collection: PageEditorStorage.BOOKMARK_COLL,
                },
                unstarNote: {
                    operation: 'deleteObject',
                    collection: PageEditorStorage.BOOKMARK_COLL,
                    args: {
                        url: '$url:string',
                    },
                },
            },
        }
    }

    private createAnnotationUrl = (args: {
        pageUrl: string
        timestamp: number
    }) => `${args.pageUrl}/#${args.timestamp}`

    createNote(
        note: RequiredBy<NoteCreate, 'comment'>,
        customTimestamp = Date.now(),
    ) {
        const pageUrl = this.normalizeUrl(note.pageUrl)

        return this.operation('createNote', {
            createdWhen: new Date(customTimestamp),
            lastEdited: new Date(customTimestamp),
            ...note,
            pageUrl,
            url: this.createAnnotationUrl({
                pageUrl,
                timestamp: customTimestamp,
            }),
        })
    }

    async createAnnotation(
        annotation: RequiredBy<NoteCreate, 'selector' | 'body'>,
        customTimestamp = Date.now(),
    ) {
        const pageUrl = this.normalizeUrl(annotation.pageUrl)

        return this.operation('createNote', {
            createdWhen: new Date(customTimestamp),
            lastEdited: new Date(customTimestamp),
            ...annotation,
            pageUrl,
            url: this.createAnnotationUrl({
                pageUrl,
                timestamp: customTimestamp,
            }),
        })
    }

    async deleteNotesForPage({ url }: { url: string }) {
        const pageUrl = this.normalizeUrl(url)

        return this.operation('deleteNotesForPage', { url: pageUrl })
    }

    async updateNoteText(args: {
        url: string
        text: string
        lastEdited?: Date
    }) {
        return this.operation('updateNoteText', {
            lastEdited: new Date(),
            ...args,
        })
    }

    async findNote({ url }: NoteOpArgs): Promise<Note | null> {
        const note = await this.operation('findNote', { url })
        if (!note) {
            return null
        }

        const bookmark = await this.operation('findBookmark', { url })
        return {
            ...note,
            isStarred: !!bookmark,
        }
    }

    async findNotes({ url }: NoteOpArgs): Promise<Note[]> {
        url = this.normalizeUrl(url)

        const notes = await this.operation('findNotesForPage', { url })

        for (const note of notes) {
            note.isStarred = !!(await this.operation('findBookmark', { url }))
        }

        return notes
    }

    async findAnnotations({
        url,
    }: NoteOpArgs): Promise<RequiredBy<Note, 'body' | 'selector'>[]> {
        const notes = await this.findNotes({ url })

        return notes.filter(
            (note) => note.body?.length && note.selector != null,
        ) as any
    }

    starNote({
        url,
        createdAt = new Date(),
    }: NoteOpArgs & { createdAt?: Date }) {
        return this.operation('starNote', { url, createdAt })
    }

    unstarNote({ url }: NoteOpArgs) {
        return this.operation('unstarNote', { url })
    }

    async deleteNoteByUrl({ url }: NoteOpArgs): Promise<void> {
        return this.operation('deleteNote', { url })
    }
}
