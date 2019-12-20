// Import the necessary modules.
// @flow
import IHelper from './IHelper'
import type { Movie, Show } from '@pct-org/mongo-models'

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
   * @type {Movie|Show}
   * @see http://mongoosejs.com/docs/models.html
   */
  Model: Movie | Show

  /**
   * Create a base helper class for content.
   * @param {!string} name - The name of the content provider.
   * @param {!Movie|Show} Model - The model to help fill.
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
     * @type {Movie|Show}
     * @see http://mongoosejs.com/docs/models.html
     */
    this.Model = Model
  }

  /**
   * Method to check the given images against the default ones.
   * @protected
   * @param {Show|Show} item - The show to check the images for
   * @returns {Object|undefined} - Throws an error if the given images are the
   * same, otherwise it will return the given images.
   */
  checkImages(item: Show | Movie): Promise<Object> {
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
   * @param {!number} runtimeInMinutes - runtime in minutes of the item
   * @returns {{hours: number, minutes: number, short: string, full: string}}
   * formatted runtime object
   * @protected
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

  /**
   * Update the torrents for an item, can also merge existing torrents and new ones
   * together
   *
   * @param {Array} torrents - Array of new torrents
   * @param {Array} foundTorrents - Array of existing torrents
   * @returns {Array<Object>} - Array of the best torrents
   * @protected
   */
  _formatTorrents(torrents: Array<Object>, foundTorrents: Array<Object> = []): Array<Object> {
    const allTorrents = [
      ...torrents,
      ...foundTorrents,
    ]

    let newTorrents = []

    // Loop true all torrents
    allTorrents.forEach((torrent) => {
      let add = true
      const match = newTorrents.find(
        t => t.quality === torrent.quality,
      )

      // If we have a match we need additional checks to determine witch one to keep
      if (match) {
        // Put add to false
        add = false

        // For 2160p we get the smallest one
        if (torrent.quality === '2160p') {
          // Check fi existing torrent is bigger then the new one
          if (torrent.size < match.size) {
            add = true
          }

        } else if (match.seeds < torrent.seeds) {
          add = true
        }
      }

      if (add) {
        // If add was true and we have a match we need to remove the old one
        if (match) {
          newTorrents = newTorrents.filter(
            t => t.quality !== torrent.quality,
          )
        }

        // Add the sizeString attribute
        torrent.sizeString = AbstractHelper._formatTorrentSize(torrent.size)

        newTorrents.push(torrent)
      }
    })

    // The order that we want it in
    const order = ['2160p', '3D', '1080p', '720p', '480p']

    // Return all merged torrents
    return newTorrents.sort((torrentA, torrentB) =>
      order.indexOf(torrentA.quality) - order.indexOf(torrentB.quality),
    )
  }

  /**
   * Formats torrent it's size to human readable
   *
   * @param bytes
   * @return {string}
   */
  static _formatTorrentSize(bytes: number) {
    if (!bytes || bytes === 0) {
      return '0 Byte'
    }

    const i = parseInt(
      `${Math.floor(
        Math.log(bytes) / Math.log(1024),
      )}`,
      10,
    )

    return `${(bytes / (1024 ** i)).toFixed(2)} ${['Bytes', 'KB', 'MB', 'GB'][i]}`
  }
}
