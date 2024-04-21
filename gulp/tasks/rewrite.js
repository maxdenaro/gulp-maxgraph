import revRewrite from "gulp-rev-rewrite";
import { readFileSync } from "fs";

export const rewrite = () => {
  const manifest = readFileSync('app/rev.json');

  app.gulp.src(`${app.paths.buildCssFolder}/*.css`)
    .pipe(revRewrite({
      manifest
    }))
    .pipe(app.gulp.dest(app.paths.buildCssFolder));
    return app.gulp.src(`${app.paths.base.build}/**/*.html`)
    .pipe(revRewrite({
      manifest
    }))
    .pipe(app.gulp.dest(app.paths.base.build));
}

