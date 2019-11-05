const fn = (s: string): number => {
  return s.length
}

fn('node')

class PostmanImporter {
  static identifier = 'com.luckymarmot.PawExtensions.PostmanCollectionV2Importer'
  static title = 'cURL Importer'
}

registerImporter(PostmanImporter)
