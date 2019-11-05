/* eslint-disable max-classes-per-file */

export interface Collection {
    info: CollectionInfo|null
    item: Item[]|null
}

export interface CollectionInfo {
    name: string|null
    schema: string|null
}

export interface Item {
    name: string|null
    request: Request|null
    item: Item[]|null
}

export interface Request {
    method: string
    url: string|Url
    description: string|null
}

export interface Url {
    raw: string|null
}
