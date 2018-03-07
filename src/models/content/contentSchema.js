// @flow

/**
 * Base structure of the database content.
 * @type {Object}
 * @see http://mongoosejs.com/docs/guide.html
 */
export const contentSchema: Object = {
  _id: {
    type: String,
    required: true
  },
  imdb_id: String,
  tmdb_id: String
  title: String,
  year: Number,
  slug: String,
  synopsis: String,
  runtime: Number,
  rating: {
    percentage: {
      type: Number
    },
    watching: {
      type: Number
    },
    votes: {
      type: Number
    }
  },
  images: {
    banner: {
      type: String
    },
    fanart: {
      type: String
    },
    poster: {
      type: String
    }
  },
  genres: [String],
  type: {
    type: String
  }
}
