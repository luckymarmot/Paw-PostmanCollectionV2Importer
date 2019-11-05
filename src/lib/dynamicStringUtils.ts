import Paw from '../types-paw-api/paw'


const makeEnvDv = (): DynamicValue => {
  return new DynamicValue('com.luckymarmot.EnvironmentVariableDynamicValue', {
    environmentVariable: null
  })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const makeDs = (s: string, context: Paw.Context): string|DynamicString => {
  const re = /\{\{([^}]+)\}\}/g
  let match
  const components: Paw.DynamicStringComponent[] = []
  let idx = 0

  // eslint-disable-next-line no-cond-assign
  while (match = re.exec(s)) {
    // push any string here before
    if (match.index > idx) {
      components.push(s.substr(idx, match.index - idx))
    }

    // push env variable
    console.log('env variable', match[1])
    components.push(makeEnvDv())

    idx += match.index + match[0].length
  }

  // add remaining string
  if (idx < s.length) {
    components.push(s.substr(idx))
  }

  return new DynamicString(...components)
}

export { makeDs }
