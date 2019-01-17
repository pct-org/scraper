// Import the necessary modules.
// @flow
import { Movie } from '../../models'
import { YtsProvider } from '../providers'
import { yts } from '../apiModules'
import { MovieHelper } from '../helpers'

/**
 * The configuration for YTS.
 * @type {Object}
 */
export const ytsConfig: Object = {
  name: 'YTS',
  api: yts,
  contentType: YtsProvider.ContentTypes.Movie,
  Helper: MovieHelper,
  Model: Movie,
  query: {
    page: 1,
    limit: 50
  }
}

/**
 * Export the configs for the YtsProvider.
 * @type {Array<Object>}
 */
export default [ytsConfig]
