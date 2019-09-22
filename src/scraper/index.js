// @flow
import {
  ettvConfigs,
  eztvConfigs,
  ytsConfigs,
  katMovieConfigs,
  katTvConfigs,
} from './configs'
import {
  EttvProvider,
  EztvProvider,
  YtsProvider,
  KatMovieProvider,
  KatTvProvider,
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
  {
    Provider: KatMovieProvider,
    args: {
      maxWebRequests,
      configs: katMovieConfigs,
    },
  },
  // {
  //   Provider: EztvProvider,
  //   args: {
  //     maxWebRequests,
  //     configs: eztvConfigs,
  //   },
  // },
  // {
  //   Provider: YtsProvider,
  //   args: {
  //     maxWebRequests,
  //     configs: ytsConfigs,
  //   },
  // },
  // Keep disabled for now!
  // {
  //   Provider: KatTvProvider,
  //   args: {
  //     maxWebRequests,
  //     configs: katTvConfigs,
  //   },
  // },
  // {
  //   Provider: EttvProvider,
  //   args: {
  //     maxWebRequests,
  //     configs: ettvConfigs,
  //   },
  // },
]

// export default [
//    Provider: MovieProvider,
//    args: {
//    maxWebRequests,
//    configs: movieConfigs
//    }
//    }, {
//    Provider: ShowProvider,
//    args: {
//    maxWebRequests,
//    configs: showConfigs
//    }
//    }, */{
//     Provider: YtsProvider,
//     args: {
//       maxWebRequests,
//       configs: ytsConfigs,
//     },
//   },
// ]
