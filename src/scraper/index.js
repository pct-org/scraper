// @flow
import {
  ettvConfigs,
  eztvConfigs,
  ytsConfigs,
  katMovieConfigs,
  katTvConfigs,
  zooqleConfigs,
} from './configs'
import {
  EttvProvider,
  EztvProvider,
  YtsProvider,
  KatMovieProvider,
  KatTvProvider,
  ZooqleProvider,
} from './providers'

/**
 * The max concurrent web requests at a time.
 * @type {number}
 */
const maxWebRequests: number = 2

/**
 * Export the providers to be attached to the PopApiScraper.
 * @type {Array<Object>}
 */
export default [
  // For UHD content
  // {
  //   Provider: ZooqleProvider,
  //   args: {
  //     maxWebRequests,
  //     configs: zooqleConfigs,
  //   },
  // },

  // // For Movies
  // {
  //   Provider: YtsProvider,
  //   args: {
  //     maxWebRequests,
  //     configs: ytsConfigs,
  //   },
  // },
  // For Shows
  {
    Provider: EztvProvider,
    args: {
      maxWebRequests,
      configs: eztvConfigs,
    }
  },
]
