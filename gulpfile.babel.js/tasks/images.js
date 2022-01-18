import { dest, src } from 'gulp';
import gulpif from 'gulp-if';
import image from 'gulp-imagemin';
import webp from 'gulp-webp';
import avif from 'gulp-avif';
import paths from '../config/paths';

export const images = () => src([`${paths.srcImgFolder}/**/**.{jpg,jpeg,png,svg}`])
    .pipe(gulpif(app.isProd, image([
      image.mozjpeg({
        quality: 80,
        progressive: true
      }),
      image.optipng({
        optimizationLevel: 2
      }),
    ])))
    .pipe(dest(paths.buildImgFolder));

export const webpImages = () => src([`${paths.srcImgFolder}/**/**.{jpg,jpeg,png}`])
    .pipe(webp())
    .pipe(dest(paths.buildImgFolder));

export const avifImages = () => src([`${paths.srcImgFolder}/**/**.{jpg,jpeg,png}`])
    .pipe(avif())
    .pipe(dest(paths.buildImgFolder));
