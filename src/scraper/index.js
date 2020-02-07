// @flow
import { eztvConfigs, solidConfigs, ytsConfigs } from './configs'
import { EztvProvider, SolidProvider, YtsProvider } from './providers'

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
  // For Movies
  {
    Provider: YtsProvider,
    args: {
      maxWebRequests,
      configs: ytsConfigs,
    },
  },
  // For Shows
  {
    Provider: EztvProvider,
    args: {
      maxWebRequests,
      configs: eztvConfigs,
    },
  },
  // {
  //   Provider: SolidProvider,
  //   args: {
  //     maxWebRequests,
  //     configs: solidConfigs,
  //   },
  // },
]
