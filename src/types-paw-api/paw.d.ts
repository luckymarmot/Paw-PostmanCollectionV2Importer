/* eslint-disable max-classes-per-file */

declare class Context {
    createRequest(name?: string|null, method?: string|DynamicString|null, url?: string|DynamicString|null, description?: string|null): Request
    createRequestGroup(name: string|null): RequestGroup
    createEnvironmentDomain(name: string|null): EnvironmentDomain
    createSecureValue(name: string|null): DynamicValue
    createJSONDynamicValue(name: string|null): DynamicValue
}

declare class RequestTreeItem {
    //
}

declare class Request extends RequestTreeItem {
    //
}

declare class RequestGroup extends RequestTreeItem {
    readonly id: string
    readonly parent: RequestTreeItem|null
    name: string|null
    order: number
    getChildren(): RequestTreeItem[]
    getChildRequests(): Request[]
    getChildGroups(): RequestGroup[]
    appendChild(child: RequestTreeItem): void
    insertChild(child: RequestTreeItem, index: number): void
    deleteGroup(): boolean
}

declare class EnvironmentDomain extends RequestTreeItem {
    //
}

declare class Environment extends RequestTreeItem {
    //
}

declare class EnvironmentVariable extends RequestTreeItem {
    //
}

declare class DynamicString {
    //
}

declare class DynamicValue {
    //
}

export interface Importer {
    canImport(context:Context, items: ExtensionItem[]): number
    import(context:Context, items: ExtensionItem[], options: ExtensionOption): boolean
}

export interface ExtensionImportFile {
    name: string // LMExtensionItemsFileName
    path: string // LMExtensionItemsFilePath
}

export interface ExtensionOption {
    // NSString* LMExtensionOptionInputs = @"inputs";
    // NSString* LMExtensionOptionFile = @"file";
    // NSString* LMExtensionOptionFileName = @"name";
    // NSString* LMExtensionOptionFilePath = @"path";
    // NSString* LMExtensionOptionObfuscateSensitiveInformation = @"hideCredentials";
    // NSString* LMExtensionOptionParent = @"parent";
    // NSString* LMExtensionOptionOrder = @"order";

    inputs: {string:any}|null
    file: ExtensionImportFile|null
    hideCredentials: boolean
    parent: RequestTreeItem|null
    order: number|null
}

export interface ExtensionItem {
    // NSString* LMExtensionItemsContent = @"content";
    // NSString* LMExtensionItemsURL = @"url";
    // NSString* LMExtensionItemsURI = @"uri";
    // NSString* LMExtensionItemsFile = @"file";
    // NSString* LMExtensionItemsFileName = @"name";
    // NSString* LMExtensionItemsFilePath = @"path";
    // NSString* LMExtensionItemsMIMEType = @"mimeType";
    // NSString* LMExtensionItemsHTTPHeaders = @"httpHeaders";
    // NSString* LMExtensionItemsHTTPStatus = @"httpStatus";
    // NSString* LMExtensionItemsName = @"name";

    content: string
    name: string
    uri: string
    url: string|null
    file: ExtensionImportFile|null
    mimeType: string|null
    httpHeaders: object|null
    httpStatus: number|null
}

declare global {
    function registerImporter(importer: any): void
}
