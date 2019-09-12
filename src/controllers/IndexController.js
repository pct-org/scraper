// Import the necessary modules.
// @flow
import fs from 'fs'
import { join } from 'path'
import { ApiError, IController, PopApi, utils } from '@pct-org/pop-api'
import type { $Request, $Response, NextFunction } from 'express'

import { MovieModel } from '@pct-org/mongo-models/dist/movie/movie.model'


import ContentController from './ContentController'
// import { Movie, Show } from '../models'
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

      const query = ContentController.Query
      const totalMovies = await MovieModel.count(query).exec()
      const totalShows = 0// await Show.count(query).exec()

      const status = await PopApi.scraper.getStatus()
      const updated = await PopApi.scraper.getUpdated()

      return res.json({
        repo: repository.url,
        version,
        commit: commit.trim(),
        server: IndexController._Server,
        status: status || 'idle',
        totalMovies,
        totalShows,
        updated: updated > 0
          ? (new Date(updated * 1000)).toISOString().slice(0, 19).replace('T', ' ')
          : 'never',
        uptime:
          process.uptime() | 0, // eslint-disable-line no-bitwise
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
