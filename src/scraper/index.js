// Import the necessary modules.
// @flow
import {
  bulkConfigs,
  movieConfigs,
  showConfigs,
  ytsConfigs
} from './configs'
import {
  BulkProvider,
  MovieProvider,
  ShowProvider,
  YtsProvider
} from './providers'

/**
 * The max concurreny web requests at a time.
 * @type {number}
 */
const maxWebRequests: number = 2

/**
 * Export the providers to be attached to the PopApiScraper.
 * @type {Array<Object>}
 */
export default [{
  Provider: BulkProvider,
  args: {
    maxWebRequests,
    configs: bulkConfigs
  }
}, /*{
  Provider: MovieProvider,
  args: {
    maxWebRequests,
    configs: movieConfigs
  }
}, */{
  Provider: ShowProvider,
  args: {
    maxWebRequests,
    configs: showConfigs
  }
}, {
  Provider: YtsProvider,
  args: {
    maxWebRequests,
    configs: ytsConfigs
  }
}]
