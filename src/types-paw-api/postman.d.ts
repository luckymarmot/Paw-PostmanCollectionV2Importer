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
    method: string|null
    url: string|Url
    description: string|null
    header: Header[]|null
    body: Body|null
}

export interface Url {
    raw: string|null
}

export interface Header {
    key: string|null
    value: string|null
    disabled: boolean
    description: string|null
}

export interface BodyUrlEncodedParameter {
    key: string|null
    value: string|null
    disabled: boolean
    description: string|null
}

export interface BodyFormParameter {
    key: string|null
    value: string|null
    disabled: boolean
    type: string|null
    contentType: string|null
    description: string|null
}

export interface BodyFile {
    src: string|null
    content: string|null
}

export interface Body {
    mode: string
    raw: string|null
    disabled: boolean
    urlencoded: BodyUrlEncodedParameter[]|null
    formdata: BodyFormParameter[]|null
    file: BodyFile
    graphql: any
}
