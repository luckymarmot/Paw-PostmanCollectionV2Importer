/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import Postman from '../types-paw-api/postman'
import Paw from '../types-paw-api/paw'
import { getPostmanAuthParam, getPostmanHeader } from './postmanUtils'
import { makeDs, makeDv } from './dynamicStringUtils'


const convertAuthApiKey = (pmAuth: Postman.Auth, pmRequest: Postman.Request, pawRequest: Paw.Request): void => {
  if (!pmAuth.apikey) {
    return
  }
  const key = getPostmanAuthParam(pmAuth.apikey, 'key')
  const value = getPostmanAuthParam(pmAuth.apikey, 'value')
  const whereIn = getPostmanAuthParam(pmAuth.apikey, 'in')
  if (whereIn === 'query') {
    pawRequest.addUrlParameter((key || ''), (value || ''))
  }
  else {
    pawRequest.addHeader((key || ''), (value || ''))
  }
}

const convertAuthBearer = (pmAuth: Postman.Auth, pmRequest: Postman.Request, pawRequest: Paw.Request): void => {
  if (!pmAuth.bearer) {
    return
  }
  const token = getPostmanAuthParam(pmAuth.bearer, 'token')
  pawRequest.addHeader('Authorization', `Bearer ${(token || '')}`)
}

const convertAuthBasic = (pmAuth: Postman.Auth, pmRequest: Postman.Request, pawRequest: Paw.Request): void => {
  if (!pmAuth.basic) {
    return
  }
  const username = getPostmanAuthParam(pmAuth.basic, 'username')
  const password = getPostmanAuthParam(pmAuth.basic, 'password')
  pawRequest.httpBasicAuth = {
    username,
    password,
  }
}

const convertAuthOAuth1 = (pmAuth: Postman.Auth, pmRequest: Postman.Request, pawRequest: Paw.Request): void => {
  if (!pmAuth.oauth1) {
    return
  }

  const consumerKey = getPostmanAuthParam(pmAuth.oauth1, 'consumerKey')
  const consumerSecret = getPostmanAuthParam(pmAuth.oauth1, 'consumerSecret')
  const token = getPostmanAuthParam(pmAuth.oauth1, 'token')
  const tokenSecret = getPostmanAuthParam(pmAuth.oauth1, 'tokenSecret')
  const signatureMethod = getPostmanAuthParam(pmAuth.oauth1, 'signatureMethod')

  pawRequest.oauth1 = {
    oauth_consumer_key: consumerKey,
    oauth_consumer_secret: consumerSecret,
    oauth_token: token,
    oauth_token_secret: tokenSecret,
    oauth_nonce: undefined,
    oauth_timestamp: undefined,
    oauth_callback: undefined,
    oauth_signature: undefined,
    oauth_signature_method: (signatureMethod || undefined),
    oauth_version: undefined,
    oauth_additional_parameters: undefined,
  }
}

const convertAuthOAuth2 = (pmAuth: Postman.Auth, pmRequest: Postman.Request, pawRequest: Paw.Request): void => {
  if (!pmAuth.oauth2) {
    return
  }

  const accessToken = getPostmanAuthParam(pmAuth.oauth2, 'accessToken')

  pawRequest.oauth2 = {
    client_id: '',
    client_secret: '',
    authorization_uri: '',
    access_token_uri: '',
    redirect_uri: '',
    scope: undefined,
    state: undefined,
    token: accessToken,
    token_prefix: undefined,
    grant_type: undefined,
  }
}

const convertAuthDigest = (pmAuth: Postman.Auth, pmRequest: Postman.Request, pawRequest: Paw.Request): void => {
  if (!pmAuth.digest) {
    return
  }

  const username = getPostmanAuthParam(pmAuth.digest, 'username')
  const password = getPostmanAuthParam(pmAuth.digest, 'password')

  const digestDv = makeDv('com.luckymarmot.PawExtensions.DigestAuthDynamicValue', {
    username,
    password,
  })

  pawRequest.addHeader('Authorization', makeDs(digestDv))
}

const convertAuthHawk = (pmAuth: Postman.Auth, pmRequest: Postman.Request, pawRequest: Paw.Request): void => {
  if (!pmAuth.hawk) {
    return
  }

  const authId = getPostmanAuthParam(pmAuth.hawk, 'authId')
  const authKey = getPostmanAuthParam(pmAuth.hawk, 'authKey')
  const algorithm = getPostmanAuthParam(pmAuth.hawk, 'algorithm')

  const hawkDv = makeDv('uk.co.jalada.PawExtensions.HawkDynamicValue', {
    id: authId,
    key: authKey,
    algorithm,
    ext: null,
  })

  pawRequest.addHeader('Authorization', makeDs(hawkDv))
}

const convertAuth = (pmRequest: Postman.Request, pawRequest: Paw.Request): void => {
  const pmAuth = pmRequest.auth
  if (!pmAuth) {
    return
  }
  switch (pmAuth.type) {
    case 'apikey':
      convertAuthApiKey(pmAuth, pmRequest, pawRequest)
      break;
    case 'bearer':
      convertAuthBearer(pmAuth, pmRequest, pawRequest)
      break;
    case 'basic':
      convertAuthBasic(pmAuth, pmRequest, pawRequest)
      break;
    case 'oauth1':
      convertAuthOAuth1(pmAuth, pmRequest, pawRequest)
      break;
    case 'oauth2':
      convertAuthOAuth2(pmAuth, pmRequest, pawRequest)
      break;
    case 'digest':
      convertAuthDigest(pmAuth, pmRequest, pawRequest)
      break;
    case 'hawk':
      convertAuthHawk(pmAuth, pmRequest, pawRequest)
      break;
    default:
      break;
  }
}

export default convertAuth
