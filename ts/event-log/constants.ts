export const eventLogCollectionName = 'eventLog'

export const eventLogCollectionDefinition = {
    [eventLogCollectionName]: {
        version: new Date(2018, 6, 14),
        fields: {
            time: { type: 'datetime' },
            type: { type: 'string' },
            details: { type: 'json' },
        },
        indices: [
            { field: ['time', 'type'], pk: true },
            { field: 'time' },
            { field: 'type' },
        ],
        watch: false,
        backup: false,
    },
}
