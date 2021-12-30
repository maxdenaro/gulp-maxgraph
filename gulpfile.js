const {
  src,
  dest,
  series,
  watch
} = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify-es').default;
const del = require('del');
const browserSync = require('browser-sync').create();
const sass = require('sass');
const gulpSass = require('gulp-sass');
const svgSprite = require('gulp-svg-sprite');
const svgmin = require('gulp-svgmin');
const cheerio = require('gulp-cheerio');
const replace = require('gulp-replace');
const fileInclude = require('gulp-file-include');
const sourcemaps = require('gulp-sourcemaps');
const rev = require('gulp-rev');
const revRewrite = require('gulp-rev-rewrite');
const revDel = require('gulp-rev-delete-original');
const htmlmin = require('gulp-htmlmin');
const gulpif = require('gulp-if');
const notify = require('gulp-notify');
const image = require('gulp-imagemin');
const {
  readFileSync
} = require('fs');
const concat = require('gulp-concat');
const typograf = require('gulp-typograf');
const webp = require('gulp-webp');
const avif = require('gulp-avif');
const mainSass = gulpSass(sass);

// paths
const srcFolder = './src';
const buildFolder = './app';
const paths = {
  srcSvg: `${srcFolder}/img/svg/**.svg`,
  srcImgFolder: `${srcFolder}/img`,
  buildImgFolder: `${buildFolder}/img`,
  srcScss: `${srcFolder}/scss/**/*.scss`,
  buildCssFolder: `${buildFolder}/css`,
  srcVendor: `${srcFolder}/js/vendor/**.js`,
  srcFullJs: `${srcFolder}/js/**/*.js`,
  buildJsFolder: `${buildFolder}/js`,
  srcPartialsFolder: `${srcFolder}/partials`,
  resourcesFolder: `${srcFolder}/resources`,
};

let isProd = false; // dev by default

const clean = () => {
  return del([`${paths.buildFolder}/*`])
}

//svg sprite
const svgSprites = () => {
  return src(paths.srcSvg)
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
          sprite: "../sprite.svg" //sprite file name
        }
      },
    }))
    .pipe(dest(paths.buildImgFolder));
}

const styles = () => {
  return src(paths.srcScss)
    .pipe(gulpif(!isProd, sourcemaps.init()))
    .pipe(mainSass().on("error", notify.onError()))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(gulpif(isProd, cleanCSS({
      level: 2
    })))
    .pipe(gulpif(!isProd, sourcemaps.write('.')))
    .pipe(dest(paths.buildCssFolder))
    .pipe(browserSync.stream());
};

const stylesBackend = () => {
  return src(paths.srcScss)
    .pipe(sass().on("error", notify.onError()))
    .pipe(autoprefixer({
      cascade: false,
    }))
    .pipe(dest(paths.buildCssFolder))
};

const scripts = () => {
  src(paths.srcVendor)
    .pipe(concat('vendor.js'))
    .pipe(gulpif(isProd, uglify().on("error", notify.onError())))
    .pipe(dest(paths.buildJsFolder))
  return src(
      ['./src/js/global.js', './src/js/components/**.js', './src/js/main.js'])
    .pipe(gulpif(!isProd, sourcemaps.init()))
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(concat('main.js'))
    .pipe(gulpif(isProd, uglify().on("error", notify.onError())))
    .pipe(gulpif(!isProd, sourcemaps.write('.')))
    .pipe(dest(paths.buildJsFolder))
    .pipe(browserSync.stream());
}

const scriptsBackend = () => {
  src(paths.srcVendor)
    .pipe(concat('vendor.js'))
    .pipe(gulpif(isProd, uglify().on("error", notify.onError())))
    .pipe(dest(paths.buildJsFolder))
  return src(['./src/js/functions/**.js', './src/js/components/**.js', './src/js/main.js'])
    .pipe(dest(paths.buildJsFolder))
};

const resources = () => {
  return src(`${paths.sresourcesFolder}/**`)
    .pipe(dest(buildFolder))
}

const images = () => {
  return src([`${paths.srcImgFolder}/**/**.{jpg,jpeg,png}`])
    .pipe(gulpif(isProd, image([
      image.mozjpeg({
        quality: 80,
        progressive: true
      }),
      image.optipng({
        optimizationLevel: 2
      }),
    ])))
    .pipe(dest(paths.buildImgFolder))
};

const webpImages = () => {
  return src([`${paths.srcImgFolder}/**/**.{jpg,jpeg,png}`])
    .pipe(webp())
    .pipe(dest(paths.buildImgFolder))
};

const avifImages = () => {
  return src([`${paths.srcImgFolder}/**/**.{jpg,jpeg,png}`])
    .pipe(avif())
    .pipe(dest(paths.buildImgFolder))
};

const htmlInclude = () => {
  return src([`${srcFolder}/*.html`])
    .pipe(fileInclude({
      prefix: '@',
      basepath: '@file'
    }))
    .pipe(typograf({
      locale: ['ru', 'en-US']
    }))
    .pipe(dest(buildFolder))
    .pipe(browserSync.stream());
}

const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: `${buildFolder}`
    },
  });

  watch(paths.srcScss, styles);
  watch(paths.srcFullJs, scripts);
  watch(`${paths.srcPartialsFolder}/*.html`, htmlInclude);
  watch(`${srcFolder}/*.html`, htmlInclude);
  watch(`${paths.sresourcesFolder}/**`, resources);
  watch(`${paths.srcImgFolder}/**/**.{jpg,jpeg,png}`, images);
  watch(`${paths.srcImgFolder}/**/**.{jpg,jpeg,png}`, webpImages);
  watch(`${paths.srcImgFolder}/**/**.{jpg,jpeg,png}`, avifImages);
  watch(paths.srcSvg, svgSprites);
}

const cache = () => {
  return src(`${buildFolder}/**/*.{css,js,svg,png,jpg,jpeg,webp,avif,woff2}`, {
      base: buildFolder
    })
    .pipe(rev())
    .pipe(revDel())
    .pipe(dest(buildFolder))
    .pipe(rev.manifest('rev.json'))
    .pipe(dest(buildFolder));
};

const rewrite = () => {
  const manifest = readFileSync('app/rev.json');
  src(`${paths.buildCssFolder}/*.css`)
    .pipe(revRewrite({
      manifest
    }))
    .pipe(dest(buildCssFolder));
  return src(`${buildFolder}/**/*.html`)
    .pipe(revRewrite({
      manifest
    }))
    .pipe(dest(buildFolder));
}

const htmlMinify = () => {
  return src(`${buildFolder}/**/*.html`)
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(dest(buildFolder));
}

const toProd = (done) => {
  isProd = true;
  done();
};

exports.default = series(clean, htmlInclude, scripts, styles, resources, images, webpImages, avifImages, svgSprites, watchFiles);

exports.build = series(toProd, clean, htmlInclude, scripts, styles, resources, images, webpImages, avifImages, svgSprites, htmlMinify);

exports.cache = series(cache, rewrite);

exports.backend = series(toProd, clean, htmlInclude, scriptsBackend, stylesBackend, resources, images, webpImages, avifImages, svgSprites);
