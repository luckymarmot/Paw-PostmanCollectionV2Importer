/* eslint-disable max-classes-per-file */

/**
 * Postman Collection format
 *
 * Schemas
 * https://schema.getpostman.com/
 *
 * v2.1.0
 * https://schema.getpostman.com/collection/json/v2.1.0/draft-07/docs/index.html
 * 
 * v2.0.0
 * https://schema.getpostman.com/collection/json/v2.0.0/draft-07/docs/index.html
 *
 * Differences between format 2.0.0 and 2.1.0:
 * https://github.com/postmanlabs/postman-collection/issues/635#issuecomment-389057960
 *
 * Official examples:
 * https://github.com/postmanlabs/postman-collection/tree/develop/examples
 */

export interface Collection {
    info: CollectionInfo|null
    item: Item[]|null
}

export interface CollectionInfo {
    name: string|null
    schema: string|null
}

export interface ProtocolProfileBehavior {
    followRedirects: boolean|null
    followOriginalHttpMethod: boolean|null
    followAuthorizationHeader: boolean|null
}

export interface Item {
    name: string|null
    request: Request|null
    item: Item[]|null
    protocolProfileBehavior: ProtocolProfileBehavior|null
}

export interface Request {
    method: string|null
    url: string|Url
    description: string|null
    header: Header[]|null
    body: Body|null
    auth: Auth|null
}

export interface UrlQueryParam {
    key: string|null
    value: string|null
    description: string|null
}

export interface Url {
    raw: string|null
    query: UrlQueryParam[]|null
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

export interface AuthKeyValue {
    key: string|null
    value: string|null
    type: string
}

export type AuthParamV20 = {[key:string]: string}

export interface Auth {
    type: string
    apikey: AuthKeyValue[]|AuthParamV20|null
    awsv4: AuthKeyValue[]|AuthParamV20|null
    basic: AuthKeyValue[]|AuthParamV20|null
    bearer: AuthKeyValue[]|AuthParamV20|null
    digest: AuthKeyValue[]|AuthParamV20|null
    hawk: AuthKeyValue[]|AuthParamV20|null
    ntlm: AuthKeyValue[]|AuthParamV20|null
    oauth1: AuthKeyValue[]|AuthParamV20|null
    oauth2: AuthKeyValue[]|AuthParamV20|null
}
