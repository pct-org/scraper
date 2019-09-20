// @flow
import { ShowModel } from '@pct-org/mongo-models/dist/show/show.model'
import { SeasonModel } from '@pct-org/mongo-models/dist/season/season.model'
import { EpisodeModel } from '@pct-org/mongo-models/dist/episode/episode.model'

import { EztvProvider } from '../providers'
import { eztv } from '../apiModules'
import { ShowHelper } from '../helpers'

/**
 * The configuration for EZTV.
 * @type {Object}
 */
export const eztvConfig: Object = {
  name: 'EZTV',
  api: eztv,
  contentType: EztvProvider.ContentTypes.Show,
  Helper: ShowHelper,
  Model: {
    Show: ShowModel,
    Season: SeasonModel,
    Episode: EpisodeModel,
  },
}

/**
 * Export the configs for the BulkProvider.
 * @type {Array<Object>}
 */
export default [eztvConfig]
