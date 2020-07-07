import {
    StorageModule,
    StorageModuleConfig,
    StorageModuleConstructorArgs,
} from '@worldbrain/storex-pattern-modules'
import { URLNormalizer } from '@worldbrain/memex-url-utils/lib'

import {
    COLLECTION_DEFINITIONS,
    COLLECTION_NAMES,
} from '../../../../annotations/constants'
import { Note } from '../types'

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

    private createAnnotationUrl({
        pageUrl,
        timestamp = Date.now(),
    }: {
        pageUrl: string
        timestamp?: number
    }) {
        return `${this.normalizeUrl(pageUrl)}/#${timestamp}`
    }

    createNote(note: Omit<Note, 'url'>, customTimestamp = Date.now()) {
        const created = new Date()

        return this.operation('createNote', {
            createdWhen: created,
            lastEdited: created,
            ...note,
            pageUrl: this.normalizeUrl(note.pageUrl),
            url: this.createAnnotationUrl({
                pageUrl: note.pageUrl,
                timestamp: customTimestamp,
            }),
        })
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
