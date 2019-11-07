/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import Postman from '../types-paw-api/postman'
import Paw from '../types-paw-api/paw'
import { getPostmanAuthParam } from './postmanUtils'
import { makeDs, makeDv } from './dynamicStringUtils'
import EnvironmentManager from './EnvironmentManager'
import convertEnvString from './convertEnvString'


const getDynamicPostmanAuthParam = (keyValueList: Postman.AuthKeyValue[]|Postman.AuthParamV20, key: string, environmentManager: EnvironmentManager): string|DynamicString|null => {
  const val = getPostmanAuthParam(keyValueList, key)
  if (!val) {
    return null
  }
  return convertEnvString(val, environmentManager)
}

const convertAuthApiKey = (pmAuth: Postman.Auth, pmRequest: Postman.Request, pawRequest: Paw.Request, environmentManager: EnvironmentManager): void => {
  if (!pmAuth.apikey) {
    return
  }
  const key = getDynamicPostmanAuthParam(pmAuth.apikey, 'key', environmentManager)
  const value = getDynamicPostmanAuthParam(pmAuth.apikey, 'value', environmentManager)
  const whereIn = getPostmanAuthParam(pmAuth.apikey, 'in')
  if (whereIn === 'query') {
    pawRequest.addUrlParameter((key || ''), (value || ''))
  }
  else {
    pawRequest.addHeader((key || ''), (value || ''))
  }
}

const convertAuthBearer = (pmAuth: Postman.Auth, pmRequest: Postman.Request, pawRequest: Paw.Request, environmentManager: EnvironmentManager): void => {
  if (!pmAuth.bearer) {
    return
  }
  const token = getDynamicPostmanAuthParam(pmAuth.bearer, 'token', environmentManager)
  pawRequest.addHeader('Authorization', `Bearer ${(token || '')}`)
}

const convertAuthBasic = (pmAuth: Postman.Auth, pmRequest: Postman.Request, pawRequest: Paw.Request, environmentManager: EnvironmentManager): void => {
  if (!pmAuth.basic) {
    return
  }
  const username = getDynamicPostmanAuthParam(pmAuth.basic, 'username', environmentManager)
  const password = getDynamicPostmanAuthParam(pmAuth.basic, 'password', environmentManager)
  pawRequest.httpBasicAuth = {
    username,
    password,
  }
}

const convertAuthOAuth1 = (pmAuth: Postman.Auth, pmRequest: Postman.Request, pawRequest: Paw.Request, environmentManager: EnvironmentManager): void => {
  if (!pmAuth.oauth1) {
    return
  }

  const consumerKey = getDynamicPostmanAuthParam(pmAuth.oauth1, 'consumerKey', environmentManager)
  const consumerSecret = getDynamicPostmanAuthParam(pmAuth.oauth1, 'consumerSecret', environmentManager)
  const token = getDynamicPostmanAuthParam(pmAuth.oauth1, 'token', environmentManager)
  const tokenSecret = getDynamicPostmanAuthParam(pmAuth.oauth1, 'tokenSecret', environmentManager)
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

const convertAuthOAuth2 = (pmAuth: Postman.Auth, pmRequest: Postman.Request, pawRequest: Paw.Request, environmentManager: EnvironmentManager): void => {
  if (!pmAuth.oauth2) {
    return
  }

  const accessToken = getDynamicPostmanAuthParam(pmAuth.oauth2, 'accessToken', environmentManager)

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

const convertAuthDigest = (pmAuth: Postman.Auth, pmRequest: Postman.Request, pawRequest: Paw.Request, environmentManager: EnvironmentManager): void => {
  if (!pmAuth.digest) {
    return
  }

  const username = getDynamicPostmanAuthParam(pmAuth.digest, 'username', environmentManager)
  const password = getDynamicPostmanAuthParam(pmAuth.digest, 'password', environmentManager)

  const digestDv = makeDv('com.luckymarmot.PawExtensions.DigestAuthDynamicValue', {
    username,
    password,
  })

  pawRequest.addHeader('Authorization', makeDs(digestDv))
}

const convertAuthHawk = (pmAuth: Postman.Auth, pmRequest: Postman.Request, pawRequest: Paw.Request, environmentManager: EnvironmentManager): void => {
  if (!pmAuth.hawk) {
    return
  }

  const authId = getDynamicPostmanAuthParam(pmAuth.hawk, 'authId', environmentManager)
  const authKey = getDynamicPostmanAuthParam(pmAuth.hawk, 'authKey', environmentManager)
  const algorithm = getPostmanAuthParam(pmAuth.hawk, 'algorithm')

  const hawkDv = makeDv('uk.co.jalada.PawExtensions.HawkDynamicValue', {
    id: authId,
    key: authKey,
    algorithm,
    ext: null,
  })

  pawRequest.addHeader('Authorization', makeDs(hawkDv))
}

const convertAuth = (pmRequest: Postman.Request, pawRequest: Paw.Request, environmentManager: EnvironmentManager): void => {
  const pmAuth = pmRequest.auth
  if (!pmAuth) {
    return
  }
  switch (pmAuth.type) {
    case 'apikey':
      convertAuthApiKey(pmAuth, pmRequest, pawRequest, environmentManager)
      break;
    case 'bearer':
      convertAuthBearer(pmAuth, pmRequest, pawRequest, environmentManager)
      break;
    case 'basic':
      convertAuthBasic(pmAuth, pmRequest, pawRequest, environmentManager)
      break;
    case 'oauth1':
      convertAuthOAuth1(pmAuth, pmRequest, pawRequest, environmentManager)
      break;
    case 'oauth2':
      convertAuthOAuth2(pmAuth, pmRequest, pawRequest, environmentManager)
      break;
    case 'digest':
      convertAuthDigest(pmAuth, pmRequest, pawRequest, environmentManager)
      break;
    case 'hawk':
      convertAuthHawk(pmAuth, pmRequest, pawRequest, environmentManager)
      break;
    default:
      break;
  }
}

export default convertAuth
