// Import the necessary modules.
// @flow
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import sinon from 'sinon'
import type { MongooseModel } from 'mongoose'

import AbstractHelper from '../../../src/scraper/helpers/AbstractHelper'
import { Show } from '../../../src/models'

/**
 * Check the constructor of the base helper.
 * @param {!AbstractHelper} helper - The helper to test.
 * @param {!string} name - The name to check for.
 * @param {!Model} Model - The model to check for.
 * @returns {undefined}
 */
export function checkHelperAttributes(
  helper: AbstractHelper,
  name: string,
  Model: MongooseModel
): void {
  expect(helper.name).to.be.a('string')
  expect(helper.name).to.equal(name)
  expect(helper.Model).to.be.a('function')
  expect(helper.Model).to.equal(Model)
}

/**
 * Helper function to test the image attributes
 * @param {!Object} images - The images object to test.
 * @param {!Function} done - The done function of mocha.
 * @returns {undefined}
 */
export function testImages(images: Object, done: Function): void {
  expect(images).to.be.an('object')
  expect(images.backdrop).to.be.a('string')
  expect(images.logo).to.be.a('string')
  expect(images.thumb).to.be.a('string')
  expect(images.poster).to.be.a('string')
  done()
}

/**
 * Test the failures of the `_getFanartImages`.
 * @param {!Object} resolves - The object the stub will resolve.
 * @param {!string} type - The type of images to get.
 * @param {!Fanart} fanart - The fanart api service.
 * @param {!AbstractHelper} helper - The helper to test.
 * @param {!Function} done - The mocha done function.
 * @returns {undefined}
 */
export function testGetFanartImages(
  resolves: Object,
  type: string,
  fanart: Object,
  helper: Object,
  done: Function
): void {
  const cap = `${type.charAt(0).toUpperCase()}${type.slice(1)}`
  const stub = sinon.stub(fanart, `get${cap}Images`)
  stub.resolves(resolves)

  helper._addFanartImages()
    .then(done)
    .catch(err => {
      expect(err).to.be.an('Error')
      stub.restore()
      done()
    })
}

/** @test {AbstractHelper} */
describe('AbstractHelper', () => {
  /**
   * The abstract helper to test.
   * @type {AbstractHelper}
   */
  let abstractHelper: AbstractHelper

  /**
   * Hook for setting up the AbstractHelper tests.
   * @type {Function}
   */
  before(() => {
    abstractHelper = new AbstractHelper({
      name: 'AbstractHelper',
      Model: Show
    })
  })

  /** @test {AbstractHelper#constructor} */
  it('should check the attributes of the BaseHelper', () => {
    checkHelperAttributes(abstractHelper, 'AbstractHelper', Show)
  })
})
