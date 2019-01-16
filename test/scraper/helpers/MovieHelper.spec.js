// Import the necessary modules.
// @flow
/* eslint-disable no-unused-expressions */
import sinon from 'sinon'
import {
  Database,
  PopApi
} from 'pop-api'
import { expect } from 'chai'

import testMovie from '../../data/movie.json'
import { logger } from '..'
import { Movie } from '../../../src/models'
import { MovieHelper } from '../../../src/scraper/helpers'
import {
  fanart,
  omdb,
  tmdb,
  trakt
} from '../../../src/scraper/apiModules'
import { name } from '../../../package.json'
import * as abstractHelperTests from './AbstractHelper.spec'

/** @test {MovieHelper} */
describe('MovieHelper', () => {
  /**
   * The movie helper to test.
   * @type {MovieHelper}
   */
  let movieHelper: MovieHelper

  /**
   * The database middleware to connect to MongoDB.
   * @type {Database}
   */
  let database: Database

  /**
   * Hook for setting up the MovieHelper tests.
   * @type {Function}
   */
  before(done => {
    if (!global.logger) {
      global.logger = logger
    }

    movieHelper = new MovieHelper({
      name: 'MovieHelper',
      Model: Movie
    })

    database = new Database(PopApi, {
      database: name
    })
    database.connect()
      .then(() => Movie.remove({}))
      .then(() => done())
      .catch(done)
  })

  /** @test {MovieHelper#_updateTorrent} */
  it('should update the torrent for an existing movie', () => {
    const movie = JSON.parse(JSON.stringify(testMovie))
    const found = JSON.parse(JSON.stringify(testMovie))

    const res = movieHelper._updateTorrent(movie, found, 'en', '720p')
    expect(res).to.be.an('object')
  })

  /** @test {MovieHelper#_updateTorrent} */
  it('should update the torrent for an existing movie', () => {
    const movie = JSON.parse(JSON.stringify(testMovie))
    const found = JSON.parse(JSON.stringify(testMovie))

    found.torrents.en['720p'] = {
      seeds: 2,
      url: 'url'
    }
    const res = movieHelper._updateTorrent(movie, found, 'en', '720p')
    expect(res).to.be.an('object')
  })

  /** @test {MovieHelper#_updateTorrent} */
  it('should update the torrent for an existing movie', () => {
    const movie = JSON.parse(JSON.stringify(testMovie))
    const found = JSON.parse(JSON.stringify(testMovie))

    movie.torrents.en = {}
    const res = movieHelper._updateTorrent(movie, found, 'en', '720p')
    expect(res).to.be.an('object')
  })

  /** @test {MovieHelper#_updateTorrent} */
  it('should update the torrent for an existing movie', () => {
    const movie = JSON.parse(JSON.stringify(testMovie))
    const found = JSON.parse(JSON.stringify(testMovie))

    found.torrents.en = {}
    const res = movieHelper._updateTorrent(movie, found, 'en', '720p')
    expect(res).to.be.an('object')
  })

  /** @test {MovieHelper#_updateTorrent} */
  it('should update the torrent for an existing movie', () => {
    const movie = JSON.parse(JSON.stringify(testMovie))
    const found = JSON.parse(JSON.stringify(testMovie))

    movie.torrents.en = null
    const res = movieHelper._updateTorrent(movie, found, 'en', '720p')
    expect(res).to.be.an('object')
  })

  /** @test {MovieHelper#_updateTorrent} */
  it('should update the torrent for an existing movie', () => {
    const movie = JSON.parse(JSON.stringify(testMovie))
    const found = JSON.parse(JSON.stringify(testMovie))

    found.torrents.en = null
    const res = movieHelper._updateTorrent(movie, found, 'en', '720p')
    expect(res).to.be.an('object')
  })

  /** @test {MovieHelper#_updateTorrent} */
  it('should update the torrent for an existing movie', () => {
    const movie = JSON.parse(JSON.stringify(testMovie))
    const found = JSON.parse(JSON.stringify(testMovie))

    movie.torrents.en = null
    found.torrents.en = {}
    const res = movieHelper._updateTorrent(movie, found, 'en', '720p')
    expect(res).to.be.an('object')
  })

  /** @test {MovieHelper#_updateMovie} */
  it('should save a given movie', done => {
    const foundStub = sinon.stub(movieHelper.Model, 'findOne')
    foundStub.returns(null)

    movieHelper._updateMovieInDb(testMovie).then(res => {
      expect(res).to.be.an('object')
      foundStub.restore()

      done()
    }).catch(done)
  })

  /** @test {MovieHelper#_updateMovie} */
  it('should update a given movie', done => {
    const foundStub = sinon.stub(movieHelper.Model, 'findOne')
    foundStub.returns(testMovie)
    const updateStub = sinon.stub(movieHelper.Model, 'findOneAndUpdate')
    updateStub.returns(testMovie)

    movieHelper._updateMovieInDb(testMovie).then(res => {
      expect(res).to.be.an('object')
      foundStub.restore()
      updateStub.restore()

      done()
    }).catch(done)
  })

  /** @test {MovieHelper#_updateMovie} */
  it('should update a given movie', done => {
    const foundStub = sinon.stub(movieHelper.Model, 'findOne')
    foundStub.returns(testMovie)
    const updateStub = sinon.stub(movieHelper.Model, 'findOneAndUpdate')
    delete testMovie.torrents
    updateStub.returns(testMovie)

    movieHelper._updateMovieInDb(testMovie).then(res => {
      expect(res).to.be.an('object')
      foundStub.restore()
      updateStub.restore()

      done()
    }).catch(done)
  })

  /** @test {MovieHelper#_updateMovie} */
  it('should catch and print an error', done => {
    const foundStub = sinon.stub(movieHelper.Model, 'findOne')
    foundStub.throws()

    movieHelper._updateMovieInDb(testMovie).then(res => {
      expect(res).to.be.undefined
      foundStub.restore()

      done()
    }).catch(done)
  })

  /** @test {MovieHelper#addTorrents} */
  it('should add torrents to a movie', done => {
    const torrent = {
      url: 'test url',
      peers: 0,
      seeds: 0,
      provider: 'test'
    }
    const torrents = {
      en: {
        '720p': torrent,
        '1080p': torrent
      }
    }

    const foundStub = sinon.stub(movieHelper.Model, 'findOne')
    foundStub.returns(testMovie)

    testMovie.torrents = {}
    movieHelper.addTorrents(testMovie, torrents).then(res => {
      expect(res).to.be.an('object')
      foundStub.restore()

      done()
    }).catch(done)
  })

  /** @test {MovieHelper#_getTmdbImages} */
  it('should fail to get movie images from TMDB', done => {
    const image = [{
      iso_639_1: null,
      file_path: null
    }]
    const stub = sinon.stub(tmdb.movie, 'images')
    stub.resolves({
      posters: image,
      backdrops: image
    })

    movieHelper._addTmdbImages()
      .then(done)
      .catch(err => {
        expect(err).to.be.an('Error')
        stub.restore()

        done()
      })
  })

  /** @test {MovieHelper#_getTmdbImages} */
  it('should get movie images from TMDB', done => {
    movieHelper._addTmdbImages(10195)
      .then(res => abstractHelperTests.testImages(res, done))
      .catch(done)
  })

  /** @test {MovieHelper#_getOmdbImages} */
  it('should get movie images from OMDB', done => {
    movieHelper._addOmdbImages('tt1431045')
      .then(res => abstractHelperTests.testImages(res, done))
      .catch(done)
  })

  /** @test {MovieHelper#_getOmdbImages} */
  it('should fail to get movie images from OMDB', done => {
    const images = {
      Poster: null
    }
    const stub = sinon.stub(omdb, 'byId')
    stub.resolves(images)

    movieHelper._addOmdbImages('')
      .then(done)
      .catch(err => {
        expect(err).to.be.an('Error')
        stub.restore()

        done()
      })
  })

  /** @test {MovieHelper#_getFanartImages} */
  it('should get movie images from Fanart', done => {
    movieHelper._addFanartImages(10195)
      .then(res => abstractHelperTests.testImages(res, done))
      .catch(done)
  })

  /** @test {MovieHelper#_getFanartImages} */
  it(`should fail to get movie images from Fanart`, done => {
    abstractHelperTests.testGetFanartImages({
      hdmovieclearart: [{
        url: 'url'
      }]
    }, 'movie', fanart, movieHelper, done)
  })

  /** @test {MovieHelper#_getFanartImages} */
  it(`should fail to get movie images from Fanart`, done => {
    abstractHelperTests.testGetFanartImages(
      {}, 'movie', fanart, movieHelper, done
    )
  })

  /** @test {MovieHelper#getImages} */
  it('should get movie images from various sources', done => {
    movieHelper.getImages({
      imdbId: 'tt1431045',
      tmdbId: 10195
    }).then(res => abstractHelperTests.testImages(res, done))
      .catch(done)
  })

  /** @test {MovieHelper#getImages} */
  it('should get movie images from various sources', done => {
    const stub = sinon.stub(omdb, 'byId')
    stub.throws()

    movieHelper.getImages({
      imdbId: 'tt1431045',
      tmdbId: 10195
    }).then(res => {
      stub.restore()
      return abstractHelperTests.testImages(res, done)
    }).catch(done)
  })

  /** @test {MovieHelper#getTraktInfo} */
  it('should get info from Trakt and make a new movie object with 0 watching', done => {
    const stub = sinon.stub(trakt.movies, 'watching')
    stub.resolves()

    movieHelper.getTraktInfo('deadpool-2016').then(res => {
      expect(res).to.be.an('object')
      stub.restore()

      done()
    }).catch(done)
  })

  /** @test {MovieHelper#getTraktInfo} */
  it('should get info from Trakt and make a new movie object with no genres', done => {
    const stub = sinon.stub(trakt.movies, 'summary')
    stub.resolves({
      ids: {
        imdb: 'imdb',
        tmdb: 'tmdb'
      },
      released: '2016-01-01',
      genres: undefined
    })

    movieHelper.getTraktInfo('deadpool-2016').then(res => {
      expect(res).to.be.an('object')
      stub.restore()

      done()
    }).catch(done)
  })

  /** @test {MovieHelper#getTraktInfo} */
  it('should not get info from Trakt', done => {
    const stub = sinon.stub(trakt.movies, 'summary')
    stub.resolves(null)

    movieHelper.getTraktInfo('deadpool-2016').then(res => {
      expect(res).to.be.undefined
      stub.restore()

      done()
    }).catch(done)
  })

  /** @test {MovieHelper#getTraktInfo} */
  it('should not get info from Trakt', done => {
    const stub = sinon.stub(trakt.movies, 'summary')
    stub.throws()

    movieHelper.getTraktInfo('deadpool-2016').then(res => {
      expect(res).to.be.undefined
      stub.restore()

      done()
    }).catch(done)
  })

  /**
   * Hook for tearing down the MovieHelper tests.
   * @type {Function}
   */
  after(done => {
    database.disconnect()
      .then(() => done())
      .catch(done)
  })
})
