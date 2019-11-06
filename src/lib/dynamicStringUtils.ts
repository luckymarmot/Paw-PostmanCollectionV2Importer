import Paw from '../types-paw-api/paw'


const makeDv = (type: string, properties?: {[key:string]:any}): DynamicValue => {
  return new DynamicValue(type, properties)
}

const makeDs = (...components: Paw.DynamicStringComponent[]): DynamicString => {
  return new DynamicString(...components)
}

const makeEnvDv = (variableId: string): DynamicValue => {
  return makeDv('com.luckymarmot.EnvironmentVariableDynamicValue', {
    environmentVariable: variableId
  })
}

const makeFileDv = (): DynamicValue => {
  return makeDv('com.luckymarmot.FileContentDynamicValue', {
    bookmarkData: null
  })
}

export { makeDv, makeDs, makeEnvDv, makeFileDv }
