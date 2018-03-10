// Import the necessary modules.
// @flow
import type ContentModel from '../../models/content/ContentModel'

/**
 * Interface for saving content.
 * @interface
 * @type {IHelper}
 */
export default class IHelper {

  /**
   * Get images for the content you want.
   * @abstract
   * @protected
   * @param {!number} tmdbId - The tmdb id of the movie for which you want the images.
   * @throws {Error} - Using default method: '_getImages'.
   * @returns {Promise<Object>} - Object with banner, fanart and poster
   * images.
   */
  async getImages(tmdbId: Number): Promise<Object> {
    throw new Error('Using default method: \'getImages\'')
  }

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
