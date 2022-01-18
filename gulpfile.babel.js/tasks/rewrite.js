import { readFileSync } from 'fs';
import { dest, src } from 'gulp';
import revRewrite from 'gulp-rev-rewrite';
import paths from '../config/paths';

const rewrite = () => {
  const manifest = readFileSync('app/rev.json');
  src(`${paths.buildCssFolder}/*.css`)
    .pipe(revRewrite({
      manifest
    }))
    .pipe(dest(paths.buildCssFolder));
  return src(`${paths.buildFolder}/**/*.html`)
    .pipe(revRewrite({
      manifest
    }))
    .pipe(dest(paths.buildFolder));
};

export default rewrite;
