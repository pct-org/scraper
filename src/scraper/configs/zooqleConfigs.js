// @flow
import { MovieProvider } from '../providers'
import { zooqle } from '../apiModules'
import { MovieHelper } from '../helpers'

import { MovieModel } from '@pct-org/mongo-models/dist/movie/movie.model'

const regexps = [
  {
    regex: /(.*).(\d{4}).+[4k]\D+(\d{3,4}p)/i,
  }, {
    regex: /(.*).(\d{4}).[UHD]\D+(\d{3,4}p)/i,
  }, {
    // Some files have the quality in it twice
    regex: /(.*).(\d{4}).(\d{3,4}p)\D+(\d{3,4}p)/i,
  }, {
    regex: /(.*).(\d{4})\D+(\d{3,4}p)/i,
  },
]

export default [
  {
    name: 'Zooqle',
    api: zooqle,
    contentType: MovieProvider.ContentTypes.Movie,
    Helper: MovieHelper,
    Model: MovieModel,
    regexps,
    query: {
      query: '2160p category:Movies',
      language: 'en',
    },
  },
]
