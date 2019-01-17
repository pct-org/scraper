// Import the necessary modules.
// @flow
import { Schema } from 'mongoose'

import { contentSchema, torrentSchema } from '../content/contentSchema'

/**
 * The schema object for the show model.
 * @type {Object}
 */
export const showSchema: Object = {
  ...contentSchema,
  tvdb_id: Number,
  air_info: {
    type: {
      network: String,
      country: String,
      day: String,
      time: String,
      status: String
    }
  },
  num_seasons: Number,
  seasons: {
    type: [
      {
        tmdb_id: Number,
        number: Number,
        title: String,
        synopsis: String,
        first_aired: Number,
        images: {
          type: {
            full: {
              type: String,
              default: null
            },
            high: {
              type: String,
              default: null
            },
            medium: {
              type: String,
              default: null
            },
            thumb: {
              type: String,
              default: null
            }
          }
        },
        episodes: {
          type: [
            {
              tmdb_id: Number,
              number: Number,
              title: String,
              synopsis: String,
              first_aired: Number,
              images: {
                type: {
                  full: {
                    type: String,
                    default: null
                  },
                  high: {
                    type: String,
                    default: null
                  },
                  medium: {
                    type: String,
                    default: null
                  },
                  thumb: {
                    type: String,
                    default: null
                  }
                }
              },
              torrents: {
                type: [torrentSchema]
              }
            }
          ]
        }
      }
    ]
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
