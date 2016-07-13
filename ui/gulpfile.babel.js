'use strict';

import gulp from 'gulp';
import browsersync from 'browser-sync';
import gulploadplugins from 'gulp-load-plugins';
import runSequence from 'run-sequence';
import path from 'path';
import merge from 'merge-stream';
import del from 'del';

const browserSync = browsersync.create();
const $ = gulploadplugins();
const DIST = 'dist';

let dist = subpath => !subpath ? DIST : path.join(DIST, subpath);

gulp.task('copy', [], () => {
  let app = gulp
    .src([
      'app/**/*',
      '!app/elements',
      '!app/bower_components'
    ], { dot: true })
    .pipe(gulp.dest(dist()));

  // copy over the bower components that don't vulcanize
  let bower = gulp
    .src(['app/bower_components/webcomponentsjs/**/*'])
    .pipe(gulp.dest(dist('bower_components')));

  let tmp = gulp
    .src(['app/bower_components/**/*'])
    .pipe(gulp.dest('.tmp/bower_components'));

  return merge(app, bower, tmp)
    .pipe($.size({ title: 'copy' }));
});

gulp.task('vulcanize', ['copy'], () => gulp
  .src('.tmp/elements/elements.html')
  .pipe($.vulcanize({
    stripComments: true,
    inlineCss: true,
    inlineScripts: true
  }))
  .pipe(gulp.dest(dist('elements')))
  .pipe($.size({title: 'vulcanize'})));

gulp.task('js', [], () => gulp
  .src(['app/**/*.{js,html}', '!app/bower_components/**/*'])
  .pipe($.if('*.html', $.crisper({scriptInHead:false}))) // extract JS from html
  .pipe($.sourcemaps.init())
  .pipe($.if('*.js', $.babel({presets: ['es2015']})))
  .pipe($.sourcemaps.write())
  .pipe(gulp.dest('.tmp/'))
  .pipe(gulp.dest(dist())));

gulp.task('serve', ['js'], () => {

  browserSync.init({
    port: 5000,
    notify: false,
    logPrefix: 'GCLHouseAccounting',
    // might want to eventually get to the point where we are only using https
    // https: true,
    server: {
      baseDir: ['.tmp', 'app']
    }
  });

  gulp.watch(['app/**/*.html', '!app/bower_components/**/*.html'], ['js', browserSync.reload]);
});

gulp.task('clean', [], () => del(['.tmp', dist()]));

gulp.task('default', ['clean'], (cb) => {
  runSequence(
    ['copy'],
    ['js'],
    ['vulcanize'],
    cb);
});
