// Import the necessary modules.
// @flow
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
   * @returns {AnimeShow|Show} - A newly updated show.
   */
  async _updateNumSeasons(show: AnimeShow | Show): AnimeShow | Show {
    const saved = await this.Model.findOneAndUpdate({
      _id: show.imdb_id
    }, new this.Model(show), {
      new: true,
      upsert: true
    })

    const distinct = await this.Model.distinct('episodes.season', {
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
   * Update the torrents for an existing show.
   * @param {!Object} matching - The matching episode of new the show.
   * @param {!Object} found - The matching episode existing show.
   * @param {!AnimeShow|Show} show - The show to merge the episodes to.
   * @param {!string} quality - The quality of the torrent.
   * @returns {AnimeShow|Show} - A show with merged torrents.
   */
  _updateEpisode(
    matching: Object,
    found: Object,
    show: AnimeShow | Show,
    quality: string
  ): AnimeShow | Show {
    const index = show.episodes.indexOf(matching)

    const foundTorrents = found.torrents[quality]
    let matchingTorrents = matching.torrents[quality]

    if (foundTorrents && matchingTorrents) {
      let update = false

      if (
        foundTorrents.seeds > matchingTorrents.seeds ||
        foundTorrents.url === matchingTorrents.url
      ) {
        update = true
      }

      if (update) {
        if (quality === '480p') {
          matching.torrents['0'] = foundTorrents
        }

        matchingTorrents = foundTorrents
      }
    } else if (foundTorrents && !matchingTorrents) {
      if (quality === '480p') {
        matching.torrents['0'] = foundTorrents
      }

      matchingTorrents = foundTorrents
    }

    show.episodes.splice(index, 1, matching)
    return show
  }

  /**
   * Update a given show with it's associated episodes.
   * @param {!AnimeShow|Show} show - The show to update its episodes.
   * @returns {AnimeShow|Show} - A newly updated show.
   */
  async _updateEpisodes(show: AnimeShow | Show): AnimeShow | Show {
    try {
      let s = show
      const found = await this.Model.findOne({
        _id: s.imdb_id
      })
      if (!found) {
        logger.info(`${this.name}: '${s.title}' is a new show!`)
        const newShow = await new this.Model(s).save()
        return await this._updateNumSeasons(newShow)
      }

      logger.info(`${this.name}: '${found.title}' is an existing show.`)

      found.episodes.map(e => {
        const matching = s.episodes.find(
          s => s.season === e.season && s.episode === e.episode
        )

        if (e.first_aired > s.latest_episode) {
          s.latest_episode = e.first_aired
        }

        if (!matching) {
          return s.episodes.push(e)
        }

        s = this._updateEpisode(matching, e, s, '480p')
        s = this._updateEpisode(matching, e, s, '720p')
        s = this._updateEpisode(matching, e, s, '1080p')
      })

      return await this._updateNumSeasons(s)
    } catch (err) {
      logger.error(err)
    }
  }

  /**
   * Adds one seasonal season to a show.
   * @param {!AnimeShow|Show} show - The show to add the torrents to.
   * @param {!Object} episodes - The episodes containing the torrents.
   * @param {!number} season - The season number.
   * @param {!string} slug - The slug of the show.
   * @returns {undefined}
   */
  _addSeasonalSeason(
    show: AnimeShow | Show,
    episodes: Object,
    season: number,
    slug: string
  ): void {
    return trakt.seasons.season({
      id: slug,
      season,
      extended: 'full'
    }).then(traktEpisodes => {
      traktEpisodes.map(e => {
        if (!episodes[season][e.number]) {
          return
        }

        const episode = {
          tvdb_id: parseInt(e.ids['tvdb'], 10),
          tmdb_id: parseInt(e.ids['tmdb'], 10),
          season: parseInt(e.season, 10),
          episode: parseInt(e.number, 10),
          title: e.title,
          overview: e.overview,
          date_based: false,
          first_aired: new Date(e.first_aired).getTime() / 1000.0,
          torrents: episodes[season][e.number]
        }

        if (episode.first_aired > show.latest_episode) {
          show.latest_episode = episode.first_aired
        }

        episode.torrents[0] = episodes[season][e.number]['480p']
          ? episodes[season][e.number]['480p']
          : episodes[season][e.number]['720p']

        show.episodes.push(episode)
      })
    }).catch(err =>
      logger.error(`Trakt: Could not find any data on: ${err.path || err} with slug: '${slug}'`)
    )
  }

  /**
   * Adds episodes to a show.
   * @param {!AnimeShow|Show} show - The show to add the torrents to.
   * @param {!Object} episodes - The episodes containing the torrents.
   * @param {!string} slug - The slug of the show.
   * @returns {Show} - A show with updated torrents.
   */
  addEpisodes(
    show: AnimeShow | Show,
    episodes: Object,
    slug: string
  ): Show {
    delete episodes.dateBased

    return pMap(Object.keys(episodes), season => {
      return this._addSeasonalSeason(show, episodes, season, slug)
    }).then(() => this._updateEpisodes(show))
      .catch(err => logger.error(err))
  }

  /**
   * Get TV show images from TMDB.
   * @param {!number} tmdbId - The tmdb id of the show you want the images
   * from.
   * @returns {Object} - Object with backdrop and poster images.
   */
  _getTmdbImages(tmdbId: number): Object {
    return tmdb.tv.images({
      tv_id: tmdbId
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

      const images = {
        backdrop: tmdbBackdrop ? `${baseUrl}${tmdbBackdropWidth}${tmdbBackdropUrl}` : null,
        poster: tmdbPoster ? `${baseUrl}${tmdbPosterWidth}${tmdbPosterUrl}` : null
      }

      return this.checkImages(images)
    })
  }

  /**
   * Get TV show images from TVDB.
   * @param {!number} tvdbId - The tvdb id of the show you want the images
   * from.
   * @returns {Object} - Object with backdrop images.
   */
  _getTvdbImages(tvdbId: number): Object {
    return tvdb.getSeriesById(tvdbId).then(i => {
      const baseUrl = 'http://thetvdb.com/banners/'

      const { Holder } = AbstractHelper
      const images = {
        backdrop: i.banner ? `${baseUrl}${i.banner}` : null,
        poster: null
      }

      return this.checkImages(images)
    })
  }

  /**
   * Get TV show images from Fanart.
   * @param {!number} tvdbId - The tvdb id of the show you want the images
   * from.
   * @returns {Object} - Object with backdrop and poster images.
   */
  _getFanartImages(tvdbId: number): Object {
    return fanart.getShowImages(tvdbId).then(i => {
      const { Holder } = AbstractHelper
      const images = {
        poster: i.tvposter[0].url,
        backdrop: i.showbackground
          ? i.showbackground[0].url
          : i.clearart
            ? i.clearart[0].url
      }

      return this.checkImages(images)
    })
  }

  /**
   * Get TV show images.
   * @override
   * @protected
   * @param {!number} tmdbId - The tmdb id of the show you want the images
   * from.
   * @param {!number} tvdbId - The tvdb id of the show you want the images
   * from.
   * @returns {Promise<Object>} - Object with banner, fanart and poster images.
   */
  getImages({tmdbId, tvdbId}: Object): Promise<Object> {
    return this._getTmdbImages(tmdbId)
      .catch(() => this._getTvdbImages(tvdbId))
      .catch(() => this._getFanartImages(tmdbId))
      .catch(() => AbstractHelper.DefaultImages)
  }

  /**
   * Get info from Trakt and make a new show object.
   * @override
   * @param {!string} id - The slug to query https://trakt.tv/.
   * @returns {Show} - A new show without the episodes attached.
   */
  async getTraktInfo(id: string): Show {
    try {
      const traktShow = await trakt.shows.summary({
        id,
        extended: 'full'
      })
      const traktWatchers = await trakt.shows.watching({ id })

      if (!traktShow) {
        return logger.warn(`No show found for slug: '${id}'`)
      }

      const { ids } = traktShow
      const { imdb, tmdb, slug, tvdb } = ids
      if (!imdb || !tmdb || !tvdb) {
        return logger.warn(`No ids found for slug: '${id}'`)
      }

      const images = await this.getImages({
        tmdbId: tmdb,
        tvdbId: tvdb
      })

      return {
        imdb_id: imdb,
        tmdb_id: tmdb,
        title: traktShow.title,
        year: traktShow.year,
        slug,
        synopsis: traktShow.overview,
        runtime: traktShow.runtime,
        rating: {
          votes: traktShow.votes,
          watching: traktWatchers ? traktWatchers.length : 0,
          percentage: Math.round(traktShow.rating * 10)
        },
        images,
        genres: traktShow.genres ? traktShow.genres : ['unknown'],
        tvdb_id: tvdb,
        country: traktShow.country,
        network: traktShow.network,
        air_day: traktShow.airs.day,
        air_time: traktShow.airs.time,
        status: traktShow.status,
        released: new Date(traktShow.released).getTime() / 1000.0,
        num_seasons: 0,
        last_updated: Number(new Date()),
        latest_episode: 0,
        episodes: []
      }
    } catch (err) {
      logger.error(`Trakt: Could not find any data on: ${err.path || err} with slug: '${id}'`)
    }
  }

}
