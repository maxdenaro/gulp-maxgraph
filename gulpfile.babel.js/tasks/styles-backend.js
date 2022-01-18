import { dest, src } from 'gulp';
import sass from 'sass';
import gulpSass from 'gulp-sass';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import autoprefixer from 'gulp-autoprefixer';
import browserSync from 'browser-sync';
import paths from '../config/paths';

const mainSass = gulpSass(sass);

// styles backend
const stylesBackend = () => src(paths.srcScss)
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
    .pipe(dest(paths.buildCssFolder))
    .pipe(browserSync.stream());

export default stylesBackend;
