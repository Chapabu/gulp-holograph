# gulp-hologram

[![Build Status](https://travis-ci.org/Chapabu/gulp-holograph.svg?branch=master)](https://travis-ci.org/Chapabu/gulp-holograph)

> Generate [Holograph][holograph] styleguides with [Gulp][gulp].

## Getting started

### Installation

```bash
npm install gulp-holograph
```

or

```bash
yarn add gulp-holograph
```

### Usage

Ensure you have a `holograph_config.yml` as per the [Holograph configuration][holograph-config], and then pipe it into
the `gulp-holograph` task.

```javascript
const holograph = require('gulp-holograph');

gulp.task('holograph', function () => {
  gulp.src('holograph_config.yml')
    .pipe(holograph());
});
```

[holograph]: https://www.npmjs.com/package/holograph
[gulp]: http://gulpjs.com/
[holograph-config]: https://github.com/holography/holograph#configuration
