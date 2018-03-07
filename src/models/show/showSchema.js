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
  tvdb_id: String,
  country: String,
  network: String,
  air_day: String,
  air_time: String,
  status: String,
  num_seasons: Number,
  last_updated: Number,
  latest_episode: {
    type: Number,
    default: 0
  },
  episodes: {
    type: [{
      tvdb_id: String,
      tmdb_id: String,
      season: Number,
      episode: Number,
      title: String,
      overview: String,
      first_aired: Number,
      torrents: {}
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
