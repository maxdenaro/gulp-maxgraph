export const resources = () => {
  return app.gulp.src(`${app.paths.resourcesFolder}/**`, { encoding: false })
    .pipe(app.gulp.dest(app.paths.base.build))
}
