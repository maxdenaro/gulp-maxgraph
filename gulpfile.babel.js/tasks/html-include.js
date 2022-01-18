import { dest, src } from 'gulp';
import fileInclude from 'gulp-file-include';
import typograf from 'gulp-typograf';
import browserSync from 'browser-sync';
import htmlmin from 'gulp-htmlmin';
import gulpif from 'gulp-if';
import paths from '../config/paths';

const htmlInclude = () => src([`${paths.srcFolder}/*.html`])
    .pipe(fileInclude({
      prefix: '@',
      basepath: '@file'
    }))
    .pipe(typograf({
      locale: ['ru', 'en-US']
    }))
    .pipe(gulpif(app.isProd, htmlmin({
      collapseWhitespace: true
    })))
    .pipe(dest(paths.buildFolder))
    .pipe(browserSync.stream());

export default htmlInclude;
