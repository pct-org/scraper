// @flow
import pTimes from 'p-times'
import BaseProvider from './BaseProvider'
import movieMap from './maps/movieMap'

/**
 * Class for scraping content from zooqle.com.
 */
export default class ZooqleProvider extends BaseProvider {

  /**
   * Get the total pages to scrape for the provider query.
   * @protected
   * @returns {Promise<number>} - The number of total pages to scrape.
   */
  getTotalPages(): Promise<number> {
    return this.api.search(this.query.query).then((res) => {
      return Math.ceil(res.searchResponse.total / res.searchResponse.pageSize)
    })
  }

  /**
   * Get all the torrents of a given torrent provider.
   * @protected
   * @param {!number} totalPages - The total pages of the query.
   * @returns {Promise<Array<Object>>} - A list of all the queried torrents.
   */
  getAllTorrents(totalPages: number): Promise<Array<Object>> {
    let torrents = []

    return pTimes(totalPages, async(page) => {
      logger.info(`${this.name}: Started searching ${this.name} on page ${page + 1} out of ${totalPages}`)

      const res = await this.api.search(this.query.query, [`pg=${page + 1}`], ['movie'])

      torrents = torrents.concat(res.searchResponse.searchResults)

    }, {
      concurrency: 1,
    }).then(() => {
      logger.info(`${this.name}: Found ${torrents.length} torrents.`)

      return Promise.resolve(torrents)
    }).catch((err) => {
      logger.error(`Catch ${this.name}.getAllTorrents: ${err.message || err}`)

      // When a error happens send all collected torrents
      return Promise.resolve(torrents)
    })
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
    const { title, name } = torrent
    const t = regex.regex.test(title)
      ? title
      : regex.regex.test(name)
        ? name
        : null

    if (!t || torrent.languages.indexOf(lang) === -1 || torrent.quality.toLowerCase() === 'str') {
      return
    }

    const match = t.match(regex.regex)

    const movieTitle = match[1].replace(/\./g, ' ')
      .replace(' - ', ' ')
      .trimEnd()

    let slug = movieTitle.replace(/[^a-zA-Z0-9\- ]/gi, '')
                 .trimStart()
                 .replace(/\s+/g, '-')
                 .toLowerCase()
                 .trim() + '-' + match[2]

    slug = slug in movieMap ? movieMap[slug] : slug

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
