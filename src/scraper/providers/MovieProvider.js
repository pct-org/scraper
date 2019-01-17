// Import the necessary modules.
// @flow
import pMap from 'p-map'
import bytes from 'bytes'

import BaseProvider from './BaseProvider'
import movieMap from './maps/movieMap'

/**
 * Class for scraping movie content from various sources.
 * @extends {BaseProvider}
 * @type {MovieProvider}
 */
export default class MovieProvider extends BaseProvider {

  /**
   * Extract content information based on a regex.
   * @override
   * @protected
   * @param {!Object} options - The options to extract content information.
   * @param {!Object} options.torrent - The torrent to extract the content
   * information.
   * @param {!Object} options.regex - The regex object to extract the content
   * information.
   * @param {?string} [lang] - The language of the torrent.
   * @returns {Object|undefined} - Information about the content from the
   * torrent.
   */
  extractContent({ torrent, regex, lang }: Object): Object | void {
    let movieTitle
    let slug

    const {
      title, size, seeds, peers, magnet, torrentLink
    } = torrent

    movieTitle = title.match(regex.regex)[1]
    if (movieTitle.endsWith(' ')) {
      movieTitle = movieTitle.substring(0, movieTitle.length - 1)
    }

    movieTitle = movieTitle.replace(/\./g, ' ')

    slug = movieTitle.replace(/[^a-zA-Z0-9 ]/gi, '')
      .replace(/\s+/g, '-')
      .toLowerCase()

    if (slug.endsWith('-')) {
      slug = slug.substring(0, slug.length - 1)
    }

    slug = slug in movieMap ? movieMap[slug] : slug

    const year = parseInt(title.match(regex.regex)[2], 10)
    const quality = title.match(regex.regex)[3]

    return {
      movieTitle,
      slug,
      slugYear: `${slug}-${year}`,
      year,
      type: this.contentType,
      torrent: {
        quality,
        provider: this.name,
        size: bytes(size),
        seeds: seeds || 0,
        peers: peers || 0,
        url: magnet || torrentLink
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
   * @param {!string} [options.lang=en] - The language of the torrents.
   * @returns {Promise<Array<Object>, Error>} - A list of object with
   * content information extracted from the torrents.
   */
  getAllContent({
    torrents,
    lang = 'en'
  }: Object): Promise<Array<Object>> {
    const movies = new Map()

    return pMap(torrents, t => {
      if (!t) {
        return
      }

      const movie = this.getContentData({
        lang,
        torrent: t
      })

      if (!movie) {
        return
      }

      const { slug, language, quality } = movie
      if (!movies.has(slug)) {
        return movies.set(slug, movie)
      }

      const torrent = movie.torrents.filter(
        torrent => torrent.language === language && torrent.quality === quality
      )[0]

      const created = {
        movieTitle: movie.movieTitle,
        slug: movie.slug,
        slugYear: movie.slugYear,
        year: movie.year,
        type: this.contentType,
        torrent
      }

      return movies.set(slug, created)
    }, {
      concurrency: 1
    }).then(() => Array.from(movies.values()))
  }

}
