'use strict'

const withTimeoutOption = require('@chris.troutner/ipfs-core-utils/src/with-timeout-option')

/**
 * @param {Object} config
 * @param {import('ipfs-repo')} config.repo
 */
module.exports = function ({ repo }) {
  /**
   * @type {import('@chris.troutner/ipfs-core-types/src/refs').API["local"]}
   */
  async function * refsLocal (options = {}) {
    for await (const cid of repo.blocks.queryKeys({}, { signal: options.signal })) {
      yield { ref: cid.toString() }
    }
  }

  return withTimeoutOption(refsLocal)
}
