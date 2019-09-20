// Import the necessary modules.
// @flow
/**
 * An EZTV API wrapper to get data from eztv.ag.
 * @external {Eztv} https://github.com/ChrisAlderson/eztv-api-pt
 */
import Eztv from 'eztv-api-pt'

/**
 * A Fanart.tv API wrapper for NodeJS.
 * @external {Fanart} https://github.com/ChrisAlderson/fanart.tv-api
 */
import Fanart from 'fanart.tv-api'

/**
 * A HorribleSubs API wrapper to get data from horriblesubs.info
 * @external {HorribleSubs} https://github.com/ChrisAlderson/horriblesubs-api
 */
import HorribleSubs from 'horriblesubs-api'

/**
 * A KickassTorrents API wrapper for NodeJs.
 * @external {Kat} https://github.com/ChrisAlderson/kat-api-pt
 */
import Kat from 'kat-api-pt'

/**
 * A nyaa.se API wrapper for NodeJS.
 * @external {Nyaa} https://github.com/ChrisAlderson/nyaa-api-pt
 */
import Nyaa from 'nyaa-api-pt'

/**
 * An OMDB API wrapper for NodeJS.
 * @external {Omdb} https://github.com/ChrisAlderson/omdb-api-pt
 */
import Omdb from 'omdb-api-pt'

/**
 * TheMovieDB API wrapper, written in node.js
 * @external {Tmdb} https://github.com/vankasteelj/tmdbapi
 */
import Tmdb from 'tmdbapi'

/**
 * A Trakt.tv API wrapper for Node.js
 * @external {Trakt} https://github.com/vankasteelj/trakt.tv
 */
import Trakt from 'trakt.tv'

/**
 * Node.js library for accessing TheTVDB API
 * @external {Tvdb} https://github.com/edwellbrook/node-tvdb
 */
import Tvdb from 'node-tvdb'

/**
 * A NodeJS wrapper for yts.ag
 * @external {Yts} https://github.com/ChrisAlderson/yts-api-pt
 */
import Yts from 'yts-api-pt'

/**
 * A configured Eztv API.
 * @type {Eztv}
 * @see https://github.com/ChrisAlderson/eztv-api-pt
 */
const eztv = new Eztv()
eztv.getAll = eztv.getAllShows
eztv.getData = eztv.getShowData

/**
 * A configured Fanart API.
 * @type {Fanart}
 * @see https://github.com/ChrisAlderson/fanart.tv-api
 */
const fanart = new Fanart({
  apiKey: process.env.FANART_KEY,
})

/**
 * A configured Kat API.
 * @type {Kat}
 * @see https://github.com/pct-org/kat-api-pt
 */
const kat = new Kat()

/**
 * A configured Omdb API.
 * @type {Omdb}
 * @see https://github.com/ChrisAlderson/omdb-api-pt
 */
const omdb = new Omdb({
  apiKey: process.env.OMDB_KEY,
})

/**
 * A configured Tmdb API.
 * @type {Tmdb}
 * @see https://github.com/vankasteelj/tmdbapi
 */
const tmdb = new Tmdb({
  apiv3: process.env.TMDB_KEY,
})

/**
 * A configured Trakt API.
 * @type {Trakt}
 * @see https://github.com/vankasteelj/trakt.tv
 */
const trakt = new Trakt({
  client_id: process.env.TRAKT_KEY,
})

/**
 * A configured Tvdb API.
 * @type {Tvdb}
 * @see https://github.com/edwellbrook/node-tvdb
 */
const tvdb = new Tvdb(process.env.TVDB_KEY)

/**
 * A configured Yts API.
 * @type {Yts}
 * @see https://github.com/ChrisAlderson/yts-api-pt
 */
const yts = new Yts()
yts.search = yts.getMovies

/**
 * Export the API modules.
 * @type {Object}
 * @ignore
 */
export {
  eztv,
  fanart,
  kat,
  omdb,
  tmdb,
  trakt,
  tvdb,
  yts,
}
