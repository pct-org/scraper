// Import the necessary modules.
// @flow
/* eslint-disable camelcase */
import ContentModel from '../content/ContentModel'

/**
 * The episode model type.
 * @typedef {Object} Episode
 * @property {!number} tmdb_id The tmdb_id of the episode.
 * @property {!number} number The episode number of the current episode.
 * @property {!string} title The title of the episode.
 * @property {!string} synopsis A brief summary of the episode
 * @property {!number} first_aired The date on which the episode was first aired.
 * @property {!string} image The still for the current episode.
 * @property {!Object} torrents The episode's torrent.
 */
type Episode = {
  tmdb_id: number,
  number: number,
  title: string,
  synopsis: string,
  first_aired: number,
  image: string,
  torrents: [Torrent]
}

/**
 * The season model type.
 * @typedef {Object} Season
 * @property {!number} tmdb_id The tmdb_id of the season.
 * @property {!number} number The season number.
 * @property {!string} title The title of the season.
 * @property {!string} synopsis A brief summary of the season.
 * @property {!number} first_aired The date on which the first episode of the season first aired.
 * @property {!string} image The season poster for the current season.
 * @property {!Array<Episode>} episodes The episodes in the season.
 */
type Season = {
  tmdb_id: number,
  number: number,
  title: string,
  synopsis: string,
  first_aired: number,
  image: string,
  episodes: Array<Episode>
}

/**
 * The air information model type.
 * @typedef {Object} AirInformation
 * @property {!string} network The name of the network on which the show airs.
 * @property {!string} country The country in which the show airs.
 * @property {!string} day The name of the day (in English), on which the show airs. (Will be null if the show has stopped airing).
 * @property {!string} time The time at which the show airs. (Will be null if the show has stopped airing).
 * @property {!string} status The status of the show's airing (returning series, in production, planned, cancelled, ended).
 */
type AirInformation = {
  network: string,
  country: string,
  day: string,
  time: string,
  status: string
}

/**
 * Class for show attributes and methods.
 * @extends {ContentModel}
 * @type {ShowModel}
 */
export default class ShowModel extends ContentModel {

  /**
   * The tvdb id for the show.
   * @type {number}
   */
  tvdb_id: number

  /**
   * Information about when the show airs.
   * @type {AirInformation}
   */
  air_info: AirInformation

  /**
   * The time at which the show was last updated.
   * @type {number}
   */
  last_updated: number

  /**
   * The seasons in the show.
   * @type {Array<Season>}
   */
  seasons: Array<Season>

  /**
   * Create a new Show object.
   * @param {!Object} config = {} - The configuration object for the show.
   * @param {!string} imdb_id - The imdb id of the show.
   * @param {!number} tmdb_id - The tmdb id of the show.
   * @param {!string} title - The title of the show.
   * @param {!number} released - The release date of the show.
   * @param {!string} certification - The certification of the show.
   * @param {!string} slug - The slug of the show.
   * @param {!string} synopsis - A brief summary of the show.
   * @param {!number} runtime - How long each episode in the show is, approximately (in minutes).
   * @param {!Rating} rating - The rating of the show.
   * @param {!Images} images - The images for the show.
   * @param {!Array<string>} genres - The genres describing the show.
   * @param {!string} [type=tvshow] - The type of the show.
   * @param {!number} tvdb_id - The tvdb id for the show.
   * @param {!AirInformation} air_info - Information about when the show airs.
   * @param {!number} last_updated = 0 - The time the show was last updated.
   * @param {!Array<Season>} seasons - The seasons in the show.
   */
  constructor({
    imdb_id,
    tmdb_id,
    title,
    released,
    certification,
    slug,
    synopsis,
    runtime,
    rating,
    images,
    genres,
    type = 'tvshow',
    air_info,
    num_seasons,
    last_updated,
    seasons
  }: Object = {}): void {
    super({
      imdb_id,
      tmdb_id,
      title,
      released,
      certification,
      slug,
      synopsis,
      runtime,
      rating,
      images,
      genres,
      type
    })

    this.tvdb_id = tvdb_id
    this.air_info = air_info
    this.last_updated = last_updated
    this.seasons = seasons
  }

}
