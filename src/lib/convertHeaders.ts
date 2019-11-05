/* eslint-disable no-param-reassign */
import Postman from '../types-paw-api/postman'
import Paw from '../types-paw-api/paw'


const convertHeader = (pmHeader: Postman.Header, pawRequest: Paw.Request): Paw.KeyValue => {
  // @TODO support importing descriptions using RequestVariables
  const pawHeader = pawRequest.addHeader(pmHeader.key || '', pmHeader.value || '')
  if (pmHeader.disabled) {
    pawHeader.enabled = false
  }
  return pawHeader
}

const convertHeaders = (pmRequest: Postman.Request, pawRequest: Paw.Request): void => {
  if (pmRequest.header) {
    pmRequest.header.forEach((pmHeader) => {
      convertHeader(pmHeader, pawRequest)
    })
  }
}

export default convertHeaders
