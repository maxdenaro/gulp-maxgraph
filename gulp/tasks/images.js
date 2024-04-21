import gulpif from 'gulp-if';
import imagemin, { gifsicle, mozjpeg, optipng, svgo } from 'gulp-imagemin';
import newer from "gulp-newer";

export const images = () => {
  return app.gulp.src([`${app.paths.srcImgFolder}/**/**.{jpg,jpeg,png,svg}`], { encoding: false })
    // .pipe(newer(app.paths.buildImgFolder))
    // .pipe(gulpif(app.isProd, imagemin([
    //   gifsicle({ interlaced: true }),
    //   mozjpeg({ quality: 75, progressive: true }),
    //   optipng({ optimizationLevel: 2 }),
    // ])))
    .pipe(app.gulp.dest(app.paths.buildImgFolder))
};
