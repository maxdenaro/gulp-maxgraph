import svgSprite from "gulp-svg-sprite";
import svgmin from "gulp-svgmin";
import cheerio from 'gulp-cheerio';
import replace from 'gulp-replace';

export const svgSprites = () => {
  return app.gulp.src(app.paths.srcSvg, { encoding: false })
    .pipe(
      svgmin({
        js2svg: {
          pretty: true,
        },
      })
    )
    .pipe(
      cheerio({
        run: function ($) {
          $('[fill]').removeAttr('fill');
          $('[stroke]').removeAttr('stroke');
          $('[style]').removeAttr('style');
        },
        parserOptions: {
          xmlMode: true
        },
      })
    )
    .pipe(replace('&gt;', '>'))
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: "../sprite.svg"
        }
      },
    }))
    .pipe(app.gulp.dest(app.paths.buildImgFolder));
}
