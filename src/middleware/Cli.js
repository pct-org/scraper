/* eslint-disable no-console */
import path from 'path'
import { Cli as BaseCli, Database } from '@pct-org/pop-api'

/**
 * Class The class for the command line interface.
 * @type {Cli}
 */
export default class Cli extends BaseCli {

  /**
   * The command line parser to process the Cli inputs.
   * @type {Command}
   */
  // program: Object

  /**
   * The name of the Cli program.
   * @type {string}
   */
  // name: string

  /**
   * The verion of the Cli program.
   * @type {string}
   */
  // version: string

  /**
   * The name of the Cli provider. Default is `Cli`.
   * @type {string}
   */
  static _Name: string = 'Cli'

  /**
   * The database middleware from `pop-api`.
   * @type {Database}
   */
  database: Database

  /**
   * Create a CLI object.
   *
   * @param {!PopApi} PopApi - The PopApi instance to bind the cli to.
   * @param {!Object} options - The options for the cli.
   * @param {?Array<string>} options.argv - The arguments to be parsed by commander.
   * @param {!string} options.name - The name of the Cli program.
   * @param {!string} [options.version] - The version of the Cli program.
   */
  constructor(PopApi: any, { argv, name, version }: Object): void {
    super(PopApi, { name, version })

    /**
     * The database middleware from `pop-api`.
     * @type {Database}
     */
    this.database = PopApi.database

    this.run(PopApi, argv)
  }

  /**
   * Initiate the options for the Cli.
   * @param {!string} version - The version of the Cli program.
   * @returns {undefined}
   */
  initOptions(version: string): void {
    super.initOptions(version)

    return this.program
      .option('-s, --start', 'Start the scraping process')
      .option('--export <collection>',
        'Export a collection to a JSON file.',
        /^(anime|movie|show)$/i, false)
      .option('--import <collection>', 'Import a JSON file to the database.')
  }

  /**
   * Method for displaying the --help option
   * @returns {undefined}
   */
  getHelp(): void {
    const baseHelp = super.getHelp()
    return baseHelp.concat([
      `    $ ${this.name} --export <movie|show>`,
    ])
  }

  /**
   * Handle the --export CLI option.
   * @param {!string} e - The collection to export.
   * @returns {Promise<string, undefined>} - The promise to export a collection.
   */
  _export(e: string): Promise<string | void> {
    process.env.TEMP_DIR = process.env.TEMP_DIR || path.join(...[
      __dirname,
      '..',
      '..',
      'tmp',
    ])
    const tempDir = process.env.TEMP_DIR

    return this.database.exportFile(e, path.join(...[
      tempDir,
      `${e}s.json`,
    ]))
      .then(() => process.exit(0))
      .catch(err => {
        console.error(`An error occurred: ${err}`)
        return process.exit(1)
      })
  }

  /**
   * Run the Cli program.
   * @param {!PopApi} PopApi - The PopApi instance to bind the options to.
   * @param {?Array<string>} argv - The arguments to be parsed by commander.
   * @returns {undefined}
   */
  run(PopApi: any, argv?: Array<string>): any {
    if (argv) {
      this.program.parse(argv)
    }

    if (this.program.export) {
      return this._export(this.program.export)

    } else if (this.program.import) {
      return this._import(this.program.import)
    }

    if (this.program.start) {
      PopApi.startScraper = true
    }

    return super.run(PopApi)
  }

}
