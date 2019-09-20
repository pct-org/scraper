// @flow
import { ShowModel } from '@pct-org/mongo-models/dist/show/show.model'
import { SeasonModel } from '@pct-org/mongo-models/dist/season/season.model'
import { EpisodeModel } from '@pct-org/mongo-models/dist/episode/episode.model'

import { KatTvProvider } from '../providers'
import { kat } from '../apiModules'
import { ShowHelper } from '../helpers'

/**
 * The regular expressions used to extract information about shows.
 * @type {Array<Object>}
 */
const regexps = [
  {
    regex: /(.*).[sS](\d{2})[eE](\d{2})/i,
    dateBased: false,
  }, {
    regex: /(.*).(\d{1,2})[x](\d{2})/i,
    dateBased: false,
  }, {
    regex: /(.*).(\d{4}).(\d{2}.\d{2})/i,
    dateBased: true,
  }, {
    regex: /\[.*\].(\D+).S(\d+)...(\d{2,3}).*\.mkv/i,
    dateBased: false,
  }, {
    regex: /\[.*\].(\D+)...(\d{2,3}).*\.mkv/i,
    dateBased: false,
  },
]

/**
 * The base configuration for KAT.
 * @type {Object}
 */
const baseKatConfig: Object = {
  api: kat,
  contentType: KatTvProvider.ContentTypes.Show,
  Helper: ShowHelper,
  Model: {
    Show: ShowModel,
    Season: SeasonModel,
    Episode: EpisodeModel,
  },
  regexps,
}

export default [
  {
    ...baseKatConfig,
    name: 'KAT TV',
    query: {
      page: 1,
      language: 'en',
      verified: 1,
      category: 'tv',
      subcate: 'hd',
    },
  },
]
