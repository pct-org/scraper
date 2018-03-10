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
   * The movie's trailer.
   * @type {string}
   */
  trailer: string

  /**
   * The movie's torrents.
   * @type {Array<Torrent>}
   */
  torrents: Array<Torrent>

  /**
   * Create a new Movie object.
   * @param {!Object} config = {} - The configuration object for the movie.
   * @param {!string} imdb_id - The imdb id of the movie.
   * @param {!number} tmdb_id - The tmdb id of the movie.
   * @param {!string} title - The title of the movie.
   * @param {!number} released - The release date of the movie.
   * @param {!string} certification - The certification of the movie.
   * @param {!string} slug - The slug of the movie.
   * @param {!string} synopsis - A brief summary of the movie.
   * @param {!number} runtime - How long the movie is (in minutes).
   * @param {!Rating} rating - The rating of the movie.
   * @param {!Images} images - The images for the movie.
   * @param {!Array<string>} genres - The genres describing the movie.
   * @param {!string} [type=movie] - The type of the movie.
   * @param {!string} trailer - The movie's trailer.
   * @param {!Object} torrents - The movie's torrents.
   */
  constructor({
    imdb_id, // eslint-disable-line camelcase
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
    type = 'movie',
    trailer,
    torrents
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

    this.trailer = trailer
    this.torrents = torrents
  }

}
