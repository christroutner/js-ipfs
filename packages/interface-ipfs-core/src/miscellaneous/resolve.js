/* eslint-env mocha */
'use strict'

const { fromString: uint8ArrayFromString } = require('uint8arrays/from-string')
const isIpfs = require('is-ipfs')
const { nanoid } = require('nanoid')
const { base64url } = require('multiformats/bases/base64')
const { getDescribe, getIt, expect } = require('../utils/mocha')
const all = require('it-all')
const { isWebWorker } = require('ipfs-utils/src/env')
const getIpfsOptions = require('../utils/ipfs-options-websockets-filter-all')

/**
 * @typedef {import('ipfsd-ctl').Factory} Factory
 */

/**
 * @param {Factory} factory
 * @param {Object} options
 */
module.exports = (factory, options) => {
  const ipfsOptions = getIpfsOptions()
  const describe = getDescribe(options)
  const it = getIt(options)

  describe('.resolve', function () {
    this.timeout(60 * 1000)
    /** @type {import('ipfs-core-types').IPFS} */
    let ipfs
    /** @type {import('ipfs-core-types/src/root').IDResult} */
    let ipfsId

    before(async () => {
      ipfs = (await factory.spawn({ type: 'proc', ipfsOptions })).api
      ipfsId = await ipfs.id()
    })

    after(() => factory.clean())

    it('should resolve an IPFS hash', async () => {
      const content = uint8ArrayFromString('Hello world')

      const { cid } = await ipfs.add(content)
      const path = await ipfs.resolve(`/ipfs/${cid}`)
      expect(path).to.equal(`/ipfs/${cid}`)
    })

    it('should resolve an IPFS hash and return a base64url encoded CID in path', async () => {
      const { cid } = await ipfs.add(uint8ArrayFromString('base64url encoded'), {
        cidVersion: 1
      })
      const path = await ipfs.resolve(`/ipfs/${cid}`, { cidBase: 'base64url' })
      const [,, cidStr] = path.split('/')

      expect(cidStr).to.equal(cid.toString(base64url))
    })

    // Test resolve turns /ipfs/QmRootHash/path/to/file into /ipfs/QmFileHash
    it('should resolve an IPFS path link', async () => {
      const path = 'path/to/testfile.txt'
      const content = uint8ArrayFromString('Hello world')
      const [{ cid: fileCid }, , , { cid: rootCid }] = await all(ipfs.addAll([{ path, content }], { wrapWithDirectory: true }))
      const resolve = await ipfs.resolve(`/ipfs/${rootCid}/${path}`)

      expect(resolve).to.equal(`/ipfs/${fileCid}`)
    })

    it('should resolve up to the last node', async () => {
      const content = { path: { to: { file: nanoid() } } }
      const options = { format: 'dag-cbor', hashAlg: 'sha2-256' }
      const cid = await ipfs.dag.put(content, options)
      const path = `/ipfs/${cid}/path/to/file`
      const resolved = await ipfs.resolve(path)

      expect(resolved).to.equal(path)
    })

    it('should resolve up to the last node across multiple nodes', async () => {
      const options = { format: 'dag-cbor', hashAlg: 'sha2-256' }
      const childCid = await ipfs.dag.put({ node: { with: { file: nanoid() } } }, options)
      const parentCid = await ipfs.dag.put({ path: { to: childCid } }, options)
      const resolved = await ipfs.resolve(`/ipfs/${parentCid}/path/to/node/with/file`)

      expect(resolved).to.equal(`/ipfs/${childCid}/node/with/file`)
    })

    // Test resolve turns /ipns/domain.com into /ipfs/QmHash
    it('should resolve an IPNS DNS link', async function () {
      // @ts-ignore this is mocha
      this.retries(3)
      const resolved = await ipfs.resolve('/ipns/ipfs.io')

      expect(isIpfs.ipfsPath(resolved)).to.be.true()
    })

    it('should resolve IPNS link recursively by default', async function () {
      // @ts-ignore this is mocha
      this.timeout(20 * 1000)
      // webworkers are not dialable because webrtc is not available
      const node = (await factory.spawn({ type: isWebWorker ? 'go' : undefined })).api
      const nodeId = await node.id()
      await ipfs.swarm.connect(nodeId.addresses[0])
      const { path } = await ipfs.add(uint8ArrayFromString('should resolve a record recursive === true'))
      const { id: keyId } = await ipfs.key.gen('key-name', { type: 'rsa', size: 2048 })

      await ipfs.name.publish(path, { allowOffline: true })
      await ipfs.name.publish(`/ipns/${ipfsId.id}`, { allowOffline: true, key: 'key-name', resolve: false })

      return expect(await ipfs.resolve(`/ipns/${keyId}`))
        .to.eq(`/ipfs/${path}`)
    })

    it('should resolve IPNS link non-recursively if recursive==false', async function () {
      // @ts-ignore this is mocha
      this.timeout(20 * 1000)
      // webworkers are not dialable because webrtc is not available
      const node = (await factory.spawn({ type: isWebWorker ? 'go' : undefined })).api
      const nodeId = await node.id()
      await ipfs.swarm.connect(nodeId.addresses[0])
      const { path } = await ipfs.add(uint8ArrayFromString('should resolve an IPNS key if recursive === false'))
      const { id: keyId } = await ipfs.key.gen('new-key-name', { type: 'rsa', size: 2048 })

      await ipfs.name.publish(path, { allowOffline: true })
      await ipfs.name.publish(`/ipns/${ipfsId.id}`, { allowOffline: true, key: 'new-key-name', resolve: false })

      return expect(await ipfs.resolve(`/ipns/${keyId}`, { recursive: false }))
        .to.eq(`/ipns/${ipfsId.id}`)
    })
  })
}
