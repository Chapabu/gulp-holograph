'use strict';

// Module imports.
const expect = require('chai').expect;
const holographPlugin = require('../src');
const File = require('vinyl');
const fs = require('fs');
const sinon = require('sinon');
const holograph = require('holograph');

describe('gulp-holograph', function () {

  describe('supported input', function () {

    let holographInit;

    beforeEach(function () {
      holographInit = sinon.stub(holograph, 'holograph');
    });

    afterEach(function () {
      holographInit.restore();
    });

    describe('streamed input', function () {

      it('triggers Holograph when given a stream', function (done) {

        let file = new File({
          path: 'test/fixtures/holograph_config.yml',
          cwd: 'test/',
          base: 'test/fixtures',
          contents: fs.createReadStream('test/fixtures/holograph_config.yml')
        });

        let stream = holographPlugin();

        stream.on('data', function () {
          const holographWasCalled = holographInit.called;
          expect(holographWasCalled).to.be.true;
          done();
        });

        stream.write(file);
        stream.end();

      });

    });

    describe('buffered input', function () {

      it('triggers Holograph when given a buffer', function (done) {

        let file = new File({
          path: 'test/fixtures/holograph_config.yml',
          cwd: 'test/',
          base: 'test/fixtures',
          contents: fs.readFileSync('test/fixtures/holograph_config.yml')
        });

        let stream = holographPlugin();

        stream.on('data', function () {
          const holographWasCalled = holographInit.called;
          expect(holographWasCalled).to.be.true;
          done();
        });

        stream.write(file);
        stream.end();

      });

    });

  });

  describe('unsupported input', function () {

    context('throws a PluginError when given...', function () {

      specify('null input/empty file', function (done) {

        const file = new File({
          path: 'test/fixtures/holograph_config.yml',
          cwd: 'test/',
          base: 'test/fixtures',
        });

        let stream = holographPlugin();

        stream.on('error', function (error) {
          const errorType = error.constructor.name;
          expect(errorType).to.equal('PluginError');
          done();
        });

        stream.write(file);
        stream.end();

      });

      specify('a directory', function (done) {

        const file = new File({
          path: 'test/fixtures/holograph_config.yml',
          cwd: 'test/',
          base: 'test/fixtures',
          stat: {
            isDirectory: () => {
              return true;
            }
          }
        });

        let stream = holographPlugin();

        stream.on('error', function (error) {
          const errorType = error.constructor.name;
          expect(errorType).to.equal('PluginError');
          done();
        });

        stream.write(file);
        stream.end();

      });

      specify('a symlink', function (done) {

        const file = new File({
          path: 'test/fixtures/holograph_config.yml',
          cwd: 'test/',
          base: 'test/fixtures',
          stat: {
            isSymbolicLink: () => {
              return true;
            }
          }
        });

        let stream = holographPlugin();

        stream.on('error', function (error) {
          const errorType = error.constructor.name;
          expect(errorType).to.equal('PluginError');
          done();
        });

        stream.write(file);
        stream.end();

      });

    });

  });

});