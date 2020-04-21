// @flow
import 'dotenv/config'
import { join } from 'path'
import { Database, HttpServer, Logger, Routes, PopApi } from '@pct-org/pop-api'
import { Cron, PopApiScraper } from '@pct-org/pop-api-scraper'

import controllers from './controllers'
import providers from './scraper'
import { Cli } from './middleware'

import { name, version } from '../package.json'

/** Setup the api. */
(async() => {
  try {
    providers.map((prov) => {
      const { Provider, args } = prov

      PopApiScraper.use(Provider, args)
    })

    process.env.TEMP_DIR = process.env.TEMP_DIR || join(...[
      __dirname,
      '..',
      'tmp',
    ])
    const logDir = process.env.TEMP_DIR

    await PopApi.init({
      name,
      version,
      logDir,
      controllers,
      workers: 0,
      statusPath: join(...[logDir, 'status.json']),
      updatedPath: join(...[logDir, 'updated.json']),

      dbName: process.env.MONGO_DATABASE,

      // This starts the scraping on the master node and sets up the cron
      // start: isMaster
    }, [
      Cli,
      Logger,
      Database,
      Routes,
      HttpServer,
      PopApiScraper,
    ])

    // Add the cron and enabled it if the scraper should start
    await PopApi.use(Cron, {
      start: PopApi.startScraper,
      schedule: true,
      cronTime: process.env.CRON_TIME,
    })

  } catch (err) {
    throw err
  }
})()
