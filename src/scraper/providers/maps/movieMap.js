// @flow

/**
 * Map for correcting movie slugs.
 * @type {Object}
 */
const movieMap: {
  [key: string]: string
} = {
  'godzilla-2-king-of-the-monsters-2019': 'godzilla-king-of-the-monsters-2019',
  'the-dead-dont-die-2019': 'the-dead-don-t-die-2019',
  'pokmon-detective-pikachu-2019': 'pokemon-detective-pikachu-2019'
}

/**
 * Export the movie map.
 * @type {Object}
 */
export default movieMap
