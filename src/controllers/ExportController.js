// @flow
import { join } from 'path'
import { existsSync } from 'fs'
import type {
  $Request,
  $Response,
  NextFunction,
} from 'express'

import { IController } from '@pct-org/pop-api'

/**
 * Class for downloading export collections.
 * @type {ExportController}
 * @implements {IController}
 */
export default class ExportController extends IController {

  /**
   * Register the routes for the export controller to the Express instance.
   * @param {!Object} router - The express router to register the routes to.
   * @param {?PopApi} [PopApi] - The PopApi instance.
   * @returns {undefined}
   */
  registerRoutes(router: any, PopApi?: any): void {
    router.get('/exports/:collection', this.getExport)
  }

  /**
   * Download the export of a collection.
   * @param {!Object} req - The ExpressJS request object.
   * @param {!Object} res - The ExpressJS response object.
   * @param {!Function} next - The ExpressJS next function.
   * @returns {Object|Error} - The download request of an export of a
   * collection.
   */
  getExport(
    req: $Request,
    res: $Response,
    next: NextFunction,
  ): Object | mixed {
    const { collection } = req.params

    if (collection.match(/(movie|show)s?/i)) {
      process.env.TEMP_DIR = process.env.TEMP_DIR
        ? process.env.TEMP_DIR
        : join(...[
          __dirname,
          '..',
          '..',
          'tmp',
        ])

      const tempDir = process.env.TEMP_DIR
      let jsonFile = join(...[
        tempDir,
        `${collection}.json`,
      ])

      if (existsSync(jsonFile)) {
        return res.download(jsonFile)
      }

      jsonFile = join(...[
        tempDir,
        `${collection}s.json`,
      ])

      if (existsSync(jsonFile)) {
        return res.download(jsonFile)
      }

      return next(new Error(`Error: no such file found for '${jsonFile}'`))
    }

    return next(new Error(`Error: '${collection}' is not a valid collection to export.`))
  }

}
