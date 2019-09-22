// @flow
import pMap from 'p-map'

import BaseProvider from './BaseProvider'
import showMap from './maps/showMap'

/**
 * Class for scraping show content from various sources.
 * @extends {BaseProvider}
 * @type {KatTvProvider}
 */
export default class KatTvProvider extends BaseProvider {

  /**
   * Extract content information based on a regex.
   * @override
   * @protected
   * @param {!Object} options - The options to extract content information.
   * @param {!Object} options.torrent - The torrent to extract the content
   * information.
   * @param {!Object} options.regex - The regex object to extract the content
   * information.
   * @returns {Object|undefined} - Information about the content from the
   * torrent.
   */
  extractContent({ torrent, regex }: Object): Object | void {
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
      return
    }

    const match = t.match(regex.regex)

    const showTitle = match[1].replace(/\./g, ' ')
    slug = showTitle.replace(/[^a-zA-Z0-9\- ]/gi, '')
      .replace(/\s+/g, '-')
      .toLowerCase()
    slug = slug in showMap ? showMap[slug] : slug

    season = parseInt(match[2], 10)

    episode = parseInt(match[3], 10)

    const quality = t.match(/(\d{3,4})p/) !== null
      ? t.match(/(\d{3,4})p/)[0]
      : '480p'

    const torrentObj = {
      title: torrent.title,
      url: torrent.torrentLink,
      seeds: torrent.seeds ? torrent.seeds : 0,
      peers: torrent.peers ? torrent.peers : 0,
      provider: this.name,
      size: torrent.size,
    }

    const show = {
      showTitle,
      slug,
      season,
      episode,
      quality,
      dateBased: regex.dateBased,
      episodes: {},
      type: this.contentType,
    }

    return this.attachTorrent({
      show,
      season,
      episode,
      quality,
      torrent: torrentObj,
    })
  }

  /**
   * Attach the torrent object to the content.
   * @override
   * @protected
   * @param {!Object} options - The options to attach a torrent to the content.
   * @param {!Object} options.show - The content to attach a torrent to.
   * @param {!Object} options.torrent - The torrent object ot attach.
   * @param {!string} options.quality - The quality of the torrent.
   * @param {?number} options.season - The season number for the torrent.
   * @param {?number} options.episode - The episode number for the torrent.
   * @throws {Error} - Using default method: 'attachTorrent'
   * @returns {Object} - The content with the newly attached torrent.
   */
  attachTorrent({
    show,
    torrent,
    season,
    episode,
    quality,
  }: Object): Object {
    if (!show.episodes[season]) {
      show.episodes[season] = {}
    }
    if (!show.episodes[season][episode]) {
      show.episodes[season][episode] = {}
    }

    const qualityObj = show.episodes[season][episode][quality]
    if (
      (!qualityObj || show.showTitle.toLowerCase().indexOf('repack') > -1) ||
      (qualityObj && qualityObj.seeds < torrent.seeds)
    ) {
      show.episodes[season][episode][quality] = torrent
    }

    return show
  }

  /**
   * Put all the found content from the torrents in an array.
   * @override
   * @protected
   * @param {!Object} options - The options to get the content.
   * @param {!Array<Object>} options.torrents - A list of torrents to extract
   * content information from.
   * @returns {Promise<Array<Object>, Error>} - A list of object with
   * content information extracted from the torrents.
   */
  getAllContent({ torrents }: Object): Promise<Array<Object>> {
    const shows = new Map()

    return pMap(torrents, t => {
      if (!t) {
        return
      }

      const show = this.getContentData({
        torrent: t,
      })

      if (!show) {
        return
      }

      const { slug, season, episode, quality } = show
      if (!shows.has(slug)) {
        return shows.set(slug, show)
      }

      // TODO:: This here needs to be checked and updated accordingly

      const torrent = show.episodes[season][episode][quality]
      const created = this.attachTorrent({
        torrent,
        season,
        episode,
        quality,
        show,
      })

      return shows.set(slug, created)
    }, {
      concurrency: 1,
    }).then(() => Array.from(shows.values()))
  }

}
