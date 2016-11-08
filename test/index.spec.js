// Module imports.
const expect = require('chai').expect;
const holographPlugin = require('../src');
const File = require('vinyl');
const fs = require('fs');
const sinon = require('sinon');
const holograph = require('holograph');
const PluginError = require('gulp-util').PluginError;

describe('gulp-holograph', function () {

  // Disable the timeout.
  this.timeout(0);

  describe('supported input', () => {

    let holographInit;

    beforeEach(() => {
      holographInit = sinon.stub(holograph, 'holograph');
    });

    afterEach(() => {
      holographInit.restore();
    });

    describe('streamed input', () => {

      it('triggers Holograph when given a stream', done => {

        let file = new File({
          path: 'test/fixtures/holograph_config.yml',
          cwd: 'test/',
          base: 'test/fixtures',
          contents: fs.createReadStream('test/fixtures/holograph_config.yml')
        });

        let stream = holographPlugin();

        stream.on('data', () => {
          const holographWasCalled = holographInit.called;
          expect(holographWasCalled).to.be.true;
          done();
        });

        stream.write(file);
        stream.end();

      });

    });

    describe('buffered input', () => {

      it('triggers Holograph when given a buffer', done => {

        let file = new File({
          path: 'test/fixtures/holograph_config.yml',
          cwd: 'test/',
          base: 'test/fixtures',
          contents: fs.readFileSync('test/fixtures/holograph_config.yml')
        });

        let stream = holographPlugin();

        stream.on('data', () => {
          const holographWasCalled = holographInit.called;
          expect(holographWasCalled).to.be.true;
          done();
        });

        stream.write(file);
        stream.end();

      });

    });

  });

  describe('unsupported input', () => {

    it('throws a PluginError when given null input', () => {

      const file = new File({
        path: 'test/fixtures/holograph_config.yml',
        cwd: 'test/',
        base: 'test/fixtures',
      });


    });

  });


});