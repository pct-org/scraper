// @flow

export const torrentSchema: Object = {
  quality: String,
  provider: String,
  seeds: Number,
  peers: Number,
  url: String,
  language: String,
  size: Number
}

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
  tmdb_id: Number,
  title: String,
  released: Number,
  certification: String,
  slug: String,
  synopsis: String,
  runtime: {
    full: {
      type: String
    },
    short: {
      type: String
    },
    hours: {
      type: Number
    },
    minutes: {
      type: Number
    }
  },
  rating: {
    percentage: {
      type: Number
    },
    watching: {
      type: Number
    },
    votes: {
      type: Number
    },
    stars: {
      type: Number
    }
  },
  images: {
    type: {
      backdrop: {
        type: String,
        default: null
      },
      poster: {
        type: String,
        default: null
      },
      logo: {
        type: String,
        default: null
      },
      thumb: {
        type: String,
        default: null
      }
    }
  },
  genres: [String],
  type: String,
  trailer: {
    type: String,
    default: null
  }
}
