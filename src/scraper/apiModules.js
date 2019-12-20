// @flow
/**
 * An EZTV API wrapper to get data from eztv.ag.
 * @external {Eztv} https://github.com/ChrisAlderson/eztv-api-pt
 */
import Eztv from '@pct-org/eztv-api-pt'

/**
 * A Fanart.tv API wrapper for NodeJS.
 * @external {Fanart} https://github.com/ChrisAlderson/fanart.tv-api
 */
import Fanart from 'fanart.tv-api'

/**
 * An OMDB API wrapper for NodeJS.
 * @external {Omdb} https://github.com/ChrisAlderson/omdb-api-pt
 */
import Omdb from 'omdb-api-pt'

/**
 * TheMovieDB API wrapper, written in node.js
 * @external {Tmdb} https://github.com/gajus/tmdb
 */
import { Tmdb } from 'tmdb'

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
 * A NodeJS wrapper for solidtorrents.net
 * @external {Ettv} https://github.com/pct-org/solidtorrents-api-pt
 */
import Solid from '@pct-org/solidtorrents-api-pt'

/**
 * A NodeJS wrapper for zooqle.com
 * @external {Ettv} https://github.com/ChrisAlderson/ettv-api-pt
 */
import { zooqle } from '@pct-org/zooqle'

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
 * @external {Tmdb} https://github.com/gajus/tmdb
 */
const tmdb = new Tmdb(process.env.TMDB_KEY)

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

const solid = new Solid()

/**
 * Export the API modules.
 * @type {Object}
 * @ignore
 */
export {
  eztv,
  fanart,
  omdb,
  tmdb,
  trakt,
  tvdb,
  yts,
  solid,
  zooqle,
}
