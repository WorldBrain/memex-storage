export const notificationCollectionName = 'notifications'

export const notificationCollectionDefinition = {
    [notificationCollectionName]: {
        version: new Date('2019-08-18'),
        fields: {
            id: { type: 'string' },
            title: { type: 'string' },
            message: { type: 'string' },
            buttonText: { type: 'string' },
            link: { type: 'string' },
            sentTime: { type: 'datetime' },
            deliveredTime: { type: 'datetime' },
            readTime: { type: 'datetime' },
            buttons: { type: 'json' },
        },
        indices: [{ field: 'id', pk: true }],
    },
}

export const notificationCollectionHistory = [
    {
        version: new Date(2018, 7, 4),
        fields: {
            id: { type: 'string' },
            title: { type: 'string' },
            message: { type: 'string' },
            buttonText: { type: 'string' },
            link: { type: 'string' },
            sentTime: { type: 'datetime' },
            deliveredTime: { type: 'datetime' },
            readTime: { type: 'datetime' },
        },
        indices: [{ field: 'id', pk: true }],
    },
]
