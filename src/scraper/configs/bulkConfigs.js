// @flow
// import { Show } from '../../models'
import { BulkProvider } from '../providers'
import { eztv } from '../apiModules'
import { ShowHelper } from '../helpers'

import { showSchema } from '@pct-org/mongo-models/dist/show/show.schema'

/**
 * The configuration for EZTV.
 * @type {Object}
 */
export const eztvConfig: Object = {
  name: 'EZTV',
  api: eztv,
  contentType: BulkProvider.ContentTypes.Show,
  Helper: ShowHelper,
  Model: showSchema,
}

/**
 * Export the configs for the BulkProvider.
 * @type {Array<Object>}
 */
export default [eztvConfig]
