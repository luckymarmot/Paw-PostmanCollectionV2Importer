/* eslint-disable no-param-reassign */
import Postman from '../types-paw-api/postman'
import Paw from '../types-paw-api/paw'
import { getPostmanHeader } from './postmanUtils'
import { makeDs, makeFileDv } from './dynamicStringUtils'
import EnvironmentManager from './EnvironmentManager'
import convertEnvString from './convertEnvString'


const convertRaw = (pmBody: Postman.Body, pmRequest: Postman.Request, pawRequest: Paw.Request, environmentManager: EnvironmentManager): void => {
  if (!pmBody.raw || typeof pmBody.raw !== 'string') {
    return
  }

  // convert body (with environment variables)
  const str = convertEnvString(pmBody.raw, environmentManager)

  // if type is JSON (and if there are no environment variables), set a JSON Body in Paw
  const contentTypeHeader = getPostmanHeader(pmRequest, 'content-type')
  if (contentTypeHeader &&
      contentTypeHeader.value &&
      contentTypeHeader.value.match(/^application\/json/) &&
      typeof str === 'string') {
    try {
      const json = JSON.parse(pmBody.raw)
      pawRequest.jsonBody = json
      return
    } catch (error) {
      // no op
    }
  }

  pawRequest.body = str
}

const convertBodyUrlEncoded = (pmBody: Postman.Body, pmRequest: Postman.Request, pawRequest: Paw.Request, environmentManager: EnvironmentManager): void => {
  if (!pmBody.urlencoded || !Array.isArray(pmBody.urlencoded)) {
    return
  }
  const pawParams: { [key:string]: string|DynamicString } = {}
    pmBody.urlencoded.forEach((pmParam) => {
      const key: string = (pmParam.key || '')
      const value: string = (pmParam.value || '')
      pawParams[key] = convertEnvString(value, environmentManager)
    })
    pawRequest.urlEncodedBody = pawParams
}

const convertBodyMultipart = (pmBody: Postman.Body, pmRequest: Postman.Request, pawRequest: Paw.Request, environmentManager: EnvironmentManager): void => {
  if (!pmBody.formdata || !Array.isArray(pmBody.formdata)) {
    return
  }
  const pawParams: { [key:string]: string|DynamicString } = {}
  pmBody.formdata.forEach((pmParam) => {
    const key: string = (pmParam.key || '')
    if (pmParam.type === 'file') {
      pawParams[key] = makeDs(makeFileDv())
    }
    else {
      const value: string = (pmParam.value || '')
      pawParams[key] = convertEnvString(value, environmentManager)
    }
  })
  pawRequest.multipartBody = pawParams
}

const convertBodyFile = (pmBody: Postman.Body, pmRequest: Postman.Request, pawRequest: Paw.Request): void => {
  pawRequest.body = makeDs(makeFileDv())
}

const convertBody = (pmRequest: Postman.Request, pawRequest: Paw.Request, environmentManager: EnvironmentManager): void => {
  const pmBody = pmRequest.body
  if (!pmBody) {
    return
  }
  if (pmBody.mode === 'raw') {
    convertRaw(pmBody, pmRequest, pawRequest, environmentManager)
  }
  if (pmBody.mode === 'urlencoded') {
    convertBodyUrlEncoded(pmBody, pmRequest, pawRequest, environmentManager)
  }
  if (pmBody.mode === 'formdata') {
    convertBodyMultipart(pmBody, pmRequest, pawRequest, environmentManager)
  }
  if (pmBody.mode === 'file') {
    convertBodyFile(pmBody, pmRequest, pawRequest)
  }
}

export default convertBody
