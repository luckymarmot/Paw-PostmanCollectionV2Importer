/* eslint-disable class-methods-use-this */

import Paw, { registerImporter } from './types-paw-api/paw'


class PostmanImporter implements Paw.Importer {
  static identifier = 'com.luckymarmot.PawExtensions.PostmanCollectionV2Importer'
  static title = 'Postman Importer (2.0, 2.1)'

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public canImport(context: Paw.Context, items: Paw.ExtensionItem[]): number {
    return 1
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  import(context: Paw.Context, items: Paw.ExtensionItem[], options: Paw.ExtensionOption): boolean {
    items.forEach((item) => {
      this.importItem(context, item)
    })
    return true
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private importItem(context: Paw.Context, item: Paw.ExtensionItem): void {
    console.log(JSON.stringify(item))
  }
}

registerImporter(PostmanImporter)
