// Import the necessary modules.
// @flow
/* eslint-disable camelcase */
import pMap from 'p-map'

import AbstractHelper from './AbstractHelper'
import {
  fanart,
  tmdb,
  trakt,
  tvdb
} from '../apiModules'
import type {
  AnimeShow,
  Show
} from '../../models'

/**
 * Class for saving shows.
 * @extends {AbstractHelper}
 * @type {ShowHelper}
 */
export default class ShowHelper extends AbstractHelper {

  /**
   * Update the number of seasons of a given show.
   * @param {!AnimeShow|Show} show - The show to update the number of seasons.
   * @returns {Promise<AnimeShow|Show>} - A newly updated show.
   */
  async _updateShowInDb(show: AnimeShow | Show): Promise<AnimeShow | Show> {
    const saved = await this.Model.findOneAndUpdate({
      _id: show.imdb_id
    }, new this.Model(show), {
      new: true,
      upsert: true
    })

    const distinct = await this.Model.distinct('seasons', {
      _id: saved.imdb_id
    }).exec()

    saved.num_seasons = distinct.length

    return this.Model.findOneAndUpdate({
      _id: saved.imdb_id
    }, new this.Model(saved), {
      new: true,
      upsert: true
    })
  }

  /**
   * Sorts the content like seasons and episodes
   * @param {Array} seasonsOrEpisodes - Seasons or episodes to sort
   * @returns {Array<T>} - Sorted seasons or episodes
   */
  sortSeasonsOrEpisodes(seasonsOrEpisodes: Array<Object>): Array {
    return seasonsOrEpisodes.sort((a, b) => a.number - b.number)
  }

  /**
   * Update the torrents for an existing show.
   * @param {!Object} matchingEpisode - The matching episode of new the show.
   * @param {!Object} foundEpisode - The matching episode existing show.
   * @param {!string} quality - The quality of the torrent.
   * @returns {AnimeShow|Show} - A show with merged torrents.
   */
  _updateEpisode(
    matchingEpisode: Object,
    foundEpisode: Object,
    quality: string
  ): AnimeShow | Show {

    const foundTorrents = foundEpisode.torrents.find(
      torrent => torrent.qualtity === quality
    )
    const matchingTorrents = matchingEpisode.torrents.find(
      torrent => torrent.qualtity === quality
    )

    if (foundTorrents && matchingTorrents) {
      let update = false

      if (
        foundTorrents.seeds > matchingTorrents.seeds ||
        foundTorrents.url === matchingTorrents.url
      ) {
        update = true
      }

      if (update) {
        matchingEpisode.torrents = foundTorrents
      }
    } else if (foundTorrents && !matchingTorrents) {
      matchingEpisode.torrents = foundTorrents
    }

    return matchingEpisode
  }

  /**
   * Update a given show with its associated episodes.
   * @param {!AnimeShow|Show} show - The show to update its episodes.
   * @returns {Promise<AnimeShow|Show>} - A newly updated show.
   */
  async _updateShow(show: AnimeShow | Show): Promise<AnimeShow | Show> {
    try {
      const s = show
      const found = await this.Model.findOne({
        _id: s.imdb_id
      })

      if (!found) {
        logger.info(`${this.name}: '${s.title}' is a new show!`)
        const newShow = await new this.Model(s).save()

        return await this._updateShowInDb(newShow)
      }

      logger.info(`${this.name}: '${found.title}' is an existing show.`)

      found.seasons.forEach(foundSeason => {
        const matchingSeason = s.seasons.find(
          season => season.number === foundSeason.number
        )

        if (!matchingSeason) {
          s.seasons.push(foundSeason)

        } else {
          s.seasons.map(season => {
            if (season.number !== foundSeason.number) {
              return season
            }

            const episodes = []

            foundSeason.episodes.forEach(e => {
              let matchingEpisode = matchingSeason.episodes.find(
                s => s.season === e.season && s.episode === e.episode
              )

              if (e.first_aired > s.latest_episode) {
                s.latest_episode = e.first_aired
              }

              if (!matchingEpisode) {
                episodes.push(e)

              } else {
                matchingEpisode = this._updateEpisode(matchingEpisode, e, '480p')
                matchingEpisode = this._updateEpisode(matchingEpisode, e, '720p')

                episodes.push(this._updateEpisode(matchingEpisode, e, '1080p'))
              }
            })

            return {
              ...season,
              episodes: this.sortSeasonsOrEpisodes(episodes)
            }
          })
        }
      })

      // Sort the seasons
      s.seasons = this.sortSeasonsOrEpisodes(s.seasons)

      return await this._updateShowInDb(s)
    } catch (err) {
      logger.error(`_updateShow: ${err.message || err}`)
    }
  }

  /**
   * Adds one season to a show.
   * @param {!AnimeShow|Show} show - The show to add the torrents to.
   * @param {!Object} episodes - The episodes containing the torrents.
   * @param {!number} season - The season number.
   * @returns {Promise<AnimeShow | Show>} - A newly updated show.
   */
  _addSeason(
    show: AnimeShow | Show,
    episodes: Object,
    season: number
  ): Promise<AnimeShow | Show> {
    return tmdb.tv.season.details({
      tv_id: show.tmdb_id,
      season
    }).then(s => {
      const updatedEpisodes = []

      const baseUrl = 'https://image.tmdb.org/t/p'

      s.episodes.map(e => {
        const episode = {
          tmdb_id: parseInt(e.id, 10),
          number: parseInt(e.episode_number, 10),
          title: e.name,
          synopsis: e.overview,
          first_aired: e.air_date ? new Date(e.air_date).getTime() : 0,
          images: {
            full: !e.still_path ? null : `${baseUrl}/original${e.still_path}`,
            high: !e.still_path ? null : `${baseUrl}/w1280${e.still_path}`,
            medium: !e.still_path ? null : `${baseUrl}/w780${e.still_path}`,
            thumb: !e.still_path ? null : `${baseUrl}/w342${e.still_path}`
          },
          torrents: this._formatTorrents(episodes[season][e.episode_number])
        }

        updatedEpisodes.push(episode)
      })

      // Check if the season has any torrents
      const torrents = updatedEpisodes.filter(episode => episode.torrents.length > 0)

      if (torrents.length === 0) {
        // Don't add the season if non of the episodes has torrents
        return show
      }

      show.seasons.push({
        tmdb_id: s.id,
        number: s.season_number,
        title: s.name,
        synopsis: s.overview,
        first_aired: s.air_date ? new Date(s.air_date).getTime() : 0,
        images: {
          full: !s.poster_path ? null : `${baseUrl}/original${s.poster_path}`,
          high: !s.poster_path ? null : `${baseUrl}/w1280${s.poster_path}`,
          medium: !s.poster_path ? null : `${baseUrl}/w780${s.poster_path}`,
          thumb: !s.poster_path ? null : `${baseUrl}/w342${s.poster_path}`
        },
        episodes: this.sortSeasonsOrEpisodes(updatedEpisodes)
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
   * Adds one season to a show but is only used when the season could not be found by TheMovieDB
   * @param {!AnimeShow|Show} show - The show to add the torrents to.
   * @param {!Object} episodes - The episodes containing the torrents.
   * @param {!number} season - The season number.
   * @returns {Promise<AnimeShow | Show>} - A newly updated show.
   * @private
   */
  _addTraktSeason(
    show: AnimeShow | Show,
    episodes: Object,
    season: number
  ): Promise<AnimeShow | Show> {
    return trakt.seasons.season({
      season,
      id: show.imdb_id,
      extended: 'full'
    }).then(s => {
      const updatedEpisodes = []
      let firstEpisode = null

      s.map((e, index) => {
        const episode = {
          tmdb_id: null,
          number: parseInt(e.number, 10),
          title: e.title,
          synopsis: e.overview,
          first_aired: e.first_aired ? new Date(e.first_aired).getTime() : 0,
          images: {
            full: null,
            high: null,
            medium: null,
            thumb: null
          },
          torrents: this._formatTorrents(episodes[season][e.number])
        }

        if (index === 0) {
          firstEpisode = episode
        }

        updatedEpisodes.push(episode)
      })

      // Check if the season has any torrents
      const torrents = updatedEpisodes.filter(episode => episode.torrents.length > 0)

      if (torrents.length === 0) {
        // Don't add the season if non of the episodes has torrents
        return show
      }

      show.seasons.push({
        tmdb_id: s.id,
        number: season,
        title: `Season ${season}`,
        synopsis: null,
        first_aired: firstEpisode ? firstEpisode.first_aired : 0,
        images: {
          full: null,
          high: null,
          medium: null,
          thumb: null
        },
        episodes: this.sortSeasonsOrEpisodes(updatedEpisodes)
      })

      show.seasons = this.sortSeasonsOrEpisodes(show.seasons)

      return show

    }).catch(err => {
      if (err.statusCode === 404) {
        return logger.error(`_addTraktSeason: Trakt and TheMovDB could not find any data for slug '${show.slug}' and season '${season}' with imdb id: '${show.imdb_id}'`)
      }

      logger.error(`_addTraktSeason: ${err.path || err}`)
    })
  }

  /**
   * Adds episodes to a show.
   * @param {!AnimeShow|Show} show - The show to add the torrents to.
   * @param {!Object} episodes - The episodes containing the torrents.
   * @returns {Show} - A show with updated torrents.
   */
  addEpisodes(
    show: AnimeShow | Show,
    episodes: Object
  ): Show {
    return pMap(Object.keys(episodes), season => {
      return this._addSeason(show, episodes, season)

    }).then(() => this._updateShow(show))
      .catch(err => logger.error(`addEpisodes: ${err.message || err}`))
  }

  /**
   * Get TV show images from TMDB.
   * @param {!AnimeShow|Show} show - The show to fetch images for
   * @returns {!AnimeShow|Show} - Show with banner, fanart and poster images.
   */
  _addTmdbImages(show: Show | AnimeShow): Promise<Show | AnimeShow> {
    return tmdb.tv.images({
      tv_id: show.tmdb_id
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
        ...show,
        images: {
          banner: Holder,

          backdrop: tmdbBackdrop
            ? `${baseUrl}${tmdbBackdrop.file_path}`
            : Holder,

          poster: tmdbPoster
            ? `${baseUrl}${tmdbPoster.file_path}`
            : Holder
        }
      })
    }).catch(err => {
      // If we have tmdb_id then the check images failed
      if (err.tmdb_id) {
        return Promise.reject(err)

      } else if (err.statusCode && err.statusCode === 404) {
        logger.warn(`_addTmdbImages: can't find images for slug '${show.slug}'`)

      } else {
        logger.error(`_addTmdbImages: ${err.message || err}`)
      }

      // Always return the show
      return Promise.reject(show)
    })
  }

  /**
   * Get TV show images from TVDB.
   * @param {!AnimeShow|Show} show - The show to fetch images for
   * @returns {!AnimeShow|Show} - Show with banner, fanart and poster images.
   */
  _addTvdbImages(show: Show | AnimeShow): Promise<Show | AnimeShow> {
    return tvdb.getSeriesById(show.tvdb_id).then(i => {
      const baseUrl = 'http://thetvdb.com/banners/'

      return this.checkImages({
        ...show,
        images: {
          banner: !show.images.banner && i.banner
            ? `${baseUrl}${i.banner}`
            : show.images.banner,

          backdrop: !show.images.backdrop && i.fanart
            ? `${baseUrl}${i.fanart}`
            : show.images.backdrop,

          poster: !show.images.poster && i.poster
            ? `${baseUrl}${i.poster}`
            : show.images.poster
        }
      })
    }).catch(err => {
      // If we have tvdb_id then the check images failed
      if (err.tvdb_id) {
        return Promise.reject(err)

      } else if (err.statusCode && err.statusCode === 404) {
        logger.warn(`_addTvdbImages: can't find images for slug '${show.slug}'`)

      } else {
        logger.error(`_addTvdbImages: ${err.message || err}`)
      }

      // Always return the show
      return Promise.reject(show)
    })
  }

  /**
   * Get TV show images from Fanart.
   * @param {!AnimeShow|Show} show - The show to fetch images for
   * @returns {!AnimeShow|Show} - Show with banner, fanart and poster images.
   */
  _addFanartImages(show: Show | AnimeShow): Promise<Show | AnimeShow> {
    return fanart.getShowImages(show.tvdb_id).then(i => {
      return this.checkImages({
        ...show,
        images: {
          banner: !show.images.banner && i.tvbanner
            ? i.tvbanner[0].url
            : show.images.banner,

          backdrop: !show.images.backdrop && i.showbackground
            ? i.showbackground[0].url
            : i.clearart
              ? i.clearart[0].url
              : show.images.backdrop,

          poster: !show.images.poster && i.tvposter
            ? i.tvposter[0].url
            : show.images.poster
        }
      })
    }).catch(err => {
      // If we have tvdb_id then the check images failed
      if (err.tvdb_id) {
        return Promise.reject(err)

      } else if (err.statusCode && err.statusCode === 404) {
        logger.warn(`_addFanartImages: can't find images for slug '${show.slug}'`)

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
      let idUsed = traktSlug

      try {
        traktShow = await trakt.shows.summary({
          id: traktSlug,
          extended: 'full'
        })
      } catch (err) {
        // If it's a 404 and we have don't have the imdbId then throw error
        if (err.statusCode !== 404 || !imdbId || imdbId.indexOf('tt') === -1) {
          throw err
        }

        logger.warn(`No show found for slug: '${traktSlug}' trying imdb id: '${imdbId}'`)

        idUsed = imdbId
        traktShow = await trakt.shows.summary({
          id: imdbId,
          extended: 'full'
        })
      }

      if (!traktShow) {
        return logger.error(`No show found for slug: '${traktSlug}' or imdb id: '${imdbId}'`)
      }

      const traktWatchers = await trakt.shows.watching({
        id: idUsed
      })

      const { imdb, tmdb, tvdb } = traktShow.ids

      if (traktShow && imdb && tmdb && tvdb) {
        const ratingPercentage = Math.round(traktShow.rating * 10)

        return this.addImages({
          slug: traktShow.ids.slug,
          imdb_id: imdb,
          tmdb_id: tmdb,
          tvdb_id: tvdb,
          title: traktShow.title,
          released: new Date(traktShow.first_aired).getTime(),
          certification: traktShow.certification,
          synopsis: traktShow.overview,
          runtime: this._formatRuntime(traktShow.runtime),
          trailer: traktShow.trailer,
          rating: {
            stars: parseFloat(((ratingPercentage / 100) * 5).toFixed('2')),
            votes: traktShow.votes,
            watching: traktWatchers ? traktWatchers.length : 0,
            percentage: ratingPercentage
          },
          images: {
            banner: null,
            backdrop: null,
            poster: null
          },
          genres: traktShow.genres ? traktShow.genres : ['unknown'],
          air_info: {
            network: traktShow.network,
            country: traktShow.country,
            day: traktShow.airs.day,
            time: traktShow.airs.time,
            status: traktShow.status
          },
          last_updated: Number(new Date()),
          seasons: [],
          num_seasons: 0
        })
      }
    } catch (err) {
      let message = `getTraktInfo: ${err.path || err}`

      if (err.statusCode === 404) {
        message = `getTraktInfo: Could not find any data with slug: '${traktSlug}' or imdb id: '${imdbId}'`
      }

      // BulkProvider will log it
      return Promise.reject({ message })
    }
  }

}
