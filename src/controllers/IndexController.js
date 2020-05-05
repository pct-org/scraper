// @flow
import fs from 'fs'
import { join } from 'path'
import { parseExpression } from 'cron-parser'
import { ApiError, IController, PopApi, utils } from '@pct-org/pop-api'
import type { $Request, $Response, NextFunction } from 'express'
import { MovieModel } from '@pct-org/mongo-models/dist/movie/movie.model'
import { ShowModel } from '@pct-org/mongo-models/dist/show/show.model'

import { name, repository, version } from '../../package.json'

/**
 * Class for displaying information about the server the API is running on.
 * @type {IndexController}
 * @implements {IController}
 */
export default class IndexController extends IController {

  /**
   * The name of the server. Default is `serv01`.
   * @type {string}
   */
  static _Server: string = 'serv01'

  /**
   * Register the routes for the index controller to the Express instance.
   * @param {!Object} router - The express router to register the routes to.
   * @param {?PopApi} [PopApi] - The PopApi instance.
   * @returns {undefined}
   */
  registerRoutes(router: any, PopApi?: any): void {
    router.get('/status', this.getIndex)
    router.get('/logs/error', this.getErrorLog)
  }

  /**
   * Get general information about the server.
   * @param {!Object} req - The ExpressJS request object.
   * @param {!Object} res - The ExpressJS response object.
   * @param {!Function} next - The ExpressJS next function.
   * @returns {Promise<Object, Error>} - General information about the server.
   */
  async getIndex(
    req: $Request,
    res: $Response,
    next: NextFunction,
  ): Promise<Object | mixed> {
    try {
      const commit = await utils.executeCommand('git', [
        'rev-parse',
        '--short',
        'HEAD',
      ])

      let updated = null
      let nextUpdate = null
      let status = null

      try {
        updated = await PopApi.scraper.getUpdated()
        status = await PopApi.scraper.getStatus()

        nextUpdate = parseExpression(process.env.CRON_TIME, {}).next().toString()
      } catch (e) {
        // File does not exist do nothing
      }

      return res.json({
        repo: repository.url,
        version,
        commit: commit.trim(),
        server: IndexController._Server,
        status: status || 'idle',
        totalMovies: await MovieModel.countDocuments().exec(),
        totalShows: await ShowModel.countDocuments().exec(),
        updated: updated > 0
          ? new Date(updated * 1000).toLocaleString()
          : 'never',
        nextUpdate: nextUpdate
          ? new Date(nextUpdate).toLocaleString()
          : 'unknown',
        uptime: process.uptime() | 0, // eslint-disable-line no-bitwise
      })
    } catch (err) {
      return next(err)
    }
  }

  /**
   * Displays the 'popcorn-api.log' file.
   * @param {!Object} req - The ExpressJS request object.
   * @param {!Object} res - The ExpressJS response object.
   * @param {!Function} next - The ExpressJS next function.
   * @returns {Object|Error} - The content of the log file.
   */
  getErrorLog(
    req: $Request,
    res: $Response,
    next: NextFunction,
  ): Object | mixed {
    process.env.TEMP_DIR = typeof process.env.TEMP_DIR === 'string'
      ? process.env.TEMP_DIR
      : join(...[
        __dirname,
        '..',
        '..',
        'tmp',
      ])

    const root = process.env.TEMP_DIR
    const file = `${name}-app.log`
    const filePath = join(...[
      process.env.TEMP_DIR,
      file,
    ])

    if (fs.existsSync(filePath)) {
      return res.sendFile(file, {
        root,
        headers: {
          'Content-Type': 'text/plain; charset=UTF-8',
        },
      })
    }

    return next(new ApiError({
      message: `Could not find file: '${filePath}'`,
    }))
  }

}
