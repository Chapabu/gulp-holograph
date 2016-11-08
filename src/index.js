'use strict';

const holograph = require('holograph');
const Transform = require('readable-stream/transform');
const configParser = require('./configParser');
const PluginError = require('gulp-util').PluginError;

const PLUGIN_NAME = 'gulp-hologram';

module.exports = () => {


  return new Transform({
      objectMode: true,
      transform: (file, encoding, cb) => {

        // If our file has no contents, then just return the callback.
        if (file.isNull()) {
          throw new PluginError('gulp-holograph', 'No file contents.');
        }

        // Handle buffers.
        if (file.isBuffer()) {

          const config = configParser(String(file.contents));
          holograph.holograph(config);
          return cb(null, file);
        }

        // Handle streams.
        if (file.isStream()) {

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

      }

    });

};
