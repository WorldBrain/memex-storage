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
