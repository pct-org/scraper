// Import the necessary modules.
// @flow
/* eslint-disable camelcase, no-unused-vars */
/**
 * MongoDB object modeling designed to work in an asynchronous environment.
 * @external {Model} http://mongoosejs.com
 */
import { Model } from 'mongoose'

/**
 * The rating model type.
 * @typedef {Object} Rating
 * @property {!number} amount of stars
 * @property {!number} votes How many people rated the content.
 * @property {!number} watching How many people are currently watching the
 * content.
 * @property {!number} percentage The rating of the content, expressed as a
 * percentage.
 */
type Rating = {
  stars: number,
  votes: number,
  watching: number,
  percentage: number
}

/**
 * The runtime model type
 * @typedef {Object} Runtime
 * @property {!string} full string of runtime 43 minutes
 * @property {!string} short string of runtime 43 min
 * @property {!number} amount of hours
 * @property {!number} amount of minutes
 */
type Runtime = {
  full: string,
  short: string,
  hours: number,
  minutes: number,
}

/**
 * The images model type.
 * @typedef {Object} Images
 * @property {!string} backdrop A backdrop image for the content.
 * @property {!string} poster A poster image for the content.
 * @property {!string} logo A hd clear logo image for the content.
 * @property {!string} thumb A background thumb image for the content.
 */
type Images = {
  backdrop: string,
  poster: string,
  logo: string,
  thumb: string
}

/**
 * The torrent model type.
 * @typedef {Object} Torrent
 * @property {!string} quality The quality of the video (1080p, 720p, 480p).
 * @property {!string} provider The website from which the torrent was obtained.
 * @property {!string} language The language code describing the audio language
 * of the video.
 * @property {!number} size The size of the video to which the torrent points
 * (in bytes).
 * @property {!number} seeds The number of people seeding the torrent currently.
 * @property {!number} peers The number of peers the torrent has.
 * @property {!string} url The url pointing to the torrent.
 */
export type Torrent = {
  quality: string,
  provider: string,
  language: string,
  size: number,
  seeds: number,
  peers: number,
  url: string
}

/**
 * The Content model.
 * @extends {Model}
 * @type {ContentModel}
 */
export class ContentModel extends Model {

  /**
   * The imdb id of the content.
   * @type {string}
   */
  _id: any

  /**
   * The imdb id of the content.
   * @type {string}
   */
  imdb_id: string

  /**
   * The tmdb id of the content.
   * @type {number}
   */
  tmdb_id: number

  /**
   * The title of the content.
   * @type {string}
   */
  title: string

  /**
   * The release date of the content.
   * @type {number}
   */
  released: number

  /**
   * The certification of the content.
   * @type {string}
   */
  certification: string

  /**
   * The slug of the content.
   * @type {string}
   */
  slug: string

  /**
   * A brief summary of the content.
   * @type {string}
   */
  synopsis: string

  /**
   * How long the content is (in minutes).
   * @type {Runtime}
   */
  runtime: Runtime

  /**
   * The rating of the content.
   * @type {Rating}
   */
  rating: Rating

  /**
   * The images for the content.
   * @type {Images}
   */
  images: Images

  /**
   * The genres describing the content.
   * @type {Array<string>}
   */
  genres: Array<string>

  /**
   * The type of the content.
   * @type {string}
   */
  type: string

  /**
   * The content's trailer
   * @type {string}
   */
  trailer: string

  /**
   * Create a new Content object.
   * @param {!Object} config - The configuration object for the content.
   * @param {!string} imdb_id - The imdb id of the content.
   * @param {!number} tmdb_id - The tmdb id of the content.
   * @param {!string} title - The title of the content.
   * @param {!number} released - The release date of the content.
   * @param {!string} certification - The certification of the content.
   * @param {!string} slug - The slug of the content.
   * @param {!string} synopsis - A brief summary of the content.
   * @param {!number} runtime - How long the content is (in minutes).
   * @param {!Rating} rating - The rating of the content.
   * @param {!Images} images - The images for the content.
   * @param {!Array<string>} genres - The genres describing the content.
   * @param {!string} type - The type of the content.
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
    type,
    trailer
  }: Object): void {
    super()

    this._id = imdb_id
    this.imdb_id = imdb_id
    this.tmdb_id = tmdb_id
    this.title = title
    this.released = released
    this.certification = certification
    this.slug = slug
    this.synopsis = synopsis
    this.runtime = runtime
    this.rating = rating
    this.images = images
    this.genres = genres
    this.type = type
    this.trailer = trailer
  }

}
