'use strict'

const withTimeoutOption = require('@chris.troutner/ipfs-core-utils/src/with-timeout-option')

/**
 * @param {Object} config
 * @param {import('ipfs-repo')} config.repo
 */
module.exports = ({ repo }) => {
  /**
   * @type {import('@chris.troutner/ipfs-core-types/src/repo').API["stat"]}
   */
  async function stat (options = {}) {
    const stats = await repo.stat()

    return {
      numObjects: BigInt(stats.numObjects.toString()),
      repoSize: BigInt(stats.repoSize.toString()),
      repoPath: stats.repoPath,
      version: `${stats.version}`,
      storageMax: BigInt(stats.storageMax.toString())
    }
  }

  return withTimeoutOption(stat)
}
