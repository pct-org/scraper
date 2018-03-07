// Import the necessary modules.
// @flow
import ContentModel from '../content/ContentModel'

/**
 * Class for movie attributes and methods.
 * @extends {ContentModel}
 * @type {MovieModel}
 */
export default class MovieModel extends ContentModel {

  /**
   * The language of the movie.
   * @type {string}
   */
  language: string

  /**
   * The trailer of the movie.
   * @type {string}
   */
  trailer: string

  /**
   * The certification of the movie.
   * @type {string}
   */
  certification: string

  /**
   * The torrents of the movie.
   * @type {Object}
   */
  torrents: Object

  /**
   * Create a new Movie object.
   * @param {!Object} config={} - The configuration object for the movie.
   * @param {!string} imdb_id - The imdb id of the movie.
   * @param {!number} tmdb_id - The tmdb id of the movie.
   * @param {!string} title - The title of the movie.
   * @param {!string} slug - The slug of the movie.
   * @param {!string} synopsis - The synopsis of the movie.
   * @param {!number} runtime - The runtime of the movie.
   * @param {!Rating} rating - The rating of the movie.
   * @param {!Images} images - The images of the movie.
   * @param {!Array<string>} genres - The genres of the movie.
   * @param {!string} [type=movie] - The type of the movie.
   * @param {!string} [language=en] - The language of the movie.
   * @param {!number} released - The release date of the movie.
   * @param {!string} trailer - The trailer of the movie.
   * @param {!string} certification - The certification of the movie.
   * @param {!Object} torrents - The torrents of the movie.
   */
  constructor({
    imdb_id, // eslint-disable-line camelcase
    tmdb_id,
    title,
    slug,
    synopsis,
    runtime,
    rating,
    images,
    genres,
    type = 'movie',
    language = 'en',
    released,
    trailer,
    certification,
    torrents
  }: Object = {}): void {
    super({
      imdb_id,
      tmdb_id,
      title,
      released,
      slug,
      synopsis,
      runtime,
      rating,
      images,
      genres,
      type
    })

    /**
     * The language of the movie.
     * @type {string}
     */
    this.language = language
    /**
     * The trailer of the movie.
     * @type {string}
     */
    this.trailer = trailer
    /**
     * The certification of the movie.
     * @type {string}
     */
    this.certification = certification
    /**
     * The torrents of the movie.
     * @type {Object}
     */
    this.torrents = torrents
  }

}
