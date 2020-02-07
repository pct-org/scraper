// @flow
import pMap from 'p-map'
import deepmerge from 'deepmerge'
import movieMap from './maps/movieMap'
import showMap from './maps/showMap'

import BaseProvider from './BaseProvider'

/**
 * Class for scraping content from SolidTorrents
 * @extends {BaseProvider}
 * @type {SolidProvider}
 */
export default class SolidProvider extends BaseProvider {

  solidTorrents = null
  solidTotalPages = null

  /**
   * Put all the found content from the torrents in an array.
   * @abstract
   * @protected
   * @param {!Object} options - The options to get the content.
   * @param {!Array<Object>} options.torrents - A list of torrents to extract
   * content information from.
   * @param {!string} [options.lang=en] - The language of the torrents.
   * @throws {Error} - Using default method: 'getAllContent'
   * @returns {Promise<Array<Object>, Error>} - A list of object with
   * content information extracted from the torrents.
   */
  getAllContent({ torrents, lang = 'en' }: Object): Promise<Array<Object>> {
    const items = new Map()

    return pMap(torrents, (torrent) => {
      if (!torrent) {
        return
      }

      let item = this.getContentData({
        torrent,
      })

      if (!item) {
        return
      }

      const { slug } = item

      // If we already have the movie merge the torrents together
      if (this.contentType === SolidProvider.ContentTypes.Movie && items.has(slug)) {
        // Reset the movies torrents
        item.torrents = this.helper._formatTorrents(
          items.get(slug).torrents,
          item.torrents,
        )

      } else if (this.contentType === SolidProvider.ContentTypes.Show && items.has(slug)) {
        const existingItem = items.get(slug)

        item = deepmerge(existingItem, item)
      }

      return items.set(slug, item)
    }, {
      concurrency: 1,
    }).then(() => Array.from(items.values()))
  }

  /**
   * Extract content information based on a regex.
   * @override
   * @protected
   * @param {!Object} options - The options to extract content information.
   * @param {!Object} options.torrent - The torrent to extract the content
   * information.
   * @param {?string} [lang] - The language of the torrent.
   * @returns {Object|undefined} - Information about the content from the
   * torrent.
   */
  extractContent({ torrent, lang, regex }: Object): Object | void {
    const { title } = torrent
    // console.log('torrent', torrent)

    const t = regex.regex.test(title)
      ? title
      : null

    const match = t.match(regex.regex)

    const itemTitle = match[1].replace(/\./g, ' ')
      .replace(' - ', ' ')
      .trimEnd()

    let slug = itemTitle.replace(/[^a-zA-Z0-9\- ]/gi, '')
      .trimStart()
      .replace(/\s+/g, '-')
      .toLowerCase()
      .trim()

    const itemTorrent = {
      title,
      quality: '2160p',
      size: torrent.size,
      peers: torrent.leechers,
      seeds: torrent.seeders,
      url: torrent.magnet,
      provider: this.name,
    }

    if (this.contentType === SolidProvider.ContentTypes.Movie) {
      // Adds the year to the slug for movies
      slug = `${slug}-${match[2]}`

      slug = slug in movieMap ? movieMap[slug] : slug

      return {
        slug,
        torrents: [
          itemTorrent,
        ],
      }

    } else {
      // Remove any - at the end of a string
      slug = slug.replace(/[-]*$/i, '')
        .replace(/(\-\d{4})*$/i, '')

      slug = slug in showMap ? showMap[slug] : slug

      return {
        slug,
        episodes: {
          [parseInt(match[2], 10)]: { // Match 2 is the season
            [parseInt(match[3], 10)]: [ // Match 3 is the episode
              itemTorrent,
            ],
          },
        },
      }
    }
  }

  async getTotalPages(): Promise<number> {
    if (!this.solidTotalPages) {
      this.solidTotalPages = await super.getTotalPages()
    }

    return this.solidTotalPages
  }

  async getAllTorrents(totalPages: number): Promise<Array<Object>> {
    if (!this.solidTorrents) {
      this.solidTorrents = await super.getAllTorrents(totalPages)
    }

    return this.solidTorrents
  }

}
