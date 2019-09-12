// @flow
import { YtsProvider } from '../providers'
import { yts } from '../apiModules'
import { MovieHelper } from '../helpers'

import { movieSchema } from '@pct-org/mongo-models/dist/movie/movie.schema'

/**
 * The configuration for YTS.
 * @type {Object}
 */
export const ytsConfig: Object = {
  name: 'YTS',
  api: yts,
  contentType: YtsProvider.ContentTypes.Movie,
  Helper: MovieHelper,
  Model: movieSchema,
  query: {
    page: 1,
    limit: 50,
  },
}

/**
 * Export the configs for the YtsProvider.
 * @type {Array<Object>}
 */
export default [ytsConfig]
