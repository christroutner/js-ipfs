'use strict'

const { getPubsubRouting } = require('./utils')
const withTimeoutOption = require('@chris.troutner/ipfs-core-utils/src/with-timeout-option')

/**
 * @param {Object} config
 * @param {import('../../ipns')} config.ipns
 * @param {import('../../../types').Options} config.options
 */
module.exports = ({ ipns, options }) => {
  const experimental = options.EXPERIMENTAL

  /**
   * @type {import('@chris.troutner/ipfs-core-types/src/name/pubsub').API["state"]}
   */
  async function state (_options = {}) { // eslint-disable-line require-await
    try {
      return { enabled: Boolean(getPubsubRouting(ipns, experimental)) }
    } catch (err) {
      return { enabled: false }
    }
  }

  return withTimeoutOption(state)
}
