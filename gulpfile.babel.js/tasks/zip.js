import { dest, src } from 'gulp';
import { basename } from 'path';
import del from 'del';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import zip from 'gulp-zip';
import paths from '../config/paths';

const zipFiles = (_done) => {
  del.sync([`${paths.buildFolder}/*.zip`]);
  return src(`${paths.buildFolder}/**/*.*`, {})
    .pipe(plumber(
      notify.onError({
        title: 'ZIP',
        message: 'Error: <%= error.message %>'
      })
    ))
    .pipe(zip(`${basename(paths.rootPath)}.zip`))
    .pipe(dest(paths.buildFolder));
};

export default zipFiles;
