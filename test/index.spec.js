// Module imports.
const chai = require('chai');
const holographPlugin = require('../src');
const File = require('vinyl');
const fs = require('fs');
const sinon = require('sinon');
const holograph = require('holograph');

// Chai setup,
const expect = chai.expect;

describe('gulp-holograph', function () {

  // Disable the timeout.
  this.timeout(0);

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