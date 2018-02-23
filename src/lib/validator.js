import { updateInObject } from './core'

const defaultState = {
  whitelists: {
    class: false,
    providerName: false,
    extension: false,
    contentType: false,
    state: false,
    pass: false,
  },
  validators: {},
  sanitizers: {},
}

class Validator {
  constructor(config) {
    this.config = config
    this.validationState = defaultState
  }

  validate(block) {
    const whitelists = this.config.whitelists
    this.compareToWhitelist(block, 'state', block.state, whitelists.state)
    if (this.validationState.whitelists.state.isValid) {

      this.compareToWhitelist(block, 'class', block.class, whitelists.class)
      if (this.validationState.whitelists.class.isValid) {
        if (block.class === 'Attachment') {
          this.compareToWhitelist(block, 'extension', block.attachment.extension, whitelists.extension)
        } else {
          this.compareToWhitelist(block, 'providerName', block.source.provider.name, whitelists.providerName)
        }
        this.callConfigMethods(block, 'sanitizers')
        this.callConfigMethods(block, 'validators')
      }
    }
    console.log(this.validationState)
    const blockWithValidation = updateInObject(block, 'validation', this.validationState)
    this.validationState = defaultState
    return blockWithValidation
  }

  compareToWhitelist(block, key, value, whitelist) {
    let result
    if (whitelist.includes('*')) {
      result = message(true, value, `any value accepted`)
    } else if (whitelist.includes(value)) {
      result = message(true, value, `${key}:${value} is in whitelist`)
    } else {
      result = message(false, value, `${key}:${value} is not in whitelist`)
    }

    this.validationState = {
      ...this.validationState,
      whitelists: {
        ...this.validationState.whitelists,
        [key]: result,
      }
    }
  }

  callConfigMethods(block, key) {
    const methods = this.config[key]
    const keys = Object.keys(methods)
    let results = {}

    keys.map(methodName => {
      const method = methods[methodName]
      const result = method(block)
      results[methodName] = result
    })

    this.validationState = {
      ...this.validationState,
      [key]: results,
    }
  }

}

function message(isValid, type, message) {
  return {
    isValid,
    isOfType: type,
    message,
  }
}

function checkConfig() {

}

export {
  Validator,
  message,
  checkConfig,
}
