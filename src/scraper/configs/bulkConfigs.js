// @flow
import { Show } from '../../models'
import { BulkProvider } from '../providers'
import { eztv } from '../apiModules'
import { ShowHelper } from '../helpers'

/**
 * The configuration for EZTV.
 * @type {Object}
 */
export const eztvConfig: Object = {
  name: 'EZTV',
  api: eztv,
  contentType: BulkProvider.ContentTypes.Show,
  Helper: ShowHelper,
  Model: Show,
}

/**
 * Export the configs for the BulkProvider.
 * @type {Array<Object>}
 */
export default [eztvConfig]
