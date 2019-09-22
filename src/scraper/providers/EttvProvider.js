// @flow
import pMap from 'p-map'

import BaseProvider from './BaseProvider'

/**
 * Class for scraping content from Ettv
 * @extends {BaseProvider}
 * @type {EttvProvider}
 */
export default class EttvProvider extends BaseProvider {

  /**
   * Get the contents for a configuration.
   * @param {!Object} config - The config to get content with.
   * @param {!string} config.name - The name of the config.
   * @param {!Object} config.api - The API module ot get the content with.
   * @param {!string} config.contentType - The type of content to scrape.
   * @param {!MongooseModel} config.Model - The model for the content to
   * scrape.
   * @param {!IHelper} config.Helper - The helper class to save the content to
   * the database.
   * @returns {Promise<Array<Object>, Error>} - The results of a configuration.
   */
  scrapeConfig({
    name,
    api,
    contentType,
    Model,
    Helper,
  }: Object): Promise<Array<Object>> {
    this.setConfig({ name, api, contentType, Model, Helper })

    logger.info(`${this.name}: Started scraping...`)
    return this.api.getDaily(['Movies']).then((contents) => {

      console.log('contents.length),', contents.length)

      logger.info(`${this.name}: Found ${contents.length} ${this.contentType}s.`)

      return pMap(contents, async c => {
        if (c.title.toUpperCase().indexOf('UHD') > -1) {
          console.log('\n\n', c)
        }

      }, {
        concurrency: this.maxWebRequests,
      })
    }).catch((err) => {
      logger.error(`Catch EttvProvider.scrapeConfig: ${err.message || err}`)
    })
  }

}
