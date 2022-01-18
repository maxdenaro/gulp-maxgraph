import { dest, src } from 'gulp';
import sass from 'sass';
import gulpSass from 'gulp-sass';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import autoprefixer from 'gulp-autoprefixer';
import browserSync from 'browser-sync';
import gulpif from 'gulp-if';
import cleanCSS from 'gulp-clean-css';
import paths from '../config/paths';

const mainSass = gulpSass(sass);

// scss styles
const styles = () => src(paths.srcScss, { sourcemaps: app.isDev })
    .pipe(plumber(
      notify.onError({
        title: 'SCSS',
        message: 'Error: <%= error.message %>'
      })
    ))
    .pipe(mainSass())
    .pipe(autoprefixer({
      cascade: false,
      grid: true,
    }))
    .pipe(gulpif(app.isProd, cleanCSS({
      level: 2
    })))
    .pipe(dest(paths.buildCssFolder, { sourcemaps: '.' }))
    .pipe(browserSync.stream());

export default styles;
