'use strict'

const configure = require('../lib/configure')

/**
 * @typedef {import('../types').HTTPClientExtraOptions} HTTPClientExtraOptions
 * @typedef {import('@chris.troutner/ipfs-core-types/src/key').API<HTTPClientExtraOptions>} KeyAPI
 */

module.exports = configure(api => {
  /**
   * @type {KeyAPI["info"]}
   */
  const info = async (name, options = {}) => {
    throw new Error('Not implemented')
  }

  return info
})
