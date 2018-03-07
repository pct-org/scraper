// Import the necessary modules.
// @flow
/* eslint-disable camelcase */
import ContentModel from '../content/ContentModel'

/**
 * The episode model type.
 * @typedef {Object} Episode
 * @property {!string} tvdb_id The tvdb_id of the episode.
 * @property {!string} tmdb_id The tmdb_id of the episode.
 * @property {!number} season The season of the episode.
 * @property {!number} episode The episode of the episode.
 * @property {!string} title The title of the episode.
 * @property {!string} overview The overview of the episode.
 * @property {!boolean} date_based The date based of the episode.
 * @property {!number} first_aired The first aired time of the episode.
 * @property {!Object} torrents The torrents of the episode.
 */
type Episode = {
  tvdb_id: string,
  tmdb_id: string,
  season: number,
  episode: number,
  title: string,
  overview: string,
  date_based: boolean,
  first_aired: number,
  torrents: Object
}

/**
 * Class for show attributes and methods.
 * @extends {ContentModel}
 * @type {ShowModel}
 */
export default class ShowModel extends ContentModel {

  /**
   * The tvdb id of the show.
   * @type {number}
   */
  tvdb_id: string

  /**
   * The country of the show.
   * @type {string}
   */
  country: string

  /**
   * The network of the show.
   * @type {string}
   */
  network: string

  /**
   * The air day of the show.
   * @type {string}
   */
  air_day: string

  /**
   * The air time of the show.
   * @type {number}
   */
  air_time: string

  /**
   * The status of the show.
   * @type {string}
   */
  status: string

  /**
   * The number of seasons of the show.
   * @type {number}
   */
  num_seasons: number

  /**
   * The time the show was last updated.
   * @type {number}
   */
  last_updated: number

  /**
   * The latest episode of the show.
   * @type {number}
   */
  latest_episode: number

  /**
   * The episodes of the show.
   * @type {Array<Episode>}
   */
  episodes: Array<Episode>

  /**
   * Create a new Show object.
   * @param {!Object} config={} - The configuration object for the show.
   * @param {!string} imdb_id - The imdb id of the show.
   * @param {!string} tmdb_id - The tmdb id of the show.
   * @param {!string} title - The title of the show.
   * @param {!number} year - The year of the show.
   * @param {!string} slug - The slug of the show.
   * @param {!string} synopsis - The synopsis of the show.
   * @param {!number} runtime - The runtime of the show.
   * @param {!Rating} rating - The rating of the show.
   * @param {!Images} images - The images of the show.
   * @param {!Array<string>} genres - The genres of the show.
   * @param {!string} [type=tvshow] - The type of the show.
   * @param {!number} tvdb_id - The tvdb id of the show.
   * @param {!string} country - The country of the show.
   * @param {!string} network - The network of the show.
   * @param {!string} air_day - The air day of the show.
   * @param {!number} air_time - The air time of the show.
   * @param {!string} status - The status of the show.
   * @param {!number} num_seasons - The number of seasons of the show.
   * @param {!number} last_updated=0 - The time the show was last updated.
   * @param {!number} latest_episode - The latest episode of the show.
   * @param {!Array<Episode>} episodes - The episodes of the show.
   */
  constructor({
    imdb_id,
    tmdb_id,
    title,
    year,
    slug,
    synopsis,
    runtime,
    rating,
    images,
    genres,
    type = 'tvshow',
    tvdb_id,
    country,
    network,
    air_day,
    air_time,
    status,
    num_seasons,
    last_updated,
    latest_episode = 0,
    episodes
  }: Object = {}): void {
    super({
      imdb_id,
      tmdb_id,
      title,
      year,
      slug,
      synopsis,
      runtime,
      rating,
      images,
      genres,
      type
    })

    /**
     * The tvdb id of the show.
     * @type {number}
     */
    this.tvdb_id = tvdb_id
    /**
     * The country of the show.
     * @type {string}
     */
    this.country = country
    /**
     * The network of the show.
     * @type {string}
     */
    this.network = network
    /**
     * The air day of the show.
     * @type {string}
     */
    this.air_day = air_day
    /**
     * The air time of the show.
     * @type {number}
     */
    this.air_time = air_time
    /**
     * The status of the show.
     * @type {string}
     */
    this.status = status
    /**
     * The number of seasons of the show.
     * @type {number}
     */
    this.num_seasons = num_seasons
    /**
     * The time the show was last updated.
     * @type {number}
     */
    this.last_updated = last_updated
    /**
     * The latest episode of the show.
     * @type {number}
     */
    this.latest_episode = latest_episode
    /**
     * The episodes of the show.
     * @type {Array<Object>}
     */
    this.episodes = episodes
  }

}
