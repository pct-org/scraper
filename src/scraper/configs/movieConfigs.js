// @flow
import { MovieProvider } from '../providers'
import { kat } from '../apiModules'
import { MovieHelper } from '../helpers'

import { movieSchema } from '@pct-org/mongo-models/dist/movie/movie.schema'

/**
 * The configuration for KAT movies.
 * @type {Object}
 */
export const katMovieConfig: Object = {
  name: 'KAT Movies',
  api: kat,
  contentType: MovieProvider.ContentTypes.Movie,
  Helper: MovieHelper,
  Model: movieSchema,
  query: {
    category: 'movies_hd',
    query: 'x264 BlueRay',
  },
  regexps: [
    {
      regex: /(.*).(\d{4}).[3Dd]\D+(\d{3,4}p)/i,
    }, {
      regex: /(.*).(\d{4}).[4k]\D+(\d{3,4}p)/i,
    }, {
      regex: /(.*).(\d{4})\D+(\d{3,4}p)/i,
    },
  ],
}

/**
 * Export the configs for the MovieProvider.
 * @type {Array<Object>}
 */
export default [katMovieConfig]
