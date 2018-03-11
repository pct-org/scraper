// Import the necessary modules.
// @flow
import MovieProvider from './MovieProvider'

/**
 * Class for scraping content from YTS.ag.
 * @extends {MovieProvider}
 * @type {YtsProvider}
 */
export default class YtsProvider extends MovieProvider {

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
  extractContent({torrent, lang}: Object): Object | void {
    const movie = {
      movieTitle: torrent.title,
      slug: torrent.imdb_code,
      slugYear: torrent.imdb_code,
      year: torrent.year,
      torrents: []
    }

    torrent.torrents.map(t => {
      // eslint-disable-next-line camelcase
      const { hash, peers, quality, seeds, size_bytes } = t

      const torrentObj = {
        quality,
        provider: this.name,
        language: lang,
        size: size_bytes,
        seeds: seeds || 0,
        peers: peers || 0,
        url: `magnet:?xt=urn:btih:${hash}&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://p4p.arenabg.ch:1337&tr=udp://tracker.internetwarriors.net:1337`
      }

      return movie.torrents.push(torrentObj)
    })

    return movie
  }

  /**
   * Get content info from a given torrent.
   * @override
   * @protected
   * @param {!Object} options - The options to get content info from a torrent.
   * @param {!Object} options.torrent - A torrent object to extract content
   * information from.
   * @param {!string} [optiosn.lang=en] - The language of the torrent.
   * @returns {Object|undefined} - Information about the content from the
   * torrent.
   */
  getContentData({torrent, lang = 'en'}: Object): Object | void {
    if (
      torrent && torrent.torrents &&
      torrent.imdb_code &&
      torrent.language.match(/english/i)
    ) {
      return this.extractContent({
        torrent,
        lang
      })
    }

    logger.warn(`${this.name}: Could not find data from torrent: '${torrent.title}'`)
  }

}
