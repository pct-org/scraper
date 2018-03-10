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
  trailer: {
    type: String,
    default: null
  },
  torrents: {
    type: [{
      quality: String,
      provider: String,
      language: String,
      size: Number,
      seeds: Number,
      peers: Number,
      url: String
    }]
  }
}

/**
 * The movie schema used by mongoose.
 * @type {Object}
 * @see http://mongoosejs.com/docs/guide.html
 */
export default new Schema(movieSchema, {
  collection: 'movies'
})
