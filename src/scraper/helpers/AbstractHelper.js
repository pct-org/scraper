// Import the necessary modules.
// @flow
import IHelper from './IHelper'
import type {
  AnimeMovie,
  AnimeShow,
  Movie,
  Show,
} from '../../models'

/**
 * Abstract class for saving content.
 * @implements {IHelper}
 * @type {AbstractHelper}
 */
export default class AbstractHelper extends IHelper {

  /**
   * The default image link.
   * @protected
   * @type {string}
   */
  static Holder: string = null

  /**
   * The default image sizes object.
   * @protected
   * @type {Object}
   */
  static DefaultImageSizes: Object = {
    full: AbstractHelper.Holder,
    high: AbstractHelper.Holder,
    medium: AbstractHelper.Holder,
    thumb: AbstractHelper.Holder,
  }

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
  constructor({ name, Model }: Object): void {
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
   * Method to check the given images against the default ones.
   * @protected
   * @param {Show|AnimeShow|Show} item - The show to check the images for
   * @returns {Object|undefined} - Throws an error if the given images are the
   * same, otherwise it will return the given images.
   */
  checkImages(item: Show | AnimeShow | Movie): Promise<Object> {
    for (const i in item.images) {
      if (item.images[i] === AbstractHelper.Holder) {
        return Promise.reject(item)
      }
    }

    return item
  }

  /**
   * Formats imdb image sizes
   *
   * @param filePath
   * @return {{high: *, thumb: *, medium: *, full: *}}
   * @protected
   */
  _formatImdbImage(filePath: string) {
    const baseUrl = 'https://image.tmdb.org/t/p'

    return {
      full: `${baseUrl}/original${filePath}`,
      high: `${baseUrl}/w1280${filePath}`,
      medium: `${baseUrl}/w780${filePath}`,
      thumb: `${baseUrl}/w342${filePath}`,
    }
  }

  /**
   * Formats the torrents
   * @param {Array} torrents Object torrents to format
   * @returns {Array} of torrents
   * @protected
   */
  _formatTorrents(torrents: Object) {
    let formattedTorrents = []

    if (!torrents) {
      return formattedTorrents
    }

    Object.keys(torrents).forEach(quality => {
      let add = true
      const sameQuality = formattedTorrents.find(
        torrent => torrent.quality === quality,
      )

      if (sameQuality) {
        if (torrents[quality].seeds > sameQuality.seeds) {
          // Remove the quality from the array
          formattedTorrents = formattedTorrents.filter(
            torrent => torrent.quality === quality,
          )

        } else {
          add = false
        }
      }

      if (add) {
        formattedTorrents.push({
          ...torrents[quality],
          quality,
        })
      }
    })

    return formattedTorrents
  }

  /**
   * @param {!number} runtimeInMinutes - runtime in minutes of the item
   * @returns {{hours: number, minutes: number, short: string, full: string}}
   * formatted runtime object
   * @private
   */
  _formatRuntime(runtimeInMinutes: number) {
    const hours = runtimeInMinutes >= 60 ? Math.round(runtimeInMinutes / 60) : 0
    const minutes = runtimeInMinutes % 60

    return {
      full: hours > 0
        ? `${hours} ${hours > 1 ? 'hours' : 'hour'}${minutes > 0
          ? ` ${minutes} minutes`
          : ''}`
        : `${minutes} minutes`,

      short: hours > 0
        ? `${hours} ${hours > 1 ? 'hrs' : 'hr'}${minutes > 0
          ? ` ${minutes} min`
          : ''}`
        : `${minutes} min`,

      hours,
      minutes,
    }
  }

}
