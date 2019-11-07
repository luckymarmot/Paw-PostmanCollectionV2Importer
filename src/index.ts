/* eslint-disable class-methods-use-this */
import Paw from './types-paw-api/paw'
import Postman from './types-paw-api/postman'
import convertBody from './lib/convertBody'
import convertHeaders from './lib/convertHeaders'
import convertAuth from './lib/convertAuth'
import convertUrl, { convertUrlParams } from './lib/convertUrl'
import EnvironmentManager from './lib/EnvironmentManager'


/*
 * Read Postman SDK Docs:
 * http://www.postmanlabs.com/postman-collection/
 */

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
      this.importCollection(item)
    })
    return true
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private importCollection(item: Paw.ExtensionItem): void {
    // parse JSON
    let pmCollection
    try {
      pmCollection = JSON.parse(item.content) as Postman.Collection
    } catch (error) {
      throw new Error('Postman Collection is not a valid JSON')
    }

    // check format
    if (!Array.isArray(pmCollection.item)) {
      throw new Error('Postman Collection has no request')
    }

    // get name and create root group
    const name = (pmCollection.info ? pmCollection.info.name : null) || item.name || null
    const environmentManager = new EnvironmentManager(this.context, name)
    const pawRootGroup = this.context.createRequestGroup(name)

    // import items
    pmCollection.item.forEach((pmChild) => {
      const pawChild = this.convertItem(pmChild, environmentManager)
      if (pawChild) {
        pawRootGroup.appendChild(pawChild)
      }
    })
  }

  private convertItem(pmItem: Postman.Item, environmentManager: EnvironmentManager): Paw.RequestTreeItem|null {
    if (pmItem.request) {
      return this.convertRequest(pmItem, environmentManager)
    }
    return this.convertRequestGroup(pmItem, environmentManager)
  }

  private convertRequestGroup(pmItem: Postman.Item, environmentManager: EnvironmentManager): Paw.RequestGroup {
    const pawGroup = this.context.createRequestGroup(pmItem.name || null)
    if (Array.isArray(pmItem.item)) {
      pmItem.item.forEach((pmChild) => {
        const pawChild = this.convertItem(pmChild, environmentManager)
        if (pawChild) {
          pawGroup.appendChild(pawChild)
        }
      })
    }
    return pawGroup
  }

  private convertRequest(pmItem: Postman.Item, environmentManager: EnvironmentManager): Paw.Request|null {
    const pmRequest = pmItem.request
    if (!pmRequest) {
      return null
    }

    const pawUrl = convertUrl(pmRequest.url, environmentManager)
    const pawRequest = this.context.createRequest(
      (pmItem.name || null),
      (pmRequest.method || null),
      pawUrl,
      (pmRequest.description || null)
    )

    // URL params
    convertUrlParams(pmRequest, pawRequest, environmentManager)

    // headers
    convertHeaders(pmRequest, pawRequest, environmentManager)

    // body
    convertBody(pmRequest, pawRequest, environmentManager)

    // auth
    convertAuth(pmRequest, pawRequest, environmentManager)

    // options
    if (pmItem.protocolProfileBehavior) {
      pawRequest.followRedirects = (pmItem.protocolProfileBehavior.followRedirects || false)
      pawRequest.redirectAuthorization = (pmItem.protocolProfileBehavior.followAuthorizationHeader || false)
      pawRequest.redirectMethod = (pmItem.protocolProfileBehavior.followOriginalHttpMethod || false)
    }

    return pawRequest
  }
}

registerImporter(PostmanImporter)
