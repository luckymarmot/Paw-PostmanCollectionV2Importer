/* eslint-disable no-param-reassign */
import Postman from '../types-paw-api/postman'
import Paw from '../types-paw-api/paw'
import { getPostmanHeader } from './postmanUtils'
import { makeDs, makeFileDv } from './dynamicStringUtils'


const convertRaw = (pmBody: Postman.Body, pmRequest: Postman.Request, pawRequest: Paw.Request): void => {
  if (!pmBody.raw) {
    return
  }

  // if type is JSON, set a JSON Body in Paw
  const contentTypeHeader = getPostmanHeader(pmRequest, 'content-type')
  if (contentTypeHeader && contentTypeHeader.value && contentTypeHeader.value.match(/^application\/json/)) {
    try {
      const json = JSON.parse(pmBody.raw)
      pawRequest.jsonBody = json
      return
    } catch (error) {
      // no op
    }
  }

  pawRequest.body = pmBody.raw
}

const convertBodyUrlEncoded = (pmBody: Postman.Body, pmRequest: Postman.Request, pawRequest: Paw.Request): void => {
  if (!pmBody.urlencoded) {
    return
  }
  const pawParams: { [key:string]: string|DynamicString } = {}
    pmBody.urlencoded.forEach((pmParam) => {
      const key: string = (pmParam.key || '')
      const value: string = (pmParam.value || '')
      pawParams[key] = value
    })
    pawRequest.urlEncodedBody = pawParams
}

const convertBodyMultipart = (pmBody: Postman.Body, pmRequest: Postman.Request, pawRequest: Paw.Request): void => {
  if (!pmBody.formdata) {
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
      pawParams[key] = value
    }
  })
  pawRequest.multipartBody = pawParams
}

const convertBodyFile = (pmBody: Postman.Body, pmRequest: Postman.Request, pawRequest: Paw.Request): void => {
  pawRequest.body = makeDs(makeFileDv())
}

const convertBody = (pmRequest: Postman.Request, pawRequest: Paw.Request): void => {
  const pmBody = pmRequest.body
  if (!pmBody) {
    return
  }
  if (pmBody.mode === 'raw') {
    convertRaw(pmBody, pmRequest, pawRequest)
  }
  if (pmBody.mode === 'urlencoded') {
    convertBodyUrlEncoded(pmBody, pmRequest, pawRequest)
  }
  if (pmBody.mode === 'formdata') {
    convertBodyMultipart(pmBody, pmRequest, pawRequest)
  }
  if (pmBody.mode === 'file') {
    convertBodyFile(pmBody, pmRequest, pawRequest)
  }
}

export default convertBody
