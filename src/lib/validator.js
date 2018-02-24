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

/**
 * performs validation with config
 * @param  {collection} block a represntation of a block or channel from are.na
 * @return {collection}       a new block or channel with validation messages appended
 */
  validateSafe(block) {
    const configIsLegit = Validator.checkConfig()
    if (configIsLegit) {
      const whitelists = this.config.whitelists
      /* some sanitizers need to be run regardless of whitelist validity, ie
      if you need to tell the user about the titles of rejected blocks.
      */
      Validator.callMethods(block, 'sanitizers')
      this.testAgainstWhitelist('state', block.state, whitelists.state)
      const itemDidPassStateCheck = this.validationState.whitelists.state.isValid
      if (itemDidPassStateCheck) {
        this.testAgainstWhitelist('class', block.class, whitelists.class)
        const itemDidPassClassCheck = this.validationState.whitelists.class.isValid
        if (itemDidPassClassCheck) {
          if (block.class === 'Attachment') {
            this.testAgainstWhitelist('extension', block.attachment.extension, whitelists.extension)
          } else {
            this.testAgainstWhitelist('providerName', block.source.provider.name, whitelists.providerName)
          }
          Validator.callMethods(block, 'validators')
        }
      }
      Validator.quickReject()
      const blockWithValidation = updateInObject(block, 'validation', this.validationState)
      this.validationState = defaultState
      return blockWithValidation
    } else {
      // idk if this is confusing or not
      return block
    }
  }

  validate(block) {
    const configIsLegit = Validator.checkConfig()
    if (configIsLegit) {
      const whitelists = this.config.whitelists
      Validator.callMethods(block, 'sanitizers')
      this.testAgainstWhitelist('state', block.state, whitelists.state)
      this.testAgainstWhitelist('class', block.class, whitelists.class)
      if (block.class === 'Attachment') {
        this.testAgainstWhitelist('extension', block.attachment.extension, whitelists.extension)
      } else {
        this.testAgainstWhitelist('providerName', block.source.provider.name, whitelists.providerName)
      }
      Validator.callMethods(block, 'validators')
      Validator.quickReject()
      const blockWithValidation = updateInObject(block, 'validation', this.validationState)
      this.validationState = defaultState
      return blockWithValidation
    } else {
      return block
    }
  }

  /**
   * takes a whitelist, it's name and a value and checks fof inclusion. Then
   * returns a validation message with results
   * @param  {string}     key       the key of the whitelist being checked
   * @param  {type}       value     the value to compare against the whitelist from the block or channel
   * @param  {array}      whitelist an array of string keys representing acceptable values
   * @return {message}              returns no value but does immutably change the class validationState
   */
  testAgainstWhitelist(key, value, whitelist) {
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

  /**
   * takes an array of functions and calls them, then sets the results to state
   * @param  {collection} block a block or channel from are.na API
   * @param  {string}     key   key, either 'sanitizers' or 'validators'
   * @return {[type]}           returns no value but does immutably change the
   *                            class validationState
   */
  static callMethods(block, key) {
    const methods = this.config[key]
    const keys = Object.keys(methods)

    // ugh not this kind of thing again
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

  /**
   * provides a boolean indication if at least one test has failed
   * @return {Boolean} did at least one test fail?
  */
  static quickReject() {
    const state = this.validationState
    const keys = Object.keys(state)
    const inspectableFields = keys.filter(item => item !== 'sanitizers')
    // need to drop sanitizers from this check
    const isValid = inspectableFields.map(category => {
       const items = Object.keys(state[category])
       const rejects = items.filter(item => !item.isValid)
       if (rejects.length > 0) {
         return false
       }
       return true
    })

    this.validationState = {
      ...this.validationState,
      isValid,
    }
  }

  /**
   * runs some basic stuff to tell you what is wrong with your config
   * @return {Boolean} whether or not the config passed
   */
  static checkConfig() {
    const config = this.config
    if (!config) {
      console.error('No config object passed to validator')
      return false
    }
    if (typeof config !== 'object') {
      console.error('Config must be an object')
      return false
    }
    const whiteListKeys = Object.keys(config.whitelists)
    whiteListKeys.map(key => {
      const whitelist = config.whitelists[key]
      if (typeof whitelist !== 'array') {
        console.error(`Whitelist ${key} must be an array.`)
        return false
      }
      whitelist.map(item => {
        if (typeof item !== 'string') {
          console.error(`Item ${item} in whitelist ${key} must be a string`)
          return false
        }
      })
    })
    return true
  }
}
/**
 * makes a validation message object
 * @param  {Boolean}  isValid did the value pass validation or not
 * @param  {any}      type    the value of the key being compared
 * @param  {string}   message a human-readable message that could be passed to
 *                            an interface
 * @return {object}           the message object
 */
function message(isValid, value, message) {
  return {
    isValid,
    isOfValue: value,
    message,
  }
}

export {
  Validator,
  message,
}
