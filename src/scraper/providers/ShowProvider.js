// Import the necessary modules.
// @flow
import pMap from 'p-map'

import BaseProvider from './BaseProvider'
import showMap from './maps/showMap'

/**
 * Class for scraping show content from various sources.
 * @extends {BaseProvider}
 * @type {ShowProvider}
 */
export default class ShowProvider extends BaseProvider {

  /**
   * Extract content information based on a regex.
   * @override
   * @protected
   * @param {!Object} options - The options to extract content information.
   * @param {!Object} options.torrent - The torrent to extract the content
   * information.
   * @param {!Object} options.regex - The regex object to extract the content
   * information.
   * @throws {Error} - 'Invalid title'.
   * @returns {Object} - Information about the content from the
   * torrent.
   */
  extractContent({ torrent, regex }: Object): Object {
    let episode
    let season
    let slug

    const { title, name } = torrent
    const t = regex.regex.test(title)
      ? title
      : regex.regex.test(name)
        ? name
        : null
    if (!t) {
      throw new Error('Invalid title')
    }
    const match = t.match(regex.regex)

    const showTitle = match[1].replace(/\./g, ' ')
    slug = showTitle.replace(/[^a-zA-Z0-9\- ]/gi, '')
      .replace(/\s+/g, '-')
      .toLowerCase()
    slug = slug in showMap ? showMap[slug] : slug

    season = 1
    season = regex.dateBased ? parseInt(match[2], 10) : match[2]

    episode = match.length >= 4
      ? parseInt(match[3], 10)
      : parseInt(match[2], 10)
    episode = regex.dateBased ? parseInt(match[3], 10) : match[3]

    const quality = t.match(/(\d{3,4})p/) !== null
      ? t.match(/(\d{3,4})p/)[0]
      : '480p'

    return {
      showTitle,
      slug,
      season,
      episode,
      episodes: {},
      type: this.contentType,
      torrent: {
        quality,
        provider: this.name,
        language: torrent.language || 'en',
        size: torrent.size_bytes || 0,
        seeds: torrent.seeds || 0,
        peers: torrent.peers || 0,
        url: torrent.magnet ? torrent.magnet : torrent.torrent_link
      }
    }
  }

  /**
   * Put all the found content from the torrents in an array.
   * @override
   * @protected
   * @param {!Object} options - The options to get the content.
   * @param {!Array<Object>} options.torrents - A list of torrents to extract
   * content information from.
   * @returns {Promise<Array<Object>>} - A list of object with
   * content information extracted from the torrents.
   */
  getAllContent({ torrents }: Object): Promise<Array<Object>> {
    const shows = new Map()

    return pMap(torrents, t => {
      if (!t) {
        return
      }

      const show = this.getContentData({
        torrent: t
      })
      if (!show) {
        return
      }

      const { slug, season, episode, quality } = show
      if (!shows.has(slug)) {
        return shows.set(slug, show)
      }

      const torrent = show.episodes[season][episode][quality]

      const created = {
        showTitle: show.showTitle,
        slug,
        season,
        episode,
        episodes: {},
        type: this.contentType,
        torrent
      }

      return shows.set(slug, created)
    }, {
      concurrency: 1
    }).then(() => Array.from(shows.values()))
  }

}
