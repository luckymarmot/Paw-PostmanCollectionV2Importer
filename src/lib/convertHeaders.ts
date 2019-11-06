/* eslint-disable no-param-reassign */
import Postman from '../types-paw-api/postman'
import Paw from '../types-paw-api/paw'
import EnvironmentManager from './EnvironmentManager'
import convertEnvString from './convertEnvString'


const convertHeader = (pmHeader: Postman.Header, pawRequest: Paw.Request, environmentManager: EnvironmentManager): Paw.KeyValue => {
  // @TODO support importing descriptions using RequestVariables
  const pawHeader = pawRequest.addHeader(
    convertEnvString((pmHeader.key || ''), environmentManager),
    convertEnvString((pmHeader.value || ''), environmentManager)
  )
  if (pmHeader.disabled) {
    pawHeader.enabled = false
  }
  return pawHeader
}

const convertHeaders = (pmRequest: Postman.Request, pawRequest: Paw.Request, environmentManager: EnvironmentManager): void => {
  if (pmRequest.header) {
    pmRequest.header.forEach((pmHeader) => {
      convertHeader(pmHeader, pawRequest, environmentManager)
    })
  }
}

export default convertHeaders
