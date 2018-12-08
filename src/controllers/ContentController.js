// Import the necessary modules.
// @flow
import type {
  $Request,
  $Response,
  NextFunction
} from 'express'
import type { MongooseModel } from 'mongoose'

import {
  BaseContentController,
  type ContentService
} from 'pop-api'

/**
 * Base class for getting content from endpoints.
 * @implements {BaseContentController}
 * @type {ContentController}
 */
export default class ContentController extends BaseContentController {

  /**
   * The base path for the routes.
   * @type {string}
   */
  basePath: string

  /**
   * The service of the content controller.
   * @type {ContentService}
   */
  service: ContentService

  /**
   * Register the default methods to the default routes.
   * @param {!Object} router - The express router to register the routes to.
   * @param {?PopApi} [PopApi] - The PopApi instance.
   * @returns {undefined}
   */
  registerRoutes(router: any, PopApi?: any): void {
    const t = this.basePath

    router.get(`/${t}s`, this.getContents.bind(this))
    router.get(`/${t}s/:page`, this.getPage.bind(this))
    router.get(`/${t}/:id`, this.getContent.bind(this))
    router.get(`/random/${t}`, this.getRandomContent.bind(this))
  }

  /**
   * Default method to sort the items.
   * @param {!string} sort - The property to sort on.
   * @param {!number} order - The way to sort the property.
   * @returns {Object} - The sort object.
   */
  sortContent(sort: string, order: number): Object {
    const s = sort.toLowerCase()

    switch (s) {
      case 'name':
        return {
          title: order
        }
      case 'rating':
        return {
          'rating.votes': order,
          'rating.percentage': order
        }
      case 'released':
        return {
          latest_episode: order,
          released: order
        }
      case 'trending':
        return {
          'rating.watching': order
        }
      case 'year':
        return {
          year: order
        }
      default:
        return {
          'rating.votes': order,
          'rating.precentage': order,
          'rating.watching': order
        }
    }
  }

  /**
   * Get content from one page.
   * @param {!Object} req - The ExpressJS request object.
   * @param {!Object} res - The ExpressJS response object.
   * @param {!Function} next - The ExpressJS next function.
   * @returns {Promise<Array<Object>, Error>} - The content of one
   * page.
   */
  getPage(
    req: $Request,
    res: $Response,
    next: NextFunction
  ): Promise<Array<MongooseModel> | mixed> {
    const { page } = req.params
    const { sort, order, genre, keywords } = req.query

    const o = parseInt(order, 10) ? parseInt(order, 10) : -1
    const s = typeof sort === 'string' ? this.sortContent(sort, o) : ''

    const query = {
      ...this.service.query
    }

    if (typeof genre === 'string' && genre.toLowerCase() !== 'all') {
      if (genre.match(/science[-\s]fiction/i) || genre.match(/sci[-\s]fi/i)) {
        query.genres = 'science-fiction'
      } else {
        query.genres = genre.toLowerCase()
      }
    }

    if (typeof keywords === 'string') {
      query.$text = {
        $search: keywords
      }
    }

    return this.service.getPage(s, Number(page), query)
      .then(content => this.checkEmptyContent(res, content))
      .catch(err => next(err))
  }

}
