// @flow
import {
  AnimeShow,
  // Show
} from '../../models'
import { ShowProvider } from '../providers'
import {
  // kat,
  nyaa,
} from '../apiModules'
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
 * The base configuration for Nyaa.
 * @type {Object}
 */
const baseNyaaConfig: Object = {
  api: nyaa,
  contentType: ShowProvider.ContentTypes.Show,
  Helper: ShowHelper,
  Model: AnimeShow,
  regexps,
}

/**
 * The configuration for Nyaa Commie.
 * @type {Object}
 */
export const nyaaCommieConfig: Object = {
  ...baseNyaaConfig,
  name: 'Commie',
  query: {
    page: 1,
    q: 'commie mkv',
  },
}

/**
 * The configuration for Nyaa FFF.
 * @type {Object}
 */
export const nyaaFffConfig: Object = {
  ...baseNyaaConfig,
  name: 'FFF',
  query: {
    page: 1,
    q: 'fff mkv',
  },
}

/**
 * The configuration for Nyaa GG.
 * @type {Object}
 */
export const nyaaGgConfig: Object = {
  ...baseNyaaConfig,
  name: 'GG',
  query: {
    page: 1,
    q: 'gg mkv',
  },
}

// /**
//  * The base configuration for KAT.
//  * @type {Object}
//  */
// const baseKatConfig: Object = {
//   api: kat,
//   contentType: ShowProvider.ContentTypes.Show,
//   Helper: ShowHelper,
//   Model: Show,
//   regexps
// }
//
//   ...baseKatConfig,
//   name: 'Zoner720p',
//   query: {
//     page: 1,
//     language: 'en',
//     verified: 1,
//     adult_filter: 1,
//     category: 'tv',
//     query: 'x264 720p',
//     uploader: 'z0n321'
//   }
// }, {
//   ...baseKatConfig,
//   name: 'Zoner1080p',
//   query: {
//     page: 1,
//     language: 'en',
//     verified: 1,
//     adult_filter: 1,
//     category: 'tv',
//     query: 'x264 1080p',
//     uploader: 'z0n321'
//   }
// }, {
//   ...baseKatConfig,
//   name: 'Brasse0',
//   query: {
//     page: 1,
//     language: 'en',
//     verified: 1,
//     adult_filter: 1,
//     category: 'tv',
//     query: 'x264',
//     uploader: 'brasse0'
//   }
// }, {
//   ...baseKatConfig,
//   name: 'ETHD',
//   query: {
//     page: 1,
//     language: 'en',
//     verified: 1,
//     adult_filter: 1,
//     category: 'tv',
//     query: 'x264',
//     uploader: 'ethd'
//   }
// }, {
//   ...baseKatConfig,
//   name: 'ETTV',
//   query: {
//     page: 1,
//     language: 'en',
//     verified: 1,
//     adult_filter: 1,
//     category: 'tv',
//     query: 'x264',
//     uploader: 'ettv'
//   }
// }, {
//   ...baseKatConfig,
//   name: 'KAT EZTV',
//   query: {
//     page: 1,
//     language: 'en',
//     verified: 1,
//     adult_filter: 1,
//     category: 'tv',
//     query: 'x264',
//     uploader: 'eztv'
//   }
// }, {
//   ...baseKatConfig,
//   name: 'VTV',
//   query: {
//     page: 1,
//     language: 'en',
//     verified: 1,
//     adult_filter: 1,
//     category: 'tv',
//     query: 'x264',
//     uploader: 'vtv'
//   }
// }, {
//   ...baseKatConfig,
//   name: 'Srigga',
//   query: {
//     page: 1,
//     language: 'en',
//     verified: 1,
//     adult_filter: 1,
//     category: 'tv',
//     query: 'x264',
//     uploader: 'ethd'
//   }
// }, {
//   ...baseKatConfig,
//   name: 'ZonerSD',
//   query: {
//     page: 1,
//     language: 'en',
//     verified: 1,
//     adult_filter: 1,
//     category: 'tv',
//     query: 'x264 lol | fleet | killers | w4f',
//     uploader: 'z0n321'
//   }

/**
 * Export the configs for the ShowProvider.
 * @type {Array<Object>}
 */
export default [
  nyaaCommieConfig,
  nyaaFffConfig,
  nyaaGgConfig,
]
