'use strict'

const withTimeoutOption = require('@chris.troutner/ipfs-core-utils/src/with-timeout-option')

/**
 * @param {Object} config
 * @param {import('libp2p/src/keychain')} config.keychain
 */
module.exports = ({ keychain }) => {
  /**
   * @type {import('@chris.troutner/ipfs-core-types/src/key').API["list"]}
   */
  const list = () => keychain.listKeys()

  return withTimeoutOption(list)
}
