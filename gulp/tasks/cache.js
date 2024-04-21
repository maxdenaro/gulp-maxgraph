import rev from "gulp-rev";
import revDel from "gulp-rev-delete-original";

export const cacheTask = () => {
  return app.gulp.src(`${app.paths.base.build}/**/*.{css,js,svg,png,jpg,jpeg,webp,woff2}`, {
      base: app.paths.base.build,
      encoding: false,
    })
    .pipe(rev())
    .pipe(revDel())
    .pipe(app.gulp.dest(app.paths.base.build))
    .pipe(rev.manifest('rev.json'))
    .pipe(app.gulp.dest(app.paths.base.build));
};
