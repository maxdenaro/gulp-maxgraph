import { series, watch, parallel } from 'gulp';
import browserSync from 'browser-sync';
import paths from './config/paths';

import { images, webpImages, avifImages } from './tasks/images';
import {
  clean,
  resources,
  cacheTask,
  zip,
  svgSprites,
  rewrite,
  htmlInclude,
  styles,
  stylesBackend,
  scripts,
  scriptsBackend,
} from './tasks';

global.app = {
  isProd: process.argv.includes('--production'),
  isDev: !process.argv.includes('--production')
};

// Сервер
const server = () => {
  browserSync.init({
    server: {
      baseDir: paths.buildFolder
    },
    notify: false
  });
};

const watchFiles = () => {
  watch(paths.srcScss, styles);
  watch(paths.srcFullJs, scripts);
  watch(`${paths.srcPartialsFolder}/*.html`, htmlInclude);
  watch(`${paths.srcFolder}/*.html`, htmlInclude);
  watch(`${paths.resourcesFolder}/**`, resources);
  watch(`${paths.srcImgFolder}/**/**.{jpg,jpeg,png,svg}`, images);
  watch(`${paths.srcImgFolder}/**/**.{jpg,jpeg,png}`, webpImages);
  watch(`${paths.srcImgFolder}/**/**.{jpg,jpeg,png}`, avifImages);
  watch(paths.srcSvg, svgSprites);
};

const cache = series(cacheTask, rewrite);
const imagesTask = series(images, webpImages, avifImages);
const backend = series(
  clean, htmlInclude, scriptsBackend, stylesBackend, resources, imagesTask, svgSprites
);

const build = series(
  clean,
  parallel(htmlInclude, scripts, styles, resources, imagesTask, svgSprites),
);

const dev = series(
  build,
  parallel(watchFiles, server),
);

export {
  backend,
  cache,
  zip,
};

export default app.isProd ? build : dev;
