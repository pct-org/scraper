// @flow
import { EpisodeModel } from '@pct-org/mongo-models/dist/episode/episode.model'
import { MovieModel } from '@pct-org/mongo-models/dist/movie/movie.model'
import { SeasonModel } from '@pct-org/mongo-models/dist/season/season.model'
import { ShowModel } from '@pct-org/mongo-models/dist/show/show.model'

import { SolidProvider } from '../providers'
import { solid } from '../apiModules'
import { MovieHelper, ShowHelper } from '../helpers'

/**
 * The configuration for SolidTorrents.
 * @type {Object}
 */
export const solidConfig: Object = {
  name: 'SolidTorrents',
  api: solid,
  query: {
    query: '2160p',
    // category: 'video',
  },
}

/**
 * Export the configs for the BulkProvider.
 * @type {Array<Object>}
 */
export default [
  // {
  //   ...solidConfig,
  //   contentType: SolidProvider.ContentTypes.Movie,
  //   Helper: MovieHelper,
  //   Model: MovieModel,
  //   regexps: [
  //     {
  //       regex: /(.*).(\d{4}).+[4k]\D+(\d{3,4}p)/i,
  //     }, {
  //       regex: /(.*).(\d{4}).[UHD]\D+(\d{3,4}p)/i,
  //     }, {
  //       // Some files have the quality in it twice
  //       regex: /(.*).(\d{4}).(\d{3,4}p)\D+(\d{3,4}p)/i,
  //     }, {
  //       regex: /(.*).(\d{4})\D+(\d{3,4}p)/i,
  //     },
  //   ],
  // },
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
        regex: /(.*).(\d{1,2})[x](\d{2})/i,
      },  {
        regex: /\[.*\].(\D+).S(\d+)...(\d{2,3}).*\.mkv/i,
      }, {
        regex: /\[.*\].(\D+)...(\d{2,3}).*\.mkv/i,
      },
    ],
  },
]
