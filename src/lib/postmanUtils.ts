import Postman from '../types-paw-api/postman'


const getPostmanHeader = (pmRequest: Postman.Request, headerName: string): Postman.Header|null => {
  if (!pmRequest.header) {
    return null
  }
  return pmRequest.header.find((item) => {
    return item.key && item.key.toLowerCase() === headerName.toLowerCase()
  }) || null
}

const getPostmanAuthParam = (keyValueList: Postman.AuthKeyValue[], key: string): string|null => {
  const foundAuthKeyValue = keyValueList.find((authKeyValue) => {
    return authKeyValue.key && authKeyValue.key.toLowerCase() === key.toLowerCase()
  })
  if (!foundAuthKeyValue) {
    return null
  }
  return (foundAuthKeyValue.value || null)
}

export { getPostmanHeader, getPostmanAuthParam }
