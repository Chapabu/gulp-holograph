const holograph = require('holograph');
const Transform = require('readable-stream/transform');
const configParser = require('./configParser');

/**
 *
 *
 * @returns
 */
module.exports = () => {


  return new Transform({
      objectMode: true,
      transform: (file, encoding, cb) => {

        // If our file has no contents, then just return the callback.
        if (file.isNull()) {
          return cb(null, file);
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

          return cb(null, file);
        }
        // Merge any default configuration.

      }

    });

};
