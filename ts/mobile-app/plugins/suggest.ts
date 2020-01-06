import { StorageBackendPlugin } from '@worldbrain/storex'
import { TypeORMStorageBackend } from '@worldbrain/storex-backend-typeorm'

export type SuggestCollection = 'tags' | 'customLists'

export interface IndexQuery {
    [indexName: string]: string
}

export interface SuggestArgs {
    collection: string
    query: IndexQuery
    limit?: number
}

export class SuggestPlugin extends StorageBackendPlugin<TypeORMStorageBackend> {
    static SUGGEST_OP_ID = 'memex:typeorm.suggest'

    install(backend: TypeORMStorageBackend) {
        super.install(backend)

        backend.registerOperation(
            SuggestPlugin.SUGGEST_OP_ID,
            this.suggest.bind(this),
        )
    }

    async suggest({
        query,
        collection,
        limit = 10,
    }: SuggestArgs): Promise<any[]> {
        const { repository } = this.backend._preprocessOperation(collection)

        // Grab first entry from the filter query; ignore rest for now
        const [[indexName, value], ...fields] = Object.entries<string>(query)

        if (fields.length > 1) {
            throw new Error('`suggest` only supports querying a single field.')
        }

        const data = await repository
            .createQueryBuilder(collection)
            .where(`${collection}.${indexName} like :value`, {
                value: `${value}%`,
            })
            .limit(limit)
            .getMany()

        return data
    }
}
