// Module imports.
const yaml = require('js-yaml');
const extend = require('extend');

// Other constants.
const defaultConfig = {
  index_title: 'Home'
};


/**
 * Read a YAML string and merge it with default Holograph configuration.
 *
 * @param {string} config YAML configuration for Holograph.
 *
 * @returns {object} A merged object containing default config merged with provided config.
 */
module.exports = config => {
  return extend(defaultConfig, yaml.safeLoad(config));
};