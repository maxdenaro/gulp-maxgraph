import { dest, src } from 'gulp';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import webpackStream from 'webpack-stream';
import browserSync from 'browser-sync';
import paths from '../config/paths';

// scripts backend
const scriptsBackend = () => src(paths.srcMainJs)
    .pipe(plumber(
      notify.onError({
        title: 'JS',
        message: 'Error: <%= error.message %>'
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
                  targets: 'defaults'
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

export default scriptsBackend;
