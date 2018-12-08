// Import the necessary modules.
// @flow
import 'dotenv/config'
import { isMaster } from 'cluster'
import { join } from 'path'
import {
  Database,
  HttpServer,
  Logger,
  Routes,
  PopApi
} from 'pop-api'
import {
  Cron,
  PopApiScraper
} from 'pop-api-scraper'

import controllers from './controllers'
import providers from './scraper'
import { Cli } from './middleware'
import {
  name,
  version
} from '../package.json'

/** Setup the api. */
(async () => {
  try {
    providers.map(p => {
      const { Provider, args } = p
      PopApiScraper.use(Provider, args)
    })

    process.env.TEMP_DIR = process.env.TEMP_DIR || join(...[
      __dirname,
      '..',
      'tmp'
    ])
    const logDir = process.env.TEMP_DIR
    await PopApi.init({
      name,
      version,
      logDir,
      controllers,
      statusPath: join(...[logDir, 'status.json']),
      updatedPath: join(...[logDir, 'updated.json'])
    }, [
      Cli,
      Logger,
      Database,
      Routes,
      HttpServer,
      PopApiScraper,
      Cron
    ])

    // TODO: make scraping start wth 'start' param in 'init'.
    if (isMaster && PopApi.startScraper) {
      PopApi.scraper.scrape()
    }
  } catch (err) {
    throw err
  }
})()
