import gulpif from 'gulp-if';
import browserSync from 'browser-sync';
import cleanCSS from 'gulp-clean-css';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import plumber from 'gulp-plumber';
import autoprefixer from 'gulp-autoprefixer';
import notify from 'gulp-notify';

const sass = gulpSass(dartSass);

export const styles = () => {
  return app.gulp.src(app.paths.srcScss, { sourcemaps: !app.isProd })
    .pipe(plumber(
      notify.onError({
        title: "SCSS",
        message: "Error: <%= error.message %>"
      })
    ))
    .pipe(sass())
    .pipe(autoprefixer({
      cascade: false,
      grid: true,
      overrideBrowserslist: ["last 5 versions"]
    }))
    .pipe(gulpif(app.isProd, cleanCSS({
      level: 2
    })))
    .pipe(app.gulp.dest(app.paths.buildCssFolder, { sourcemaps: '.' }))
    .pipe(browserSync.stream());
};
