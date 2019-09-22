// @flow
import { MovieModel } from '@pct-org/mongo-models/dist/movie/movie.model'

import { EztvProvider } from '../providers'
import { ettv } from '../apiModules'
import { MovieHelper } from '../helpers'

/**
 * The configuration for EZTV.
 * @type {Object}
 */
export const ettvConfig: Object = {
  name: 'ETTV',
  api: ettv,
  contentType: EztvProvider.ContentTypes.Movie,
  Helper: MovieHelper,
  Model: MovieModel,
}

/**
 * Export the configs for the BulkProvider.
 * @type {Array<Object>}
 */
export default [ettvConfig]
