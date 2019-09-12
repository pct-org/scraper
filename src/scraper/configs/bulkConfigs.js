// @flow
// import { Show } from '../../models'
import { BulkProvider } from '../providers'
import { eztv } from '../apiModules'
import { ShowHelper } from '../helpers'

import { ShowModel } from '@pct-org/mongo-models/dist/show/show.model'

/**
 * The configuration for EZTV.
 * @type {Object}
 */
export const eztvConfig: Object = {
  name: 'EZTV',
  api: eztv,
  contentType: BulkProvider.ContentTypes.Show,
  Helper: ShowHelper,
  Model: ShowHelper,
}

/**
 * Export the configs for the BulkProvider.
 * @type {Array<Object>}
 */
export default [eztvConfig]
