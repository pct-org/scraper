// Import the necessary modules.
// @flow
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import express, { type $Application } from 'express'
import request from 'supertest'
import sinon from 'sinon'
import {
  ContentService,
  Database,
  PopApi
} from 'pop-api'
import type { MongooseModel } from 'mongoose'

import ContentController from '../../src/controllers/ContentController'
import testAnime from '../data/animeshow'
import testMovie from '../data/movie'
import testShow from '../data/show'
import {
  AnimeShow as Anime,
  Movie,
  Show
} from '../../src/models'
import { name } from '../../package.json'

/**
  * Test suite for fetching content from the database.
  * @param {!string} content - The content to test.
  * @param {!Model} Model - The model object of the content to fetch.
  * @param {!Object} testContent - The test content to test with.
  * @returns {undefined}
  */
function testContentController(
  content: string,
  Model: MongooseModel,
  testContent: Object
): void {
  /** @test {ContentController} */
  describe('ContentController', () => {
    /**
     * The express instance to test with.
     * @type {Express}
     */
    let app: $Application

    /**
      * The base content controller object to test.
      * @type {ContentController}
      */
    let contentController: ContentController

    /**
      * The id of the content to get.
      * @type {string}
      */
    let id: string

    /**
     * The database middleware from `pop-api`.
     * @type {Database}
     */
    let database: Database

    /**
     * The content service for the controller.
     * @type {ContentService}
     */
    let service: ContentService

    /**
      * Hook for setting up the Controller tests.
      * @type {Function}
      */
    before(done => {
      app = express()

      service = new ContentService({
        Model,
        projection: {
          imdb_id: 1
        }
      })
      contentController = new ContentController({
        basePath: content,
        service
      })
      contentController.registerRoutes(app)

      database = new Database(PopApi, {
        database: name
      })
      database.connect()
        .then(() => done())
        .catch(done)
    })

    /** @test {ContentController#constructor} */
    it('should check the attributes of the ContentController', () => {
      expect(contentController.basePath).to.be.a('string')
      expect(contentController.basePath).to.equal(content)
      expect(contentController.service).to.be.an('object')
      expect(contentController.service).to.equal(service)
    })

    /** @test {ContentController#registerRoutes} */
    it('should not throw an error when calling the implemented registerRoutes method', () => {
      expect(contentController.registerRoutes)
        .to.not.throw('Using default method: \'registerRoutes\'')
    })

    /** @test {ContentController} */
    describe('with an empty database', () => {
      /**
        * Hook for setting up the AudioController tests.
        * @type {Function}
        */
      before(done => {
        Model.remove({})
          .then(() => done())
          .catch(done)
      })

      /** @test {ContentController#getContents} */
      it(`should get a 204 status from the GET [/${content}s] route`, done => {
        request(app).get(`/${content}s`)
          .expect(204)
          .then(() => done())
          .catch(done)
      })

      /** @test {ContentController#getPage} */
      it(`should get a 204 status from the GET [/${content}s/:page] route`, done => {
        request(app).get(`/${content}s/1`)
          .expect(204)
          .then(() => done())
          .catch(done)
      })

      /** @test {ContentController#getContent} */
      it(`should get a 204 status from the GET [/${content}/:id] route`, done => {
        request(app).get(`/${content}/${id}`)
          .expect(204)
          .then(() => done())
          .catch(done)
      })

      /** @test {ContentController#getRandomContent} */
      it(`should get a 204 status from the GET [/random/${content}] route`, done => {
        request(app).get(`/random/${content}`)
          .expect(204)
          .then(() => done())
          .catch(done)
      })
    })

    /** @test {ContentController} */
    describe('with a filled database', () => {
      /**
        * The query object passed along to the 'getAudios' tests.
        * @type {[type]}
        */
      let query: Object

      /**
        * Hook for setting up the AudioController tests.
        * @type {Function}
        */
      before(done => {
        query = {
          keywords: 'String',
          genre: 'all',
          order: -1
        }

        new Model(testContent).save()
          .then(() => done())
          .catch(done)
      })

      /** @test {ContentController#getContents} */
      it(`should get a 200 status from the GET [/${content}] route`, done => {
        request(app).get(`/${content}s`)
          .expect(200)
          .then(() => done())
          .catch(done)
      })

      /** @test {ContentController#getPage} */
      it(`should get a 200 status from the GET [/${content}s/:page] route`, done => {
        request(app).get(`/${content}s/1`).query({
          genre: 'sci-fi'
        }).expect(200)
          .then(res => {
            const random = Math.floor(Math.random() * res.body.length)
            id = res.body[random].imdb_id

            done()
          }).catch(done)
      })

      /**
       * Helper function to test the `/contents/:page` route.
       * @param {!string} sort - The sorting method to use.
       * @returns {undefined}
       */
      function testGetPage(sort: string): void {
        /** @test {ContentController#getPage} */
        it(`should get a 200 status from the GET [/${content}s/:page] route`, done => {
          request(app).get(`/${content}s/1`).query({
            ...query,
            genre: 'string',
            sort
          }).expect(200)
            .then(() => done())
            .catch(done)
        })
      }

      // Execute the tests.
      [
        'faulty',
        'name',
        'rating',
        'released',
        'trending',
        'year'
      ].map(testGetPage)

      /** @test {ContentController#getContent} */
      it(`should get a 200 status from the GET [/${content}/:id] route`, done => {
        request(app).get(`/${content}/${id}`)
          .expect(200)
          .then(() => done())
          .catch(done)
      })

      /** @test {ContentController#getRandomContent} */
      it(`should get a 200 status from the GET [/random/${content}] route`, done => {
        request(app).get(`/random/${content}`)
          .expect(200)
          .then(() => done())
          .catch(done)
      })
    })

    /** @test {ContentController} */
    describe('will throw errors', () => {
      /** @test {ContentController#getContents} */
      it(`should get a 500 status from the GET [/${content}s] route`, done => {
        const stub = sinon.stub(Model, 'count')
        stub.rejects()

        request(app).get(`/${content}s`)
          .expect(500)
          .then(() => {
            stub.restore()
            done()
          })
          .catch(done)
      })

      /** @test {ContentController#getPage} */
      it(`should get a 500 status from the GET [/${content}s/:page] route`, done => {
        const stub = sinon.stub(Model, 'aggregate')
        stub.rejects()

        request(app).get(`/${content}s/1`)
          .expect(500)
          .then(() => {
            stub.restore()
            done()
          })
          .catch(done)
      })

      /** @test {ContentController#getContent} */
      it(`should get a 500 status from the GET [/${content}/:id] route`, done => {
        const stub = sinon.stub(Model, 'findOne')
        stub.rejects()

        request(app).get(`/${content}/${id}`)
          .expect(500)
          .then(() => {
            stub.restore()
            done()
          })
          .catch(done)
      })

      /** @test {ContentController#getRandomContent} */
      it(`should get a 500 status from the GET [/random/${content}] route`, done => {
        const stub = sinon.stub(Model, 'aggregate')
        stub.rejects()

        request(app).get(`/random/${content}`)
          .expect(500)
          .then(() => {
            stub.restore()
            done()
          })
          .catch(done)
      })
    })

    /**
      * Hook for tearing down the AudioController tests.
      * @type {Function}
      */
    after(done => {
      Model.findOneAndRemove({
        _id: testContent.id
      }).exec()
        .then(() => database.disconnect())
        .then(() => done())
        .catch(done)
    })
  })
}

const itemTypes = [
  ['anime', Anime, testAnime],
  ['movie', Movie, testMovie],
  ['show', Show, testShow]
]
itemTypes.map(i => testContentController(...i))
