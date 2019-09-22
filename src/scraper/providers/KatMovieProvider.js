// @flow
import MovieProvider from './MovieProvider'

import formatKbToString from '../formatKbToString'

/**
 * Class for scraping content from YTS.ag.
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
  extractContent({ torrent, lang, regex }: Object): Object | void {
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

    const movieTitle = match[1].replace(/\./g, ' ')
    const slug = movieTitle.replace(/[^a-zA-Z0-9\- ]/gi, '')
      .replace(/\s+/g, '-')
      .toLowerCase() + '-' + match[2]

    const quality = t.match(/(\d{3,4})p/) !== null
      ? t.match(/(\d{3,4})p/)[0]
      : '480p'

    // Add some file size restrictions
    if (
      (quality === '1080p' && torrent.size > 3000000000)
      || (quality === '720p' && torrent.size > 2000000000)
      || (quality === '480p' && torrent.size > 1500000000)
    ) {
      logger.warn(`Not adding "${movieTitle}" to big`)

      return false
    }

    return {
      title: movieTitle,
      slug,
      torrents: [
        {
          quality,
          title,
          size: torrent.size,
          sizeString: formatKbToString(torrent.size),
          peers: torrent.peers,
          seeds: torrent.seeds,
          url: torrent.torrentLink,
          language: lang,
          provider: this.name,
        },
      ],
    }
  }

}
