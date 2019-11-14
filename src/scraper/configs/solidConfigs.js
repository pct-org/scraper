// @flow
import { EpisodeModel } from '@pct-org/mongo-models/dist/episode/episode.model'
import { SeasonModel } from '@pct-org/mongo-models/dist/season/season.model'
import { ShowModel } from '@pct-org/mongo-models/dist/show/show.model'

import { SolidProvider } from '../providers'
import { solid } from '../apiModules'
import { ShowHelper } from '../helpers'

/**
 * NOT READY TO BE USED
 */

/**
 * The configuration for SolidTorrents.
 * @type {Object}
 */
export const solidConfig: Object = {
  name: 'SolidTorrents',
  api: solid,
}

/**
 * Export the configs for the BulkProvider.
 * @type {Array<Object>}
 */
export default [
  {
    ...solidConfig,
    contentType: SolidProvider.ContentTypes.Show,
    Helper: ShowHelper,
    Model: {
      Show: ShowModel,
      Season: SeasonModel,
      Episode: EpisodeModel,
    },
    regexps: [
      {
        regex: /(.*).[sS](\d{2})[eE](\d{2})/i,
      }, {
        regex: /(.*).(\d{1,2})[x](\d{2})/i
      }, {
        regex: /\[.*\].(\D+).S(\d+)...(\d{2,3}).*\.mkv/i,
      },
    ],
    query: {
      query: '720p|1080p|2160p',
    },
  },
]
