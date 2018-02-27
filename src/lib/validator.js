import resolvePath from 'object-resolve-path'
import flatten from 'flat'

import { updateInObject } from './core'

const defaultState = {
  whitelists: {
    class: false,
    providerName: false,
    extension: false,
    contentType: false,
    state: false,
    pass: false
  },
  validators: {},
  sanitizers: {}
}

class Validator {
  constructor(config) {
    this.config = config
    this.validationState = defaultState
  }

  validate(block) {
    const configDidPass = this.checkConfig()
    if (configDidPass) {
      const whitelists = this.config.whitelists
      this.callMethods(block, 'sanitizers')
      this.checkWhitelists(block)
      this.callMethods(block, 'validators')
      this.reportNaiveValidity()
      const blockWithValidation = updateInObject(
        block,
        'validation',
        this.validationState
      )
      this.validationState = defaultState
      return blockWithValidation
    } else {
      return block
    }
  }

  checkWhitelists(block) {
    const whitelists = this.config.whitelists
    let results = {}
    Object.keys(whitelists).map(path => {
      const currentWhitelist = whitelists[path]
      const value = resolvePath(block, path)
      if (value !== undefined) {
        if (currentWhitelist.includes('*')) {
          results[path] = mark(true, path, value)
        } else if (currentWhitelist.includes(value)) {
          results[path] = mark(true, path, value)
        } else {
          results[path] = mark(false, path, value)
        }
      } else {
        results[path] = mark(null, path, value)
      }
    })
    this.setState({ whitelists: results })
  }

  /**
   * takes an array of functions and calls them, then sets the results to state
   * @param  {collection} block a block or channel from are.na API
   * @param  {string}     key   key, either 'sanitizers' or 'validators'
   * @return {[type]}           returns no value but does immutably change the
   *                            class validationState
   */
  callMethods(block, key) {
    const methods = this.config[key]
    const keys = Object.keys(methods)
    let results = {}
    keys.map(methodName => {
      const method = methods[methodName]
      const result = method(block)
      results[methodName] = result
    })
    this.setState({ [key]: results })
  }

  /**
   * provides a boolean indication if at least one test has failed. nulls are
   * interpreted as 'could not check'
   * @return {Boolean} did at least one test fail?
   */
  reportNaiveValidity() {
    let isValid = true
    const state = { ...this.validationState }
    delete state['sanitizers']
    const flat = flatten(state, { maxDepth: 2 })
    const rejects = Object.values(flat).filter(item => item.isValid === false)
    isValid = rejects.length > 0 ? false : true
    this.setState({ isValid: isValid })
  }

  /**
   * runs some basic stuff to tell you what is wrong with your config
   * @return {Boolean} whether or not the config passed
   */
  checkConfig() {
    const config = this.config
    if (config === undefined || config === null) {
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
      if (!Array.isArray(whitelist)) {
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

  setState(entry) {
    this.validationState = {
      ...this.validationState,
      ...entry
    }
  }
}

function mark(isValid, keyToEval, value) {
  return {
    isValid,
    keyEvaluated: keyToEval,
    isOfValue: value
  }
}

export { Validator, mark }
