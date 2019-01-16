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
      logger.error(`_updateEpisodes: ${err.message || err}`)
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
          first_aired: new Date(e.air_date).getTime() / 1000.0,
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

      show.seasons.push({
        tmdb_id: s.id,
        number: s.season_number,
        title: s.name,
        synopsis: s.overview,
        first_aired: new Date(s.air_date).getTime() / 1000.0,
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

    }).catch(err =>
      logger.error(`TheMovieDB: Could not find any data on: ${err.path || err}`)
    )
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

        // Show does not exist in Tmdb
        return Promise.reject(show)

      } else {
        logger.error(`_addTmdbImages: ${err.message || err}`)
      }
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

        // Show does not exist in Tvdb
        return Promise.reject(show)

      } else {
        logger.error(`_addTvdbImages: ${err.message || err}`)
      }
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

        // Show does not exist in fanart
        return Promise.reject(show)

      } else {
        logger.error(`_addFanartImages: ${err.message || err}`)
      }
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
   * @param {!string} traktId - The slug to query https://trakt.tv/.
   * @returns {Promise<AnimeShow | Show | Error>} - A new show without the
   * episodes attached.
   */
  async getTraktInfo(traktId: string): Show {
    try {
      const traktShow = await trakt.shows.summary({
        id: traktId,
        extended: 'full'
      })

      const traktWatchers = await trakt.shows.watching({ id: traktId })

      if (!traktShow) {
        return logger.warn(`No show found for slug: '${traktId}'`)
      }

      const { imdb, tmdb, tvdb } = traktShow.ids

      if (traktShow && imdb && tmdb && tvdb) {
        const ratingPercentage = Math.round(traktShow.rating * 10)

        return this.addImages({
          slug: traktShow.ids.slug,
          imdb_id: imdb,
          tmdb_id: tmdb,
          tvdb_id: tvdb,
          title: traktShow.title,
          released: new Date(traktShow.first_aired).getTime() / 1000.0,
          certification: traktShow.certification,
          synopsis: traktShow.overview,
          runtime: this._formatRuntime(traktShow.runtime),
          trailer: traktShow.trailer,
          rating: {
            stars: (ratingPercentage / 100) * 5,
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
      // BulkProvider will log it
      return Promise.reject({
        message: `Trakt: Could not find any data on: ${err.path || err} with trakt id: '${traktId}'`
      })
    }
  }

}
