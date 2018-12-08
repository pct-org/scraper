// Import the necessary modules.
// @flow
/* eslint-disable no-unused-expressions */
/* eslint-disable quote-props */
import { expect } from 'chai'
import {
  Database,
  PopApi
} from 'pop-api'
import sinon from 'sinon'

import testShow from '../../data/show.json'
import { logger } from '..'
import { Show } from '../../../src/models'
import { ShowHelper } from '../../../src/scraper/helpers'
import {
  fanart,
  trakt,
  tmdb,
  tvdb
} from '../../../src/scraper/apiModules'
import { name } from '../../../package.json'
import * as abstractHelperTests from './AbstractHelper.spec'

/** @test {ShowHelper} */
describe('ShowHelper', () => {
  /**
   * A mock torrent object.
   * @type {Object}
   */
  const torrent: Object = {
    '1': {
      '1': {
        '480p': {
          url: 'url',
          seeds: 0,
          peers: 0,
          provider: 'test'
        }
      },
      '2': {
        '720p': {
          url: 'url',
          seeds: 0,
          peers: 0,
          provider: 'test'
        }
      }
    }
  }

  /**
   * A mock datebased torrent object.
   * @type {Object}
   */
  const torrentDatebased: Object = {
    '2016': {
      '10-02': {
        '480p': {
          url: 'url',
          seeds: 0,
          peers: 0,
          provider: 'test'
        }
      },
      '10-09': {
        '720p': {
          url: 'url',
          seeds: 0,
          peers: 0,
          provider: 'test'
        }
      }
    }
  }

  /**
   * The show helper to test.
   * @type {ShowHelper}
   */
  let showHelper: ShowHelper

  /**
   * The database middleware to connect to MongoDB.
   * @type {Database}
   */
  let database: Database

  /**
   * Hook for setting up the ShowHelper tests.
   * @type {Function}
   */
  before(done => {
    if (!global.logger) {
      global.logger = logger
    }

    showHelper = new ShowHelper({
      name: 'ShowHelper',
      Model: Show
    })

    database = new Database(PopApi, {
      database: name
    })
    database.connect()
      .then(() => Show.remove({}))
      .then(() => done())
      .catch(done)
  })

  /** @test {ShowHelper#_updateNumSeasons} */
  it.skip('should update the number of seasons for a show', () => {
    expect(true).to.be.true
  })

  /** @test {ShowHelper#_updateEpisode} */
  it('should update an episode for an existing ', () => {
    const matching = JSON.parse(JSON.stringify(testShow.episodes[0]))
    const episode = JSON.parse(JSON.stringify(testShow.episodes[0]))
    const show = JSON.parse(JSON.stringify(testShow))

    let res = showHelper._updateEpisode(matching, episode, show, '480p')
    expect(res).to.be.an('object')
    res = showHelper._updateEpisode(matching, episode, show, '720p')
    expect(res).to.be.an('object')
  })

  /** @test {ShowHelper#_updateEpisode} */
  it('should update an episode for an existing ', () => {
    const matching = JSON.parse(JSON.stringify(testShow.episodes[0]))
    const episode = JSON.parse(JSON.stringify(testShow.episodes[0]))
    const show = JSON.parse(JSON.stringify(testShow))

    episode.torrents['480p'] = {
      seeds: 0,
      url: 'test'
    }
    const res = showHelper._updateEpisode(matching, episode, show, '480p')
    expect(res).to.be.an('object')
  })

  /** @test {ShowHelper#_updateEpisode} */
  it('should update an episode for an existing ', () => {
    const matching = JSON.parse(JSON.stringify(testShow.episodes[0]))
    const episode = JSON.parse(JSON.stringify(testShow.episodes[0]))
    const show = JSON.parse(JSON.stringify(testShow))

    matching.torrents = {}
    let res = showHelper._updateEpisode(matching, episode, show, '480p')
    expect(res).to.be.an('object')
    res = showHelper._updateEpisode(matching, episode, show, '720p')
    expect(res).to.be.an('object')
  })

  /** @test {ShowHelper#_updateEpisode} */
  it('should update an episode for an existing ', () => {
    const matching = JSON.parse(JSON.stringify(testShow.episodes[0]))
    const episode = JSON.parse(JSON.stringify(testShow.episodes[0]))
    const show = JSON.parse(JSON.stringify(testShow))

    episode.torrents = {}
    const res = showHelper._updateEpisode(matching, episode, show, '480p')
    expect(res).to.be.an('object')
  })

  /** @test {ShowHelper#_updateEpisodes} */
  it('should save a given show', done => {
    const foundStub = sinon.stub(showHelper.Model, 'findOne')
    foundStub.returns(null)

    showHelper._updateShow(testShow).then(res => {
      expect(res).to.be.an('object')
      foundStub.restore()

      done()
    }).catch(done)
  })

  /** @test {ShowHelper#_updateEpisodes} */
  it('should update a given show', done => {
    const foundStub = sinon.stub(showHelper.Model, 'findOne')
    foundStub.returns(testShow)
    const updateStub = sinon.stub(showHelper.Model, 'findOneAndUpdate')
    updateStub.returns(testShow)

    showHelper._updateShow(testShow).then(res => {
      expect(res).to.be.an('object')
      foundStub.restore()
      updateStub.restore()

      done()
    }).catch(done)
  })

  /** @test {ShowHelper#_updateEpisodes} */
  it('should update a given show', done => {
    const found = JSON.parse(JSON.stringify(testShow))
    found.episodes[0].first_aired = Date.now()
    found.episodes[0].episode = 10

    const foundStub = sinon.stub(showHelper.Model, 'findOne')
    foundStub.returns(found)
    const updateStub = sinon.stub(showHelper.Model, 'findOneAndUpdate')
    updateStub.returns(testShow)

    showHelper._updateShow(testShow).then(res => {
      expect(res).to.be.an('object')
      foundStub.restore()
      updateStub.restore()

      done()
    }).catch(done)
  })

  /** @test {ShowHelper#_updateEpisodes} */
  it('should catch and print an error', done => {
    const foundStub = sinon.stub(showHelper.Model, 'findOne')
    foundStub.throws()

    showHelper._updateShow(testShow).then(res => {
      expect(res).to.be.undefined
      foundStub.restore()

      done()
    }).catch(done)
  })

  /** @test {ShowHelper#_addSeasonalSeason} */
  it('should add a seasonal season to a show', done => {
    const show = JSON.parse(JSON.stringify(testShow))
    show.latest_episode = 0

    showHelper._addSeasonalSeason(show, torrent, 1, 'westworld').then(res => {
      expect(res).to.be.undefined
      done()
    }).catch(done)
  })

  /** @test {ShowHelper#_addSeasonalSeason} */
  it('should add a seasonal season to a show', done => {
    const show = JSON.parse(JSON.stringify(testShow))

    showHelper._addSeasonalSeason(show, torrent, 1, 'westworld').then(res => {
      expect(res).to.be.undefined
      done()
    }).catch(done)
  })

  /** @test {ShowHelper#_addSeasonalSeason} */
  it('should add a seasonal season to a show', done => {
    const show = JSON.parse(JSON.stringify(testShow))
    const stub = sinon.stub(trakt.seasons, 'season')
    stub.rejects()

    showHelper._addSeasonalSeason(show, torrent, 1, 'westworld').then(res => {
      expect(res).to.be.undefined
      stub.restore()

      done()
    }).catch(done)
  })

  /** @test {ShowHelper#_addDateBasedSeason} */
  it('should add a date based season to a show', done => {
    const show = JSON.parse(JSON.stringify(testShow))
    show.latest_episode = 0
    show.tvdb_id = 296762

    showHelper._addDateBasedSeason(show, {
      'dateBased': true,
      ...torrentDatebased
    }, 2016).then(res => {
      expect(res).to.be.undefined
      done()
    }).catch(done)
  })

  /** @test {ShowHelper#_addDateBasedSeason} */
  it('should not add a datebased season of episode 0', done => {
    const show = JSON.parse(JSON.stringify(testShow))
    show.tvdb_id = 296762

    const stub = sinon.stub(tvdb, 'getSeriesAllById')
    const tvdbShow = {
      firstAired: '2016-10-02',
      episodes: [{
        airedEpisodeNumber: 0,
        airedSeason: 1,
        episodeName: 'Chestnut',
        firstAired: '2016-10-09',
        id: 5748834,
        overview: 'A pair of guests â first-timer William, and repeat visitor Logan â arrive at Westworld with different expectations and agendas. Bernard  and Quality Assurance head Theresa Cullen debate whether a recent host anomaly is contagious. Meanwhile, behavior engineer Elsie Hughes tweaks the emotions of Maeve, a madam in Sweetwaterâs brothel, in order to avoid a recall. Cocky programmer Lee Sizemore pitches his latest narrative to the team, but Dr. Ford has other ideas. The Man in Black conscripts a condemned man, Lawrence, to help him uncover Westworldâs deepest secrets.'
      }]
    }
    stub.resolves(tvdbShow)

    showHelper._addDateBasedSeason(show, {
      'dateBased': true,
      ...torrentDatebased
    }, 2016).then(res => {
      expect(res).to.be.undefined
      stub.restore()

      done()
    }).catch(done)
  })

  /** @test {ShowHelper#_addDateBasedSeason} */
  it('should catch an error when adding a datebased season', done => {
    const show = JSON.parse(JSON.stringify(testShow))
    show.tvdb_id = 296762

    const stub = sinon.stub(tvdb, 'getSeriesAllById')
    stub.throws()

    showHelper._addDateBasedSeason(show, {
      'dateBased': true,
      ...torrentDatebased
    }, 2016).then(res => {
      expect(res).to.be.undefined
      stub.restore()

      done()
    }).catch(done)
  })

  /** @test {ShowHelper#addEpisodes} */
  it('should add episodes to a seasonal show', done => {
    const stub = sinon.stub(showHelper, '_updateEpisodes')
    stub.resolves()

    showHelper.addEpisodes(testShow, {
      'dateBased': true,
      ...torrent
    }, testShow.slug).then(res => {
      expect(true).to.be.true
      stub.restore()

      done()
    }).catch(done)
  })

  /** @test {ShowHelper#addEpisodes} */
  it('should add episodes to a datebased show', done => {
    const stub = sinon.stub(showHelper, '_updateEpisodes')
    stub.resolves()

    showHelper.addEpisodes(testShow, torrent, testShow.slug).then(res => {
      expect(true).to.be.true
      stub.restore()

      done()
    }).catch(done)
  })

  /** @test {ShowHelper#addEpisodes} */
  it('should throw an error when adding episodes', done => {
    const stub = sinon.stub(showHelper, '_addSeasonalSeason')
    stub.throws()

    showHelper.addEpisodes(testShow, torrent, testShow.slug).then(res => {
      expect(res).to.be.undefined
      stub.restore()

      done()
    }).catch(done)
  })

  /** @test {ShowHelper#_getTmdbImages} */
  it('should fail to get show images from TMDB', done => {
    const image = [{
      iso_639_1: null,
      file_path: null
    }]
    const stub = sinon.stub(tmdb.tv, 'images')
    stub.resolves({
      posters: image,
      backdrops: image
    })

    showHelper._getTmdbImages()
      .then(done)
      .catch(err => {
        expect(err).to.be.an('Error')
        stub.restore()

        done()
      })
  })

  /** @test {ShowHelper#_getTvdbImages} */
  it('should get show images from TVDB', done => {
    showHelper._getTvdbImages(296762)
      .then(res => abstractHelperTests.testImages(res, done))
      .catch(done)
  })

  /** @test {ShowHelper#_getTvdbImages} */
  it('should fail to get show images from TVDB', done => {
    const stub = sinon.stub(tvdb, 'getSeriesById')
    stub.resolves({
      banner: null
    })

    showHelper._getTvdbImages(296762)
      .then(done)
      .catch(err => {
        expect(err).to.be.an('Error')
        stub.restore()

        done()
      })
  })

  /** @test {ShowHelper#_getFanartImages} */
  it('should get show images from Fanart', done => {
    showHelper._getFanartImages(75682)
      .then(res => abstractHelperTests.testImages(res, done))
      .catch(done)
  })

  /** @test {ShowHelper#_getFanartImages} */
  it(`should fail to get show images from Fanart`, done => {
    abstractHelperTests.testGetFanartImages({
      clearart: [{
        url: 'url'
      }]
    }, 'show', fanart, showHelper, done)
  })

  /** @test {ShowHelper#_getFanartImages} */
  it(`should fail to get show images from Fanart`, done => {
    abstractHelperTests.testGetFanartImages(
      {}, 'show', fanart, showHelper, done
    )
  })

  /** @test {ShowHelper#getImages} */
  it('should get show images from various sources', done => {
    showHelper.getImages({
      tmdbId: 75682,
      tvdbId: 296762
    }).then(res => abstractHelperTests.testImages(res, done))
      .catch(done)
  })

  /** @test {ShowHelper#getTraktInfo} */
  it('should get info from Trakt and make a new show object', done => {
    showHelper.getTraktInfo('westworld').then(res => {
      expect(res).to.be.an('object')
      done()
    }).catch(done)
  })

  /** @test {ShowHelper#getTraktInfo} */
  it('should get info from Trakt and make a new show object with 0 watching', done => {
    const stub = sinon.stub(trakt.shows, 'watching')
    stub.resolves()

    showHelper.getTraktInfo('westworld').then(res => {
      expect(res).to.be.an('object')

      stub.restore()
      done()
    }).catch(done)
  })

  /** @test {ShowHelper#getTraktInfo} */
  it('should get info from Trakt and make a new shows object with no genres', done => {
    const stub = sinon.stub(trakt.shows, 'summary')
    stub.returns(Promise.resolve({
      ids: {
        imdb: 'imdb',
        tmdb: 'tmdb',
        tvdb: 'tvdb'
      },
      airs: {
        day: 'day',
        time: 'time'
      },
      released: '2016-01-01',
      genres: undefined
    }))

    showHelper.getTraktInfo('westworld').then(res => {
      expect(res).to.be.an('object')

      stub.restore()
      done()
    }).catch(done)
  })

  /** @test {ShowHelper#getTraktInfo} */
  it('should not get info from Trakt', done => {
    const stub = sinon.stub(trakt.shows, 'summary')
    stub.throws()

    showHelper.getTraktInfo('westworld').then(res => {
      expect(res).to.be.undefined

      stub.restore()
      done()
    }).catch(done)
  })

  /** @test {ShowHelper#getTraktInfo} */
  it('should not get info from Trakt', done => {
    const stub = sinon.stub(trakt.shows, 'summary')
    stub.resolves({
      ids: {
        imdb: null
      }
    })

    showHelper.getTraktInfo('westworld').then(res => {
      expect(res).to.be.undefined

      stub.restore()
      done()
    }).catch(done)
  })

  /** @test {ShowHelper#getTraktInfo} */
  it('should not get info from Trakt', done => {
    const stub = sinon.stub(trakt.shows, 'summary')
    stub.resolves(null)

    showHelper.getTraktInfo('westworld').then(res => {
      expect(res).to.be.undefined

      stub.restore()
      done()
    }).catch(done)
  })

  /**
   * Hook for tearing down the ShowHelper tests.
   * @type {Function}
   */
  after(done => {
    database.disconnect()
      .then(() => done())
      .catch(done)
  })
})
