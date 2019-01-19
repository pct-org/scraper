// Import the necessary modules.
// @flow
import { Model } from 'mongoose'

/**
 * Class for provider configuration attributes and methods.
 * @extends {Model}
 * @type {ProviderConfigModel}
 */
export default class ProviderConfigModel extends Model {

  /**
   * The id of the provider configuration.
   * @type {string}
   */
  _id: string

  /**
   * The API of the provider configuration.
   * @type {string}
   */
  api: string

  /**
   * The modelType of the provider configuration.
   * @type {string}
   */
  modelType: string

  /**
   * The name of the provider configuration.
   * @type {string}
   */
  name: string

  /**
   * The type of the provider configuration.
   * @type {string}
   */
  type: string

  /**
   * The clazz of the provider configuration.
   * @type {string}
   */
  clazz: string

  /**
   * The query of the provider configuration.
   * @type {Object}
   */
  query: Object

  /**
   * Create a new ProviderConfig object.
   * @param {!Object} config - The configuration object for the content.
   * @param {!string} api - The API of the provider configuration.
   * @param {!string} modelType - The modelType of the provider configuration.
   * @param {!string} name - The name of the provider configuration.
   * @param {!string} type - The type of the provider configuration.
   * @param {!string} clazz - The clazz of the provider configuration.
   * @param {?Object} query - The query of the provider configuration.
   */
  constructor({ api, modelType, name, type, clazz, query }: Object = {}): void {
    super()

    /**
     * The id of the provider configuration.
     * @type {string}
     */
    this._id = name
    /**
     * The API of the provider configuration.
     * @type {string}
     */
    this.api = api
    /**
     * The modelType of the provider configuration.
     * @type {string}
     */
    this.modelType = modelType
    /**
     * The name of the provider configuration.
     * @type {string}
     */
    this.name = name
    /**
     * The type of the provider configuration.
     * @type {string}
     */
    this.type = type
    /**
     * The clazz of the provider configuration.
     * @type {string}
     */
    this.clazz = clazz
    /**
     * The query of the provider configuration.
     * @type {Object}
     */
    this.query = query
  }

  /**
   * Getter for the id of the provider configuration.
   * @return {string} - The id of the provider configuration.
   */
  get id(): string {
    return this._id
  }

}
