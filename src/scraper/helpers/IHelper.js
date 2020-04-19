// @flow

/**
 * Interface for saving content.
 * @interface
 * @type {IHelper}
 */
export default class IHelper {

  /**
   * Get info from Trakt and make a new content object.
   * @abstract
   * @param {!object} content - Containg the slug / imdb to query trakt.tv
   * @throws {Error} - Using default method: 'getTraktInfo'.
   * @returns {Promise<ContentModel, Error>} - A new content model.
   */
  getTraktInfo(content: Object): Promise<Error> {
    throw new Error('Using default method: \'getTraktInfo\'')
  }

}
