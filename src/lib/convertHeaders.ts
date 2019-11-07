/* eslint-disable no-param-reassign */
import Postman from '../types-paw-api/postman'
import Paw from '../types-paw-api/paw'
import EnvironmentManager from './EnvironmentManager'
import convertEnvString from './convertEnvString'
import { makeDs, makeRequestDv } from './dynamicStringUtils'


const convertHeader = (pmHeader: Postman.Header, pawRequest: Paw.Request, environmentManager: EnvironmentManager): Paw.KeyValue => {
  const headerName = convertEnvString((pmHeader.key || ''), environmentManager)
  let headerValue = convertEnvString((pmHeader.value || ''), environmentManager)

  // Convert to Request Variable (if there's a description)
  if (pmHeader.description &&
      typeof pmHeader.description === 'string' &&
      pmHeader.description.trim() !== '') {
    const variable = pawRequest.addVariable(headerName as string, headerValue, pmHeader.description.trim())
    headerValue = makeDs(makeRequestDv(variable.id))
  }

  // Add header
  const pawHeader = pawRequest.addHeader(headerName, headerValue)

  // Set disabled?
  if (pmHeader.disabled) {
    pawHeader.enabled = false
  }

  return pawHeader
}

const convertHeaders = (pmRequest: Postman.Request, pawRequest: Paw.Request, environmentManager: EnvironmentManager): void => {
  if (!pmRequest.header || !Array.isArray(pmRequest.header)) {
    return
  }
  pmRequest.header.forEach((pmHeader) => {
    convertHeader(pmHeader, pawRequest, environmentManager)
  })
}

export default convertHeaders
