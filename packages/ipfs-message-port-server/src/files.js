'use strict'

/* eslint-env browser */

const { encodeCID } = require('@chris.troutner/ipfs-message-port-protocol/src/cid')

/**
 * @typedef {import('@chris.troutner/ipfs-core-types').IPFS} IPFS
 * @typedef {import('@chris.troutner/ipfs-core-types/src/files').StatOptions} StatOptions
 * @typedef {import('@chris.troutner/ipfs-message-port-protocol/src/files').EncodedStat} EncodedStat
 */

exports.FilesService = class FilesService {
  /**
   *
   * @param {IPFS} ipfs
   */
  constructor (ipfs) {
    this.ipfs = ipfs
  }

  /**
   * @typedef {Object} StatQuery
   * @property {string} path
   *
   * @param {StatOptions & StatQuery} input
   */
  async stat (input) {
    const stat = await this.ipfs.files.stat(input.path, input)
    /** @type {Transferable[]} */
    const transfer = []
    return { stat: { ...stat, cid: encodeCID(stat.cid, transfer) }, transfer }
  }
}
