// @flow
import ExportController from './ExportController'
import IndexController from './IndexController'

/**
 * The controllers used by the setup process of registering them.
 * @type {Array<Object>}
 */
export default [
  {
    Controller: IndexController,
    args: {},
  }, {
    Controller: ExportController,
    args: {},
  },
]
