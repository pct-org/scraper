// Import the necessary modules.
// @flow
/* eslint-disable no-unused-expressions */
import sinon from 'sinon'
import { expect } from 'chai'
import {
  Database,
  PopApi
} from 'pop-api'
import { PopApiScraper } from 'pop-api-scraper'

import KatTvProvider from '../../../src/scraper/providers/ShowProvider'
import showMap from '../../../src/scraper/providers/maps/showMap'
import { logger } from '..'
import { nyaaCommieConfig } from '../../../src/scraper/configs/showConfigs'
import { name } from '../../../package.json'

/** @test {ShowProvider} */
describe('ShowProvider', () => {
  /**
   * The show provider to test.
   * @type {KatTvProvider}
   */
  let showProvider: KatTvProvider

  /**
   * The database middleware from 'pop-api'.
   * @type {Database}
   */
  let database: Database

  /**
   * Hook for setting up the ShowProvider tests.
   * @type {Function}
   */
  before(done => {
    if (!global.logger) {
      global.logger = logger
    }

    showProvider = new KatTvProvider(PopApiScraper, {
      configs: [nyaaCommieConfig]
    })
    showProvider.setConfig(nyaaCommieConfig)

    database = new Database(PopApi, {
      database: name
    })
    database.connect()
      .then(() => done())
      .catch(done)
  })

  /**
   * Test the attributes of an object returned by the `_extractContent method.
   * @param {!Object|undefined} content - The content object to test.
   * @param {!string} type - The type of the season and episode.
   * @returns {void}
   */
  function testContentAttributes(content: Object | void, type: string): void {
    if (content) {
      expect(content).to.be.an('object')
      expect(content.showTitle).to.be.a('string')
      expect(content.slug).to.be.a('string')
      expect(content.season).to.be.a(type)
      expect(content.episode).to.be.a(type)
      expect(content.quality).to.be.a('string')
      expect(content.dateBased).to.be.a('boolean')
      expect(content.episodes).to.be.an('object')
      expect(content.type).to.be.a('string')
    } else {
      expect(true).to.be.false
    }
  }

  /** @test {ShowProvider#extractContent} */
  it('should extract show information based on a seasonal regex', () => {
    showMap.testworld = 'westworld'
    const content = showProvider.extractContent({
      torrent: {
        title: 'Testworld S01E06 720p HDTV x264-FLEET [eztv]',
        seeds: 1,
        peers: 1
      },
      regex: {
        regex: /(.*).[sS](\d{2})[eE](\d{2})/i,
        dateBased: false
      }
    })

    testContentAttributes(content, 'string')
  })

  /** @test {ShowProvider#extractContent} */
  it('should extract show information based on a datebased regex', () => {
    const content = showProvider.extractContent({
      torrent: {
        title: 'Jimmy Fallon 2017 10 10 Mandy Moore 720p HDTV x264-CROOKS [eztv]',
        seeds: 1,
        peers: 1
      },
      regex: {
        regex: /(.*).(\d{4}).(\d{2}.\d{2})/i,
        dateBased: true
      }
    })

    testContentAttributes(content, 'number')
  })

  /** @test {ShowProvider#extractContent} */
  it('should not extract show information based on a regex', () => {
    const content = showProvider.extractContent({
      torrent: {
        title: 'faulty'
      },
      regex: {
        regex: /(.*).[sS](\d{2})[eE](\d{2})/i
      }
    })

    expect(content).to.be.undefined
  })

  /** @test {ShowProvider#attachTorrent} */
  it('should create a new show object with a torrent attached', () => {
    let show = showProvider.attachTorrent({
      show: {
        showTitle: 'repack',
        episodes: {}
      },
      torrent: {
        seeds: 2
      },
      season: 1,
      episode: 1,
      quality: '480p'
    })
    expect(show).to.be.an('object')

    show.showTitle = 'test'
    show = showProvider.attachTorrent({
      show,
      torrent: {
        seeds: 1
      },
      season: 1,
      episode: 1,
      quality: '480p'
    })
    expect(show).to.be.an('object')
  })

  /** @test {ShowProvider#getAllContent} */
  it('should get no content from an empty torrents array', done => {
    showProvider.getAllContent({
      torrents: [null]
    }).then(res => {
      expect(res).to.be.an('array')
      expect(res.length).to.equal(0)

      done()
    }).catch(done)
  })

  /** @test {ShowProvider#getAllContent} */
  it('should get no content from a filled torrents array', done => {
    showProvider.getAllContent({
      torrents: [{
        title: 'faulty'
      }]
    }).then(res => {
      expect(res).to.be.an('array')
      expect(res.length).to.equal(0)

      done()
    }).catch(done)
  })

  /** @test {ShowProvider#getAllContent} */
  it('should merge the torrent objects into one', done => {
    showProvider.getAllContent({
      torrents: [{
        title: 'Westworld S01E06 720p HDTV x264-FLEET [eztv]'
      }, {
        title: 'Westworld S01E07 720p HDTV x264-FLEET [eztv]'
      }]
    }).then(res => {
      expect(res).to.be.an('array')
      expect(res.length).to.equal(1)

      done()
    }).catch(done)
  })

  /** @test {ShowProvider#scrapeConfig} */
  it('should return a list of all the inserted torrents', done => {
    const stub = sinon.stub(showProvider, 'getTotalPages')
    stub.resolves(1)

    showProvider.scrapeConfig(nyaaCommieConfig).then(res => {
      if (res) {
        expect(res).to.be.an('array')
        expect(res.length).to.be.at.least(1)
      } else {
        expect(true).to.be.false
      }

      stub.restore()
      done()
    }).catch(done)
  })

  /**
   * Hook for tearing down the ShowProvider tests.
   * @type {Function}
   */
  after(done => {
    database.disconnect()
      .then(() => done())
      .catch(done)
  })
})
