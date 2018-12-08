// Import the necessary modules.
// @flow
import { Schema } from 'mongoose'

import { contentSchema, torrentSchema } from '../content/contentSchema'

/**
 * The schema object for the movie model.
 * @type {Object}
 */
export const movieSchema: Object = {
  ...contentSchema,
  torrents: {
    type: [torrentSchema]
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
