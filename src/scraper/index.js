// @flow
import { eztvConfigs, ytsConfigs, katTvConfigs } from './configs'
import { EztvProvider, YtsProvider, KatTvProvider } from './providers'

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
  {
    Provider: KatTvProvider,
    args: {
      maxWebRequests,
      configs: katTvConfigs,
    },
  },
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
