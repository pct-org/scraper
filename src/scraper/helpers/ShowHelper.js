// @flow
import pMap from 'p-map'
import type { Show, Season, Episode } from '@pct-org/mongo-models'

import AbstractHelper from './AbstractHelper'
import { fanart, tmdb, trakt, tvdb } from '../apiModules'

/**
 * Class for saving shows.
 * @extends {AbstractHelper}
 * @type {ShowHelper}
 */
export default class ShowHelper extends AbstractHelper {

  /**
   * Sorts the content like seasons and episodes
   *
   * @param {Array} seasonsOrEpisodes - Seasons or episodes to sort
   * @returns {Array<T>} - Sorted seasons or episodes
   */
  sortSeasonsOrEpisodes(seasonsOrEpisodes: Array<Object>): Array {
    return seasonsOrEpisodes.sort((a, b) => a.number - b.number)
  }

  /**
   * Updates or adds one show to the database
   *
   * @param {Show} show - Show to add / update
   * @return {Promise<void>}
   * @private
   */
  async _updateShow(show: Show): Promise<Show> {
    try {
      // Create a copy
      const s = Object.assign({}, show)
      const found = await this.Model.Show.findOne({
        _id: s.imdbId,
      })

      // Get the latestEpisodeAired
      let latestEpisodeAired = null
      s.seasons.forEach((season) => {
        // Loop true all episodes
        season.episodes.forEach((episode) => {
          // If the firstAired is higher then that is a newer episode
          if (episode.firstAired > latestEpisodeAired) {
            latestEpisodeAired = episode.firstAired
          }
        })
      })

      // Set the latestEpisodeAired
      s.latestEpisodeAired = latestEpisodeAired

      // We do not need to store the seasons here
      delete s.seasons

      if (found) {
        logger.info(`${this.name}: '${found.title}' is an existing show.`)

        // Keep old attributes that could change
        s.createdAt = found.createdAt
        s.bookmarked = found.bookmarked
        s.bookmarkedOn = found.bookmarkedOn

        return await this.Model.Show.findOneAndUpdate({
            _id: s.imdbId,
          },
          s,
          {
            upsert: true,
            new: true,
          },
        )
      }

      logger.info(`${this.name}: '${s.title}' is a new show!`)

      return await new this.Model.Show(s).save()

    } catch (err) {
      logger.error(`_updateShow: ${err.path || err}`)
    }
  }

  /**
   * Updates or adds one season to the database
   *
   * @param {Show} show - Show the season belongs to
   * @return {Promise<void>}
   * @private
   */
  async _updateShowSeasons(show: Show): Promise<Show> {
    try {
      const seasonsFound = await this.Model.Season.find({
        showImdbId: show.imdbId,
      })

      await Promise.all(
        show.seasons.map(async(season) => {
          // Create a copy
          const s = Object.assign({}, season)
          const found = seasonsFound.find(sf => sf.number === season.number && sf._id === season._id)

          // We do not need to store the episodes here
          delete s.episodes

          if (found) {
            // logger.info(`${this.name}: '${show.title}' update new season '${season.number}'`)

            // Keep old attributes that could change
            s.createdAt = found.createdAt

            await this.Model.Season.findOneAndUpdate({
                _id: season._id,
              },
              s,
              {
                upsert: true,
                new: true,
              },
            )
          } else {
            // logger.info(`${this.name}: '${show.title}' add season '${season.number}'`)

            await new this.Model.Season(s).save()
          }

          // Update all episodes of the season
          return await this._updateShowEpisodes(show, season)
        }),
      )
    } catch (err) {
      logger.error(`_updateShowSeasons: ${err.path || err}`)
    }
  }

  /**
   * Updates or adds one episode to the database
   *
   * @param {Show} show - Show the episode belongs to
   * @param {Season} season - Season the episode belongs to
   * @return {Promise<void>}
   * @private
   */
  async _updateShowEpisodes(show: Show, season: Season): Promise<Show> {
    try {
      const episodesFound = await this.Model.Episode.find({
        showImdbId: show.imdbId,
        season: season.number,
      })

      await Promise.all(
        season.episodes.map(async(episode) => {
          const e = episode
          const found = episodesFound.find(se => se.number === episode.number && se._id === episode._id)

          if (found) {
            // logger.info(`${this.name}: '${show.title}' update episode '${e.number}' of season '${season.number}'`)

            // Keep old attributes that could change
            e.createdAt = found.createdAt
            e.watched = found.watched
            e.download = found.download

            if (found.torrents && found.torrents.length > 0) {
              e.torrents = this._formatTorrents(e.torrents, found.torrents)
            }

            await this.Model.Episode.findOneAndUpdate({
                _id: episode._id,
              },
              e,
              {
                upsert: true,
                new: true,
              },
            )

          } else {
            // logger.info(`${this.name}: '${show.title}' add episode '${e.number}' of season '${season.number}'`)

            await new this.Model.Episode(e).save()
          }
        }),
      )
    } catch (err) {
      logger.error(`_updateShowEpisodes: ${err.path || err}`)
    }
  }

  /**
   * Adds one season to a show.
   *
   * @param {!Show} show - The show to add the torrents to.
   * @param {!Object} episodes - The episodes containing the torrents.
   * @param {!number} season - The season number.
   * @returns {Promise<Show>} - A newly updated show.
   */
  _addSeason(show: Show, episodes: Object, season: number): Promise<Show> {
    return tmdb.tv.season.details({
      tv_id: show.tmdbId,
      season,
    }).then(s => {
      const updatedEpisodes = []

      s.episodes.map(e => {
        const number = parseInt(e.episode_number, 10)
        const torrents = episodes[season][e.episode_number]

        const episode = {
          _id: `${show.imdbId}-${season}-${number}`,
          showImdbId: show.imdbId,
          tmdbId: parseInt(e.id, 10),
          number: number,
          season,
          title: e.name,
          synopsis: e.overview,
          firstAired: e.air_date ? new Date(e.air_date).getTime() : 0,
          images: {
            poster: e.still_path
              ? this._formatImdbImage(e.still_path)
              : AbstractHelper.DefaultImageSizes,
            banner: AbstractHelper.DefaultImageSizes,
            backdrop: AbstractHelper.DefaultImageSizes,
          },
          type: 'episode',
          torrents: typeof torrents !== 'undefined'
            ? this._formatTorrents(torrents)
            : [],
          watched: {
            complete: false,
            progress: 0,
          },
          download: {
            downloaded: false,
            downloading: false,
            downloadStatus: null,
            downloadProgress: null,
          },
          createdAt: Number(new Date()),
          updatedAt: Number(new Date()),
        }

        updatedEpisodes.push(episode)
      })

      show.seasons.push({
        _id: `${show.imdbId}-${s.season_number}`,
        showImdbId: show.imdbId,
        tmdbId: s.id,
        number: s.season_number,
        title: s.name,
        synopsis: s.overview,
        firstAired: s.air_date ? new Date(s.air_date).getTime() : 0,
        images: {
          poster: s.poster_path
            ? this._formatImdbImage(s.poster_path)
            : AbstractHelper.DefaultImageSizes,
          banner: AbstractHelper.DefaultImageSizes,
          backdrop: AbstractHelper.DefaultImageSizes,
        },
        type: 'season',
        episodes: this.sortSeasonsOrEpisodes(updatedEpisodes),
        createdAt: Number(new Date()),
        updatedAt: Number(new Date()),
      })

      show.seasons = this.sortSeasonsOrEpisodes(show.seasons)

      return show

    }).catch(err => {
      if (err.statusCode === 404) {
        return this._addTraktSeason(show, episodes, season)
      }

      logger.error(`_addSeason: ${err.path || err}`)
    })
  }

  /**
   * Adds one season to a show but is only used when the season
   * could not be found by TheMovieDB
   *
   * @param {!Show} show - The show to add the torrents to.
   * @param {!Object} episodes - The episodes containing the torrents.
   * @param {!number} season - The season number.
   * @returns {Promise<Show>} - A newly updated show.
   * @private
   */
  _addTraktSeason(show: Show, episodes: Object, season: number): Promise<Show> {
    return trakt.seasons.season({
      season,
      id: show.imdbId,
      extended: 'full',
    }).then(s => {
      const updatedEpisodes = []
      let firstEpisode = null

      s.map((e, index) => {
        const number = parseInt(e.number, 10)
        const torrents = episodes[season][e.number]

        const episode = {
          _id: `${show.imdbId}-${season}-${number}`,
          showImdbId: show.imdbId,
          tmdbId: null,
          number,
          title: e.title,
          synopsis: e.overview,
          firstAired: e.first_aired ? new Date(e.first_aired).getTime() : 0,
          images: {
            banner: AbstractHelper.DefaultImageSizes,
            backdrop: AbstractHelper.DefaultImageSizes,
            poster: AbstractHelper.DefaultImageSizes,
          },
          type: 'episode',
          torrents: typeof torrents !== 'undefined'
            ? this._formatTorrents(torrents)
            : [],
          watched: {
            complete: false,
            progress: 0,
          },
          download: {
            downloaded: false,
            downloading: false,
            downloadStatus: null,
            downloadProgress: null,
          },
          createdAt: Number(new Date()),
          updatedAt: Number(new Date()),
        }

        if (index === 0) {
          firstEpisode = episode
        }

        updatedEpisodes.push(episode)
      })

      // Check if the season has any torrents
      const torrents = updatedEpisodes.filter(
        episode => episode.torrents.length > 0,
      )

      if (torrents.length === 0) {
        // Don't add the season if non of the episodes has torrents
        return show
      }

      show.seasons.push({
        _id: `${show.imdbId}-${season}`,
        showImdbId: show.imdbId,
        tmdbId: s.id,
        number: season,
        title: `Season ${season}`,
        type: 'season',
        synopsis: null,
        firstAired: firstEpisode ? firstEpisode.firstAired : 0,
        images: {
          banner: AbstractHelper.DefaultImageSizes,
          backdrop: AbstractHelper.DefaultImageSizes,
          poster: AbstractHelper.DefaultImageSizes,
        },
        episodes: this.sortSeasonsOrEpisodes(updatedEpisodes),
        createdAt: Number(new Date()),
        updatedAt: Number(new Date()),
      })

      show.seasons = this.sortSeasonsOrEpisodes(show.seasons)

      return show

    }).catch(err => {
      if (err.statusCode === 404) {
        return logger.error(`_addTraktSeason: Trakt and TheMovieDB could not find any data for slug '${show.slug}' and season '${season}' with imdb id: '${show.imdbId}'`)
      }

      logger.error(`_addTraktSeason: ${err.path || err}`)
    })
  }

  /**
   * Adds episodes to a show.
   *
   * @param {!Show} show - The show to add the torrents to.
   * @param {!Object} episodes - The episodes containing the torrents.
   * @returns {Show} - A show with updated torrents.
   */
  addEpisodes(show: Show, episodes: Object): Show {
    return pMap(Object.keys(episodes), season => {
      return this._addSeason(show, episodes, season)

    }).then(() => this._updateShow(show))
      .then(() => this._updateShowSeasons(show))
      .catch(err => logger.error(`addEpisodes: ${err.message || err}`))
  }

  /**
   * Get TV show images from TMDB.
   * @param {!Show} show - The show to fetch images for
   * @returns {!Show} - Show with banner, fanart and poster images.
   */
  _addTmdbImages(show: Show): Promise<Show> {
    return tmdb.tv.images({
      tv_id: show.tmdbId,
    }).then(i => {
      const tmdbPoster = i.posters.filter(
        poster => poster.iso_639_1 === 'en' || poster.iso_639_1 === null,
      ).shift()

      const tmdbBackdrop = i.backdrops.filter(
        backdrop => backdrop.iso_639_1 === 'en' || backdrop.iso_639_1 === null,
      ).shift()

      return this.checkImages({
        ...show,
        images: {
          banner: AbstractHelper.DefaultImageSizes,

          backdrop: tmdbBackdrop
            ? this._formatImdbImage(tmdbBackdrop.file_path)
            : AbstractHelper.DefaultImageSizes,

          poster: tmdbPoster
            ? this._formatImdbImage(tmdbPoster.file_path)
            : AbstractHelper.DefaultImageSizes,

          logo: AbstractHelper.DefaultImageSizes,
        },
      })
    }).catch(err => {
      // If we have tmdb_id then the check images failed
      if (err.tmdbId) {
        return Promise.reject(err)

      } else if (err.statusCode && err.statusCode === 404) {
        logger.warn(`_addTmdbImages: can't find images for slug '${show.slug}' with tmdb id '${show.tmdbId}'`)

      } else {
        logger.error(`_addTmdbImages: ${err.message || err}`)
      }

      // Always return the show
      return Promise.reject(show)
    })
  }

  /**
   * Get TV show images from TVDB.
   * @param {!Show} show - The show to fetch images for
   * @returns {!Show} - Show with banner, fanart and poster images.
   */
  _addTvdbImages(show): Promise<Show> {
    return tvdb.getSeriesById(show.tvdbId).then(i => {
      const baseUrl = 'https://thetvdb.com/banners/'

      return this.checkImages({
        ...show,
        images: {
          banner: !show.images.banner && i.banner
            ? {
              full: `${baseUrl}${i.banner}`,
              high: `${baseUrl}${i.banner}`,
              medium: `${baseUrl}${i.banner}`,
              thumb: `${baseUrl}${i.banner}`,
            }
            : show.images.banner,

          backdrop: !show.images.backdrop && i.fanart
            ? {
              full: `${baseUrl}${i.fanart}`,
              high: `${baseUrl}${i.fanart}`,
              medium: `${baseUrl}${i.fanart}`,
              thumb: `${baseUrl}${i.fanart}`,
            }
            : show.images.backdrop,

          poster: !show.images.poster && i.poster
            ? {
              full: `${baseUrl}${i.poster}`,
              high: `${baseUrl}${i.poster}`,
              medium: `${baseUrl}${i.poster}`,
              thumb: `${baseUrl}${i.poster}`,
            }
            : show.images.poster,

          logo: show.images.logo,
        },
      })
    }).catch(err => {
      // If we have tvdb_id then the check images failed
      if (err.tvdbId) {
        return Promise.reject(err)

      } else if (err.statusCode && err.statusCode === 404) {
        logger.warn(`_addTvdbImages: can't find images for slug '${show.slug}' with tvdb id '${show.tvdbId}'`)

      } else {
        logger.error(`_addTvdbImages: ${err.message || err}`)
      }

      // Always return the show
      return Promise.reject(show)
    })
  }

  /**
   * Get TV show images from Fanart.
   * @param {!Show} show - The show to fetch images for
   * @returns {!Show} - Show with banner, fanart and poster images.
   */
  _addFanartImages(show: Show): Promise<Show> {
    return fanart.getShowImages(show.tvdbId).then(i => {
      const banner = !show.images.banner && i.tvbanner
        ? i.tvbanner.shift()
        : null

      const backdrop = !show.images.backdrop && i.showbackground
        ? i.showbackground.shift()
        : !show.images.backdrop && i.clearart
          ? i.clearart.shift()
          : null

      const poster = !show.images.poster && i.tvposter
        ? i.tvposter.shift()
        : null

      const logo = !show.images.logo && i.clearlogo
        ? i.clearlogo.shift()
        : !show.images.logo && i.hdtvlogo
          ? i.hdtvlogo.shift()
          : null

      return this.checkImages({
        ...show,
        images: {
          banner: banner
            ? {
              full: banner.url,
              high: banner.url,
              medium: banner.url,
              thumb: banner.url,
            }
            : show.images.banner,

          backdrop: backdrop ? {
              full: backdrop.url,
              high: backdrop.url,
              medium: backdrop.url,
              thumb: backdrop.url,
            }
            : show.images.backdrop,

          poster: poster ? {
              full: poster.url,
              high: poster.url,
              medium: poster.url,
              thumb: poster.url,
            }
            : show.images.poster,

          logo: logo ? {
              full: logo.url,
              high: logo.url,
              medium: logo.url,
              thumb: logo.url,
            }
            : show.images.logo,
        },
      })
    }).catch(err => {
      // If we have tvdb_id then the check images failed
      if (err.tvdbId) {
        return Promise.reject(err)

      } else if (err.statusCode && err.statusCode === 404) {
        logger.warn(`_addFanartImages: can't find images for slug '${show.slug}' with tvdb id '${show.tvdbId}'`)

      } else {
        logger.error(`_addFanartImages: ${err.message || err}`)
      }

      // Always return the show
      return Promise.reject(show)
    })
  }

  /**
   * Get TV show images.
   * @override
   * @protected
   * @param {!AnimeShow|Show} show - The show to fetch images for
   * @returns {Promise<Object>} - Object with banner, fanart and poster images.
   */
  addImages(show: Show | AnimeShow): Promise<Object> {
    return this._addTmdbImages(show)
      .catch(show => this._addTvdbImages(show))
      .catch(show => this._addFanartImages(show))
      .catch(show => show)
  }

  /**
   * Get info from Trakt and make a new show object.
   * @override
   * @param {!string} traktSlug - The slug to query https://trakt.tv/.
   * @param {!string} imdbId - The imdb id to query trakt.tv
   * @returns {Promise<AnimeShow | Show | Error>} - A new show without the
   * episodes attached.
   */
  async getTraktInfo(traktSlug: string, imdbId?: string = null): Show {
    try {
      let traktShow = null
      let idUsed = traktSlug || imdbId

      try {
        traktShow = await trakt.shows.summary({
          id: idUsed,
          extended: 'full',
        })
      } catch (err) {
        // If it's a 404 and we have don't have the imdbId then throw error
        if (err.statusCode !== 404 || !imdbId || imdbId.indexOf('tt') === -1) {
          throw err
        }

        if (idUsed !== imdbId) {
          logger.warn(`No show found for slug: '${traktSlug}' trying imdb id: '${imdbId}'`)

          idUsed = imdbId
          traktShow = await trakt.shows.summary({
            id: imdbId,
            extended: 'full',
          })
        }
      }

      if (!traktShow) {
        return logger.error(`No show found for slug: '${traktSlug}' or imdb id: '${imdbId}'`)
      }

      const traktWatchers = await trakt.shows.watching({
        id: idUsed,
      })

      const { imdb, tmdb, tvdb } = traktShow.ids

      if (traktShow && imdb && tmdb && tvdb) {
        const ratingPercentage = Math.round(traktShow.rating * 10)

        return this.addImages({
          _id: imdb,
          slug: traktShow.ids.slug,
          imdbId: imdb,
          tmdbId: tmdb,
          tvdbId: tvdb,
          title: traktShow.title,
          released: new Date(traktShow.first_aired).getTime(),
          certification: traktShow.certification,
          synopsis: traktShow.overview,
          runtime: this._formatRuntime(traktShow.runtime),
          trailer: traktShow.trailer,
          trailerId: traktShow.trailer
            ? traktShow.trailer.split('v=').reverse().shift()
            : null,
          rating: {
            stars: parseFloat(((ratingPercentage / 100) * 5).toFixed('2')),
            votes: traktShow.votes,
            watching: traktWatchers ? traktWatchers.length : 0,
            percentage: ratingPercentage,
          },
          images: {
            banner: AbstractHelper.DefaultImageSizes,
            backdrop: AbstractHelper.DefaultImageSizes,
            poster: AbstractHelper.DefaultImageSizes,
          },
          type: 'show',
          genres: traktShow.genres ? traktShow.genres : ['unknown'],
          airInfo: {
            network: traktShow.network,
            country: traktShow.country,
            day: traktShow.airs.day,
            time: traktShow.airs.time,
            status: traktShow.status,
          },
          createdAt: Number(new Date()),
          updatedAt: Number(new Date()),
          seasons: [],
          latestEpisodeAired: 0,
          numSeasons: 0,
        })
      }
    } catch (err) {
      let message = `getTraktInfo: ${err.path || err}`

      if (err.statusCode === 404) {
        message = `getTraktInfo: Could not find any data with slug: '${traktSlug}' or imdb id: '${imdbId}'`
      }

      // BulkProvider will log it
      return Promise.reject(Error(message))
    }
  }

}
