export const backupChangeCollectionName = 'backupChanges'

export const backupChangeCollectionDefinition = {
    [backupChangeCollectionName]: {
        version: new Date(2018, 11, 13),
        fields: {
            timestamp: { type: 'datetime' },
            collection: { type: 'string' },
            objectPk: { type: 'string' },
            operation: { type: 'string' }, // 'create'|'update'|'delete'
        },
        indices: [
            { pk: true, field: 'timestamp' },
            { field: 'collection' },
        ],
        watch: false,
        backup: false,
    },
}
