/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable class-methods-use-this */

import Paw, { DynamicString } from './types-paw-api/paw'
import Postman from './types-paw-api/postman'

/*
 * Read Postman SDK Docs:
 * http://www.postmanlabs.com/postman-collection/
 */


// const getSafeString = (str: any): string|null => {
//   if (str && typeof str === 'string') {
//     return (str as string)
//   }
//   return null
// }

// const getNonnullString = (str: any): string => {
//   if (str && typeof str === 'string') {
//     return (str as string)
//   }
//   return ''
// }

const getPostmanHeader = (pmRequest: Postman.Request, headerName: string): Postman.Header|null => {
  if (pmRequest.header) {
    return pmRequest.header.find((item) => {
      return item.key && item.key.toLowerCase() === headerName.toLowerCase()
    }) || null
  }
  return null
}

class PostmanImporter implements Paw.Importer {
  static identifier = 'com.luckymarmot.PawExtensions.PostmanCollectionV2Importer'
  static title = 'Postman Importer (2.0, 2.1)'

  context: Paw.Context

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public canImport(context: Paw.Context, items: Paw.ExtensionItem[]): number {
    return 1
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  import(context: Paw.Context, items: Paw.ExtensionItem[], options: Paw.ExtensionOption): boolean {
    this.context = context

    items.forEach((item) => {
      this.importCollection(context, item)
    })
    return true
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private importCollection(context: Paw.Context, item: Paw.ExtensionItem): void {
    const pmCollection = JSON.parse(item.content) as Postman.Collection
    if (!Array.isArray(pmCollection.item)) {
      throw new Error('This Postman Collection has no request')
    }
    const pawRootGroup = context.createRequestGroup((pmCollection.info ? pmCollection.info.name : null) || null)
    pmCollection.item.forEach((pmChild) => {
      const pawChild = this.convertItem(pmChild)
      if (pawChild) {
        pawRootGroup.appendChild(pawChild)
      }
    })
  }

  private convertItem(pmItem: Postman.Item): Paw.RequestTreeItem|null {
    if (pmItem.request) {
      return this.convertRequest(pmItem)
    }
    return this.convertRequestGroup(pmItem)
  }

  private convertRequestGroup(pmItem: Postman.Item): Paw.RequestGroup {
    const pawGroup = this.context.createRequestGroup(pmItem.name || null)
    if (Array.isArray(pmItem.item)) {
      pmItem.item.forEach((pmChild) => {
        const pawChild = this.convertItem(pmChild)
        if (pawChild) {
          pawGroup.appendChild(pawChild)
        }
      })
    }
    return pawGroup
  }

  private convertRequest(pmItem: Postman.Item): Paw.Request|null {
    const pmRequest = pmItem.request
    if (!pmRequest) {
      return null
    }

    const pawRequest = this.context.createRequest(
      (pmItem.name || null),
      (pmRequest.method || null),
      this.convertUrl(pmRequest.url),
      (pmRequest.description || null)
    )

    // headers
    if (pmRequest.header) {
      pmRequest.header.forEach((pmHeader) => {
        this.convertHeader(pmHeader, pawRequest)
      })
    }

    // body
    this.convertBody(pmRequest, pawRequest)

    return pawRequest
  }

  private convertUrl(pmUrl: string|Postman.Url): string|null {
    if (!pmUrl) {
      return null
    }
    if (typeof pmUrl === 'string') {
      return (pmUrl as string)
    }
    return (pmUrl as Postman.Url).raw
  }

  private convertHeader(pmHeader: Postman.Header, pawRequest: Paw.Request): Paw.KeyValue {
    // @TODO support importing descriptions using RequestVariables
    const pawHeader = pawRequest.addHeader(pmHeader.key || '', pmHeader.value || '')
    if (pmHeader.disabled) {
      pawHeader.enabled = false
    }
    return pawHeader
  }

  private convertBody(pmRequest: Postman.Request, pawRequest: Paw.Request): void {
    const pmBody = pmRequest.body
    if (!pmBody) {
      return
    }
    if (pmBody.mode === 'raw') {
      this.convertRaw(pmBody, pmRequest, pawRequest)
    }
    if (pmBody.mode === 'urlencoded') {
      this.convertBodyUrlEncoded(pmBody, pmRequest, pawRequest)
    }
    if (pmBody.mode === 'formdata') {
      this.convertBodyMultipart(pmBody, pmRequest, pawRequest)
    }
  }

  private convertRaw(pmBody: Postman.Body, pmRequest: Postman.Request, pawRequest: Paw.Request): void {
    if (!pmBody.raw) {
      return
    }

    // if type is JSON, set a JSON Body in Paw
    const contentTypeHeader = getPostmanHeader(pmRequest, 'content-type')
    if (contentTypeHeader && contentTypeHeader.value && contentTypeHeader.value.match(/^application\/json/)) {
      try {
        const json = JSON.parse(pmBody.raw)
        pawRequest.jsonBody = json
        return
      } catch (error) {
        // no op
      }
    }

    pawRequest.body = pmBody.raw
  }

  private convertBodyUrlEncoded(pmBody: Postman.Body, pmRequest: Postman.Request, pawRequest: Paw.Request): void {
    if (!pmBody.urlencoded) {
      return
    }
    const pawParams: { [key:string]: string|DynamicString } = {}
      pmBody.urlencoded.forEach((pmParam) => {
        const key: string = (pmParam.key || '')
        const value: string = (pmParam.value || '')
        pawParams[key] = value
      })
      pawRequest.urlEncodedBody = pawParams
  }

  private convertBodyMultipart(pmBody: Postman.Body, pmRequest: Postman.Request, pawRequest: Paw.Request): void {
    if (!pmBody.formdata) {
      return
    }
    const pawParams: { [key:string]: string|DynamicString } = {}
    pmBody.formdata.forEach((pmParam) => {
      const key: string = (pmParam.key || '')
      const value: string = (pmParam.value || '')
      pawParams[key] = value
    })
    pawRequest.multipartBody = pawParams
  }
}

// eslint-disable-next-line no-undef
registerImporter(PostmanImporter)
