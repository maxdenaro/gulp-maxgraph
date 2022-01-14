const {
  src,
  dest,
  series,
  watch
} = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const del = require('del');
const browserSync = require('browser-sync').create();
const sass = require('sass');
const gulpSass = require('gulp-sass');
const svgSprite = require('gulp-svg-sprite');
const svgmin = require('gulp-svgmin');
const cheerio = require('gulp-cheerio');
const replace = require('gulp-replace');
const fileInclude = require('gulp-file-include');
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
const typograf = require('gulp-typograf');
const webp = require('gulp-webp');
const avif = require('gulp-avif');
const mainSass = gulpSass(sass);
const webpackStream = require('webpack-stream');
const plumber = require('gulp-plumber');
const path = require('path');
const zip = require('gulp-zip');
const rootFolder = path.basename(path.resolve());

// paths
const srcFolder = './src';
const buildFolder = './app';
const paths = {
  srcSvg: `${srcFolder}/img/svg/**.svg`,
  srcImgFolder: `${srcFolder}/img`,
  buildImgFolder: `${buildFolder}/img`,
  srcScss: `${srcFolder}/scss/**/*.scss`,
  buildCssFolder: `${buildFolder}/css`,
  srcFullJs: `${srcFolder}/js/**/*.js`,
  srcMainJs: `${srcFolder}/js/main.js`,
  buildJsFolder: `${buildFolder}/js`,
  srcPartialsFolder: `${srcFolder}/partials`,
  resourcesFolder: `${srcFolder}/resources`,
};

let isProd = false; // dev by default

const clean = () => {
  return del([buildFolder])
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
          sprite: "../sprite.svg"
        }
      },
    }))
    .pipe(dest(paths.buildImgFolder));
}

// scss styles
const styles = () => {
  return src(paths.srcScss, { sourcemaps: !isProd })
    .pipe(plumber(
      notify.onError({
        title: "SCSS",
        message: "Error: <%= error.message %>"
      })
    ))
    .pipe(mainSass())
    .pipe(autoprefixer({
      cascade: false,
      grid: true,
      overrideBrowserslist: ["last 5 versions"]
    }))
    .pipe(gulpif(isProd, cleanCSS({
      level: 2
    })))
    .pipe(dest(paths.buildCssFolder, { sourcemaps: '.' }))
    .pipe(browserSync.stream());
};

// styles backend
const stylesBackend = () => {
  return src(paths.srcScss)
    .pipe(plumber(
      notify.onError({
        title: "SCSS",
        message: "Error: <%= error.message %>"
      })
    ))
    .pipe(mainSass())
    .pipe(autoprefixer({
      cascade: false,
      grid: true,
      overrideBrowserslist: ["last 5 versions"]
    }))
    .pipe(dest(paths.buildCssFolder))
    .pipe(browserSync.stream());
};

// scripts
const scripts = () => {
  return src(paths.srcMainJs)
    .pipe(plumber(
      notify.onError({
        title: "JS",
        message: "Error: <%= error.message %>"
      })
    ))
    .pipe(webpackStream({
      mode: isProd ? 'production' : 'development',
      output: {
        filename: 'main.js',
      },
      module: {
        rules: [{
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: "defaults"
                }]
              ]
            }
          }
        }]
      },
      devtool: !isProd ? 'source-map' : false
    }))
    .on('error', function (err) {
      console.error('WEBPACK ERROR', err);
      this.emit('end');
    })
    .pipe(dest(paths.buildJsFolder))
    .pipe(browserSync.stream());
}

// scripts backend
const scriptsBackend = () => {
  return src(paths.srcMainJs)
    .pipe(plumber(
      notify.onError({
        title: "JS",
        message: "Error: <%= error.message %>"
      })
    ))
    .pipe(webpackStream({
      mode: 'development',
      output: {
        filename: 'main.js',
      },
      module: {
        rules: [{
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: "defaults"
                }]
              ]
            }
          }
        }]
      },
      devtool: false
    }))
    .on('error', function (err) {
      console.error('WEBPACK ERROR', err);
      this.emit('end');
    })
    .pipe(dest(paths.buildJsFolder))
    .pipe(browserSync.stream());
}

const resources = () => {
  return src(`${paths.resourcesFolder}/**`)
    .pipe(dest(buildFolder))
}

const images = () => {
  return src([`${paths.srcImgFolder}/**/**.{jpg,jpeg,png,svg}`])
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
  watch(`${paths.resourcesFolder}/**`, resources);
  watch(`${paths.srcImgFolder}/**/**.{jpg,jpeg,png,svg}`, images);
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
    .pipe(dest(paths.buildCssFolder));
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

const zipFiles = (done) => {
  del.sync([`${buildFolder}/*.zip`]);
  return src(`${buildFolder}/**/*.*`, {})
    .pipe(plumber(
      notify.onError({
        title: "ZIP",
        message: "Error: <%= error.message %>"
      })
    ))
    .pipe(zip(`${rootFolder}.zip`))
    .pipe(dest(buildFolder));
}

const toProd = (done) => {
  isProd = true;
  done();
};

exports.default = series(clean, htmlInclude, scripts, styles, resources, images, webpImages, avifImages, svgSprites, watchFiles);

exports.backend = series(clean, htmlInclude, scriptsBackend, stylesBackend, resources, images, webpImages, avifImages, svgSprites)

exports.build = series(toProd, clean, htmlInclude, scripts, styles, resources, images, webpImages, avifImages, svgSprites, htmlMinify);

exports.cache = series(cache, rewrite);

exports.zip = zipFiles;
