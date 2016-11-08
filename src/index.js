'use strict';

// Module imports.
const holograph = require('holograph');
const configParser = require('./configParser');
const PluginError = require('gulp-util').PluginError;
const through = require('through2');

// General constants.
const PLUGIN_NAME = 'gulp-holograph';

/**
 * Run Hologram when given a buffer.
 *
 * @param {Object} file A Vinyl file.
 * @param {String} encoding The file encoding.
 * @param {Function} cb Called after hologram has run.
 * @returns {Function} Executed callback.
 */
function handleBuffer (file, encoding, cb) {
  const config = configParser(String(file.contents));
  holograph.holograph(config);
  return cb(null, file);
}

/**
 * Run Hologram when given a stream.
 *
 * @param {Object} file A Vinyl file.
 * @param {String} encoding The file encoding.
 * @param {Function} cb Called after hologram has run.
 * @returns {Function} Executed callback.
 */
function handleStream (file, encoding, cb) {

  let config = '';

  file.contents.on('data', chunk => {
    config += chunk;
  });

  file.contents.on('end', () => {
    config = configParser(config);
    holograph.holograph(config);
    return cb(null, file);
  });

}

/**
 * The actual plugin. Runs Holograph with a provided config file.
 *
 * @returns {Object} A through2 stream.
 */
function gulpHolograph () {

  return through.obj(function (file, encoding, cb) {

    // Handle any non-supported types.
    // This covers directories and symlinks as well, as they have to be null.
    if (file.isNull()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'No file contents.'));
    }

    // Handle buffers.
    if (file.isBuffer()) {
      handleBuffer(file, encoding, cb);
    }

    // Handle streams.
    if (file.isStream()) {
      handleStream(file, encoding, cb);
    }

  });

}

module.exports = gulpHolograph;