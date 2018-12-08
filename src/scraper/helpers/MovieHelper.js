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
   * @param {!string} tmdbId - The tmdb id of the movie you want the images
   * from.
   * @returns {Object} - Object with banner, fanart and poster images.
   */
  _getTmdbImages(tmdbId: string): Promise<Object | Error> {
    return tmdb.movie.images({
      movie_id: tmdbId
    }).then(i => {
      const baseUrl = 'http://image.tmdb.org/t/p/w500'

      const tmdbPoster = i.posters.filter(
        poster => poster.iso_639_1 === 'en' || poster.iso_639_1 === null
      )[0].file_path
      const tmdbBackdrop = i.backdrops.filter(
        backdrop => backdrop.iso_639_1 === 'en' || backdrop.iso_639_1 === null
      )[0].file_path

      const { Holder } = AbstractHelper
      const images = {
        banner: tmdbPoster ? `${baseUrl}${tmdbPoster}` : Holder,
        backdrop: tmdbBackdrop ? `${baseUrl}${tmdbBackdrop}` : Holder,
        poster: tmdbPoster ? `${baseUrl}${tmdbPoster}` : Holder
      }

      return this.checkImages(images)
    })
  }

  /**
   * Get movie images from OMDB.
   * @param {!string} imdbId - The imdb id of the movie you want the images
   * from.
   * @returns {Object} - Object with banner, fanart and poster images.
   */
  _getOmdbImages(imdbId: string): Promise<Object | Error> {
    return omdb.byId({
      imdb: imdbId,
      type: 'movie'
    }).then(i => {
      const { Holder } = AbstractHelper
      const images = {
        banner: i.Poster ? i.Poster : Holder,
        backdrop: i.Poster ? i.Poster : Holder,
        poster: i.Poster ? i.Poster : Holder
      }

      return this.checkImages(images)
    })
  }

  /**
   * Get movie images from Fanart.
   * @param {!number} tmdbId - The tvdb id of the movie you want the images
   * from.
   * @returns {Object} - Object with banner, fanart and poster images.
   */
  _getFanartImages(tmdbId: number): Promise<Object | Error> {
    return fanart.getMovieImages(tmdbId).then(i => {
      const { Holder } = AbstractHelper
      const images = {
        banner: i.moviebanner ? i.moviebanner[0].url : Holder,
        backdrop: i.moviebackground
          ? i.moviebackground[0].url
          : i.hdmovieclearart
            ? i.hdmovieclearart[0].url
            : Holder,
        poster: i.movieposter ? i.movieposter[0].url : Holder
      }

      return this.checkImages(images)
    })
  }

  /**
   * Get movie images.
   * @override
   * @protected
   * @param {!number} tmdbId - The tmdb id of the movie you want the images
   * from.
   * @param {!string} imdbId - The imdb id of the movie you want the images
   * from.
   * @returns {Promise<Object>} - Object with banner, fanart and poster images.
   */
  getImages({ tmdbId, imdbId }: Object): Promise<Object> {
    return this._getTmdbImages(tmdbId)
      .catch(() => this._getOmdbImages(tmdbId))
      .catch(() => this._getFanartImages(tmdbId))
      .catch(() => AbstractHelper.DefaultImages)
  }

  /**
   * Get info from Trakt and make a new movie object.
   * @override
   * @param {!string} slug - The slug to query trakt.tv.
   * @returns {Promise<AnimeMovie | Movie | Error>} - A new movie.
   */
  async getTraktInfo(slug: string): Promise<AnimeMovie | Movie | Error> {
    try {
      const traktMovie = await trakt.movies.summary({
        id: slug,
        extended: 'full'
      })
      const traktWatchers = await trakt.movies.watching({
        id: slug
      })

      if (traktMovie && traktMovie.ids.imdb && traktMovie.ids.tmdb) {
        return Promise.resolve(
          {
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
            images: await this.getImages({
              tmdbId: traktMovie.ids.tmdb,
              imdb: traktMovie.ids.imdb
            }),
            genres: traktMovie.genres ? traktMovie.genres : ['unknown'],
            trailer: traktMovie.trailer,
            torrents: []
          }
        )
      }
    } catch (err) {
      logger.error(`Trakt: Could not find any data on: ${err.path || err} with slug: '${slug}'`)
      return Promise.reject(err)
    }
  }

}
