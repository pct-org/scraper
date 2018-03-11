// Import the necessary modules.
// @flow
import { Schema } from 'mongoose'

import { contentSchema } from '../content/contentSchema'

/**
 * The schema object for the show model.
 * @type {Object}
 */
export const showSchema: Object = {
  ...contentSchema,
  air_info: {
    type: {
      network: String,
      country: String,
      day: String,
      time: String,
      status: String
    }
  },
  last_updated: Number,
  seasons: {
    type: [{
      tmdb_id: Number,
      number: Number,
      title: String,
      synopsis: String,
      first_aired: Number,
      image: {
        type: String,
        default: null
      },
      episodes: {
        type: [{
          tmdb_id: Number,
          number: Number,
          title: String,
          synopsis: String,
          first_aired: Number,
          image: {
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
        }]
      }
    }]
  }
}

/**
 * The show schema used by mongoose.
 * @type {Object}
 * @see http://mongoosejs.com/docs/guide.html
 */
export default new Schema(showSchema, {
  collection: 'shows'
})
