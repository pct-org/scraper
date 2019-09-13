// @flow
import { bulkConfigs, ytsConfigs } from './configs'
import { BulkProvider, YtsProvider } from './providers'

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
    Provider: YtsProvider,
    args: {
      maxWebRequests,
      configs: ytsConfigs,
    },
  },
  // {
  //   Provider: BulkProvider,
  //   args: {
  //     maxWebRequests,
  //     configs: bulkConfigs,
  //   },
  // },
]

// export default [
//   // {
//   //   Provider: BulkProvider,
//   //   args: {
//   //     maxWebRequests,
//   //     configs: bulkConfigs,
//   //   },
//   // },
//   /* {
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
