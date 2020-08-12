const {src, dest, parallel, series, watch} = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify-es').default;
const del = require('del');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const fileinclude = require('gulp-file-include');
const gutil = require('gulp-util');
const ftp = require('vinyl-ftp');
const sourcemaps = require('gulp-sourcemaps');
const notify = require('gulp-notify');
const svgSprite = require('gulp-svg-sprite');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const fs = require('fs');
const tiny = require('gulp-tinypng-compress');



// DEV
//svg sprite
const svgSprites = () => {
  return src('./src/img/**.svg')
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: "../sprite.svg" //sprite file name
        }
      },
    }))
    .pipe(dest('./app/img'));
}

const resources = () => {
  return src('./src/resources/**')
    .pipe(dest('./app'))
}

const imgToApp = () => {
  return src(['./src/img/**.jpg', './src/img/**.png', './src/img/**.jpeg'])
    .pipe(dest('./app/img'))
}

const htmlInclude = () => {
  return src(['./src/index.html'])
    .pipe(fileinclude({
      prefix: '@',
      basepath: '@file'
    }))
    .pipe(dest('./app'))
    .pipe(browserSync.stream());
}

const fonts = () => {
  src('./src/fonts/**.ttf')
    .pipe(ttf2woff())
    .pipe(dest('./app/fonts/'));
  return src('./src/fonts/**.ttf')
    .pipe(ttf2woff2())
    .pipe(dest('./app/fonts/'));
}

const cb = () => {}

let srcFonts = './src/scss/_fonts.scss';
let appFonts = './app/fonts/';

const fontsStyle = (done) => {
  let file_content = fs.readFileSync(srcFonts);

  fs.writeFile(srcFonts, '', cb);
  fs.readdir(appFonts, function (err, items) {
    if (items) {
      let c_fontname;
      for (var i = 0; i < items.length; i++) {
        let fontname = items[i].split('.');
        fontname = fontname[0];
        if (c_fontname != fontname) {
          fs.appendFile(srcFonts, '@include font-face("' + fontname + '", "' + fontname + '", 400);\r\n', cb);
        }
        c_fontname = fontname;
      }
    }
  })

  done();
}

const styles = () => {
  return src('./src/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded'
    }).on("error", notify.onError()))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(autoprefixer({
      cascade: false,
    }))
    .pipe(cleanCSS({
      level: 2
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('./app/css/'))
    .pipe(browserSync.stream());
}

const scripts = () => {
  return src('./src/js/main.js')
    .pipe(webpackStream(
      {
        mode: 'development',
        output: {
          filename: 'main.js',
        },
        module: {
          rules: [{
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              }
            }
          }]
        },
      }
    ))
    .on('error', function (err) {
      console.error('WEBPACK ERROR', err);
      this.emit('end'); // Don't stop the rest of the task
    })

    .pipe(sourcemaps.init())
    .pipe(uglify().on("error", notify.onError()))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('./app/js'))
    .pipe(browserSync.stream());
}

const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: "./app"
    },
  });

  watch('./src/scss/**/*.scss', styles);
  watch('./src/js/**/*.js', scripts);
  watch('./src/html/*.html', htmlInclude);
  watch('./src/index.html', htmlInclude);
  watch('./src/resources/**', resources);
  watch('./src/img/**.jpg', imgToApp);
  watch('./src/img/**.jpeg', imgToApp);
  watch('./src/img/**.png', imgToApp);
  watch('./src/img/**.svg', svgSprites);
  watch('./src/fonts/**', fonts);
  watch('./src/fonts/**', fontsStyle);
}

const clean = () => {
	return del(['app/*'])
}

exports.fileinclude = htmlInclude;
exports.styles = styles;
exports.scripts = scripts;
exports.watchFiles = watchFiles;
exports.fonts = fonts;
exports.fontsStyle = fontsStyle;

exports.default = series(clean, parallel(htmlInclude, scripts, fonts, resources, imgToApp, svgSprites), fontsStyle, styles, watchFiles);

// BUILD
const tinypng = () => {
  return src(['./src/img/**.jpg', './src/img/**.png', './src/img/**.jpeg'])
    .pipe(tiny({
      key: '9JGFXhzcvJn1G7PvGRBmZMspkDDtGpwV',
      sigFile: './app/img/.tinypng-sigs',
      log: true
    }))
    .pipe(dest('./app/img'))
}

const stylesBuild = () => {
  return src('./src/scss/**/*.scss')
    .pipe(sass({
      outputStyle: 'expanded'
    }).on("error", notify.onError()))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(autoprefixer({
      cascade: false,
    }))
    .pipe(cleanCSS({
      level: 2
    }))
    .pipe(dest('./app/css/'))
}

const scriptsBuild = () => {
  return src('./src/js/main.js')
    .pipe(webpackStream(

        {
          mode: 'development',
          output: {
            filename: 'main.js',
          },
          module: {
            rules: [{
              test: /\.m?js$/,
              exclude: /(node_modules|bower_components)/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-env']
                }
              }
            }]
          },
        }))
      .on('error', function (err) {
        console.error('WEBPACK ERROR', err);
        this.emit('end'); // Don't stop the rest of the task
      })
    .pipe(uglify().on("error", notify.onError()))
    .pipe(dest('./app/js'))
}

exports.tinypng = tinypng;

exports.build = series(clean, parallel(htmlInclude, scriptsBuild, fonts, resources, imgToApp, svgSprites), fontsStyle, stylesBuild, tinypng);


// deploy
const deploy = () => {
  let conn = ftp.create({
    host: '',
    user: '',
    password: '',
    parallel: 10,
    log: gutil.log
  });

  let globs = [
    'app/**',
  ];

  return src(globs, {
      base: './app',
      buffer: false
    })
    .pipe(conn.newer('')) // only upload newer files
    .pipe(conn.dest(''));
}

exports.deploy = deploy;
