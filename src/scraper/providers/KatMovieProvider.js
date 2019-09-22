// @flow
import MovieProvider from './MovieProvider'
import movieMap from './maps/movieMap'

import AbstractHelper from './../helpers/AbstractHelper'

/**
 * Class for scraping content from YTS.ag.
 */
export default class KatMovieProvider extends MovieProvider {

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
    console.log('torrent', torrent)

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

    const movieTitle = match[1].replace(/\./g, ' ').trimEnd()
    let slug = movieTitle.replace(/[^a-zA-Z0-9\- ]/gi, '')
                 .replace(/\s+/g, '-')
                 .toLowerCase()
                 .trimEnd() + '-' + match[2]

    slug = slug in movieMap ? movieMap[slug] : slug

    const quality = t.match(/(\d{3,4})p/) !== null
      ? t.match(/(\d{3,4})p/)[0]
      : '480p'

    // Add some file size restrictions
    if (
      (quality === '1080p' && torrent.size > 3200000000)
      || (quality === '720p' && torrent.size > 2200000000)
      || (quality === '480p' && torrent.size > 1500000000)
    ) {
      logger.warn(`Not adding "${title}" to big!. Size is: ${AbstractHelper._formatTorrentSize(torrent.size)} (${torrent.size})`)

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
