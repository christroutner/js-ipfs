'use strict'

const withTimeoutOption = require('@chris.troutner/ipfs-core-utils/src/with-timeout-option')

/**
 * @param {Object} config
 * @param {import('../../types').NetworkService} config.network
 */
module.exports = ({ network }) => {
  /**
   * @type {import('@chris.troutner/ipfs-core-types/src/bitswap').API["wantlist"]}
   */
  async function wantlist (options = {}) {
    const { bitswap } = await network.use(options)
    const list = bitswap.getWantlist()

    return Array.from(list).map(e => e[1].cid)
  }

  return withTimeoutOption(wantlist)
}
