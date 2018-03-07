// Import the necessary modules.
// @flow
import IHelper from './IHelper'
import type {
  AnimeMovie,
  AnimeShow,
  Movie,
  Show
} from '../../models'

/**
 * Abstract class for saving content.
 * @implements {IHelper}
 * @type {AbstractHelper}
 */
export default class AbstractHelper extends IHelper {

  /**
   * The name of the torrent provider.
   * @type {string}
   */
  name: string

  /**
   * The model to create or alter.
   * @type {AnimeMovie|AnimeShow|Movie|Show}
   * @see http://mongoosejs.com/docs/models.html
   */
  Model: AnimeMovie | AnimeShow | Movie | Show

  /**
   * Create a base helper class for content.
   * @param {!string} name - The name of the content provider.
   * @param {!AnimeMovie|AnimeShow|Movie|Show} Model - The model to help fill.
   */
  constructor({name, Model}: Object): void {
    super()

    /**
     * The name of the torrent provider.
     * @type {string}
     */
    this.name = name
    /**
     * The model to create or alter.
     * @type {AnimeMovie|AnimeShow|Movie|Show}
     * @see http://mongoosejs.com/docs/models.html
     */
    this.Model = Model
  }

  /**
   * Method to check whether or not the given images are null.
   * @override
   * @protected
   * @param {Object} images - The images to check.
   * @throws {Error} - An image could not be found!
   * @returns {Object|undefined} - Throws an error if the given images are the
   * same, otherwise it will return the given images.
   */
  checkImages(images: Object): Object | void {
    for (const i in images) {
      if (images[i] == null) {
        throw new Error('An image could not be found!')
      }
    }

    return images
  }

}
