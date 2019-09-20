// @flow
import pMap from 'p-map'
import pTimes from 'p-times'
import { AbstractProvider } from '@pct-org/pop-api-scraper'

import type { MovieHelper, ShowHelper } from '../helpers'

/**
 * Class for scraping content from various sources.
 */
export default class BaseProvider extends AbstractProvider {

  /**
   * Map of the available content types to scrape.
   * @type {Object}
   */
  static ContentTypes: Object = {
    Movie: 'movie',
    Show: 'show',
  }

  /**
   * The api of the torrent provider.
   * @type {Object}
   */
  api: Object

  /**
   * The name of the torrent provider.
   * @type {string}
   */
  // name: string

  /**
   * The helper class for adding movies.
   * @type {MovieHelper|ShowHelper}
   */
  helper: MovieHelper | ShowHelper

  /**
   * The type of content to scrape.
   * @type {string}
   */
  contentType: string

  /**
   * The max allowed concurrent web requests.
   * @type {number}
   */
  // maxWebRequests: number

  /**
   * The query object for the api.
   * @type {Object}
   */
  query: Object

  /**
   * The regular expressions used to extract information about movies.
   * @type {Array<Object>}
   */
  regexps: Array<Object>

  /**
   * Gets information about a show from Trakt.tv and insert the show into the
   * MongoDB database.
   * @protected
   * @param {!Object} content - The show information.
   * @returns {Promise<Object | Error>} - A show object.
   */
  _getShowContent(content: Object): Promise<Object> {
    const { episodes, slug, imdb } = content

    if (!episodes || episodes.length === 0) {
      return logger.warn(
        `${this.name}: '${slug}' has no torrents`,
      )
    }

    if (episodes && episodes[0]) {
      delete episodes[0]
    }

    return this.helper.getTraktInfo(slug, imdb).then(res => {
      if (res && res.imdbId) {
        return this.helper.addEpisodes(res, episodes, slug)
      }
    })
  }

  /**
   * Gets information about a movie from Trakt.tv and insert the movie into the
   * MongoDB database.
   * @protected
   * @param {!Object} content - The content information.
   * @returns {Promise<Object | Error>} - A movie object.
   */
  _getMovieContent(content: Object): Promise<Object | Error> {
    const { slug, torrents } = content

    return this.helper.getTraktInfo(slug).then(res => {
      if (res && res.imdbId) {
        return this.helper.addTorrents(res, torrents)
      }
    })
  }

  /**
   * Gets information about content from Trakt.tv and inserts the content into
   * the MongoDB database.
   * @protected
   * @param {!Object} content - The content information.
   * @throws {Error} - 'CONTENT_TYPE' is not a valid value for Types!
   * @returns {Promise<Object>} - A content object.
   */
  getContent(content: Object): Promise<Object> {
    if (this.contentType === BaseProvider.ContentTypes.Show) {
      return this._getShowContent(content)

    } else if (this.contentType === BaseProvider.ContentTypes.Movie) {
      return this._getMovieContent(content)
    }

    return Promise.reject(new Error(`'${this.contentType}' is not a valid value for ContentTypes!`))
  }

  /**
   * Extract content information based on a regex.
   * @abstract
   * @protected
   * @param {!Object} options - The options to extract content information.
   * @param {!Object} options.torrent - The torrent to extract the content
   * information.
   * @param {!Object} options.regex - The regex object to extract the content
   * information.
   * @param {?string} [lang] - The language of the torrent.
   * @throws {Error} - Using default method: 'extractContent'
   * @returns {Object|undefined} - Information about the content from the
   * torrent.
   */
  extractContent({ torrent, regex, lang }: Object): Object | void {
    throw new Error('Using default method: \'extractContent\'')
  }

  /**
   * Get content info from a given torrent.
   * @protected
   * @param {!Object} options - The options to get content info from a torrent.
   * @param {!Object} options.torrent - A torrent object to extract content
   * information from.
   * @param {!string} [options.lang=en] - The language of the torrent.
   * @returns {Object|undefined} - Information about the content from the
   * torrent.
   */
  getContentData({ torrent, lang = 'en' }: Object): Object | void {
    const regex = this.regexps.find(
      r => r.regex.test(torrent.title) || r.regex.test(torrent.name),
    )

    if (regex) {
      return this.extractContent({
        torrent,
        regex,
        lang,
      })
    }

    logger.warn(`${this.name}: Could not find data from torrent: '${torrent.title}'`)
  }

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
  getAllContent({
    torrents,
    lang = 'en',
  }: Object): Promise<Array<Object>> {
    throw new Error('Using default method: \'getAllContent\'')
  }

  /**
   * Get all the torrents of a given torrent provider.
   * @protected
   * @param {!number} totalPages - The total pages of the query.
   * @returns {Promise<Array<Object>>} - A list of all the queried torrents.
   */
  getAllTorrents(totalPages: number): Promise<Array<Object>> {
    let torrents = []
    return pTimes(totalPages, async page => {
      this.query.page = page + 1

      logger.info(`${this.name}: Started searching ${this.name} on page ${page + 1} out of ${totalPages}`)

      const res = await this.api.search(this.query)

      const data = res.results
        ? res.results // Kat & ET
        : res.data
          ? res.data.movies // YTS
          : res.torrents
            ? res.torrents // Nyaa
            : []

      torrents = torrents.concat(data)

    }, {
      concurrency: 1,
    }).then(() => {
      logger.info(`${this.name}: Found ${torrents.length} torrents.`)

      return Promise.resolve(torrents)
    })
  }

  /**
   * Get the total pages to scrape for the provider query.
   * @protected
   * @returns {Promise<number>} - The number of total pages to scrape.
   */
  getTotalPages(): Promise<number> {
    return this.api.search(this.query).then(res => {
      if (res.data) { // Yts
        return Math.ceil(res.data.movie_count / 50)

      } else if (res.total_pages) { // ET
        return res.total_pages

      } else if (res.totalPages) { // Kat
        return res.totalPages
      }

      return Math.ceil(res.totalRecordCount / res.queryRecordCount) // Nyaa
    })
  }

  /**
   * Set the configuration to scrape with.
   * @protected
   * @param {!Object} config - The config to get content with.
   * @param {!string} config.name - The name of the config.
   * @param {!Object} config.api - The API module ot get the content with.
   * @param {!string} config.contentType - The type of content to scrape.
   * @param {!MongooseModel} config.Model - The model for the content to
   * scrape.
   * @param {!IHelper} config.Helper - The helper class to save the content to
   * the database.
   * @param {?Object} config.query - The query to get the content with for the
   * api.
   * @param {?Array<object>} config.regexps - The regular expressions used to
   * extract information from a torrent.
   * @returns {undefined}
   */
  setConfig({
    name,
    api,
    contentType,
    Model,
    Helper,
    query,
    regexps,
  }: Object): void {
    this.name = name
    this.api = api
    this.contentType = contentType
    this.helper = new Helper({
      Model,
      name,
    })
    this.query = query
    this.regexps = regexps
  }

  /**
   * Get the contents for a configuration.
   * @override
   * @param {!Object} config - The config to get content with.
   * @param {!string} config.name - The name of the config.
   * @param {!Object} config.api - The API module ot get the content with.
   * @param {!string} config.contentType - The type of content to scrape.
   * @param {!MongooseModel} config.Model - The model for the content to
   * scrape.
   * @param {!IHelper} config.Helper - The helper class to save the content to
   * the database.
   * @param {?Object} config.query - The query to get the content with for the
   * api.
   * @param {?Array<Object>} config.regexps - The regular expressions used to
   * extract information from a torrent.
   * @returns {Promise<Array<Object>|undefined, Error>} - The results of a
   * configuration.
   */
  async scrapeConfig({
    name,
    api,
    contentType,
    Model,
    Helper,
    query,
    regexps,
  }: Object): Promise<Array<Object> | void> {
    try {
      this.setConfig({ name, api, contentType, Model, Helper, query, regexps })

      const totalPages = await this.getTotalPages()

      if (!totalPages) {
        return logger.error(
          `${this.name}: totalPages returned: '${totalPages}'`,
        )
      }

      logger.info(`${this.name}: Total pages ${totalPages}`)

      const torrents = await this.getAllTorrents(totalPages)

      const { language } = this.query
      const allContent = await this.getAllContent({
        torrents,
        language,
      })

      logger.info(`${this.name}: Total content ${allContent.length}`)

      return await pMap(
        allContent,
        content => this.getContent(content)
          .catch(err => logger.error(`BaseProvider.scrapeConfig: ${err.message || err}`)),
        {
          concurrency: this.maxWebRequests,
        },
      )
    } catch (err) {
      logger.error(`Catch BaseProvider.scrapeConfig: ${err.message || err}`)
    }
  }

}
