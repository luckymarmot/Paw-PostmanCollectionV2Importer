import Paw from '../types-paw-api/paw'
import { makeEnvDv } from './dynamicStringUtils'


class EnvironmentManager {
  name: string
  context: Paw.Context
  environmentDomain: Paw.EnvironmentDomain|null

  constructor(context: Paw.Context, name?: string|null) {
    this.name = (name || 'Postman Environment')
    this.context = context
    this.environmentDomain = null
  }

  private getEnvironmentDomain(): Paw.EnvironmentDomain {
    if (!this.environmentDomain) {
      this.environmentDomain = this.context.getEnvironmentDomainByName(this.name)
      if (!this.environmentDomain) {
        this.environmentDomain = this.context.createEnvironmentDomain(this.name)
        this.environmentDomain.createEnvironment('Default')
      }
    }
    return this.environmentDomain
  }

  private getEnvironmentVariable(name: string): Paw.EnvironmentVariable {
    let variable = this.getEnvironmentDomain().getVariableByName(name)
    if (!variable) {
      variable = this.getEnvironmentDomain().createEnvironmentVariable(name)
    }
    return variable
  }

  public getDynamicValue(variableName: string): DynamicValue {
    const variable = this.getEnvironmentVariable(variableName)
    return makeEnvDv(variable.id)
  }

}

export default EnvironmentManager
