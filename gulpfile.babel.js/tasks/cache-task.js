import { dest, src } from 'gulp';
import rev from 'gulp-rev';
import revDel from 'gulp-rev-delete-original';
import paths from '../config/paths';

const cacheTask = () => src(`${paths.buildFolder}/**/*.{css,js,svg,png,jpg,jpeg,webp,avif,woff2}`, {
    base: paths.buildFolder
  })
    .pipe(rev())
    .pipe(revDel())
    .pipe(dest(paths.buildFolder))
    .pipe(rev.manifest('rev.json'))
    .pipe(dest(paths.buildFolder));

export default cacheTask;
