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

import EztvProvider from '../../../src/scraper/providers/BulkProvider'
import { eztvConfig } from '../../../src/scraper/configs/bulkConfigs'
import { logger } from '..'
import { name } from '../../../package.json'

/** @test {BulkProvider} */
describe('BulkProvider', () => {
  /**
   * The bulk provider to test.
   * @type {EztvProvider}
   */
  let bulkProvider: EztvProvider

  /**
   * The database middleware from 'pop-api'.
   * @type {Database}
   */
  let database: Database

  /**
   * Hook for setting up the BulkProvider tests.
   * @type {Function}
   */
  before(done => {
    if (!global.logger) {
      global.logger = logger
    }

    bulkProvider = new EztvProvider(PopApiScraper, {
      configs: [eztvConfig]
    })

    database = new Database(PopApi, {
      database: name
    })
    database.connect()
      .then(() => done())
      .catch(done)
  })

  /** @test {BulkProvider#scrapeConfig} */
  it('should return a list of all the inserted torrents', done => {
    bulkProvider.setConfig(eztvConfig)
    const stub = sinon.stub(bulkProvider.api, 'getAll')
    stub.resolves([{
      show: 'Westworld',
      id: 1913,
      slug: 'westworld'
    }])

    bulkProvider.scrapeConfig(eztvConfig).then(res => {
      expect(res).to.be.an('array')
      expect(res.length).to.be.at.least(1)

      stub.restore()
      done()
    }).catch(done)
  })

  /** @test {BulkProvider#scrapeConfig} */
  it('should throw and catch an error while scraping', done => {
    bulkProvider.setConfig(eztvConfig)
    const stub = sinon.stub(bulkProvider.api, 'getAll')
    stub.resolves([{}])

    bulkProvider.scrapeConfig(eztvConfig).then(res => {
      expect(res).to.be.an('array')
      expect(res[0]).to.be.undefined
      stub.restore()

      done()
    }).catch(done)
  })

  /**
   * Hook for tearing down the YtsProvider tests.
   * @type {Function}
   */
  after(done => {
    database.disconnect()
      .then(() => done())
      .catch(done)
  })
})
