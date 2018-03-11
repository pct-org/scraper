// Import the necessary modules.
// @flow
import { ContentModel } from '../../models/content/ContentModel'

/**
 * Interface for saving content.
 * @interface
 * @type {IHelper}
 */
export default class IHelper {

  /**
   * Get info from Trakt and make a new content object.
   * @abstract
   * @param {!string} slug - The slug to query trakt.tv.
   * @throws {Error} - Using default method: 'getTraktInfo'.
   * @returns {Promise<ContentModel, Error>} - A new content model.
   */
  getTraktInfo(slug: string): Promise<ContentModel | Error> {
    throw new Error('Using default method: \'getTraktInfo\'')
  }

}
