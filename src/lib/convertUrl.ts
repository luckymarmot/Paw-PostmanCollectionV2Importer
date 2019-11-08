/* eslint-disable no-param-reassign */
import Postman from '../types-paw-api/postman'
import Paw from '../types-paw-api/paw'
import EnvironmentManager from './EnvironmentManager'
import convertEnvString from './convertEnvString'
import { makeDs, makeRequestDv } from './dynamicStringUtils'


const convertUrl = (pmUrl: string|Postman.Url, environmentManager: EnvironmentManager): string|DynamicString|null => {
  if (!pmUrl) {
    return null
  }
  if (typeof pmUrl === 'string') {
    return convertEnvString(pmUrl as string, environmentManager)
  }
  const { raw } = (pmUrl as Postman.Url)
  if (!raw) {
    return null
  }
  return convertEnvString(raw, environmentManager)
}

const convertUrlParam = (pmQueryParam: Postman.UrlQueryParam, pawRequest: Paw.Request, environmentManager: EnvironmentManager): void => {
  // params have already been inserted anyways by the "url.raw" field
  // only perform change if there's a request description
  if (!pmQueryParam.description ||
      typeof pmQueryParam.description !== 'string' ||
      pmQueryParam.description.trim() === '') {
    return
  }

  // get key & value
  const name = (pmQueryParam.key || '')
  let value = convertEnvString((pmQueryParam.value || ''), environmentManager)

  // check that Paw has this URL Param, otherwise ignore it
  if (!pawRequest.getUrlParameterByName(name, true /* isDynamic */)) {
    return
  }

  // convert to Request Variable
  const variable = pawRequest.addVariable(name, value, pmQueryParam.description.trim())
  value = makeDs(makeRequestDv(variable.id))

  // set URL Param in Paw
  pawRequest.setUrlParameterByName(name, value)
}

const convertUrlParams = (pmRequest: Postman.Request, pawRequest: Paw.Request, environmentManager: EnvironmentManager): void => {
  if (typeof pmRequest.url !== 'object') {
    return
  }
  const pmUrl = (pmRequest.url as Postman.Url)
  if (!pmUrl.query || !Array.isArray(pmUrl.query)) {
    return
  }
  pmUrl.query.forEach((queryParam) => {
    convertUrlParam(queryParam, pawRequest, environmentManager)
  })
}

export { convertUrlParams }
export default convertUrl
