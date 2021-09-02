// @ts-nocheck
'use strict'

const withTimeoutOption = require('@chris.troutner/ipfs-core-utils/src/with-timeout-option')

/**
 * @param {Object} config
 * @param {import('../../types').NetworkService} config.network
 */
module.exports = ({ network }) => {
  /**
   * @type {import('@chris.troutner/ipfs-core-types/src/swarm').API["disconnect"]}
   */
  async function disconnect (addr, options = {}) {
    const { libp2p } = await network.use(options)
    await libp2p.hangUp(addr)
  }

  return withTimeoutOption(disconnect)
}
