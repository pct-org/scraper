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
  tmdb_id: Number
  title: String,
  released: Number,
  certification: String,
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
    backdrop: {
      type: String,
      default: null
    },
    poster: {
      type: String
      default: null
    },
    logo: {
      type: String
      default: null
    },
    thumb: {
      type: String
      default: null
    }
  },
  genres: [String],
  type: String
}
