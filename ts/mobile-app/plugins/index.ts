import { StorageBackendPlugin } from '@worldbrain/storex'
import { TypeORMStorageBackend } from '@worldbrain/storex-backend-typeorm'

import { SuggestPlugin } from './suggest'

export const createStorexPlugins = (): StorageBackendPlugin<
    TypeORMStorageBackend
>[] => [new SuggestPlugin()]
