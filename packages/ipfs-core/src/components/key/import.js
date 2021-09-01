'use strict'

const withTimeoutOption = require('@chris.troutner/ipfs-core-utils/src/with-timeout-option')

/**
 * @param {Object} config
 * @param {import('libp2p/src/keychain')} config.keychain
 */
module.exports = ({ keychain }) => {
  /**
   * @type {import('@chris.troutner/ipfs-core-types/src/key').API["import"]}
   */
  const importKey = (name, pem, password) => {
    return keychain.importKey(name, pem, password)
  }

  return withTimeoutOption(importKey)
}
