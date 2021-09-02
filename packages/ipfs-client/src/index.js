// @ts-nocheck
'use strict'

const { create: httpClient } = require('@chris.troutner/ipfs-http-client')
const { create: grpcClient } = require('@chris.troutner/ipfs-grpc-client')
const mergeOptions = require('merge-options')

/**
 * @typedef {import('@chris.troutner/ipfs-http-client').Options} HTTPOptions
 * @typedef {import('@chris.troutner/ipfs-grpc-client').Options} GRPCOptions
 * @typedef {string|URL|import('multiaddr').Multiaddr} Address
 * @typedef {{http?: Address, grpc?: Address} & Partial<HTTPOptions & GRPCOptions>} Options
 *
 * @param {Options} [opts]
 */
function create (opts = {}) {
  const clients = []

  if (opts.http) {
    clients.push(httpClient({
      ...opts,
      url: opts.http
    }))
  }

  if (opts.grpc) {
    clients.push(grpcClient({
      ...opts,
      url: opts.grpc
    }))
  }

  // override http methods with grpc if address is supplied
  return mergeOptions.apply({ ignoreUndefined: true }, clients)
}

module.exports = {
  create
}
