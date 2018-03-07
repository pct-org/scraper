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
   * Method to check the given images against the default ones.
   * @abstract
   * @param {Object} images - The images to check.
   * @throws {Error} - An image could not been found!
   * @returns {Object|undefined} - Throws an error if the given images are the
   * same, otherwise it will return the given images.
   */
  checkImages(images: Object): Object | void {
    throw new Error('Using default method: \'checkImages\'')
  }

  /**
   * Get images for the content you want.
   * @abstract
   * @protected
   * @param {!string} tmdbId - The tmdb id of the content you want the images
   * from.
   * @param {!string} imdbId - The imdb id of the content you want the images
   * from.
   * @param {!string} tvdbId - The tvdb id of the content you want the images
   * from.
   * @throws {Error} - Using default method: '_getImages'.
   * @returns {Promise<Object>} - Object with banner, fanart and poster
   * images.
   */
  getImages({tmdbId, imdbId, tvdbId}: Object): Promise<Object> {
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
