'use strict'

const pkg = require('../../package.json')
const withTimeoutOption = require('@chris.troutner/ipfs-core-utils/src/with-timeout-option')

/**
 * @param {Object} config
 * @param {import('ipfs-repo')} config.repo
 */
module.exports = ({ repo }) => {
  /**
   * @type {import('@chris.troutner/ipfs-core-types/src/root').API["version"]}
   */
  async function version (_options = {}) {
    const repoVersion = await repo.version.get()

    return {
      version: pkg.version,
      repo: `${repoVersion}`,

      // @ts-ignore gitHead is defined in published versions
      commit: pkg.gitHead || '',
      'interface-ipfs-core': pkg.devDependencies['@chris.troutner/interface-ipfs-core']
    }
  }

  return withTimeoutOption(version)
}
