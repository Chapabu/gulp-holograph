// SUT import.
const configParser = require('../src/configParser');

// Module imports.
const fs = require('fs');
const chai = require('chai');
const chaiDeepMatch = require('chai-deep-match');

// Chai setup.
const expect = chai.expect;
chai.use( chaiDeepMatch );

describe('configParser', () => {

  const configFixture = fs.readFileSync('test/fixtures/holograph_config.yml');

  it('gets config from a config string', () => {

    const config = configParser(configFixture);

    const expectation = {
      source: './scss',
      destination: './holograph',
      documentation_assets: './node_modules/holograph/assets',
      dependencies: ['css'],
      css_include: ['css/example.css'],
      index: 'basics',
      exit_on_warnings: false,
      global_title: 'Holograph stylesheet',
    };

    expect(config).to.deep.match(expectation);

  });


  it('merges default Holograph config', () => {

    const config = configParser(configFixture);

    expect(config).to.have.property('index_title');

  });

});