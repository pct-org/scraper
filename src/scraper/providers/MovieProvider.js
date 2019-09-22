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
   * Put all the found content from the torrents in an array.
   *
   * @override
   * @protected
   * @param {!Object} options - The options to get the content.
   * @param {!Array<Object>} options.torrents - A list of torrents to extract
   * content information from.
   * @param {!string} [options.lang=en] - The language of the torrents.
   * @returns {Promise<Array<Object>, Error>} - A list of object with
   * content information extracted from the torrents.
   */
  getAllContent({ torrents, lang = 'en', }: Object): Promise<Array<Object>> {
    const movies = new Map()

    return pMap(torrents, (torrent) => {
      if (!torrent) {
        return
      }

      const movie = this.getContentData({
        lang,
        torrent,
      })

      if (!movie) {
        return
      }

      const { slug } = movie

      // If we already have the movie merge the torrents together
      if (movies.has(slug)) {
        // Reset the movies torrents
        movie.torrents = this.helper._formatTorrents(
          movies.get(slug).torrents,
          movie.torrents,
        )
      }

      return movies.set(slug, movie)
    }, {
      concurrency: 1,
    }).then(() => Array.from(movies.values()))
  }

}
