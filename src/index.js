'use strict';

// Module imports.
const holograph = require('holograph');
const configParser = require('./configParser');
const PluginError = require('gulp-util').PluginError;
const through = require('through2');

// General constants.
const PLUGIN_NAME = 'gulp-holograph';

const handleBuffer = function (file, encoding, callback) {
  const config = configParser(String(file.contents));
  holograph.holograph(config);
  return callback(null, file);
};

const handleStream = function (file, encoding, callback) {

  let config = '';

  file.contents.on('data', chunk => {
    config += chunk;
  });

  file.contents.on('end', () => {
    config = configParser(config);
    holograph.holograph(config);
    return callback(null, file);
  });

};

const gulpHolograph = () => {

  return through.obj(function (file, encoding, callback) {

    // If our file has no contents, then just return the callback.
    if (file.isNull()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'No file contents.'));
    }

    // Handle buffers.
    if (file.isBuffer()) {
      handleBuffer(file, encoding, callback);
    }

    // Handle streams.
    if (file.isStream()) {
      handleStream(file, encoding, callback);
    }

  });

};

module.exports = gulpHolograph;