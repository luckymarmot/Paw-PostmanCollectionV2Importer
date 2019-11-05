import Postman from '../types-paw-api/postman'

const getPostmanHeader = (pmRequest: Postman.Request, headerName: string): Postman.Header|null => {
  if (pmRequest.header) {
    return pmRequest.header.find((item) => {
      return item.key && item.key.toLowerCase() === headerName.toLowerCase()
    }) || null
  }
  return null
}

export { getPostmanHeader }
