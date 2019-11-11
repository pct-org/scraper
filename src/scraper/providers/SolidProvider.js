// @flow
import pMap from 'p-map'
import movieMap from './maps/movieMap'

import BaseProvider from './BaseProvider'

/**
 * Class for scraping content from SolidTorrents
 * @extends {BaseProvider}
 * @type {SolidProvider}
 */
export default class SolidProvider extends BaseProvider {

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

    console.log(slug)
    return

    slug = slug in movieMap ? movieMap[slug] : slug

    return null
    return {
      title: movieTitle,
      slug,
      torrents: [
        {
          title,
          quality: torrent.quality,
          size: torrent.size,
          peers: torrent.leechers,
          seeds: torrent.seeders,
          url: torrent.magnet,
          language: torrent.languages.join(','),
          provider: this.name,
        },
      ],
    }
  }

}
