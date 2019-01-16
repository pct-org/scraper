// Import the necessary modules.
// @flow
import AbstractHelper from './AbstractHelper'
import {
  fanart,
  tmdb,
  trakt,
  omdb
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
   *
   * @param torrents
   * @param foundTorrents
   * @returns {Array<Object>}
   * @private
   */
  _updateTorrents(
    torrents: Array<Object>,
    foundTorrents: Array<Object>
  ): Object {
    let newTorrents = torrents

    foundTorrents.forEach(torrent => {
      const match = torrents.find(
        t => t.quality === torrent.quality && t.language === torrent.language
      )

      if (!match) {
        newTorrents.push(torrent)

      } else if (match.seeds > torrent.seeds) {
        newTorrents = newTorrents.filter(
          t => t.quality === torrent.quality && t.language === torrent.language
        )

        newTorrents.push(match)
      }
    })

    return newTorrents
  }

  /**
   * Update a given movie.
   * @param {!AnimeMovie|Movie} movie - The movie to update its torrent.
   * @returns {AnimeMovie|Movie} - A newly updated movie.
   */
  async _updateMovieInDb(movie: AnimeMovie | Movie): AnimeMovie | Movie {
    try {
      const m = movie
      const found = await this.Model.findOne({
        _id: m.imdb_id
      })

      if (found) {
        logger.info(`${this.name}: '${found.title}' is an existing movie.`)

        if (found.torrents) {
          m.torrents = this._updateTorrents(m.torrents, found.torrents)
        }

        return await this.Model.findOneAndUpdate({
          _id: m.imdb_id
        }, m, {
          upsert: true,
          new: true
        })
      }

      logger.info(`${this.name}: '${m.title}' is a new movie!`)

      return await new this.Model(m).save()

    } catch (err) {
      logger.error(`_updateMovie: ${err.message || err}`)
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

    movie.torrents = torrents

    return this._updateMovieInDb(movie)
  }

  /**
   * Get movie images from TMDB.
   * @param {!AnimeMovie|Movie} movie - The movie you want the images for
   * @returns {Promise<AnimeMovie|Movie>} - A movie with torrents attached.
   */
  _addTmdbImages(movie: Movie | AnimeMovie): Promise<Movie | AnimeMovie> {
    return tmdb.movie.images({
      movie_id: movie.tmdb_id
    }).then(i => {
      const baseUrl = 'http://image.tmdb.org/t/p/w500'

      const tmdbPoster = i.posters.filter(
        poster => poster.iso_639_1 === 'en' || poster.iso_639_1 === null
      ).shift()

      const tmdbBackdrop = i.backdrops.filter(
        backdrop => backdrop.iso_639_1 === 'en' || backdrop.iso_639_1 === null
      ).shift()

      const { Holder } = AbstractHelper

      return this.checkImages({
        ...movie,
        images: {
          banner: Holder,
          backdrop: tmdbBackdrop ? `${baseUrl}${tmdbBackdrop.file_path}` : Holder,
          poster: tmdbPoster ? `${baseUrl}${tmdbPoster.file_path}` : Holder
        }
      })

    }).catch(err => {
      // If we have tmdb_id then the check images failed
      if (err.tmdb_id) {
        return Promise.reject(err)

      } else if (err.statusCode && err.statusCode === 404) {
        logger.warn(`_addTmdbImages: can't find images for slug '${movie.slug}'`)

        // Movie does not exist in tmdb
        return Promise.reject(movie)

      } else {
        logger.error(`_addTmdbImages: ${err.message || err}`)
      }
    })
  }

  /**
   * Get movie images from OMDB.
   * @param {!AnimeMovie|Movie} movie - The movie you want the images for
   * @returns {Promise<AnimeMovie|Movie>} - A movie with torrents attached.
   */
  _addOmdbImages(movie: Movie | AnimeMovie): Promise<Movie | AnimeMovie> {
    return omdb.byId({
      imdb: movie.imdb_id,
      type: 'movie'
    }).then(i => {
      return this.checkImages({
        ...movie,
        images: {
          banner: movie.images.banner,

          backdrop: movie.images.backdrop,

          poster: !movie.images.poster && i.Poster
            ? i.Poster
            : movie.images.poster

        }
      })

    }).catch(err => {
      // If we have imdb_id then the check images failed
      if (err.imdb_id) {
        return Promise.reject(err)

      } else if (err.statusCode && err.statusCode === 404) {
        logger.warn(`_addOmdbImages: can't find images for slug '${movie.slug}'`)

        // Movie does not exist in omdb
        return Promise.reject(movie)

      } else {
        logger.error(`_addOmdbImages: ${err.message || err}`)
      }
    })
  }

  /**
   * Get movie images from Fanart.
   * @param {!AnimeMovie|Movie} movie - The movie you want the images for
   * @returns {Promise<AnimeMovie|Movie>} - A movie with torrents attached.
   */
  _addFanartImages(movie: Movie | AnimeMovie): Promise<Movie | AnimeMovie> {
    return fanart.getMovieImages(movie.tmdb_id).then(i => {
      return this.checkImages({
        ...movie,
        images: {
          banner: !movie.images.banner && i.moviebanner
            ? i.moviebanner[0].url
            : movie.images.banner,

          backdrop: !movie.images.backdrop && i.moviebackground
            ? i.moviebackground[0].url
            : i.hdmovieclearart
              ? i.hdmovieclearart[0].url
              : movie.images.backdrop,

          poster: !movie.images.poster && i.movieposter
            ? i.movieposter[0].url
            : movie.images.poster
        }
      })

    }).catch(err => {
      // If we have tmdb_id then the check images failed
      if (err.tmdb_id) {
        return Promise.reject(err)

      } else if (err.statusCode && err.statusCode === 404) {
        logger.warn(`_addFanartImages: can't find images for slug '${movie.slug}'`)

        // Movie does not exist in fanart
        return Promise.reject(movie)

      } else {
        logger.error(`_addFanartImages: ${err.message || err}`)
      }
    })
  }

  /**
   * Add images to item
   * @protected
   * @param {!AnimeShow|Show|Movie} movie - The item to fetch images for
   * @returns {Promise<Object>} - Object with banner, fanart and poster images.
   */
  addImages(movie: Movie): Promise<Object> {
    return this._addTmdbImages(movie)
      .catch(movie => this._addOmdbImages(movie))
      .catch(movie => this._addFanartImages(movie))
      .catch(movie => movie)
  }

  /**
   * Get info from Trakt and make a new movie object.
   * @override
   * @param {!string} traktId - The slug to query trakt.tv.
   * @returns {Promise<AnimeMovie | Movie | Error>} - A new movie.
   */
  async getTraktInfo(traktId: string): Promise<AnimeMovie | Movie | Error> {
    try {
      const traktMovie = await trakt.movies.summary({
        id: traktId,
        extended: 'full'
      })
      const traktWatchers = await trakt.movies.watching({ id: traktId })

      if (traktMovie && traktMovie.ids.imdb && traktMovie.ids.tmdb) {
        return this.addImages({
          imdb_id: traktMovie.ids.imdb,
          tmdb_id: traktMovie.ids.tmdb,
          slug: traktMovie.ids.slug,
          title: traktMovie.title,
          released: new Date(traktMovie.released).getTime() / 1000.0,
          certification: traktMovie.certification,
          synopsis: traktMovie.overview,
          runtime: traktMovie.runtime,
          rating: {
            votes: traktMovie.votes,
            watching: await traktWatchers ? traktWatchers.length : 0,
            percentage: Math.round(traktMovie.rating * 10)
          },
          images: {
            banner: null,
            backdrop: null,
            poster: null
          },
          genres: traktMovie.genres ? traktMovie.genres : ['unknown'],
          trailer: traktMovie.trailer,
          torrents: []
        })
      }
    } catch (err) {
      return Promise.reject({
        message: `Trakt: Could not find any data on: ${err.path || err} with trakt id: '${traktId}'`
      })
    }
  }

}
