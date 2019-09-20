export const tagCollectionName = 'tags'

export const tagCollectionDefinition = {
    [tagCollectionName]: {
        version: new Date(2018, 1, 1),
        fields: {
            url: { type: 'string' },
            name: { type: 'string' },
        },
        indices: [
            { field: ['name', 'url'], pk: true },
            { field: 'name' },
            { field: 'url' },
        ],
    },
}
