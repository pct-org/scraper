// Import the necessary modules.
// @flow
import { Schema } from 'mongoose'

import { contentSchema } from '../content/contentSchema'

/**
 * The schema object for the movie model.
 * @type {Object}
 */
export const movieSchema: Object = {
  ...contentSchema,
  language: String,
  trailer: {
    type: String,
    default: null
  },
  certification: String,
  torrents: {}
}

/**
 * The movie schema used by mongoose.
 * @type {Object}
 * @see http://mongoosejs.com/docs/guide.html
 */
export default new Schema(movieSchema, {
  collection: 'movies'
})
