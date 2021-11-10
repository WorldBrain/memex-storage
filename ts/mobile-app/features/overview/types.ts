export interface Page {
    url: string
    text: string
    lang?: string
    domain: string
    fullUrl: string
    hostname: string
    fullTitle: string
    screenshot?: string
    description?: string
    canonicalUrl?: string
    isStarred?: boolean
    type: 'page' | 'pdf-local' | 'pdf-remote'
}

export interface Visit {
    url: string
    time: number
    duration?: number
    scrollMaxPerc?: number
    scrollMaxPx?: number
    scrollPerc?: number
    scrollPx?: number
}

export interface Bookmark {
    url: string
    time: number
}
