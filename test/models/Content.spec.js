// Import the necessary modules.
// @flow
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import { ContentModel } from '../../src/models/content/ContentModel'

/**
 * It should check the attributes of a content object.
 * @param {ContentModel} content - The content to test with.
 * @param {Object} testContent - The content to test against.
 * @param {string} type - The type of content to check for.
 * @returns {undefined}
 */
export function testContentAttributes(
  content: ContentModel,
  testContent: Object,
  type: string
): void {
  expect(content.id).to.be.a('string')
  expect(content.id).to.equal(testContent.imdb_id)
  expect(content.genres).to.be.an('array')
  expect(content.genres).to.deep.equal(testContent.genres)
  expect(content.images).to.be.an('object')
  expect(content.imdb_id).to.be.a('string')
  expect(content.imdb_id).to.equal(testContent.imdb_id)
  expect(content.rating).to.be.an('object')
  expect(content.runtime).to.be.a('number')
  expect(content.runtime).to.equal(testContent.runtime)
  expect(content.slug).to.be.a('string')
  expect(content.slug).to.equal(testContent.slug)
  expect(content.synopsis).to.be.a('string')
  expect(content.synopsis).to.equal(testContent.synopsis)
  expect(content.title).to.be.a('string')
  expect(content.title).to.equal(testContent.title)
  expect(content.type).to.be.a('string')
  expect(content.type).to.equal(type)
  expect(content.year).to.be.a('number')
  expect(content.year).to.equal(testContent.year)
  expect(content._id).to.be.a('string')
  expect(content._id).to.equal(testContent.imdb_id)
}

/**
 * It should check the attributes of an empty content object.
 * @param {ContentModel} contentEmpty - The content to test with.
 * @param {string} type - The type of content to check for.
 * @returns {undefined}
 */
export function testEmptyContentAttributes(
  contentEmpty: ContentModel,
  type: string
): void {
  expect(contentEmpty.id).to.be.null
  expect(contentEmpty.genres).to.be.undefined
  // expect(contentEmpty.images).to.be.undefined
  expect(contentEmpty.imdb_id).to.be.undefined
  // expect(contentEmpty.rating).to.be.undefined
  expect(contentEmpty.runtime).to.be.undefined
  expect(contentEmpty.slug).to.be.undefined
  expect(contentEmpty.synopsis).to.be.undefined
  expect(contentEmpty.title).to.be.undefined
  expect(contentEmpty.type).to.be.a('string')
  expect(contentEmpty.type).to.equal(type)
  expect(contentEmpty.year).to.be.undefined
  expect(contentEmpty._id).to.be.undefined
}
