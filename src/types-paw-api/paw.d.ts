/* eslint-disable max-classes-per-file */

declare class Context {
    //
}

declare class RequestTreeItem {
    //
}

declare class Request extends RequestTreeItem {
    //
}

declare class RequestGroup extends RequestTreeItem {
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

declare function registerImporter(importer: any): void
