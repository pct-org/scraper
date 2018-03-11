// Import the necessary modules.
// @flow
import pMap from 'p-map'

import AbstractHelper from './AbstractHelper'
import {
  fanart,
  tmdb,
  trakt
} from '../apiModules'
import type {
  AnimeMovie,
  Movie
} from '../../models'

/**
 * Class for saving movies.
 * @extends {AbstractHelper}
 * @type {MovieHelper}
 */
export default class MovieHelper extends AbstractHelper {

  /**
   * Update the torrents for an existing movie.
   * @param {!AnimeMovie|Movie} movie - The new movie.
   * @param {!AnimeMovie|Movie} found - The existing movie.
   * @param {!string} language - The language of the torrent.
   * @param {!string} quality - The quality of the torrent.
   * @returns {AnimeMovie|Movie} - A movie with merged torrents.
   */
  _updateTorrent(
    movie: AnimeMovie | Movie,
    found: AnimeMovie | Movie,
    language: string,
    quality: string
  ): AnimeMovie | Movie {
    let update = false
    let movieTorrent = movie.torrents[language]

    const foundTorrent = found.torrents[language]

    if (foundTorrent && movieTorrent) {
      const foundQuality = foundTorrent[quality]
      const movieQuality = movieTorrent[quality]

      if (foundQuality && movieQuality) {
        if (foundQuality.seeds > movieQuality.seeds ||
            foundQuality.url === movieQuality.url) {
          update = true
        }
      } else if (foundQuality && !movieQuality) {
        update = true
      }
    } else if (foundTorrent && !movieTorrent) {
      if (foundTorrent[quality]) {
        movieTorrent = {}
        update = true
      }
    }

    if (update) {
      movieTorrent[quality] = foundTorrent[quality]
    }

    return movie
  }

  /**
   * Update a given movie.
   * @param {!AnimeMovie|Movie} movie - The movie to update its torrent.
   * @returns {AnimeMovie|Movie} - A newly updated movie.
   */
  async _updateMovie(movie: AnimeMovie | Movie): AnimeMovie | Movie {
    try {
      let m = movie
      const found = await this.Model.findOne({
        imdb_id: m._id
      })

      if (found) {
        logger.info(`${this.name}: '${found.title}' is an existing movie.`)

        if (found.torrents) {
          Object.keys(found.torrents).map(language => {
            m = this._updateTorrent(m, found, language, '720p')
            m = this._updateTorrent(m, found, language, '1080p')
          })
        }

        return await this.Model.findOneAndUpdate({
          _id: m._id
        }, m, {
          upsert: true,
          new: true
        })
      }

      logger.info(`${this.name}: '${m.title}' is a new movie!`)
      return await new this.Model(m).save()
    } catch (err) {
      logger.error(err)
    }
  }

  /**
   * Adds torrents to a movie.
   * @param {!AnimeMovie|Movie} movie - The movie to add the torrents to.
   * @param {!Object} torrents - The torrents to add to the movie.
   * @returns {Promise<AnimeMovie|Movie>} - A movie with torrents attached.
   */
  addTorrents(
    movie: AnimeMovie | Movie,
    torrents: Object
  ): Promise<AnimeMovie | Movie> {
    return pMap(
      Object.keys(torrents),
      torrent => {
        movie.torrents[torrent] = torrents[torrent]
      }
    ).then(() => this._updateMovie(movie))
  }

  /**
   * Get movie images from TMDB.
   * @param {!number} tmdbId - The tmdb id of the movie for which you want the
   * images.
   * @returns {Promise<Object>} - Object with backdrop and poster images.
   */
  _getTmdbImages(tmdbId: number): Promise<Object> {
    return tmdb.movie.images({
      movie_id: tmdbId
    }).then(i => {
      const baseUrl = 'http://image.tmdb.org/t/p/w'

      const tmdbPoster = i.posters.filter(
        poster => poster.iso_639_1 === 'en' || poster.iso_639_1 === null
      )[0]
      const tmdbPosterUrl = tmdbPoster.file_path
      const tmdbPosterWidth = tmdbPoster.width

      const tmdbBackdrop = i.backdrops.filter(
        backdrop => backdrop.iso_639_1 === 'en' || backdrop.iso_639_1 === null
      )[0]
      const tmdbBackdropUrl = tmdbPoster.file_path
      const tmdbBackdropWidth = tmdbPoster.width

      return {
        backdrop: tmdbBackdrop ? `${baseUrl}${tmdbBackdropWidth}${tmdbBackdropUrl}` : null,
        poster: tmdbPoster ? `${baseUrl}${tmdbPosterWidth}${tmdbPosterUrl}` : null
      }
    })
  }

  /**
   * Get movie images from Fanart.
   * @param {!number} tmdbId - The tmdb id of the movie for which you want the
   * images.
   * @returns {Promise<Object>} - Object with backdrop, poster, logo and thumb
   * images.
   */
  _getFanartImages(tmdbId: number): Promise<Object> {
    return fanart.getMovieImages(tmdbId).then(i => {
      return {
        backdrop: i.moviebackground[0].url,
        poster: i.movieposter[0].url,
        logo: i.hdmovielogo[0].url,
        thumb: i.moviethumb[0].url
      }
    })
  }

  /**
   * Get movie images.
   * @override
   * @protected
   * @param {!number} tmdbId - The tmdb id of the movie for which you want the
   * images.
   * @returns {Promise<Object>} - Object with backdrop, poster, logo and thumb
   * images.
   */
  async getImages(tmdbId: number): Promise<Object> {
    const tmdbImages = await this._getTmdbImages(tmdbId)
    const images = await this._getFanartImages(tmdbId)

    if (tmdbImages.backdrop !== null) {
      images.backdrop = tmdbImages.backdrop // TMDB ones are better
    }

    if (tmdbImages.poster !== null) {
      images.poster = tmdbImages.poster // TMDB ones are better
    }

    return images
  }

  /**
   * Get info from Trakt and make a new movie object.
   * @override
   * @param {!string} slug - The slug to query trakt.tv.
   * @returns {Promise<AnimeMovie | Movie | Error>} - A new movie.
   */
  async getTraktInfo(slug: string): Promise<AnimeMovie | Movie | Error> {
    try {
      const traktMovie = trakt.movies.summary({
        id: slug,
        extended: 'full'
      })
      const traktWatchers = trakt.movies.watching({
        id: slug
      })

      if (await traktMovie && traktMovie.ids.imdb && traktMovie.ids.tmdb) {
        return Promise.resolve(
          {
            imdb_id: traktMovie.ids.imdb,
            tmdb_id: traktMovie.ids.tmdb,
            title: traktMovie.title,
            released: new Date(traktMovie.released).getTime() / 1000.0,
            certification: traktMovie.certification,
            slug: traktMovie.ids.slug,
            synopsis: traktMovie.overview,
            runtime: traktMovie.runtime,
            rating: {
              votes: traktMovie.votes,
              watching: await traktWatchers ? traktWatchers.length : 0,
              percentage: Math.round(traktMovie.rating * 10)
            },
            images: await this.getImages(traktMovie.ids.tmdb),
            genres: traktMovie.genres ? traktMovie.genres : ['unknown'],
            trailer: traktMovie.trailer,
            torrents: []
          }
        )
      }
    } catch (err) {
      logger.error(`Trakt: Could not find any data on: ${err.path || err} with
        slug: '${slug}'`)
      return Promise.reject(err)
    }
  }

}
